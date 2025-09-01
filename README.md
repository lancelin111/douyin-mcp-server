# 抖音 MCP 服务器 (Douyin MCP Server)

一个基于 [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) 的抖音自动化上传服务，允许大型语言模型（LLM）通过 MCP 协议自动上传视频到抖音创作者平台。

## 🌟 特性

- 🤖 **MCP 集成**: 完整实现 MCP 协议，可与支持 MCP 的 AI 工具集成
- 🔐 **自动登录**: 支持浏览器自动化登录，Cookie 持久化存储
- 📹 **视频上传**: 自动化视频上传流程，支持标题、描述、标签设置
- 📱 **短信验证**: 智能处理发布时的短信验证流程
- 🚫 **权限处理**: 自动处理浏览器权限请求，避免中断流程
- 🎯 **灵活发布**: 支持自动发布或保存为草稿

## 📋 前置要求

- Node.js 18+ 
- npm 或 yarn
- Chrome 浏览器（Puppeteer 会自动下载）
- 抖音创作者账号

## 🚀 快速开始

### 1. 安装

```bash
# 克隆仓库
git clone https://github.com/lancelin111/douyin-mcp-server.git
cd douyin-mcp-server

# 安装依赖
npm install

# 构建 TypeScript
cd mcp-server
npm run build
cd ..
```

### 2. 基本使用

```javascript
import { DouyinUploader } from './mcp-server/dist/douyin-uploader.js';

const uploader = new DouyinUploader();

// 登录
const loginResult = await uploader.login(false, 180000);
console.log(`登录成功: ${loginResult.user}`);

// 上传视频
const uploadResult = await uploader.uploadVideo({
  videoPath: './video.mp4',
  title: '我的视频标题',
  description: '视频描述内容',
  tags: ['标签1', '标签2'],
  headless: false,  // 显示浏览器
  autoPublish: true // 自动发布
});

console.log(`上传${uploadResult.success ? '成功' : '失败'}`);
```

## 🔧 MCP 服务器

### 启动 MCP 服务器

```bash
cd mcp-server
npm start
```

### MCP 工具列表

| 工具名称 | 描述 | 参数 |
|---------|------|------|
| `douyin_login` | 登录抖音账号 | `headless`, `timeout` |
| `douyin_check_login` | 检查登录状态 | `headless` |
| `douyin_upload_video` | 上传视频 | `videoPath`, `title`, `description`, `tags`, `headless`, `autoPublish` |
| `douyin_get_cookies` | 获取保存的 Cookies 信息 | 无 |
| `douyin_clear_cookies` | 清除登录数据 | 无 |

### 配置 Claude Desktop

在 Claude Desktop 的配置文件中添加：

```json
{
  "mcpServers": {
    "douyin": {
      "command": "node",
      "args": ["path/to/douyin-mcp-server/mcp-server/dist/index.js"],
      "env": {}
    }
  }
}
```

## 📝 API 文档

### DouyinUploader 类

#### `login(headless: boolean, timeout: number): Promise<LoginResult>`
登录抖音创作者平台。

- `headless`: 是否使用无头模式
- `timeout`: 登录超时时间（毫秒）

#### `checkLogin(headless: boolean): Promise<CheckLoginResult>`
检查当前登录状态。

#### `uploadVideo(params: UploadParams): Promise<UploadResult>`
上传视频到抖音。

```typescript
interface UploadParams {
  videoPath: string;      // 视频文件路径
  title: string;          // 视频标题
  description?: string;   // 视频描述
  tags?: string[];        // 标签数组
  headless?: boolean;     // 是否无头模式
  autoPublish?: boolean;  // 是否自动发布
}
```

## 🛠️ 高级功能

### 短信验证处理

当发布视频触发短信验证时，程序会：

1. 自动检测短信验证页面
2. 点击发送验证码按钮
3. 提示用户在终端输入验证码
4. 自动填入验证码并完成验证
5. 继续发布流程

```javascript
// 程序会在终端提示：
// 📱 检测到短信验证页面
// ✅ 已发送验证码到您的手机
// 请输入收到的验证码：
// 验证码: [用户输入]
```

### Cookie 持久化

登录信息会自动保存到 `douyin-cookies.json`，下次使用时无需重新登录。

```javascript
// 检查登录状态
const loginCheck = await uploader.checkLogin(true);
if (loginCheck.isValid) {
  console.log(`已登录: ${loginCheck.user}`);
}
```

## 📁 项目结构

```
douyin-mcp-server/
├── mcp-server/           # MCP 服务器核心代码
│   ├── index.ts          # MCP 服务器入口
│   ├── douyin-uploader.ts # 抖音上传核心逻辑
│   ├── package.json      # 依赖配置
│   └── tsconfig.json     # TypeScript 配置
├── examples/             # 示例代码
│   └── simple-upload.js  # 简单上传示例
├── test-video.mp4        # 测试视频文件
├── package.json          # 根项目配置
└── README.md            # 本文档
```

## ⚠️ 注意事项

1. **账号安全**: 请勿在公共环境使用，保护好你的登录信息
2. **发布频率**: 避免频繁发布，遵守平台规则
3. **内容审核**: 上传的内容需要符合抖音社区规范
4. **Cookie 有效期**: Cookies 可能过期，需要重新登录
5. **浏览器兼容**: 基于 Puppeteer，使用 Chromium 内核

## 🐛 常见问题

### Q: 浏览器启动失败？
A: 运行 `npx puppeteer browsers install chrome` 重新安装 Chrome。

### Q: 登录状态失效？
A: 删除 `douyin-cookies.json` 文件，重新登录。

### Q: 视频上传但未发布？
A: 可能触发了短信验证，查看浏览器窗口并手动完成验证。

### Q: Chrome 权限提示？
A: 程序已配置自动处理权限，如仍有提示，清除 `chrome-user-data` 目录。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 🙏 致谢

- [Model Context Protocol](https://modelcontextprotocol.io/) - AI 工具通信协议
- [Puppeteer](https://pptr.dev/) - Chrome 自动化库
- [抖音创作者平台](https://creator.douyin.com/) - 视频发布平台

## 免责声明

本项目仅供学习和研究使用，请勿用于商业用途或违反抖音平台规则的行为。使用本项目产生的任何后果由使用者自行承担。