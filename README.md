# macos-notify-bridge

DenoベースのHTTPサーバーで、OSAScriptまたはterminal-notifierを使用してmacOSの通知機能を提供します。

## 機能

- **ping エンドポイント**: サーバーの動作確認
- **notify エンドポイント**: macOSの通知センターに通知を送信

## 必要な環境

- [Deno](https://deno.land/) v1.40.0 以上
- macOS（OSAScriptまたはterminal-notifierが必要）
- [terminal-notifier](https://github.com/julienXX/terminal-notifier)（オプション）

## セットアップ

### 1. Denoのインストール

```bash
# Homebrewでインストール
brew install deno

# またはcurlでインストール
curl -fsSL https://deno.land/install.sh | sh
```

### 2. リポジトリのクローン

```bash
git clone https://github.com/fukuiretu/macos-notify-bridge.git
cd macos-notify-bridge
```

### 3. terminal-notifierのインストール（オプション）

```bash
# Homebrewでインストール
brew install terminal-notifier
```

### 4. サーバーの起動

```bash
deno run --allow-net --allow-run server.ts
```

サーバーが起動すると、以下のようなメッセージが表示されます：

```
Server running on http://localhost:8000
Try: curl http://localhost:8000/ping
Try: curl -X POST -H 'Content-Type: application/json' -d '{"title":"Test","message":"Hello World","sound":true}' http://localhost:8000/notify
Try: curl -X POST -H 'Content-Type: application/json' -d '{"title":"Test","message":"Hello World","method":"terminal-notifier"}' http://localhost:8000/notify
```

## API使用方法

### Ping エンドポイント

サーバーの動作確認用です。

```bash
curl http://localhost:8000/ping
```

レスポンス：
```
pong
```

### Notify エンドポイント

macOSの通知センターに通知を送信します。

#### OSAScriptを使用した通知（デフォルト）

```bash
curl -X POST \
  -H 'Content-Type: application/json' \
  -d '{"title":"通知タイトル","message":"通知メッセージ","sound":true}' \
  http://localhost:8000/notify
```

#### terminal-notifierを使用した通知

```bash
curl -X POST \
  -H 'Content-Type: application/json' \
  -d '{"title":"通知タイトル","message":"通知メッセージ","method":"terminal-notifier","sound":true}' \
  http://localhost:8000/notify
```

#### パラメータ

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| `title` | string | ✓ | 通知のタイトル |
| `message` | string | ✓ | 通知のメッセージ |
| `sound` | boolean | - | 通知音の有無（デフォルト: false） |
| `method` | string | - | 通知方法（`osascript` または `terminal-notifier`、デフォルト: `osascript`） |

#### レスポンス

成功時：
```
Notification sent successfully
```

エラー時：
```
Missing title or message
```

## 通知が表示されない場合

macOSの通知が表示されない場合は、以下を確認してください：

1. **システム設定を確認**
   - システム設定 > 通知とフォーカス > ターミナル
   - 通知を「許可」に設定

2. **おやすみモードの確認**
   - おやすみモードが無効になっていることを確認

3. **手動テスト**
   ```bash
   # OSAScriptでのテスト
   osascript -e 'display notification "テスト" with title "テスト"'
   
   # terminal-notifierでのテスト（インストールされている場合）
   terminal-notifier -title "テスト" -message "テスト"
   ```

## 開発

### コードの構成

- **型定義**: `NotificationRequest` インターフェース
- **設定**: `CONFIG` オブジェクト
- **ルーティング**: ルーターパターンを使用
- **エラーハンドリング**: 統一されたレスポンス作成

### 新しいエンドポイントの追加

1. ハンドラー関数を作成
2. `createRouter()` 関数内でルートを追加

例：
```typescript
function handleNewEndpoint(req: Request): Response {
  return createResponse("新しいエンドポイント");
}

// ルーターに追加
routes.set("/new", handleNewEndpoint);
```

## ライセンス

MIT License