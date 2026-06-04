---
title: 1-5. コードベースを探索する
description: xrpldのディレクトリ構造と主要コンポーネントを把握する
sidebar:
  order: 5
---

xrpldが動くようになったら、今度はコードを読んでいきましょう。大規模なC++コードベースは最初は圧倒されますが、全体像を把握すれば怖くありません。

## ディレクトリ構造の全体像

```
rippled/
├── src/
│   ├── libxrpl/         # XRPLコアライブラリ（プロトコル・型・TX処理等）
│   │   ├── basics/      # 基本ユーティリティ
│   │   ├── beast/       # ネットワーク・非同期処理基盤
│   │   ├── crypto/      # 暗号処理
│   │   ├── ledger/      # Ledger管理
│   │   ├── net/         # ネットワーク通信
│   │   ├── nodestore/   # Ledgerデータの永続化
│   │   ├── protocol/    # プロトコル定義（型・シリアライズ）
│   │   ├── shamap/      # SHAMap（台帳データ構造）
│   │   └── tx/          # トランザクション処理
│   │       └── transactors/  # 各TX種別の実装
│   │           ├── payment/
│   │           ├── dex/
│   │           ├── escrow/
│   │           └── ...
│   ├── xrpld/           # デーモン（ネットワーク・コンセンサス・RPC等）
│   │   ├── app/         # アプリケーション層
│   │   ├── consensus/   # コンセンサスアルゴリズム統合
│   │   ├── overlay/     # P2Pオーバーレイネットワーク
│   │   ├── peerfinder/  # ピア探索
│   │   └── rpc/         # RPCサーバー
│   ├── test/            # ユニットテスト
│   └── tests/           # 統合テスト
├── CMakeLists.txt
├── conanfile.py
└── docs/                # ビルド手順・設計ドキュメント
```

:::note[libxrpl と xrpld の分離]
以前は `src/ripple/` 以下にすべてのコードがありましたが、現在は**ライブラリ**（`libxrpl`）と**デーモン**（`xrpld`）に分離されています。`libxrpl` は他のプロジェクトからライブラリとして利用することもできます。
:::

## 重要なディレクトリの解説

### `src/xrpld/app/` — アプリケーション層

デーモンの中心部です。

```
xrpld/app/
├── consensus/      # XRPL固有のコンセンサス実装
├── ledger/         # Ledger取得・検証・管理
├── main/           # Application クラス（起動・依存注入）
├── misc/           # AmendmentTable, FeeVote, NetworkOPs等
└── rdb/            # RDB（SQLite）へのアクセス
```

### `src/libxrpl/tx/transactors/` — トランザクター

各トランザクション種別の実装がカテゴリ別に整理されています：

| ディレクトリ | トランザクション種別 |
|-------------|------------------|
| `payment/` | Payment（送金） |
| `dex/` | OfferCreate, OfferCancel（分散型取引所） |
| `escrow/` | EscrowCreate/Finish/Cancel |
| `nft/` | NFTokenMint/Burn等 |
| `check/` | CheckCreate/Cash/Cancel |
| `bridge/` | XChainBridge（クロスチェーン） |
| `lending/` | Lending関連 |
| `oracle/` | Price Oracle |
| `vault/` | Vault |

### `protocol/` — プロトコル定義

XRPLプロトコルの型・フォーマット・シリアライズが集約されています。**公開ヘッダ（`.h`）は `include/xrpl/protocol/`、実装（`.cpp`）は `src/libxrpl/protocol/`** に分かれています。

```
include/xrpl/protocol/   (ヘッダ) ＋ src/libxrpl/protocol/ (実装)
├── AccountID.h         # アカウントID
├── STAmount.h          # 金額型（XRP/IOU両対応）
├── STObject.h          # シリアライズ可能なオブジェクト
├── TxFormats.h         # トランザクションフォーマット定義
├── LedgerFormats.h     # Ledgerエントリのフォーマット定義
├── Feature.h           # アメンドメント（機能フラグ）定義
└── TER.h               # トランザクション実行結果コード
```

### `src/libxrpl/shamap/` — SHAMap

Ledgerの状態ツリーのデータ構造です。Ledgerの差分を効率的に計算できます。

## コードを読む入り口

### トランザクション処理を追う

実装の入口は次のファイルから辿るとよいです。

```
src/xrpld/rpc/handlers/transaction/Submit.cpp
src/xrpld/app/misc/NetworkOPs.cpp
src/libxrpl/tx/apply.cpp
src/libxrpl/tx/Transactor.cpp
```

最もわかりやすい入り口はトランザクション処理です。`Payment` を例に追ってみましょう：

```bash
# Payment トランザクターのファイルを探す
ls src/libxrpl/tx/transactors/payment/
```

`Transactor.cpp`（共通基底クラス）はこちら：

```bash
ls src/libxrpl/tx/
# Transactor.cpp, apply.cpp 等が確認できます
```

### テストコードを読む

テストコードはコードの使い方の良いドキュメントです：

```bash
ls src/test/app/
# Payment_test.cpp, Offer_test.cpp 等が見つかります
```

## 主要な型と概念

| 型 | ファイル | 説明 |
|----|---------|------|
| `AccountID` | `include/xrpl/protocol/AccountID.h` | アカウントを識別する20バイトのハッシュ |
| `uint256` | `include/xrpl/basics/base_uint.h` | 256ビット整数（ハッシュ等に使用） |
| `STAmount` | `include/xrpl/protocol/STAmount.h` | XRPとIOUを統一的に扱う金額型 |
| `STObject` | `include/xrpl/protocol/STObject.h` | キーバリューのシリアライズ可能なオブジェクト |
| `TER` | `include/xrpl/protocol/TER.h` | トランザクション実行結果コード |

## コード探索のコツ

### grep で検索する

```bash
# Transactor を継承したクラスを探す
grep -r ": public Transactor" src/

# TER コードの定義を探す（ヘッダは include/ 配下）
grep -r "tecNO_AUTH" include/xrpl/protocol/
```

### docs/ ディレクトリを読む

```bash
ls docs/
# consensus.md, CodingStyle.md, build/ 等があります
```

`docs/CodingStyle.md` はコントリビューション前に必読です。

## 練習問題

Level 1 の締めくくりとして、以下を試してみましょう：

1. `src/libxrpl/tx/transactors/` ディレクトリを開き、カテゴリ一覧を確認する
2. `src/libxrpl/tx/transactors/payment/` の中のファイルを開いて読む
3. `include/xrpl/protocol/TER.h` を開いて、どんな結果コードがあるか確認する
4. `src/test/app/` にあるテストファイルの一つを開いて構造を確認する

:::tip[完全に理解しなくて良い]
最初からすべてを理解しようとしないでください。まずは「こういうコードがある」という地図を作ることが目的です。Level 2以降で詳しく読んでいきます。
:::

## ここまでにできるようになったこと

- [x] xrpldのビルドをゼロから成功させる
- [x] ローカルでXRPLネットワークを起動・操作できる
- [x] コードベースの全体構造を把握している
- [x] 主要なディレクトリの役割を理解している

## 次のステップ

コードベースの地図ができました。ビルドでつまずいたときのために、[よくあるビルドエラーと対処](/xrpld/level1/troubleshooting/) にも目を通しておくと安心です。準備ができたら Level 2 に進み、実際にコードを深く読みながらトランザクション処理やLedgerの仕組みを理解していきましょう。

