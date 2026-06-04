---
title: 1-6. よくあるビルドエラーと対処
description: Conan・CMake・コンパイラ起因のビルドエラーを切り分けて解決する
sidebar:
  order: 6
---

xrpld のビルドは依存ライブラリが多く、環境差によるエラーに遭遇しがちです。このページでは、[1-3. xrpldをビルドする](/xrpld/level1/build/) の基本的なエラーに加えて、特につまずきやすいケースを切り分け方とあわせて解説します。

:::tip[まずはエラーの「層」を見分ける]
ビルドエラーは大きく3つの層に分けられます。どの層で失敗しているかを見極めると、対処が一気に絞り込めます。

| 層 | 失敗するコマンド | 主な原因 |
|----|----------------|---------|
| 依存解決 | `conan install` | Conanプロファイル・コンパイラ設定 |
| 設定生成 | `cmake ...` | ツールチェーン・CMakeバージョン |
| コンパイル | `cmake --build` | コンパイラのバグ・メモリ不足 |
:::

## Conan プロファイル関連

### コンパイラのバージョンが検出されない

`conan profile show` で以下のようなエラーが出る場合：

```
ERROR: Invalid setting '17' is not a valid 'settings.compiler.version' value
```

プロファイルのコンパイラ設定が、インストール済みのコンパイラと食い違っています。プロファイルを開いて `compiler.version` を実際のバージョンに合わせます。

```bash
# プロファイルの場所を確認
conan profile path default

# 内容を確認
conan profile show
```

macOS（apple-clang）の例：

```ini
[settings]
compiler=apple-clang
compiler.version=17
compiler.cppstd=20
compiler.libcxx=libc++
```

### 複数のコンパイラがある環境

システムに複数のコンパイラがあると、Conan が意図しない方を選ぶことがあります。`conan profile detect` を実行する**前**に `CC` / `CXX` を明示すると確実です。

```bash
# 例: Homebrew の LLVM を使う
export CC=$(brew --prefix llvm@18)/bin/clang
export CXX=$(brew --prefix llvm@18)/bin/clang++
conan profile detect --force
```

### C++ 標準が古いと言われる

```
ERROR: Package 'boost/...' can't be built with the current configuration
```

`compiler.cppstd` が `20` になっているか確認します。xrpld は C++20 を要求します。

```ini
[settings]
compiler.cppstd=20
```

## コンパイラ固有のエラー

### clang 19 以降 / Apple Clang 17 以降で grpc のビルドが失敗する

clang 19 以降、または Apple Clang 17 以降（Xcode 16 以降に同梱）では、`grpc` のビルド中に次のエラーが出ることがあります。環境構築時に [1-2](/xrpld/level1/setup/#apple-clang-17-以降を使う場合macos) の手順でプロファイルへフラグを追加しておくと、初回の `conan install` から失敗を避けられます。

```
.../basic_seq.h:499:38: error: a template argument list is expected after a
name prefixed by the template keyword [-Wmissing-template-arg-list-after-template-kw]
```

Conan プロファイルに以下の2行を追加して回避します。

```ini
[conf]
tools.build:cflags=["-Wno-missing-template-arg-list-after-template-kw"]
tools.build:cxxflags=["-Wno-missing-template-arg-list-after-template-kw"]
```

### gcc 12 で `-Werror=restrict` が出る

gcc 12 で `werr` を有効にしていると、標準ライブラリ起因の誤検知でビルドが止まることがあります。

```
/usr/include/c++/12/bits/char_traits.h:435:56: error: ... [-Werror=restrict]
```

gcc 13 以降にアップグレードするか、`werr` を無効にしてビルドします。

```bash
cmake -DCMAKE_TOOLCHAIN_FILE:FILEPATH=build/generators/conan_toolchain.cmake \
  -DCMAKE_BUILD_TYPE=Release -Dxrpld=ON -Dtests=ON -Dwerr=OFF ..
```

## メモリ・リンク関連

### リンク段階でメモリ不足になる

巨大なバイナリのリンクは大量のメモリを消費します。`cc1plus` や `ld` が `Killed` で終了する場合はメモリ不足です。

```
collect2: fatal error: ld terminated with signal 9 [Killed]
```

対処：

- 並列数を下げる（`cmake --build . --parallel 1`）
- スワップを増やす（Linux）
- リンカを `lld` / `mold` に変更して省メモリ化する

```bash
# lld を使う例（プロファイルの [conf] に追加）
tools.build:exelinkflags=["-fuse-ld=lld"]
tools.build:sharedlinkflags=["-fuse-ld=lld"]
```

### Debug ビルドが極端に重い

`Debug` はバイナリが大きくメモリも時間も食います。動作確認だけなら `Release` で十分です。

```bash
conan install .. --output-folder . --build missing --settings build_type=Release
cmake -DCMAKE_BUILD_TYPE=Release ... ..
```

## クリーンビルドで切り分ける

設定が壊れて原因が分からなくなったら、`.build/` を消して最初からやり直すのが確実です。

```bash
# rippled/ のルートで実行
rm -rf .build
mkdir .build && cd .build
# ステップ2（conan install）から再実行
```

:::caution[ソースツリーは消さない]
削除するのは生成物の `.build/` だけです。`git clean -xdf` はソース管理外のファイルをすべて消すため、設定ファイルを置いている場合は注意してください。
:::

## 原因を報告・質問するとき

自力で解決できないときは、以下を添えて質問すると回答が早くなります。

- OS とバージョン（`uname -a`）
- コンパイラ（`clang --version` / `g++ --version`）
- `conan profile show` の出力
- エラーの**最初**の数行（最後だけだと原因が分からないことが多い）

質問先は [1-1](/xrpld/intro/about/) でも紹介した XRPL Discord の `#dev-general` や GitHub Discussions が適しています。

## 次のステップ

ビルドのトラブルを乗り越えられるようになりました。Level 1 はこれで完了です。Level 2 に進み、[ディレクトリ構造の全体像](/xrpld/level2/directory/) からコードを読み始めましょう。
