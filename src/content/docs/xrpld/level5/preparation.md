---
title: 5-1. 実践前の準備と安全な進め方
description: 実ファイルを安全に変更し、テストで挙動の変化を確認する準備を整える
sidebar:
  order: 1
---

Level 5では、読むだけでなく、ローカルの `xrpld` に実際の変更を入れて挙動が変わることを確認します。題材は `SetRegularKey` です。実装、ヘッダ、テストが小さくまとまっていて、初心者が最初に触る題材として向いています。

::::caution[このLevelの変更は学習用です]
ここで行う一部の変更は、ローカルで挙動を体感するための実験です。そのまま本番ネットワーク向けのPRにするものではありません。PR候補にするなら、最後に「何が本当に価値のある変更か」を切り分けます。
::::

## Level 5のゴール

このLevelは、初めて `xrpld` の実装を安全に触るための実践章です。終えるころには、次の流れを一通り経験できていれば十分です。

- 既存トランザクションの定義、実装、テストを対応づけて読む
- 小さな変更でテスト結果が変わることを確認する
- 学習用の挙動変更と、PR候補になるテスト追加を切り分ける
- 変更前後の差分を自分で説明できる

## 使う実ファイル

このLevelでは、[XRPLF/rippled](https://github.com/XRPLF/rippled) リポジトリルートからの相対パスでソースを参照します（Level 2 の [ディレクトリ構造](/xrpld/level2/directory/) と同じ表記です）。

```
include/xrpl/tx/transactors/account/SetRegularKey.h
src/libxrpl/tx/transactors/account/SetRegularKey.cpp
src/test/app/SetRegularKey_test.cpp
include/xrpl/protocol/detail/transactions.macro
```

`SetRegularKey` は、アカウントに Regular Key を設定したり削除したりするトランザクションです。`transactions.macro` では、次のように `sfRegularKey` を任意フィールドとして持つトランザクションとして定義されています。

```cpp
TRANSACTION(ttREGULAR_KEY_SET, 5, SetRegularKey,
    Delegation::NotDelegable,
    uint256{},
    NoPriv,
    ({
    {sfRegularKey, SoeOptional},
}))
```

`sfRegularKey` がある場合は設定、ない場合は削除です。この「フィールドがあるかどうかで挙動が変わる」点が、最初の実験にちょうどよい大きさです。

## Level 5で体験すること

このLevelでは、次の順番で進めます。

1. `SetRegularKey` の定義、実装、テストを対応づけて読む
2. 既存テストを1つ実行し、現在の挙動を確認する
3. 学習用の小さな挙動変更を入れる
4. テストが失敗することを確認する
5. テストまたは実装を調整し、すべてのテストが通る状態に戻す
6. 実験変更とPR候補になる変更を切り分ける

## 作業ブランチを作る

実験は必ず専用ブランチで行います。`xrpld-test` 側で作業する想定です。

```bash
cd xrpld-test
git switch -c dojo/level5-set-regular-key
```

作業前に差分がないことを確認します。

```bash
git status
```

すでに差分がある場合は、その差分が自分の作業か確認してから進めてください。学習用の変更と既存の変更が混ざると、あとで戻すべき範囲がわかりにくくなります。

## テストだけを素早く回す

ビルド済みであれば、`SetRegularKey` のテストだけを実行できます。

```bash
cd xrpld-test/.build
./xrpld --unittest SetRegularKey
```

環境によっては、絞り込みオプションを使ってもかまいません。

```bash
./xrpld --unittest --unittest-match "SetRegularKey"
```

::::tip[最初は小さく回す]
全テストを毎回実行すると時間がかかります。Level 5では、変更したトランザクションのテストだけを先に回し、最後に広めのテストへ進む流れにします。
::::

## 次のステップ

準備ができたら、[SetRegularKeyを読んで変える](/xrpld/level5/set-regular-key/) に進みます。次のページでは、実際の `preflight()` と `doApply()` を読み、ローカルで挙動を変えてみます。
