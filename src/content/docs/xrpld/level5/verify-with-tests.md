---
title: 5-3. 失敗するテストから実装を確認する
description: SetRegularKeyのテストを追加し、ローカル変更がテスト結果に与える影響を確認する
sidebar:
  order: 3
---

前のページでは、学習用に `SetRegularKey::preflight()` を変更し、`sfRegularKey` がないトランザクションを `temMALFORMED` で拒否するようにしました。このページでは、その挙動をテストで確認します。

テストファイルは次です。

```
src/test/app/SetRegularKey_test.cpp
```

## 既存テストの構造を確認する

`SetRegularKey_test` は `beast::unit_test::Suite` を継承したテストスイートです。各テストメソッドを `run()` から呼び出しています。

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

新しいテストを追加するときは、クラス内に `testXxx()` メソッドを追加し、最後に `run()` から呼び出します。

## 変更後の挙動をテストで確認する

学習用の変更では、`regkey(alice, kDisabled)` のように Regular Key を削除する操作が `temMALFORMED` になるはずです。これを確認するテストを追加します。

```cpp
void
testCannotClearRegularKeyInDojoExperiment()
{
    using namespace test::jtx;

    testcase("Dojo experiment: cannot clear regular key");
    Env env{*this, testableAmendments()};
    Account const alice("alice");
    Account const bob("bob");
    env.fund(XRP(10000), alice, bob);

    env(regkey(alice, bob));
    env(regkey(alice, kDisabled), Ter(temMALFORMED));
}
```

追加する場所は、既存の `testDisabledRegularKey()` の後あたりで十分です。

次に `run()` へ呼び出しを追加します。

```cpp
void
run() override
{
    testDisabledMasterKey();
    testDisabledRegularKey();
    testCannotClearRegularKeyInDojoExperiment();
    testPasswordSpent();
    testUniversalMask();
    testTicketRegularKey();
}
```

## テストを実行する

ビルドして、`SetRegularKey` だけを実行します。

```bash
cd xrpld-test/.build
cmake --build . --parallel
./xrpld --unittest SetRegularKey
```

追加したテスト自体は通り、`preflight()` の条件が実際に効いていることがわかります。もし通らない場合は、次の点を確認してください。

- `SetRegularKey.cpp` の `preflight()` に `!ctx.tx.isFieldPresent(sfRegularKey)` の条件を追加したか
- テスト側の期待値が `Ter(temMALFORMED)` になっているか
- `run()` から新しいテストメソッドを呼び出しているか

ただし、スイート全体では既存テストの一部が失敗するはずです。その理由を次の節で読み解きます。

## 既存テストが失敗する理由を読む

学習用の変更は、既存の仕様と衝突します。たとえば既存テストには、Regular Key を削除できることを期待する箇所があります。

```cpp
testcase("Revoke regular key");
env(regkey(alice, kDisabled));
env(noop(alice), Sig(bob), Ter(tefBAD_AUTH));
env(noop(alice), Sig(alice));
```

ここで `regkey(alice, kDisabled)` は、`sfRegularKey` を省略して Regular Key を削除する操作です。学習用変更後は `temMALFORMED` になるため、この既存テストはそのままでは通りません。

この衝突は、重要な学びです。`xrpld` の挙動変更は、実装ファイル1つだけで完結しません。既存仕様、既存テスト、ユーザーが使っているトランザクションの意味まで影響します。

## すべてのテストを通すには

いまは、実験用に追加したテストは通る一方で、既存テストの一部が失敗している状態です。スイート全体ですべてのテストを通すには、考え方として2つの方向があります。

1. 実験を「仕様」として受け入れ、既存テストの期待値もすべて書き換える
2. 実験を「学習用」と割り切り、`preflight()` の変更を戻す

方向1は、「Regular Keyの削除を禁止する」という大きな仕様変更を主張することになり、`xrpld` では簡単に通せる変更ではありません。道場では方向2を選びます。具体的な戻し方と、PRに残す価値のあるテストへの整理は、次のページで行います。

## 次のステップ

次は、[実験変更をPR候補に整理する](/xrpld/level5/organize-pr/) に進みます。ローカルでの体験を、レビューしやすい小さな変更へ整える方法を学びます。
