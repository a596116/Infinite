# 無限滾動

## 環境設定

### GitHub Token 設定

前往 [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
點擊 "Generate new token" > "Generate new token (classic)"
點擊 "Generate token"
將 token 貼到 `.env` 檔案中：

```env
GITHUB_TOKEN={{github_token}}
```

## 安裝與執行

```bash
# 安裝依賴
pnpm install

# 執行
pnpm dev
```

