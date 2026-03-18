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
- 联系邮箱: binbin7418@gmail.com

---

## 本地开发启动
```bash
# 用 Kiro 打开 .kiro/amazonready 文件夹（或迁移后的 AmazonReady 文件夹）
npm install        # 首次运行需要安装依赖
npm run dev        # 启动本地服务器 → http://localhost:5173
```

---

## 推送代码到 GitHub（每次修改后执行）
```bash
git add -A
git commit -m "描述你的改动"
git push origin main
```
推送后 Vercel 会自动重新部署（等 1-2 分钟生效）

---

## Vercel 配置说明
- Root Directory: `./`（仓库根目录）
- 环境变量：`REMOVE_BG_API_KEY=3nkRvTGhP3HdEihD8TWDKR6M`（Production 环境）
- vercel.json 在项目根目录

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

### 阶段四：变现 ✅（基础完成）
- [x] Ko-fi 支付接入（三个产品链接已接入网站按钮）
  - Starter $19 one-time (500 images): https://ko-fi.com/s/08a2884d3e
  - Pro $49 one-time (2000 images): https://ko-fi.com/s/6c5b4aeb32
  - Enterprise $199 one-time (Unlimited): https://ko-fi.com/s/a04a55443d
- [x] 定价改为 one-time（非订阅）
- [x] 页面加购买说明：Credits delivered within 24 hours
- [x] 联系邮箱显示在页面：binbin7418@gmail.com

### 阶段五：待开发 ⏳
- [ ] Supabase 邮箱认证（现在是 demo 模式，credits 存 localStorage）
- [ ] 自动发 credits（Ko-fi webhook → 自动加额度）
- [ ] remove.bg 付费充值（需要海外卡，推荐 Wise/DuPay）
- [ ] 流量获取（Reddit / Facebook Groups / SEO）

---

## 当前已知问题 & 待解决
| 问题 | 状态 | 解决方案 |
|------|------|---------|
| PayPal 收款审核中 | ⏳ 等待 | Ko-fi 需先赚 $100 才能绑 PayPal |
| 邮箱认证未接入 | ⏳ 待做 | 注册 Supabase，配置环境变量 |
| remove.bg 超额付费 | ⏳ 待做 | 申请 Wise/DuPay 海外虚拟卡 |
| Credits 存 localStorage | ⏳ 待做 | 接 Supabase 后迁移到数据库 |

---

## 手动发 Credits 流程（现阶段）
1. Ko-fi 收到购买通知邮件（发到 binbin7418@gmail.com）
2. 邮件里有买家邮箱和购买套餐
3. 目前 credits 存在用户浏览器 localStorage，无法远程修改
4. **临时方案**：回复买家邮件，让他们告知账号，手动提供一个特殊访问码
5. **正式方案**：接 Supabase 后可以后台直接加 credits

---

## 技术栈
- 前端: React 18 + TypeScript + Vite + Tailwind CSS + Zustand
- 后端: Vercel Serverless Functions
- AI: remove.bg API（去背景）
- 数据库: 暂无（credits 存 localStorage）
- 部署: Vercel
- 代码托管: GitHub

## 关键文件路径
- 去背景 API: `api/remove-background.js`
- 图片处理逻辑: `src/services/imageProcessor.ts`
- 批量上传组件: `src/components/BatchImageUploader.tsx`
- 主入口: `src/App.tsx`
- Vercel 配置: `vercel.json`
- Landing 页面: `src/pages/Landing.tsx`
- Auth 页面: `src/pages/Auth.tsx`
- Dashboard: `src/pages/Dashboard.tsx`
- Credits 逻辑: `src/store/authStore.ts`
