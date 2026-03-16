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
- Replicate Token: 在 Vercel 环境变量中查看（变量名：REPLICATE_API_TOKEN）

---

## 本地开发启动
```bash
# 进入项目目录（用 Kiro 打开 .kiro/amazonready 文件夹）
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

## 进度记录

### 2026-03-16

#### ✅ 已完成
- [x] 项目搭建 (React + TypeScript + Vite + Tailwind)
- [x] Landing 页面（产品介绍 + 定价）
- [x] Auth 页面（登录/注册 UI）
- [x] Demo 模式（无需登录，直接体验）
- [x] Dashboard 页面
- [x] 批量图片上传组件 (BatchImageUploader)
- [x] Credits 系统（localStorage，免费 20 次）
- [x] 处理历史记录 (ProcessingHistory)
- [x] Vercel 部署成功 → https://amazon-ready-c591.vercel.app
- [x] GitHub 仓库 → https://github.com/binbin7418-dotcom/AmazonReady
- [x] Replicate API Token 配置到 Vercel 环境变量
- [x] Serverless Function 超时设为 60s（单张图够用）
- [x] 批量上传时每张图顺序处理，加了处理中状态提示

#### 🔴 进行中
- [ ] 去背景功能验证（最新修复已推送，等待部署测试）

#### ⏳ 待开发
- [ ] 处理结果对比展示（左原图 / 右处理后）
- [ ] 合规报告详情
- [ ] Stripe 支付集成
- [ ] Supabase 用户系统

---

## 批量上传说明
- 每张图片独立调用 Replicate API，单张约需 15-30 秒
- 5 张图 = 约 2-3 分钟（顺序处理，非并行）
- Serverless Function 超时已设为 60s，单张够用
- 前端有 Processing 状态显示，处理完一张再处理下一张

---

## 技术栈
- 前端: React 18 + TypeScript + Vite + Tailwind CSS + Zustand
- 后端: Vercel Serverless Functions
- AI: Replicate API (lucataco/remove-bg model)
- 部署: Vercel（Root Directory: .kiro/amazonready）
- 代码托管: GitHub

## 关键文件
- 去背景 API: `api/remove-background.js`
- 图片处理逻辑: `src/services/imageProcessor.ts`
- 批量上传组件: `src/components/BatchImageUploader.tsx`
- 主入口: `src/App.tsx`
- Vercel 配置: `vercel.json`
