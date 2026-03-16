# 🚀 AmazonReady AI - 部署指南

## 快速部署到 Vercel（5分钟）

### 第一步：准备 GitHub 仓库

```bash
# 在 .kiro/amazonready 目录下
cd .kiro/amazonready

# 初始化 Git（如果还没有）
git init
git add .
git commit -m "Initial commit - AmazonReady AI MVP"

# 创建 GitHub 仓库并推送
# 1. 去 github.com 创建新仓库 "amazonready-ai"
# 2. 然后运行：
git remote add origin https://github.com/YOUR_USERNAME/amazonready-ai.git
git branch -M main
git push -u origin main
```

### 第二步：部署到 Vercel

1. **访问** https://vercel.com
2. **登录/注册** （可以用 GitHub 账号）
3. **点击** "Add New Project"
4. **导入** 你的 GitHub 仓库 `amazonready-ai`
5. **配置环境变量**：
   ```
   VITE_REPLICATE_API_TOKEN=your_replicate_token_here
   VITE_SUPABASE_URL=https://placeholder.supabase.co
   VITE_SUPABASE_ANON_KEY=placeholder_key
   ```
6. **点击** "Deploy"
7. **等待** 2-3 分钟部署完成

### 第三步：测试

部署完成后，Vercel 会给你一个 URL，比如：
```
https://amazonready-ai.vercel.app
```

访问这个 URL，测试：
1. 上传产品图片
2. 点击 "Process" 按钮
3. 等待 3-5 秒
4. 查看处理后的图片（应该已经去除背景了！）

---

## 为什么本地开发看不到背景移除？

**原因**：Replicate API 不能直接从浏览器调用（CORS 跨域限制）

**解决方案**：
- 本地开发：只能看到调整尺寸 + 白底的效果
- Vercel 部署：通过 Serverless Function 调用 API，可以看到真实的背景移除效果

---

## 本地测试 API（可选）

如果你想在本地测试真实的背景移除，需要运行后端服务器：

```bash
# 安装 Vercel CLI
npm install -g vercel

# 在项目目录运行
vercel dev

# 然后访问 http://localhost:3000
```

---

## 环境变量说明

### VITE_REPLICATE_API_TOKEN
- **作用**：调用 Replicate API 去除背景
- **获取**：https://replicate.com/account/api-tokens
- **当前值**：需要你自己配置
- **成本**：$0.00031/张图片

### VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY
- **作用**：用户认证和数据存储
- **获取**：https://supabase.com/dashboard
- **当前状态**：占位符（演示模式不需要）

### VITE_STRIPE_PUBLISHABLE_KEY
- **作用**：支付功能
- **获取**：https://dashboard.stripe.com/apikeys
- **当前状态**：未配置（MVP 暂不需要）

---

## 下一步

部署成功后，你可以：

1. **分享链接**给朋友测试
2. **在 Reddit 发帖**收集反馈
3. **配置 Supabase**实现真实的用户注册
4. **集成 Stripe**实现付费功能

---

## 常见问题

### Q: 部署后还是看不到背景移除？
A: 检查 Vercel 环境变量是否正确配置，特别是 `VITE_REPLICATE_API_TOKEN`

### Q: 处理速度很慢？
A: Replicate API 第一次调用会慢一些（冷启动），后续会快很多

### Q: 如何查看错误日志？
A: Vercel Dashboard → 你的项目 → Functions → 查看日志

### Q: 如何更新代码？
A: 推送到 GitHub，Vercel 会自动重新部署
```bash
git add .
git commit -m "Update feature"
git push
```

---

## 成本估算

### 免费额度
- **Vercel**: 100GB 带宽/月，免费
- **Replicate**: 前 $5 免费（约 16,000 张图片）
- **Supabase**: 500MB 数据库，免费

### 付费后
- **Replicate**: $0.00031/张 = $0.31/1000张
- **Vercel Pro**: $20/月（如果需要更多带宽）
- **Supabase Pro**: $25/月（如果需要更多存储）

---

**祝你部署顺利！🎉**
