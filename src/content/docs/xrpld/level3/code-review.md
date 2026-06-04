---
title: 3-5. コードレビューへの対応
description: xrpldのコードレビュープロセスと、レビューコメントへの正しい対応方法
sidebar:
  order: 5
---

PR を出した後は、レビュアーからのフィードバックに対応することが重要です。xrpld のレビュープロセスと、スムーズに進めるためのコツを解説します。

## レビュープロセスの全体像

```
PR 作成（Draft）
    ↓
自動 CI チェック
    ↓
コアレビュアーによるレビュー
    ↓
コメントへの対応・修正
    ↓
（繰り返し）
    ↓
2名以上の Approve
    ↓
"Ready to merge" ラベル
    ↓
メンテナーがマージ
```

## レビュアーについて

xrpld のリポジトリには 7 名のメンテナーと 18 名のコードレビュアーがいます。レビューには数日〜数週間かかることがあります。

:::note[レスポンスが遅い場合]
1〜2週間反応がない場合は、PR にコメントして軽く催促しても問題ありません。

```markdown
Ping — is there anything I can do to move this forward?
```
:::

## CI チェックの確認

PR を出すと自動的に CI が走ります。失敗した場合はまず自分で原因を調べます。

```bash
# CI と同じチェックをローカルで実行
cd .build

# 1. ユニットテスト
./xrpld --unittest --unittest-jobs 4

# 2. clang-format チェック
git diff --name-only HEAD~1 | xargs clang-format --dry-run --Werror

# 3. clang-tidy
run-clang-tidy -p . -allow-no-checks src tests
```

## レビューコメントの種類

GitHub のレビューコメントには種類があります：

| 種類 | 意味 | 対応 |
|------|------|------|
| `nit:` | 些細な指摘（Nitpick） | 対応するかどうかは任意 |
| `suggestion:` | 改善提案 | 採用するかどうかを判断して回答 |
| `blocker:` / 🚫 | マージ前に必須の修正 | 必ず対応する |
| 質問 | 意図の確認 | 丁寧に説明する |

## コメントへの返し方

### 修正する場合

コードを修正してプッシュします。コメントには以下のように返信します：

```markdown
Done, fixed in the latest commit.
```

または具体的に：

```markdown
Fixed. I moved the check to `preflight()` as suggested,
since it doesn't require Ledger access.
```

### 修正しない場合

理由を丁寧に説明します：

```markdown
I'd prefer to keep this as-is because X. The approach you
suggested would also work, but it would require changing Y
and Z, which seems out of scope for this PR.

Happy to discuss further if you think it's important.
```

### 変更のリクエストに反論する場合

敬意を持って、論拠を示して反論します：

```markdown
Thanks for the feedback. I considered this approach, but
[reason why current approach is better]. Does that make sense,
or am I missing something?
```

## Resolve と Re-request Review

コメントに対応したら：

1. 各コメントスレッドを **"Resolve conversation"** でクローズする
2. レビュアーに **"Re-request review"** ボタンで再レビューを依頼する
3. PR 本文に変更点のサマリーをコメントする

```markdown
Updated based on review feedback:
- Moved validation to `preflight()` (as suggested by @reviewer)
- Added test case for the edge case mentioned in #comment
- Rewrote commit message per guidelines
```

## rebase と force push

レビュー後に `develop` との差分が生じた場合や、コミット整理が必要な場合：

```bash
# upstream と同期
git fetch upstream
git rebase upstream/develop

# コミットを整理（squash）する場合
git rebase -i upstream/develop

# force push（自分の fork への push のみ許可）
git push --force-with-lease origin <your-username>/fix-something
```

:::caution[force push は自分の fork のみ]
`upstream` への force push は絶対に行わないでください。`origin`（自分の fork）への `--force-with-lease` は問題ありません。
:::

## レビューを受けるためのコツ

**PR を小さく保つ**
大きな PR はレビューに時間がかかります。1つの PR で1つの目的に集中しましょう。

**CI を常に緑にする**
CI が赤い状態でレビューを依頼しないようにしましょう。

**説明を充実させる**
レビュアーがコードの意図を理解できるよう、PR 説明やコード内のコメントを充実させます。

**他の PR をレビューする**
自分の PR をレビューしてもらうだけでなく、他の人の PR にもフィードバックすることでコミュニティとの関係が深まります。

## ここまでにできるようになったこと

- [x] 取り組む issue を自分で選べる
- [x] fork・ブランチ・コミット（GPG署名）の開発フローを実践できる
- [x] xrpld のコーディング規約に従ったコードを書ける
- [x] 効果的な PR 説明を書ける
- [x] レビューコメントに適切に対応できる

## 次のステップ

PR を通すうえで欠かせない CI の仕組みを [Conan依存とCI/ビルドパイプライン](/xrpld/level3/ci-and-conan/) で確認しておきましょう。Level 3 を終えたら、Level 4 でコンセンサスアルゴリズムや P2P ネットワーク層など、xrpld の深い部分を学びます。
