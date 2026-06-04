---
title: 6-1. 本格実装の入口
description: ローカル実験から、設計判断を含む本格的なxrpld変更へ進む
sidebar:
  order: 1
---

Level 5では、`SetRegularKey` を題材にローカルで `xrpld` を変え、テストで挙動の変化を確認しました。Level 6では、その先に進みます。新しいトランザクションタイプ、アメンドメント、Invariant Checkのように、XRPLのルールそのものに関わる変更をどう設計するかを学びます。

::::caution[本格実装はコードだけでは始まらない]
プロトコルの挙動を変える変更は、コードを書けば終わりではありません。XLS提案、アメンドメント、テスト、有効化前後の互換性、レビューで説明できる設計理由が必要です。
::::

## Level 5とLevel 6の違い

| Level | 目的 | 変更の性質 |
|-------|------|------------|
| Level 5 | ローカルで変化を体感する | 学習用の小さな変更、既存挙動のテスト追加 |
| Level 6 | 本格的な変更を設計する | 新機能、アメンドメント、Invariant、レビュー前提の設計 |

Level 6で扱う内容は、すぐに初心者がPRとして出すことを勧めるものではありません。まずは既存コードを正確に読み、「どのファイルを触る必要があるか」「なぜアメンドメントが必要か」「どの不変条件を守るべきか」を説明できるようになることが目標です。

## 本格実装で考えること

新機能を入れるときは、最低でも次の問いに答える必要があります。

- その変更は既存のトランザクション結果を変えるか
- アメンドメントで有効化を制御する必要があるか
- 新しいフィールドやLedgerエントリが必要か
- 失敗時の `TER` はどれが適切か
- Invariant Checkで守るべき条件はあるか
- アメンドメント有効時と無効時の両方をテストしているか

## Level 6で読む実ファイル

このLevelでも、xrpld リポジトリルートからの相対パスを前提にします。

```
include/xrpl/protocol/detail/transactions.macro
include/xrpl/protocol/detail/features.macro
include/xrpl/tx/invariants/InvariantCheck.h
src/libxrpl/tx/Transactor.cpp
src/libxrpl/tx/invariants/InvariantCheck.cpp
src/test/app/
```

## 進め方

Level 6は、次の順番で進みます。

1. 新しいトランザクションタイプを追加するときに触るファイルを把握する
2. その変更をアメンドメントで守る理由を理解する
3. Invariant Checkで最後に守るべき条件を考える
4. 設計判断を含むPRとして説明する練習をする

## 次のステップ

まずは [新しいトランザクションタイプを追加する流れ](/xrpld/level6/new-transaction/) に進み、`transactions.macro` からTransactor実装までの全体像を確認します。
