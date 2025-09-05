# 抖音 MCP 服务器 / Douyin MCP Server

[English](#english) | [中文](#中文)

---

## 中文

### 🌟 项目简介

一个基于 [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) 的抖音自动化上传服务，允许大型语言模型（LLM）通过 MCP 协议自动上传视频到抖音创作者平台。

### ✨ 主要特性

- 🤖 **MCP 集成**: 完整实现 MCP 协议，可与 Claude 等支持 MCP 的 AI 工具无缝集成
- 🔐 **自动登录**: 支持浏览器自动化登录，Cookie 持久化存储，免重复登录
- 📹 **智能上传**: 自动化视频上传流程，支持标题、描述、标签等完整元数据设置
- 📱 **短信验证**: 智能识别并处理发布时的短信验证流程，终端交互式验证码输入
- 🚫 **权限处理**: 自动处理浏览器权限请求，避免中断自动化流程
- 🎯 **灵活发布**: 支持自动发布或保存为草稿，满足不同使用场景
- 🛠️ **错误恢复**: 完善的错误处理和重试机制，确保上传流程稳定可靠

### 📋 前置要求

- Node.js 18+ 
- npm 或 yarn
- Chrome 浏览器（Puppeteer 会自动下载 Chromium）
- 抖音创作者账号

### 🚀 快速开始

#### 1. 克隆和安装

```bash
# 克隆仓库
git clone https://github.com/lancelin111/douyin-mcp-server.git
cd douyin-mcp-server

# 安装根目录依赖
npm install

# 进入 MCP 服务器目录并安装依赖
cd mcp-server
npm install

# 构建 TypeScript
npm run build
```

#### 2. 启动 MCP 服务器

```bash
# 在 mcp-server 目录下
npm start
```

#### 3. 配置 Claude Desktop

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
┌─────────────────────────────────────────────────────────┐
│                     应用层                                │
├─────────────────────────────────────────────────────────┤
│                   SQL查询层                               │
│         SELECT AESDecrypt(mobile) FROM employee          │
├─────────────────────────────────────────────────────────┤
│                    UDF函数层                              │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│   │Oracle UDF│  │Doris UDF │  │MySQL UDF │            │
│   └──────────┘  └──────────┘  └──────────┘            │
├─────────────────────────────────────────────────────────┤
│                  密钥管理层                               │
│   静态密钥 + 定期轮换 + 审计日志补偿                        │
├─────────────────────────────────────────────────────────┤
│                  数据存储层                               │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│   │  Oracle  │  │  Doris   │  │  MySQL   │            │
│   └──────────┘  └──────────┘  └──────────┘            │
└─────────────────────────────────────────────────────────┘
#### 4. 在 Claude 中使用

配置完成后，您可以直接在 Claude 中使用以下功能：

```
请帮我登录抖音账号
请上传视频到抖音，标题是"我的新视频"，描述是"这是一个测试视频"
检查我的抖音登录状态
```

### 🔧 MCP 工具列表

| 工具名称 | 功能描述 | 主要参数 |
|---------|---------|----------|
| `douyin_login` | 登录抖音账号并保存凭证 | `headless`（是否无头模式）, `timeout`（超时时间） |
| `douyin_check_login` | 检查当前登录状态 | `headless`（是否无头模式） |
| `douyin_upload_video` | 上传视频到抖音 | `videoPath`（视频路径）, `title`（标题）, `description`（描述）, `tags`（标签）, `autoPublish`（是否自动发布） |
| `douyin_get_cookies` | 获取保存的 Cookie 信息 | 无 |
| `douyin_clear_cookies` | 清除登录数据和浏览器缓存 | 无 |

### 📝 独立使用示例

如果您想直接使用核心功能而不通过 MCP，可以参考以下代码：

```javascript
import { DouyinUploader } from './mcp-server/dist/douyin-uploader.js';

const uploader = new DouyinUploader();

// 检查登录状态
const loginCheck = await uploader.checkLogin(true);
if (!loginCheck.isValid) {
  // 需要登录
  const loginResult = await uploader.login(false, 180000);
  console.log(`登录成功: ${loginResult.user}`);
}

// 上传视频
const uploadResult = await uploader.uploadVideo({
  videoPath: './test-video.mp4',
  title: '我的视频标题',
  description: '视频描述内容',
  tags: ['标签1', '标签2'],
  headless: false,  // 显示浏览器窗口
  autoPublish: true // 自动发布
});

console.log(`上传${uploadResult.success ? '成功' : '失败'}`);
```

### 📁 项目结构

```
douyin-mcp-server/
├── mcp-server/                 # MCP 服务器核心代码
│   ├── index.ts                # MCP 服务器入口文件
│   ├── douyin-uploader.ts      # 抖音自动化核心逻辑
│   ├── package.json            # MCP 服务器依赖配置
│   ├── tsconfig.json           # TypeScript 配置
│   └── dist/                   # 编译输出目录
├── examples/                   # 使用示例
│   └── simple-upload.js        # 简单上传示例
├── .claude/                    # Claude 配置文件
├── test-video.mp4             # 测试视频文件
├── CLAUDE.md                  # Claude Code 开发指南
├── package.json               # 根项目配置
├── tsconfig.json              # 根 TypeScript 配置
└── README.md                  # 项目说明文档
```

### 🛠️ 开发指南

#### 开发命令

```bash
# 开发模式运行（自动重新加载）
cd mcp-server && npm run dev

# 构建 TypeScript
cd mcp-server && npm run build

# 运行示例
node examples/simple-upload.js
```

#### 核心架构

- **MCP 服务器**（`mcp-server/index.ts`）：实现标准 MCP 协议，处理工具调用和参数验证
- **抖音上传器**（`mcp-server/douyin-uploader.ts`）：核心自动化逻辑，包含登录、上传、验证处理
- **浏览器会话管理**：基于 Puppeteer 的持久化会话，支持 Cookie 保存和权限预设

### ⚠️ 重要注意事项

1. **账号安全**: 
   - 请勿在公共环境或不安全的网络中使用
   - 定期检查和更新保存的登录凭证
   - 建议使用测试账号进行开发调试

2. **使用规范**:
   - 避免频繁发布，遵守抖音平台发布频率限制
   - 确保上传内容符合抖音社区规范和法律法规
   - 不要用于恶意营销或垃圾内容发布

3. **技术限制**:
   - Cookie 有效期有限，过期后需要重新登录
   - 基于 Puppeteer 和 Chromium，需要足够的系统资源
   - 网络环境可能影响上传成功率

### 🐛 常见问题解决

#### Q: 浏览器启动失败？
```bash
# 重新安装 Chrome
npx puppeteer browsers install chrome
```

#### Q: 登录状态失效？
```bash
# 清除保存的登录数据
rm mcp-server/douyin-cookies.json
rm -rf mcp-server/chrome-user-data
```

#### Q: 视频上传失败？
- 检查视频文件路径和格式
- 确认网络连接稳定
- 查看终端输出的详细错误信息
- 尝试关闭无头模式查看浏览器页面

#### Q: 短信验证处理？
- 程序会自动检测并提示输入验证码
- 在终端中按提示输入收到的短信验证码
- 如果多次失败，请手动完成验证后重试

### 🤝 贡献指南

我们欢迎社区贡献！请遵循以下步骤：

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

### 📄 开源许可

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

### 🙏 致谢

- [Model Context Protocol](https://modelcontextprotocol.io/) - AI 工具通信协议标准
- [Puppeteer](https://pptr.dev/) - Chrome 浏览器自动化库
- [抖音创作者平台](https://creator.douyin.com/) - 视频发布和管理平台

---

## English

### 🌟 Project Overview

An automated video upload service for Douyin (TikTok China) based on the [Model Context Protocol (MCP)](https://modelcontextprotocol.io/). This project enables Large Language Models (LLMs) to automatically upload videos to Douyin Creator Platform through MCP protocol.

### ✨ Key Features

- 🤖 **MCP Integration**: Full MCP protocol implementation, seamlessly integrates with AI tools like Claude
- 🔐 **Automated Login**: Browser automation login with persistent cookie storage
- 📹 **Smart Upload**: Automated video upload workflow with comprehensive metadata support
- 📱 **SMS Verification**: Intelligent SMS verification handling with interactive terminal input
- 🚫 **Permission Handling**: Automatic browser permission management
- 🎯 **Flexible Publishing**: Support for both auto-publish and draft saving
- 🛠️ **Error Recovery**: Robust error handling and retry mechanisms

### 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Chrome browser (Chromium will be auto-downloaded by Puppeteer)
- Douyin creator account

### 🚀 Quick Start

#### 1. Clone and Install

```bash
# Clone repository
git clone https://github.com/lancelin111/douyin-mcp-server.git
cd douyin-mcp-server

# Install root dependencies
npm install

# Install MCP server dependencies
cd mcp-server
npm install

# Build TypeScript
npm run build
```

#### 2. Start MCP Server

```bash
# In mcp-server directory
npm start
```

#### 3. Configure Claude Desktop

Add to Claude Desktop configuration:

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

#### 4. Use with Claude

After configuration, you can directly use in Claude:

```
Please help me login to Douyin
Upload a video to Douyin with title "My New Video" and description "This is a test video"
Check my Douyin login status
```

### 🔧 MCP Tools Reference

| Tool Name | Description | Key Parameters |
|-----------|-------------|----------------|
| `douyin_login` | Login to Douyin and save credentials | `headless`, `timeout` |
| `douyin_check_login` | Check current login status | `headless` |
| `douyin_upload_video` | Upload video to Douyin | `videoPath`, `title`, `description`, `tags`, `autoPublish` |
| `douyin_get_cookies` | Get saved cookie information | None |
| `douyin_clear_cookies` | Clear login data and browser cache | None |

### 📝 Standalone Usage Example

If you want to use the core functionality without MCP:

```javascript
import { DouyinUploader } from './mcp-server/dist/douyin-uploader.js';

const uploader = new DouyinUploader();

// Check login status
const loginCheck = await uploader.checkLogin(true);
if (!loginCheck.isValid) {
  // Need to login
  const loginResult = await uploader.login(false, 180000);
  console.log(`Login successful: ${loginResult.user}`);
}

// Upload video
const uploadResult = await uploader.uploadVideo({
  videoPath: './test-video.mp4',
  title: 'My Video Title',
  description: 'Video description content',
  tags: ['tag1', 'tag2'],
  headless: false,  // Show browser window
  autoPublish: true // Auto publish
});

console.log(`Upload ${uploadResult.success ? 'successful' : 'failed'}`);
```

### 📁 Project Structure

```
douyin-mcp-server/
├── mcp-server/                 # MCP server core code
│   ├── index.ts                # MCP server entry point
│   ├── douyin-uploader.ts      # Douyin automation core logic
│   ├── package.json            # MCP server dependencies
│   ├── tsconfig.json           # TypeScript configuration
│   └── dist/                   # Compiled output directory
├── examples/                   # Usage examples
│   └── simple-upload.js        # Simple upload example
├── .claude/                    # Claude configuration
├── test-video.mp4             # Test video file
├── CLAUDE.md                  # Claude Code development guide
├── package.json               # Root project configuration
├── tsconfig.json              # Root TypeScript configuration
└── README.md                  # Project documentation
```

### 🛠️ Development Guide

#### Development Commands

```bash
# Development mode (auto-reload)
cd mcp-server && npm run dev

# Build TypeScript
cd mcp-server && npm run build

# Run example
node examples/simple-upload.js
```

#### Core Architecture

- **MCP Server** (`mcp-server/index.ts`): Implements standard MCP protocol with tool call handling and parameter validation
- **Douyin Uploader** (`mcp-server/douyin-uploader.ts`): Core automation logic including login, upload, and verification handling
- **Browser Session Management**: Puppeteer-based persistent sessions with cookie saving and permission presets

### ⚠️ Important Notes

1. **Account Security**: 
   - Do not use in public environments or unsecured networks
   - Regularly check and update saved credentials
   - Recommend using test accounts for development

2. **Usage Guidelines**:
   - Avoid frequent publishing, follow Douyin platform rate limits
   - Ensure uploaded content complies with community guidelines
   - Do not use for malicious marketing or spam content

3. **Technical Limitations**:
   - Cookies have limited validity period
   - Requires sufficient system resources for browser automation
   - Network conditions may affect upload success rate

### 🐛 Troubleshooting

#### Q: Browser fails to start?
```bash
# Reinstall Chrome
npx puppeteer browsers install chrome
```

#### Q: Login status expired?
```bash
# Clear saved login data
rm mcp-server/douyin-cookies.json
rm -rf mcp-server/chrome-user-data
```

#### Q: Video upload fails?
- Check video file path and format
- Ensure stable network connection
- Review detailed error messages in terminal
- Try disabling headless mode to see browser page

#### Q: SMS verification handling?
- The program automatically detects and prompts for verification code
- Enter the SMS verification code in terminal as prompted
- If repeatedly fails, manually complete verification and retry

### 🤝 Contributing

We welcome community contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Create a Pull Request

### 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### 🙏 Acknowledgments

- [Model Context Protocol](https://modelcontextprotocol.io/) - AI tool communication protocol standard
- [Puppeteer](https://pptr.dev/) - Chrome browser automation library
- [Douyin Creator Platform](https://creator.douyin.com/) - Video publishing and management platform

### 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/lancelin111/douyin-mcp-server/issues) page
2. Create a new issue with detailed information
3. Join our community discussions

### 🔮 Roadmap

- [ ] Support for batch video uploads
- [ ] Integration with more video platforms
- [ ] Enhanced error recovery mechanisms
- [ ] GUI management interface
- [ ] Docker containerization
- [ ] CI/CD pipeline setup

---

## 免责声明 / Disclaimer

本项目仅供学习和研究使用，请勿用于商业用途或违反抖音平台规则的行为。使用本项目产生的任何后果由使用者自行承担。

This project is for educational and research purposes only. Do not use it for commercial purposes or activities that violate Douyin platform rules. Users are responsible for any consequences arising from the use of this project.
