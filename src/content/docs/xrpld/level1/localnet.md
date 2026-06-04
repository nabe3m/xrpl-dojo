---
title: 1-4. ローカルネットワークを起動する
description: ビルドしたxrpldを使ってローカルでXRPLを動かす
sidebar:
  order: 4
---

ビルドしたxrpldを使って、自分のマシン上でXRPLネットワークを動かしてみましょう。ローカルネットワークでは自由に実験できるため、学習に最適です。

## スタンドアロンモードとは

xrpldには2つの起動モードがあります：

| モード | 説明 | 用途 |
|--------|------|------|
| **スタンドアロンモード** | 1台でコンセンサスなしに動作 | 開発・テスト向け |
| **ネットワークモード** | 他のノードと接続して動作 | 本番・テストネット接続 |

学習目的では**スタンドアロンモード**が便利です。コンセンサスを待たずに任意のタイミングでLedgerを進められます。起動方法の詳細は [xrpl.org の Stand-Alone Mode](https://xrpl.org/docs/infrastructure/commandline-usage#stand-alone-mode-options) も参照してください。

::::note[Dockerで動かす選択肢]
ソースからビルドせずにノードを動かしてみたい場合は、Docker イメージもあります。たとえば [xrpllabsofficial/xrpld](https://hub.docker.com/r/xrpllabsofficial/xrpld) は XRP Ledger ノードをコンテナとして起動できるイメージです。

このコースではコードを読み、変更し、テストするためにソースビルドを前提に進めますが、「まず xrpld が動く様子を見たい」「設定ファイルやRPC接続を試したい」という場合は Docker も選択肢になります。
::::

## 設定ファイルの準備

xrpld は起動時に設定ファイルを読み込みます。ファイル名は `xrpld.cfg` です（`--conf` でパスを指定すれば任意の名前でも構いません）。

:::note[学習用の最小設定]
ここで作る設定は、公式の `cfg/xrpld-example.cfg`（[XRPLF/rippled](https://github.com/XRPLF/rippled) リポジトリ同梱）をベースに、スタンドアロン向けへ簡略化したものです。peer ポートや `validators_file` などは省略しています。本番相当の設定例はリポジトリの公式サンプルを参照してください。
:::

次のコマンドで、学習用の最小設定を `xrpld-test/localnet/xrpld.cfg` に作成します。ここではクローンした作業ディレクトリ名を `xrpld-test` としていますが、実際の名前は自分の環境に合わせて読み替えてください。

```bash
# xrpld-test/.build から
mkdir -p ../localnet/db
cat > ../localnet/xrpld.cfg << 'EOF'
[server]
port_rpc_admin_local

[port_rpc_admin_local]
port = 5005
ip = 127.0.0.1
admin = 127.0.0.1
protocol = http

[node_size]
small

[node_db]
type=NuDB
path=db/nudb

[database_path]
db

[debug_logfile]
debug.log

[sntp_servers]
time.windows.com
time.apple.com
time.nist.gov
pool.ntp.org

[rpc_startup]
{ "command": "log_level", "severity": "warning" }

[ssl_verify]
0
EOF
```

`ssl_verify = 0` は開発・ローカル向けの設定です。公式サンプル（`cfg/xrpld-example.cfg`）のデフォルトは `1` です。

## スタンドアロンモードで起動

```bash
./xrpld --conf ../localnet/xrpld.cfg --standalone
```

DB が空の状態で初回起動すると、genesis ledger が作成されます。新規 genesis を明示したい場合は、公式手順どおり `--start` を付けてもかまいません。

```bash
./xrpld --conf ../localnet/xrpld.cfg --standalone --start
```

起動すると以下のようなログが表示されます：

```
Loading: "../localnet/xrpld.cfg"
2026-May-31 09:56:54.512425 UTC JobQueue:NFO Using 1  threads
2026-May-31 09:56:54.518771 UTC Application:NFO Process starting: xrpld-3.2.0-rc2+...DEBUG
...
2026-May-31 09:56:54.650492 UTC Application:WRN Running in standalone mode
2026-May-31 09:56:54.650506 UTC NetworkOPs:NFO STATE->full
```

ログフォーマットは `日時 UTC コンポーネント:レベル メッセージ` です。レベルの略称は `NFO`（info）・`DBG`（debug）・`WRN`（warn）・`FTL`（fatal）です。

`NetworkOPs:NFO STATE->full` が表示されれば起動完了です。

:::note[別ターミナルで操作する]
xrpldはフォアグラウンドで動き続けます。操作は別のターミナルウィンドウで行ってください。
:::

## RPCでノードに接続する

別のターミナルで、xrpldのRPCを使ってノードの状態を確認します：

```bash
./xrpld --conf ../localnet/xrpld.cfg server_info
```

以下のようなJSON応答が返ってきます：

```json
{
   "result" : {
      "info" : {
         "build_version" : "3.2.0-rc2+...",
         "complete_ledgers" : "2-3",
         "server_state" : "full",
         ...
      },
      "status" : "success"
   }
}
```

## Ledgerを進める

スタンドアロンモードでは、手動でLedgerを進めることができます：

```bash
# Ledgerを1つ進める
./xrpld --conf ../localnet/xrpld.cfg ledger_accept
```

```json
{
   "result" : {
      "ledger_current_index" : 3,
      "status" : "success"
   }
}
```

`ledger_current_index` が増えていれば成功です。

## テストアカウントへの送金を試す

スタンドアロンモードの genesis ledger には、公式ドキュメントと同じジェネシスアカウントが用意されています。

### ジェネシスアカウントの確認

ジェネシスアカウントのシードは `snoPBrXtMeMyMHUVTgbuqAfg1SUTb` です（[Start a New Genesis Ledger in Stand-Alone Mode](https://xrpl.org/docs/infrastructure/testing-and-auditing/start-a-new-genesis-ledger-in-stand-alone-mode) 参照）。

```bash
# アカウント情報を確認
./xrpld --conf ../localnet/xrpld.cfg account_info rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh
```

:::tip[Faucetについて]
テストネット（Testnet/Devnet）には、無料でXRPを配布するFaucetがあります。
ローカルではジェネシスアカウントを使いましょう。
:::

## ログの確認

```bash
tail -f ../localnet/debug.log
```

ログレベルは設定で変更できます：

```bash
./xrpld --conf ../localnet/xrpld.cfg log_level debug Application
```

## ノードを停止する

```bash
./xrpld --conf ../localnet/xrpld.cfg stop
```

または、起動しているターミナルで `Ctrl+C` を押します。

## 次のステップ

ローカルでxrpldが動くようになりました。次はソースコードの構造を理解します。
