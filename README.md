# 🎯 AmazonReady AI

**3秒让产品图通过亚马逊审核**

一个自动化图片合规处理工具，专为 Amazon/Shopify/eBay 电商卖家设计。

---

## ✨ 功能特性

- ✅ **批量上传**：一次上传多张产品图片
- ✅ **自动处理**：AI 去除背景 + 纯白底 RGB(255,255,255)
- ✅ **合规检测**：自动调整到 2000x2000px + 85% frame
- ✅ **批量下载**：一键下载所有处理好的图片
- ✅ **积分系统**：免费 20 张图片，按需付费
- ✅ **处理历史**：查看所有处理记录

---

## 🚀 快速开始

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问 http://localhost:5173
```

### 部署到 Vercel

```bash
# 推送到 GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/amazonready-ai.git
git push -u origin main

# 然后在 Vercel 导入项目
# 配置环境变量：
# VITE_REPLICATE_API_TOKEN=your_token_here
```

详细部署指南请查看 [DEPLOY_GUIDE.md](./DEPLOY_GUIDE.md)

---

## 📁 项目结构

```
.kiro/amazonready/
├── src/
│   ├── components/          # React 组件
│   │   ├── BatchImageUploader.tsx
│   │   ├── ProcessingHistory.tsx
│   │   └── CreditBalance.tsx
│   ├── pages/              # 页面组件
│   │   ├── Landing.tsx
│   │   ├── Auth.tsx
│   │   └── Dashboard.tsx
│   ├── services/           # 业务逻辑
│   │   ├── imageProcessor.ts
│   │   └── storageService.ts
│   ├── store/              # 状态管理
│   │   └── authStore.ts
│   └── App.tsx
├── api/                    # Vercel Serverless Functions
│   └── remove-background.js
├── public/
└── package.json
```

---

## 🔧 技术栈

- **前端**: React 18 + TypeScript + Vite
- **样式**: Tailwind CSS
- **状态管理**: Zustand
- **图片处理**: Replicate API (BiRefNet)
- **部署**: Vercel
- **存储**: LocalStorage (演示模式)

---

## 💰 定价

| 套餐 | 价格 | 图片数量 |
|------|------|----------|
| Free | $0 | 20 张 |
| Starter | $19/月 | 500 张 |
| Pro | $49/月 | 2000 张 |
| Enterprise | $199/月 | 无限 |

---

## 🎯 MVP 功能清单

- [x] Landing Page
- [x] 用户认证（演示模式）
- [x] 图片批量上传
- [x] 图片处理（尺寸+白底）
- [x] 背景移除（Replicate API）
- [x] 批量下载
- [x] 积分系统
- [x] 处理历史
- [ ] Supabase 集成
- [ ] Stripe 支付
- [ ] 邮件通知

---

## 📊 成本估算

### 免费额度
- Vercel: 100GB 带宽/月
- Replicate: 前 $5 免费（约 16,000 张图片）

### 付费后
- Replicate: $0.00031/张 = $0.31/1000张
- Vercel Pro: $20/月（可选）

---

## 🐛 已知问题

1. **本地开发无法测试背景移除**
   - 原因：Replicate API 有 CORS 限制
   - 解决：部署到 Vercel 后可正常使用

2. **演示模式数据存储在 localStorage**
   - 原因：暂未集成 Supabase
   - 影响：刷新浏览器数据不会丢失，但清除缓存会丢失

---

## 📝 开发日志

- 2026-03-16: MVP 开发完成
  - 实现批量上传和处理
  - 集成 Replicate API
  - 添加处理历史功能
  - 完善积分系统

---

## 📧 联系方式

- Email: support@amazonready.ai
- GitHub: [amazonready-ai](https://github.com/YOUR_USERNAME/amazonready-ai)

---

## 📄 License

MIT License - 详见 [LICENSE](./LICENSE)

---

**Made with ❤️ for Amazon Sellers**
