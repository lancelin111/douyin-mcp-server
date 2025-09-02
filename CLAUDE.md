# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Douyin MCP Server that provides automated video uploading capabilities to Douyin (TikTok China) through the Model Context Protocol. The project consists of two main components:

1. **MCP Server** (`mcp-server/`): The core MCP implementation that exposes tools for Douyin automation
2. **Douyin Uploader** (`mcp-server/douyin-uploader.ts`): The browser automation engine using Puppeteer

## Commands

### Development Commands

```bash
# Build the MCP server
cd mcp-server && npm run build

# Run MCP server in development mode
cd mcp-server && npm run dev

# Start the MCP server
cd mcp-server && npm start

# Run the example upload script
node examples/simple-upload.js
```

### Project Setup

```bash
# Install dependencies
npm install
cd mcp-server && npm install

# Build TypeScript (required before running)
cd mcp-server && npm run build
```

## Architecture

### Core Components

- **MCP Server** (`mcp-server/index.ts`): Implements the Model Context Protocol server with 5 main tools:
  - `douyin_login`: Opens browser for manual login and saves cookies
  - `douyin_check_login`: Validates saved cookies
  - `douyin_upload_video`: Uploads video with metadata
  - `douyin_get_cookies`: Shows cookie information
  - `douyin_clear_cookies`: Clears saved login data

- **Douyin Uploader** (`mcp-server/douyin-uploader.ts`): Browser automation class with core methods:
  - `login()`: Handles login flow with timeout
  - `checkLogin()`: Validates existing cookies
  - `uploadVideo()`: Complete upload workflow including SMS verification
  - Cookie persistence and browser session management

### Key Features

- **Cookie Persistence**: Login sessions saved to `douyin-cookies.json`
- **Browser Automation**: Puppeteer-based with permission handling
- **SMS Verification**: Interactive terminal-based verification code input
- **Error Recovery**: Robust error handling and retry mechanisms

### Data Flow

1. User calls MCP tools through Claude or other MCP clients
2. MCP server validates parameters using Zod schemas
3. DouyinUploader class handles browser automation
4. Results returned through MCP protocol with structured responses

## File Structure

```
├── mcp-server/                    # MCP server implementation
│   ├── index.ts                   # MCP server entry point
│   ├── douyin-uploader.ts         # Core automation logic
│   ├── package.json               # MCP server dependencies
│   └── tsconfig.json              # TypeScript config for MCP server
├── examples/
│   └── simple-upload.js           # Usage example
├── package.json                   # Root project config
└── tsconfig.json                  # Root TypeScript config
```

## Important Technical Details

- Uses ES modules (`"type": "module"`) throughout
- TypeScript compiled to `dist/` directory
- Puppeteer with persistent user data directory
- Zod for runtime parameter validation
- Supports both headless and headed browser modes
- Cookie-based session persistence across runs

## Development Notes

- The MCP server runs as a stdio transport server
- Browser automation requires Chrome/Chromium (auto-installed by Puppeteer)  
- Login flow requires manual intervention in browser window
- Video uploads support automatic publishing or draft saving
- SMS verification is handled through terminal input prompts