---
title: 3-6. Conan依存とCI/ビルドパイプライン
description: xrpldの依存管理（Conan）とCIで行われるチェックを理解し、PR前にローカルで再現する
sidebar:
  order: 6
---

PR を出すと GitHub Actions の各種チェックが自動で走ります。何が検証されるのかを先に理解しておくと、CI の赤を減らし、レビューをスムーズに通せます。このページでは依存管理の Conan と、CI で実行されるチェックの中身、そしてそれらを**ローカルで再現する方法**を解説します。

## Conan による依存管理

xrpld は多数の C++ ライブラリに依存しており、それらは [Conan](https://conan.io/) で管理されています。依存の一覧はルートの `conanfile.py` に定義されています。

```python
# conanfile.py（抜粋）
name = "xrpl"

requires = [
    "ed25519/2015.03",
    "grpc/1.78.1",
    "libarchive/3.8.7",
    "nudb/2.0.9",
    "openssl/3.6.2",
    "secp256k1/0.7.1",
    "soci/4.0.3",
    "zlib/1.3.2",
]

test_requires = [
    "gtest/1.17.0",
]

tool_requires = [
    "protobuf/6.33.5",
]
```

| 種類 | 意味 |
|------|------|
| `requires` | 本体のビルドに必要な依存（boost・openssl 等） |
| `test_requires` | テストのみで使う依存（gtest） |
| `tool_requires` | ビルド時に使うツール（protobuf コンパイラ） |

:::note[バージョンは固定されている]
依存はすべてバージョン指定されています。ローカルとCIで同じバージョンが使われることで、「自分の環境では通るのにCIで落ちる」を防いでいます。`conanfile.py` を見れば、いま必要な正確なバージョンがわかります。
:::

### options でビルドを切り替える

`conanfile.py` の `options` で、オプション機能の有無を切り替えられます。たとえば `rocksdb` を含めるかどうかなどです。

```bash
# rocksdb を無効にして依存を解決する例
conan install .. --output-folder . --build missing \
  --settings build_type=Release \
  --options "rocksdb=False"
```

## CI で実行されるチェック

PR を作成すると `.github/workflows/on-pr.yml` を起点に、複数のチェックが走ります。主なものは次の通りです。

```
PR 作成
  ├── pre-commit         … フォーマット・静的チェック
  ├── check-pr-title     … PRタイトルの規約チェック
  ├── check-pr-commits   … コミットメッセージのチェック
  ├── check-levelization … モジュール依存の循環チェック
  ├── clang-tidy         … 静的解析
  ├── build-test         … 各プラットフォームでビルド＆テスト
  └── package            … パッケージ生成
```

### pre-commit — フォーマットと軽量チェック

`.pre-commit-config.yaml` で定義されたフックが走ります。主なもの：

| フック | 役割 |
|--------|------|
| `clang-format` | C++ コードの整形 |
| `trailing-whitespace` / `end-of-file-fixer` | 余分な空白・改行の修正 |
| `check-merge-conflict` | コンフリクトマーカーの混入検出 |
| `gersemi` | CMake ファイルの整形 |
| `prettier` | JSON/YAML/Markdown の整形 |
| `black` | Python スクリプトの整形 |

### check-levelization — 循環依存の防止

xrpld 特有の重要なチェックです。`.github/scripts/levelization/` に実装されており、**モジュールが下位の層だけに依存する**という規律を保ちます。

> あるモジュールは、自分より下位レベルのモジュールしかインクルードできない。また、自分以外のモジュールの `impl` / `detail` フォルダをインクルードしてはならない。

新しい `#include` を追加したときにこのチェックが落ちたら、層をまたいだ不正な依存を作ってしまった可能性があります。

## ローカルでCIを再現する

CI で落ちてから直すより、push 前にローカルで再現するほうが速いです。

### pre-commit をローカルで実行

```bash
# 初回のみ: インストールとフックの登録
pip install pre-commit
pre-commit install

# 変更ファイルに対して実行（コミット時に自動でも走る）
pre-commit run --all-files
```

### clang-format だけ手早くかける

```bash
# 変更したファイルだけ整形
clang-format -i src/libxrpl/tx/transactors/payment/Payment.cpp
```

### ビルドとテスト

[1-3. xrpldをビルドする](/xrpld/level1/build/) と同じ手順でビルドし、ユニットテストを実行します。

```bash
# xrpld-test/.build/ で
cmake --build . --parallel
./xrpld --unittest --unittest-jobs 4
```

:::tip[CIが落ちたらまずログの最初を見る]
CIのジョブログは長いですが、原因は最初に失敗したステップにあります。`pre-commit` で落ちているなら整形漏れ、`build-test` で落ちているならコンパイル／テスト失敗、`check-levelization` なら依存違反、と切り分けられます。
:::

## PR タイトル・コミットの規約

`check-pr-title` と `check-pr-commits` は、タイトルとコミットメッセージが規約に沿っているかを検証します。書き方は [3-2. 開発ワークフロー](/xrpld/level3/workflow/) と [3-4. PRの作成と説明の書き方](/xrpld/level3/pull-request/) を参照してください。

## 次のステップ

CI の仕組みを理解し、ローカルで事前に再現できるようになりました。これで Level 3 は完了です。Level 4 に進み、コンセンサスやネットワークなど、より深い内部実装を [コンセンサスアルゴリズム](/xrpld/level4/consensus/) から掘り下げていきましょう。
