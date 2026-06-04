---
title: 2-4. テストの読み方・書き方
description: xrpldのテストフレームワークを理解し、テストを書けるようになる
sidebar:
  order: 4
---

xrpldのテストを読み・書けるようになることは、コントリビューションへの大きな一歩です。既存テストを読めばコードの使い方がわかり、新しいテストを書けば自分のコードの正しさを検証できます。

## テストフレームワーク

xrpldは独自のユニットテストフレームワーク **Beast Test** を使用しています。フレームワーク本体と登録マクロは次にあります。

```
include/xrpl/beast/unit_test.h
include/xrpl/beast/unit_test/suite.h
src/test/unit_test/multi_runner.h
```

```
src/test/
├── app/        # app/ 層のテスト（トランザクション等）
├── basics/     # basics/ のユーティリティテスト
├── consensus/  # コンセンサスのテスト
├── core/       # コアサービスのテスト
├── json/       # JSON パーサのテスト
├── ledger/     # Ledger 関連のテスト
├── protocol/   # プロトコル型のテスト
├── rpc/        # RPC ハンドラのテスト
└── unit_test/  # テストフレームワーク本体
```

## テストの基本構造

典型的なトランザクションテストの構造を見てみましょう。以下は `jtx`（後述）を使った Payment のテストの書き方の例です。

```cpp
#include <test/jtx.h>  // テスト用ユーティリティ

namespace xrpl {
namespace test {

struct MyPayment_test : public beast::unit_test::suite
{
    void
    testDirectXrpPayment()
    {
        // テスト環境（Env）を作成
        Env env(*this);

        // テスト用アカウントを作成
        auto const alice = Account("alice");
        auto const bob   = Account("bob");

        // alice と bob をファンド（XRP を付与）
        env.fund(XRP(10000), alice, bob);

        // トランザクションを送信
        env(pay(alice, bob, XRP(100)));

        // 残高を検証
        env.require(balance(bob, XRP(10100)));
    }

    void
    run() override
    {
        testDirectXrpPayment();
        // 他のテストメソッドを呼ぶ
    }
};

// マクロでテストスイートを登録（第3引数が namespace、第4引数が優先度）
BEAST_DEFINE_TESTSUITE_PRIO(MyPayment, app, xrpl, 1);

} // namespace test
} // namespace xrpl
```

:::note[namespace は `xrpl`]
コードベースの再編に伴い、名前空間は以前の `ripple` から `xrpl` に変更されています。古い資料では `namespace ripple` と書かれている場合があるので注意してください。
:::

## jtx — テスト用ユーティリティ

`test/jtx/` は、テストを簡潔に書くためのユーティリティ群です（`jtx` = JSON Transaction）。

```
src/test/jtx/
├── Env.h/cpp           # テスト環境（最重要）
├── Account.h           # テスト用アカウント
├── pay.h               # Payment トランザクション
├── offer.h             # OfferCreate トランザクション
├── trust.h             # TrustSet トランザクション
├── require.h           # アサーション群
└── ...
```

### Env クラス

テストの中心となるクラスです。

```cpp
// Env を作成すると、ローカルの Ledger 環境が立ち上がる
Env env(*this);

// アメンドメントを指定して Env を作成
Env env(*this, supported_amendments());

// カスタム設定で作成
Env env(*this, envconfig(port_increment, 10));
```

### アカウントの作成とファンド

```cpp
auto const alice = Account("alice");
auto const bob   = Account("bob");

// XRP(10000) を持った状態でアカウントを作成
env.fund(XRP(10000), alice, bob);

// トラストラインも設定した状態でファンド
auto const USD = bob["USD"];  // bob が発行する USD
env.fund(XRP(10000), alice);
env(trust(alice, USD(1000))); // alice が USD を受け入れる設定
```

### トランザクションの送信

```cpp
// Payment
env(pay(alice, bob, XRP(100)));

// エラーを期待する場合
env(pay(alice, bob, XRP(99999)), ter(tecINSUFFICIENT_FUNDS));

// フラグ付き
env(pay(alice, bob, XRP(100)), txflags(tfNoRippleDirect));
```

### アサーション（require）

```cpp
// 残高チェック
env.require(balance(alice, XRP(9900)));
env.require(balance(alice, USD(100)));

// アカウントの存在チェック
env.require(account(alice));
env.require(noaccount(charlie));  // アカウントが存在しないこと

// 複数条件
env.require(
    balance(alice, XRP(9900)),
    balance(bob, XRP(10100))
);
```

## テストを実行する

### 全テストを実行

```bash
cd .build
./xrpld --unittest
```

### 特定のテストスイートだけ実行

```bash
# AccountSet のテストのみ
./xrpld --unittest AccountSet

# 特定のスイート名で絞り込み
./xrpld --unittest --unittest-match "Offer"
```

### 並列実行で高速化

```bash
./xrpld --unittest --unittest-jobs=4
```

## 既存テストを読む練習

以下のテストファイルは比較的シンプルで読みやすいです：

### 1. `src/test/app/AccountSet_test.cpp`

シンプルなアカウント設定のテストです。`jtx` の基本的な使い方を学ぶのに最適な出発点です。

### 2. `src/test/app/Offer_test.cpp`

DEX（OfferCreate / OfferCancel）の包括的なテストです。実践的なシナリオの組み立て方が学べます（規模が大きいので、まずは一部のメソッドだけ読みましょう）。

### 3. `src/test/ledger/View_test.cpp`

Ledger ビューの操作テストです。`transferXRP` 等の低レベルAPIの使い方がわかります。

## テストを書いてみる

既存のトランザクションに新しいテストケースを追加してみましょう。

### 例: AccountSet でドメインを設定するテスト

```cpp
void
testSetDomain()
{
    Env env(*this);

    auto const alice = Account("alice");
    env.fund(XRP(10000), alice);

    // ドメインを設定
    env(fset(alice, asfDefaultRipple));

    // フラグが設定されていることを確認
    env.require(flags(alice, asfDefaultRipple));
}
```

:::tip[テスト名はわかりやすく]
テストメソッド名は `test` プレフィックスをつけ、何をテストしているかが名前からわかるようにしましょう。`testDirectXrpPayment`, `testInsufficientFunds` のように具体的に。
:::

## テストの命名規則

| 要素 | 規則 | 例 |
|------|------|-----|
| スイート名 | `ClassName_test` | `AccountSet_test` |
| テストメソッド | `testXxx()` | `testDirectXrpPayment()` |
| マクロ | `BEAST_DEFINE_TESTSUITE_PRIO` | `BEAST_DEFINE_TESTSUITE_PRIO(AccountSet, app, xrpl, 1)` |

## 次のステップ

テストの読み書きができるようになりました。次は、実行中の xrpld の挙動を追う [ログを使ったデバッグ](/xrpld/level2/debugging/) を学び、Level 2 を締めくくりましょう。

