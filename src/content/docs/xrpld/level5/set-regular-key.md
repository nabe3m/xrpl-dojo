---
title: 5-2. SetRegularKeyを読んで変える
description: 実際のSetRegularKey実装を題材に、ローカルでxrpldの挙動を変える
sidebar:
  order: 2
---

このページでは、実際の `SetRegularKey` トランザクションを読み、ローカルで小さな挙動変更を入れます。目的は、完璧な機能を作ることではありません。`xrpld` の実ファイルを変更すると、テスト結果が変わることを体感することです。

::::caution[学習用の実験です]
ここで入れる「Regular Keyの削除を禁止する」変更は、XRPLの正式な仕様変更として提案するものではありません。ローカルでコードとテストの関係を理解するための実験です。
::::

## まず定義を見る

`SetRegularKey` は `transactions.macro` で定義されています。

```
include/xrpl/protocol/detail/transactions.macro
```

実際の定義は次のとおりです。

```cpp
/** This transaction type sets or clears an account's "regular key". */
#if TRANSACTION_INCLUDE
#   include <xrpl/tx/transactors/account/SetRegularKey.h>
#endif
TRANSACTION(ttREGULAR_KEY_SET, 5, SetRegularKey,
    Delegation::NotDelegable,
    uint256{},
    NoPriv,
    ({
    {sfRegularKey, SoeOptional},
}))
```

コメントにあるとおり、このトランザクションは Regular Key を「設定または削除」します。`sfRegularKey` が `SoeOptional` なので、フィールドを省略できることもわかります。

## 実装を見る

宣言はヘッダ、実装は `.cpp` にあります。

```
include/xrpl/tx/transactors/account/SetRegularKey.h
src/libxrpl/tx/transactors/account/SetRegularKey.cpp
```

### preflight()

Ledger を見ずに、トランザクション自体の形だけを確認します。

```cpp
NotTEC
SetRegularKey::preflight(PreflightContext const& ctx)
{
    if (ctx.tx.isFieldPresent(sfRegularKey) &&
        (ctx.tx.getAccountID(sfRegularKey) == ctx.tx.getAccountID(sfAccount)))
    {
        return temBAD_REGKEY;
    }

    return tesSUCCESS;
}
```

`sfRegularKey` が存在し、しかも送信元アカウント自身と同じなら `temBAD_REGKEY` で拒否します。

### calculateBaseFee()

`SetRegularKey` には手数料計算の独自ロジックもあります。

```cpp
XRPAmount
SetRegularKey::calculateBaseFee(ReadView const& view, STTx const& tx)
{
    auto const id = tx.getAccountID(sfAccount);
    auto const spk = tx.getSigningPubKey();

    if (publicKeyType(makeSlice(spk)))
    {
        if (calcAccountID(PublicKey(makeSlice(spk))) == id)
        {
            auto const sle = view.read(keylet::account(id));

            if (sle && !sle->isFlag(lsfPasswordSpent))
            {
                // flag is armed and they signed with the right account
                return XRPAmount{0};
            }
        }
    }

    return Transactor::calculateBaseFee(view, tx);
}
```

マスターキーで署名し、かつ `lsfPasswordSpent` フラグがまだ立っていなければ、手数料を 0 にします。これは「初回のマスターキー利用」に関する仕組みで、後述の `doApply()` と `testPasswordSpent()` で確認できます。

### doApply()

Ledger を更新する本体です。

```cpp
TER
SetRegularKey::doApply()
{
    auto const sle = view().peek(keylet::account(accountID_));
    if (!sle)
        return tefINTERNAL;  // LCOV_EXCL_LINE

    if (!minimumFee(ctx_.registry, ctx_.baseFee, view().fees(), view().flags()))
        sle->setFlag(lsfPasswordSpent);

    if (ctx_.tx.isFieldPresent(sfRegularKey))
    {
        sle->setAccountID(sfRegularKey, ctx_.tx.getAccountID(sfRegularKey));
    }
    else
    {
        // Account has disabled master key and no multi-signer signer list.
        if (sle->isFlag(lsfDisableMaster) && !view().peek(keylet::signers(accountID_)))
            return tecNO_ALTERNATIVE_KEY;

        sle->makeFieldAbsent(sfRegularKey);
    }

    ctx_.view().update(sle);

    return tesSUCCESS;
}
```

冒頭の `minimumFee(...)` は、実際に手数料がかからなかった場合（`calculateBaseFee()` が 0 を返した場合など）に `lsfPasswordSpent` フラグを立てます。以降は同じアカウントで 0 手数料の特典は使えなくなります。

`sfRegularKey` がある場合は `setAccountID()` で設定し、ない場合は `makeFieldAbsent()` で削除します。ただし、マスターキーが無効で、SignerListもない場合に Regular Key を消すと、アカウントを操作する手段がなくなるため `tecNO_ALTERNATIVE_KEY` で拒否します。

## 現在のテストを見る

テストはここです。

```
src/test/app/SetRegularKey_test.cpp
```

`SetRegularKey_test` は5つのテストメソッドを `run()` から呼び出しています。

```cpp
void
run() override
{
    testDisabledMasterKey();
    testDisabledRegularKey();
    testPasswordSpent();
    testUniversalMask();
    testTicketRegularKey();
}
```

| メソッド | 主な確認内容 |
|---------|-------------|
| `testDisabledMasterKey` | Regular Key の設定・削除、マスターキー無効化 |
| `testDisabledRegularKey` | 自分自身を Regular Key に指定すると `temBAD_REGKEY` |
| `testPasswordSpent` | 0 手数料と `lsfPasswordSpent` フラグ |
| `testUniversalMask` | 無効なフラグで `temINVALID_FLAG` |
| `testTicketRegularKey` | Ticket を使った Regular Key 操作 |

### Regular Key の削除はテストでどう表現するか

テストでは `regkey()` ヘルパー（`src/test/jtx/regkey.h`）を使います。Regular Key を削除するときは `kDisabled` を渡し、`sfRegularKey` フィールドを含まない JSON を組み立てます。

```cpp
// src/test/jtx/impl/regkey.cpp（抜粋）
json::Value
regkey(Account const& account, DisabledT)
{
    json::Value jv;
    jv[jss::Account] = account.human();
    jv[jss::TransactionType] = jss::SetRegularKey;
    return jv;  // RegularKey フィールドなし = 削除
}
```

### このあとの実験で失敗するテスト

学習用の変更（削除を禁止）は、Regular Key を消す操作を前提にしたテストに当たります。たとえば `testDisabledMasterKey()` の `"Revoke regular key"` です。

```cpp
testcase("Revoke regular key");
env(regkey(alice, kDisabled));
env(noop(alice), Sig(bob), Ter(tefBAD_AUTH));
env(noop(alice), Sig(alice));
```

`regkey(alice, kDisabled)` は `sfRegularKey` を省略した削除操作です。同様に `testTicketRegularKey()` でも Ticket 経由の削除（`regkey(alice, kDisabled), ...`）があります。

一方、`testDisabledRegularKey()` は `preflight()` の `temBAD_REGKEY` を確認するだけで削除は行いません。`testPasswordSpent()` も `sfRegularKey` ありの設定操作なので、学習用変更後も通るはずです。

```cpp
void
testDisabledRegularKey()
{
    using namespace test::jtx;

    testcase("Set regular key to master key");
    Env env{*this, testableAmendments()};
    Account const alice("alice");
    env.fund(XRP(10000), alice);

    env(regkey(alice, alice), Ter(temBAD_REGKEY));
}
```

## ローカルで挙動を変える

ここから、学習用に挙動を変えてみます。`SetRegularKey::preflight()` の先頭に、`sfRegularKey` がないトランザクションを拒否するチェックを追加します。

```cpp
NotTEC
SetRegularKey::preflight(PreflightContext const& ctx)
{
    if (!ctx.tx.isFieldPresent(sfRegularKey))
        return temMALFORMED;

    if (ctx.tx.isFieldPresent(sfRegularKey) &&
        (ctx.tx.getAccountID(sfRegularKey) == ctx.tx.getAccountID(sfAccount)))
    {
        return temBAD_REGKEY;
    }

    return tesSUCCESS;
}
```

この変更により、Regular Keyを削除する操作がローカルでは拒否されるようになります。`transactions.macro` では `sfRegularKey` は任意ですが、`preflight()` で追加のルールを入れたためです。

## ビルドしてテストを実行する

実装を変更したら、`xrpld` をビルドし直します。

```bash
cd xrpld-test/.build
cmake --build . --parallel
```

次に `SetRegularKey` のテストだけ実行します。

```bash
./xrpld --unittest SetRegularKey
```

この時点では、`testDisabledMasterKey()` と `testTicketRegularKey()` が失敗するはずです。どちらも `regkey(alice, kDisabled)` による削除を成功前提にしているからです。`testDisabledRegularKey()` や `testPasswordSpent()` は通るはずです。つまり、自分の変更が `xrpld` の挙動に影響したことを確認できました。

## 差分を確認する

変更した内容を必ず `git diff` で見ます。

```bash
cd xrpld-test
git diff -- src/libxrpl/tx/transactors/account/SetRegularKey.cpp
```

この段階で確認したいのは、「どの条件を追加したか」と「どの結果コードを返すようにしたか」です。トランザクション処理では、たった1行の条件でもユーザーに見える挙動が変わります。

## 次のステップ

次は、[失敗するテストから実装を確認する](/xrpld/level5/verify-with-tests/) に進みます。学習用の変更に合わせてテストを書き、なぜ既存テストが失敗するのかを読み解きます。
