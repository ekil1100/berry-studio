# Berry Studio

一个基于 Next.js 和 Tauri 的桌面聊天应用。

## 技术栈

- **前端**: Next.js 15.4.6 + React 19 + TypeScript
- **样式**: Tailwind CSS 4 + ShadcnUI 组件库
- **桌面应用**: Tauri 2.7.1 (Rust)
- **包管理器**: Bun

## 项目架构

```
berry-studio/
├── src/                  # Next.js 前端代码
│   ├── app/              # App Router 页面
│   ├── components/       # React 组件
│   └── lib/              # 工具函数
├── src-tauri/            # Tauri 后端代码 (Rust)
└── public/               # 静态资源
```

## 安装依赖

确保你已经安装了以下工具：

- [Bun](https://bun.sh/) - JavaScript 运行时和包管理器
- [Rust](https://rustup.rs/) - Tauri 需要 Rust 环境

安装项目依赖：

```bash
# 安装前端依赖
bun install

# 如果需要安装 Tauri CLI（首次开发）
bun add -D @tauri-apps/cli
```

## 启动命令

### 开发模式

```bash
# 启动 Next.js 开发服务器
bun dev

# 启动 Tauri 桌面应用（开发模式）
bun tauri dev
```

### 构建打包

```bash
# 构建 Next.js 应用
bun build

# 构建 Tauri 桌面应用
bun tauri build
```

## 开发说明

- Web 版本访问: [http://localhost:3000](http://localhost:3000)
- 桌面应用会自动启动一个窗口
- 支持热重载，修改代码后自动更新
- 使用 ShadcnUI 组件库，采用 "new-york" 风格

## 添加 ShadcnUI 组件

```bash
# 添加新的 UI 组件
bunx shadcn@latest add <component-name>
```

可用组件列表: https://ui.shadcn.com/docs/components
