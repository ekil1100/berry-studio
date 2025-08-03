# Berry Studio

AI 对话应用，基于 Tauri + Next.js + DeepSeek

## 功能特性

- ✅ 单一 AI 模型集成（DeepSeek）
- ✅ 基础对话界面
- ✅ 消息发送/接收/显示
- ✅ 简单的聊天界面布局
- ✅ 黑白主题切换
- ✅ Markdown 渲染
- ✅ 代码高亮显示

## 开发环境设置

1. 复制环境变量文件：
```bash
cp .env.local.example .env.local
```

2. 在 `.env.local` 中添加你的 DeepSeek API Key：
```
DEEPSEEK_API_KEY=your_api_key_here
```

3. 安装依赖：
```bash
bun install
```

4. 启动开发服务器：
```bash
bun run dev
```

5. 启动 Tauri 开发模式：
```bash
bun run tauri:dev
```

## 技术栈

- **前端框架**: Next.js 14 (App Router)
- **桌面框架**: Tauri
- **样式**: Tailwind CSS + shadcn/ui
- **API 通信**: tRPC
- **状态管理**: TanStack Query
- **包管理器**: Bun
- **AI 模型**: DeepSeek