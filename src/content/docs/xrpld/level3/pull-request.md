---
title: 3-4. PRの作成と説明の書き方
description: xrpldへのPull Requestを正しく作成し、レビューされやすい説明を書く
sidebar:
  order: 4
---

コードの準備ができたら、Pull Request（PR）を作成します。PR の説明が充実しているほど、レビューが早く進みます。

## PR を作成するタイミング

:::tip[早めに Draft PR を開く]
完成を待たず、**作業を始めたら早めに Draft PR を開く**ことが推奨されています。これにより：
- 方向性についての早期フィードバックを得られる
- 開発者のコミュニティに作業中であることを知らせられる
- 重複作業を防げる
:::

## PR のベースブランチ

| 変更の種類 | ベースブランチ |
|-----------|-------------|
| 通常の機能・バグ修正 | `develop` |
| リリース候補（RC）のバグ修正 | `release` |
| 緊急のホットフィックス | `master` |

ほとんどの場合は `develop` です。

## PR タイトルの書き方

タイトルは以下のプレフィックスで始めます：

| プレフィックス | 用途 |
|-------------|------|
| `feat:` | 新機能 |
| `fix:` | バグ修正 |
| `docs:` | ドキュメント |
| `test:` | テストの追加・修正 |
| `build:` | ビルドシステムの変更 |
| `ci:` | CI 設定の変更 |
| `style:` | フォーマット・コードスタイル |
| `refactor:` | リファクタリング（機能変更なし） |
| `perf:` | パフォーマンス改善 |
| `chore:` | その他の雑務 |

**例：**
```
fix: Correct IOU-to-IOU payment path calculation
feat: Add test coverage for EscrowFinish with condition
docs: Update build instructions for Conan 2.17
```

## PR 説明の書き方

GitHub の PR テンプレートに沿って記載します。最低限、以下の内容を含めましょう。

### 変更の概要（What）

何を変えたかを簡潔に説明します。

```markdown
## What

Fix the path calculation in `RippleCalc` when both source and destination
currencies are IOUs from different issuers.

Previously, the algorithm skipped direct order book paths under certain
conditions, causing valid payments to fail with `tecPATH_DRY`.
```

### 変更の理由（Why）

なぜこの変更が必要かを説明します。関連する issue へのリンクも入れます。

```markdown
## Why

Closes #5678

This was reported by a user who observed that cross-currency payments
between two non-XRP accounts were failing intermittently.
```

### テスト方法（How to Test）

レビュアーが動作を確認するための手順を書きます。

```markdown
## How to Test

```bash
./xrpld --unittest Payment --unittest-jobs 4
```

New test cases added in `Payment_test.cpp`:
- `testCrossCurrencyDirectPath`: verifies direct paths are included
- `testCrossCurrencyFallback`: verifies fallback behavior
```

### 関連リンク

```markdown
## Related

- Closes #5678
- Related to #1234
- XLS: https://github.com/XRPLF/XRPL-Standards/...（新機能の場合）
```

## Draft から Ready for Review へ

作業が完了したら：

1. GitHub の PR ページで **"Ready for review"** ボタンを押す
2. PR に `Ready to merge` ラベルを付ける（自分でついていない場合はコメントで依頼）
3. CI が全て通っていることを確認する

## マージの条件

PR がマージされるには以下の条件が必要です：

- [ ] **レビュアー 2 名以上の Approve**（小規模な変更は 1 名でも可）
- [ ] **CI チェックが全て通過**
- [ ] **`develop` ブランチとの同期**（rebase 済み）
- [ ] **コミットメッセージが規約に従っている**

## 大きな機能変更の場合

新しいトランザクション種別や大きな機能変更は、コードの前に **XLS（XRP Ledger Standard）提案**が必要です。

```
https://github.com/XRPLF/XRPL-Standards
```

XLS は機能の設計・仕様を文書化したもので、PR の前に議論・承認が行われます。最初のコントリビューションでは XLS が必要なケースは少ないため、まずは小さな変更から始めることをお勧めします。

## Amendment が必要な変更

トランザクション処理に影響する変更は、**Amendment（アメンドメント）ガード**が必要です。

```cpp
// Amendment が有効な場合のみ処理を変える例
if (ctx_.view().rules().enabled(featureMyNewFeature))
{
    // 新しい処理
}
else
{
    // 従来の処理
}
```

Amendment が不要な変更（テスト・ドキュメント・内部リファクタリング等）では不要です。
