---
title: 3-3. コーディング規約
description: xrpldのコーディングスタイルとclang-format/clang-tidy要件
sidebar:
  order: 3
---

PR を出す前に、xrpld のコーディング規約に従っていることを確認する必要があります。自動チェックで弾かれる前に、主要なルールを把握しておきましょう。

## 自動フォーマット: clang-format

コードのフォーマットは **clang-format** で自動チェックされます。CIではpre-commit環境の clang-format が使われるため、手元ではリポジトリの `.pre-commit-config.yaml` と `.clang-format` に合わせて実行します。

```bash
# macOS
brew install pre-commit llvm
export PATH="$(brew --prefix llvm)/bin:$PATH"

# Ubuntu
sudo apt-get install -y pre-commit clang-format clang-tidy
```

### フォーマットの適用

```bash
# 変更したファイルにフォーマットを適用
clang-format -i src/libxrpl/tx/transactors/payment/Payment.cpp

# pre-commit 経由でリポジトリ設定のフォーマットを確認
pre-commit run clang-format --all-files
```

### 主なフォーマットルール

**インデント**
```cpp
// OK: 4スペース、タブ文字なし
void foo()
{
    if (condition)
    {
        doSomething();
    }
}
```

**ブレースは Allman スタイル（次の行）**
```cpp
// OK
if (condition)
{
    doSomething();
}

// NG
if (condition) {
    doSomething();
}
```

**`const` は右側に置く**
```cpp
// OK
int const value = 42;
int const* ptr = &value;

// NG
const int value = 42;
```

**行の長さ: 80文字まで**
```cpp
// 長い行は折り返す（データ・テーブルは例外）
auto result =
    someVeryLongFunctionName(argument1, argument2, argument3);
```

**ポインタ・参照の書き方**
```cpp
// OK: 型に付ける（後置記法）
SomeObject* ptr;
Thing const& ref;

// NG
SomeObject *ptr;
Thing const &ref;
```

**命名規則**

| 種別 | 規則 | 例 |
|------|------|-----|
| クラス・構造体 | TitleCase | `PaymentChannel`, `LedgerMaster` |
| 関数・変数 | camelCase | `doApply()`, `accountID` |
| 名前空間 | lowercase | `xrpl`, `test` |
| メンバ変数 | camelCase + 末尾 `_` | `ctx_`, `j_` |

## 静的解析: clang-tidy

コードの品質は **clang-tidy** でチェックされます。

```bash
# .build/ から実行
run-clang-tidy -p . -allow-no-checks src tests
```

CI で失敗する代表的なパターン：

- `auto` の過剰な使用（型が不明瞭になるケース）
- 未使用の変数・インクルード
- `nullptr` の代わりに `NULL` や `0` を使用
- `assert()` の使用（代わりに `XRPL_ASSERT` を使う）

## assert の使い方

xrpld では標準の `assert()` を使わず、プロジェクト固有のマクロを使います。

```cpp
// NG
assert(amount > 0);

// OK: XRPL_ASSERT（ユニットテスト以外）
XRPL_ASSERT(amount > 0, "Payment::doApply : amount must be positive");

// OK: 到達不能コード
UNREACHABLE("Payment::doApply : unexpected transaction type");
```

`XRPL_ASSERT` の第2引数は `"関数名 : 説明"` の形式で書きます。

## クラスメンバの順序

クラスのメンバは以下の順序で定義します：

```cpp
class MyClass
{
    // 1. private データメンバ（最初）
    int value_;
    std::string name_;

public:
    // 2. デストラクタ
    ~MyClass();

    // 3. デフォルトコンストラクタ
    MyClass();

    // 4. コピーコンストラクタ
    MyClass(MyClass const&);

    // 5. コピー代入演算子
    MyClass& operator=(MyClass const&);

    // 6. ムーブコンストラクタ
    MyClass(MyClass&&);

    // 7. ムーブ代入演算子
    MyClass& operator=(MyClass&&);

    // 8. その他のメソッド
    void doSomething();
};
```

## ファイルの配置ルール

新しいファイルを追加するときの配置場所：

| 種別 | 配置先 |
|------|--------|
| `libxrpl` のヘッダ | `include/xrpl/` |
| `libxrpl` のソース | `src/libxrpl/` |
| デーモン固有のコード | `src/xrpld/` |
| ユニットテスト | `src/test/` |

## モダンC++の書き方

xrpld はC++20を使用しています。以下のルールに従います：

```cpp
// OK: スマートポインタを使う（naked new/delete は禁止）
auto sle = std::make_shared<SLE>(keylet::account(accountID));

// OK: range-based for
for (auto const& item : items)
    process(item);

// OK: structured bindings (C++17/20)
auto [it, inserted] = map.emplace(key, value);
```

## PR 前のチェックリスト

コードを書いたら、PR を出す前に以下を確認します：

- [ ] `clang-format` または `pre-commit run clang-format` でフォーマット済み
- [ ] `clang-tidy` のエラーがない
- [ ] `./xrpld --unittest` がすべて通る
- [ ] 新機能・バグ修正にテストを追加した
- [ ] コミットメッセージが規約に従っている
- [ ] GPG 署名済みコミット
