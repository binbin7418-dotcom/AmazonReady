# AmazonReady AI - 开发进度

## 项目目标
自动处理产品图片使其符合亚马逊要求：
- 纯白背景 RGB(255,255,255)
- 2000x2000px
- 产品占画面 85%

---

## 关键信息
- GitHub: https://github.com/binbin7418-dotcom/AmazonReady
- Vercel: https://amazon-ready-c591.vercel.app
- remove.bg API Key: `3nkRvTGhP3HdEihD8TWDKR6M`（已配置到 Vercel 环境变量 Production）

---

## 本地开发启动
```bash
# 用 Kiro 打开 .kiro/amazonready 文件夹
npm install        # 首次运行需要安装依赖
npm run dev        # 启动本地服务器 → http://localhost:5173
```

---

## 推送代码到 GitHub（每次修改后执行）
```bash
# 在 .kiro/amazonready 目录下执行
git add -A
git commit -m "描述你的改动"
git push origin main
```
推送后 Vercel 会自动重新部署（等 1-2 分钟生效）

---

## Vercel 配置说明
- Root Directory: `./`（仓库根目录，不是 .kiro/amazonready）
- 环境变量：`REMOVE_BG_API_KEY=3nkRvTGhP3HdEihD8TWDKR6M`（必须设置为 Production 环境）
- vercel.json 在 `.kiro/amazonready/vercel.json`

---

## 进度记录

### 阶段一：基础搭建 ✅
- [x] 项目搭建 (React + TypeScript + Vite + Tailwind)
- [x] Landing 页面（产品介绍 + 定价）
- [x] Auth 页面（登录/注册 UI + Try Demo 按钮）
- [x] Demo 模式（无需登录，直接体验）
- [x] Dashboard 页面
- [x] Credits 系统（localStorage，免费 20 次）
- [x] 处理历史记录 (ProcessingHistory)

### 阶段二：核心功能 ✅
- [x] 批量图片上传组件 (BatchImageUploader)
- [x] remove.bg API 接入（替换 Replicate，每月 50 张免费）
- [x] 去背景功能正常运行 ✅（已验证）
- [x] 白底 2000x2000px 合规处理
- [x] 产品占画面 85%

### 阶段三：部署 ✅
- [x] GitHub 仓库 → https://github.com/binbin7418-dotcom/AmazonReady
- [x] Vercel 部署 → https://amazon-ready-c591.vercel.app
- [x] 环境变量配置（REMOVE_BG_API_KEY）

### 阶段四：变现 ⏳（下次继续）
- [ ] Lemon Squeezy 支付接入
- [ ] 邮箱通知（有付费用户后再接）
- [ ] Supabase 用户系统（有付费用户后再接）

---

## 下次开始：支付接入

### 选定方案：Lemon Squeezy
- 海外收款，注册不需要信用卡
- 支持全球信用卡付款
- 抽成 5% + $0.50/笔
- 注册地址：https://lemonsqueezy.com

### 操作步骤（下次继续）
1. 去 lemonsqueezy.com 注册账号
2. 创建 Store
3. 创建 3 个产品：
   - Starter: $19/月，500 images
   - Pro: $49/月，2000 images
   - Enterprise: $199/月，Unlimited
4. 每个产品拿到 checkout URL
5. 把 3 个 URL 告诉 Kiro，接入代码

---

## 已知限制
- 文字水印无法完全清除（AI 限制，非 bug）
- remove.bg 免费额度：50 次/月，超出需付费
- 批量处理：顺序处理，每张约 3-5 秒

---

## 技术栈
- 前端: React 18 + TypeScript + Vite + Tailwind CSS + Zustand
- 后端: Vercel Serverless Functions
- AI: remove.bg API（去背景）
- 部署: Vercel
- 代码托管: GitHub

## 关键文件路径（相对于 .kiro/amazonready/）
- 去背景 API: `api/remove-background.js`
- 图片处理逻辑: `src/services/imageProcessor.ts`
- 批量上传组件: `src/components/BatchImageUploader.tsx`
- 主入口: `src/App.tsx`
- Vercel 配置: `vercel.json`
- Landing 页面: `src/pages/Landing.tsx`
- Auth 页面: `src/pages/Auth.tsx`
- Dashboard: `src/pages/Dashboard.tsx`
