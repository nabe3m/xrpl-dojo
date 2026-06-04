---
title: 1-2. 環境構築
description: xrpldをビルドするための開発環境を整える
sidebar:
  order: 2
---

xrpldをビルドするには、いくつかのツールをインストールする必要があります。このページではmacOSとUbuntu（Linux）向けの手順を説明します。

## 必要なツール一覧

| ツール | バージョン | 用途 |
|--------|-----------|------|
| Git | 2.x以上 | ソースコードの取得 |
| CMake | 3.22以上 | ビルドシステム |
| Conan | 2.17以上 | C++パッケージマネージャ |
| Python | 3.11以上 | Conanの実行に必要 |
| C++コンパイラ | Clang 16+ / GCC 12+ / Apple Clang 16+（17 以降は[追加設定](#apple-clang-17-以降を使う場合macos)あり） | コンパイル |

## macOSの場合

Xcode 16 以降（Apple Clang 17 以降）を使う場合は、Conan プロファイルの追加設定が必要です。詳細は [共通: Conanプロファイルの設定](#apple-clang-17-以降を使う場合macos) を参照してください。

### 1. Xcode Command Line Toolsのインストール

```bash
xcode-select --install
```

### 2. Homebrewのインストール（未インストールの場合）

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 3. 依存ツールのインストール

```bash
brew install cmake python3
```

### 4. Conanのインストール

```bash
pip3 install conan
```

インストールを確認します：

```bash
conan --version
# Conan version 2.17.x 以上と表示されればOK
```

## Ubuntuの場合

### 1. 基本ツールのインストール

```bash
sudo apt-get update
sudo apt-get install -y git cmake python3 python3-pip build-essential
```

:::caution[Ubuntuのバージョン確認]
Ubuntu 22.04または24.04を使用してください。古いバージョンではClangやCMakeのバージョンが要件を満たさない場合があります。
:::

### 2. GCCのバージョン確認

```bash
gcc --version
# version 12 以上が必要
```

バージョンが古い場合：

```bash
sudo apt-get install -y gcc-12 g++-12
sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-12 100
sudo update-alternatives --install /usr/bin/g++ g++ /usr/bin/g++-12 100
```

### 3. Conanのインストール

```bash
pip3 install conan
```

## 共通: Conanプロファイルの設定

ソースコードを取得してから、リポジトリに含まれるプロファイルを使ってConanを設定します。

### ソースコードの取得

```bash
git clone https://github.com/XRPLF/rippled.git xrpld-test
cd xrpld-test
git checkout develop
```

### リポジトリのConanプロファイルをインストール

```bash
conan config install conan/profiles/ -tf $(conan config home)/profiles/
conan profile show
```

:::tip[リポジトリ付属のプロファイルを使う]
`conan profile detect --force` で自動生成したプロファイルより、リポジトリに含まれるプロファイルの方が正しく設定されています。必ずこの手順を使ってください。
:::

### XRPLFのConanリモートを追加

依存ライブラリの取得を高速化するため、XRPLFが提供するConanリモートを追加します：

```bash
conan remote add --index 0 xrplf https://conan.ripplex.io
```

### C++20の設定確認

```bash
conan profile show
```

出力の中に `compiler.cppstd=20` が含まれていることを確認します。なければ手動で設定します：

```bash
# macOS / Linux 共通
sed -i.bak -e 's|^compiler\.cppstd=.*$|compiler.cppstd=20|' \
  $(conan config home)/profiles/default
```

**Linuxの場合、追加でlibcxxも設定します：**

```bash
sed -i.bak -e 's|^compiler\.libcxx=.*$|compiler.libcxx=libstdc++11|' \
  $(conan config home)/profiles/default
```

### Apple Clang 17 以降を使う場合（macOS）

Xcode 16 以降に同梱される **Apple Clang 17** でも xrpld はビルドできます。ただし、依存ライブラリ `grpc` のビルドでコンパイラ警告がエラー扱いになり、`conan install` が失敗することがあります。**初回の `conan install` の前に** Conan プロファイルへ回避用のフラグを追加しておくとスムーズです。

まず、使用中のコンパイラを確認します：

```bash
clang --version
# Apple clang version 17.0.0 (clang-1700.0.13.5) など
```

`17` 以降と表示されたら、プロファイルに次の `[conf]` セクションを追加します（既に `[conf]` がある場合はその中に追記）：

```bash
PROFILE=$(conan profile path default)

cat >> "$PROFILE" << 'EOF'

[conf]
tools.build:cflags=["-Wno-missing-template-arg-list-after-template-kw"]
tools.build:cxxflags=["-Wno-missing-template-arg-list-after-template-kw"]
EOF
```

:::tip[`compiler.version=17` のエラーが出る場合]
`conan profile show` で `Invalid setting '17'` と表示される場合は、プロファイルの `compiler.version` を `17` に手動で合わせてください。詳しくは [1-6. よくあるビルドエラーと対処](/xrpld/level1/troubleshooting/#コンパイラのバージョンが検出されない) を参照してください。
:::

:::note[Homebrew の LLVM を使う場合]
Apple Clang ではなく Homebrew の `llvm@18` などを使う場合は、`CC` / `CXX` を明示してからプロファイルを設定します（[1-6](/xrpld/level1/troubleshooting/#複数のコンパイラがある環境) 参照）。clang 19 以降でも同じ `grpc` 回避フラグが有効です。
:::

## 次のステップ

環境の準備ができました。次はいよいよビルドです。

