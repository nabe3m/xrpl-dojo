---
title: 5-4. 実験変更をPR候補に整理する
description: ローカルで挙動を変えた体験を、レビューしやすい小さな変更へ整理する
sidebar:
  order: 4
---

Level 5では、`SetRegularKey` を題材にローカルで `xrpld` の挙動を変えました。最後に、その差分を「学習用の実験」と「PR候補になり得る変更」に分けます。

## ゴール

ローカルで動かした変更を、すべてPRにするわけではありません。`xrpld` はネットワーク全体の合意に関わるソフトウェアなので、挙動を変える変更には強い理由と合意が必要です。一方で、既存挙動を明確にするテスト追加は、初心者の最初の貢献として現実的です。このページでは、その線引きを実際の差分で練習します。

## 差分を確認する

まず、`xrpld-test` で差分を見ます。

```bash
cd xrpld-test
git diff
```

Level 5の流れどおり進めた場合、差分は大きく2種類に分かれます。

| 差分 | 扱い |
|------|------|
| `SetRegularKey.cpp` の `preflight()` 変更 | 学習用。既存仕様を変えるため、PR候補から外す |
| `SetRegularKey_test.cpp` のテスト追加 | 既存挙動のカバレッジ追加としてPR候補になり得る |

::::caution[挙動変更は簡単にPRにしない]
Regular Keyの削除可否を変えるような変更は、既存ユーザーのトランザクション結果を変えます。実装が小さく見えても、プロトコル上は大きな変更です。
::::

## 学習用の実装変更を戻す

`SetRegularKey.cpp` に入れた学習用の条件は戻します。戻した後の `preflight()` は、実ファイルの元の形に戻ります。

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

戻したら、実装側の差分が消えたことを確認します。

```bash
git diff -- src/libxrpl/tx/transactors/account/SetRegularKey.cpp
```

何も表示されなければ、学習用の実装変更は戻せています。

## PR候補として残すテスト

`5-3` で実験用に追加した `testCannotClearRegularKeyInDojoExperiment` も、`preflight()` を戻したら削除し、`run()` の呼び出しも元に戻します。実験の挙動を前提にしたテストは、そのままでは残せないからです。

代わりに、PR候補として残すなら、既存挙動を壊さずに説明できるテストだけにします。たとえば、Regular Keyを設定してから削除できることを明示するテストです。

```cpp
void
testCanClearRegularKey()
{
    using namespace test::jtx;

    testcase("Can clear regular key");
    Env env{*this, testableAmendments()};
    Account const alice("alice");
    Account const bob("bob");
    env.fund(XRP(10000), alice, bob);

    env(regkey(alice, bob));
    env(noop(alice), Sig(bob));

    env(regkey(alice, kDisabled));
    env(noop(alice), Sig(bob), Ter(tefBAD_AUTH));
    env(noop(alice), Sig(alice));
}
```

このテストが主張していることは明確です。

- `alice` は `bob` を Regular Key に設定できる
- 設定後は `bob` の署名で `alice` のトランザクションを送れる
- Regular Keyを削除すると `bob` の署名は使えなくなる
- マスターキーが有効なら `alice` 自身の署名は使える

## テストを通す

テストだけの変更に整理できたら、再度実行します。

```bash
cd xrpld-test/.build
cmake --build . --parallel
./xrpld --unittest SetRegularKey
```

通ったら、PRに出す前の最小確認として差分をもう一度見ます。

```bash
cd xrpld-test
git diff -- src/test/app/SetRegularKey_test.cpp
```

差分がテスト追加だけになっていれば、レビューしやすい変更に近づいています。

## PR説明の下書き

この変更をPRにするなら、説明は短くて十分です。

```text
Add SetRegularKey coverage for clearing a regular key

This adds an app test that explicitly verifies a regular key can be
cleared and that the removed regular key can no longer authorize
transactions for the account.
```

「新しい仕様を追加した」とは書きません。既存挙動を明確にテストした、という説明にします。

## Level 5のまとめ

ここまでで、次の流れを一周しました。

1. 実ファイルを読む
2. ローカルで挙動を変える
3. テスト結果の変化を見る
4. 実験変更とPR候補を分ける
5. 小さなテスト追加として整理する

これは、本格的なプロトコル変更に進む前の重要な練習です。次のLevel 6では、新しいトランザクションタイプ、アメンドメント、Invariant Checkのように、本番ネットワークへ影響し得る変更を扱います。

## 次のステップ

[本格実装の入口](/xrpld/level6/overview/) に進み、プロトコル変更を設計するときに何を考えるべきかを学びます。
