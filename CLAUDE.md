## 工具使用

### 文档工具

1. **查看官方文档**
   - `resolve-library-id` - 解析库名到 Context7 ID
   - `get-library-docs` - 获取最新官方文档

需要先安装Context7 MCP，安装后此部分可以从引导词中删除：

```bash
claude mcp add --transport http context7 https://mcp.context7.com/mcp
```

2. **搜索真实代码**
   - `searchGitHub` - 搜索 GitHub 上的实际使用案例

需要先安装Grep MCP，安装后此部分可以从引导词中删除：

```bash
claude mcp add --transport http grep https://mcp.grep.app
```

### 编写规范文档工具

编写需求和设计文档时使用 `specs-workflow`：

1. **检查进度**: `action.type="check"`
2. **初始化**: `action.type="init"`
3. **更新任务**: `action.type="complete_task"`

路径：`/docs/specs/*`

需要先安装spec workflow MCP，安装后此部分可以从引导词中删除：

```bash
claude mcp add spec-workflow-mcp -s user -- npx -y spec-workflow-mcp@latest
```

## 目前用到的技术栈

- 前端: Next.js 15.4.6 + React 19 + TypeScript
- 样式: Tailwind CSS 4 + ShadcnUI 组件库
  - @https://ui.shadcn.com/docs/components 可以查看可用的组件
  - 使用官方命令安装 ShadcnUI 组件
- 桌面应用: Tauri 2.7.1 (Rust)
- 包管理器: Bun

## 其它注意事项

- 这是一个桌面优先的 Tauri 应用，所以请使用适用于桌面应用的设计语言
- 页面设计尽量简洁，使用已有的组件库主题
