# 🚀 快速启动指南 (5分钟上手)

## 第一步：安装依赖 (1分钟)

```bash
cd .kiro/amazonready
npm install
```

## 第二步：配置 Supabase (2分钟)

### 1. 创建 Supabase 项目

1. 访问 https://supabase.com/dashboard
2. 点击 "New Project"
3. 填写信息：
   - Name: `amazonready-ai`
   - Database Password: (自动生成，保存好)
   - Region: 选择最近的区域

### 2. 执行数据库迁移

1. 进入项目 -> SQL Editor
2. 点击 "New Query"
3. 复制粘贴 `supabase/migrations/001_create_user_profiles.sql` 的内容
4. 点击 "Run"
5. 重复步骤 2-4，执行 `002_create_processed_images.sql`

### 3. 获取 API Keys

1. 进入 Settings -> API
2. 复制以下信息：
   - Project URL
   - anon/public key

## 第三步：配置环境变量 (1分钟)

创建 `.env.local` 文件：

```bash
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 第四步：启动项目 (1分钟)

```bash
npm run dev
```

访问 http://localhost:5173

## ✅ 测试功能

1. 点击 "Start Free" 注册账号
2. 登录后查看 Dashboard
3. 上传一张图片测试
4. 查看积分余额（应该是 20）

## 🎉 完成！

现在你有一个可运行的 MVP 了！

## 下一步

- 集成 Replicate API 实现真实的图片处理
- 添加 Stripe 支付
- 部署到 Vercel

查看 `README.md` 了解更多。
