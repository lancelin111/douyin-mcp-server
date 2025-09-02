#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { DouyinUploader } from './douyin-uploader.js';
import { z } from 'zod';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 参数验证模式
const LoginArgsSchema = z.object({
  headless: z.boolean().optional().default(false).describe('Run browser in headless mode'),
  timeout: z.number().optional().default(180000).describe('Login timeout in milliseconds')
});

const UploadVideoArgsSchema = z.object({
  videoPath: z.string().describe('Path to the video file to upload'),
  title: z.string().describe('Title of the video'),
  description: z.string().optional().describe('Description of the video'),
  tags: z.array(z.string()).optional().describe('Tags for the video'),
  headless: z.boolean().optional().default(false).describe('Run browser in headless mode'),
  autoPublish: z.boolean().optional().default(true).describe('Automatically click publish button')
});

const CheckLoginArgsSchema = z.object({
  headless: z.boolean().optional().default(true).describe('Run browser in headless mode')
});

class DouyinMCPServer {
  private server: Server;
  private uploader: DouyinUploader;

  constructor() {
    this.server = new Server(
      {
        name: 'douyin-mcp-server',
        version: '2.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.uploader = new DouyinUploader();
    this.setupHandlers();
  }

  private setupHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'douyin_login',
            description: 'Login to Douyin Creator Platform and save cookies. Opens browser for manual login.',
            inputSchema: {
              type: 'object',
              properties: {
                headless: {
                  type: 'boolean',
                  description: 'Run browser in headless mode (default: false)'
                },
                timeout: {
                  type: 'number',
                  description: 'Login timeout in milliseconds (default: 180000)'
                }
              }
            }
          },
          {
            name: 'douyin_check_login',
            description: 'Check if saved cookies are valid and can auto-login',
            inputSchema: {
              type: 'object',
              properties: {
                headless: {
                  type: 'boolean',
                  description: 'Run browser in headless mode (default: true)'
                }
              }
            }
          },
          {
            name: 'douyin_upload_video',
            description: 'Upload a video to Douyin with specified title and description',
            inputSchema: {
              type: 'object',
              properties: {
                videoPath: {
                  type: 'string',
                  description: 'Path to the video file'
                },
                title: {
                  type: 'string',
                  description: 'Video title'
                },
                description: {
                  type: 'string',
                  description: 'Video description'
                },
                tags: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Video tags/hashtags'
                },
                headless: {
                  type: 'boolean',
                  description: 'Run browser in headless mode (default: false)'
                },
                autoPublish: {
                  type: 'boolean',
                  description: 'Automatically click publish button (default: true)'
                }
              },
              required: ['videoPath', 'title']
            }
          },
          {
            name: 'douyin_get_cookies',
            description: 'Get saved cookies information',
            inputSchema: {
              type: 'object',
              properties: {}
            }
          },
          {
            name: 'douyin_clear_cookies',
            description: 'Clear saved cookies and browser data',
            inputSchema: {
              type: 'object',
              properties: {}
            }
          }
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'douyin_login': {
            const { headless, timeout } = LoginArgsSchema.parse(args);
            const result = await this.uploader.login(headless, timeout);
            return {
              content: [
                {
                  type: 'text',
                  text: result.success 
                    ? `✅ Login successful!\nUser: ${result.user}\nCookies saved: ${result.cookieCount}`
                    : `❌ Login failed: ${result.error}`
                }
              ]
            };
          }

          case 'douyin_check_login': {
            const { headless } = CheckLoginArgsSchema.parse(args);
            const result = await this.uploader.checkLogin(headless);
            return {
              content: [
                {
                  type: 'text',
                  text: result.isValid
                    ? `✅ Cookies are valid. Can auto-login as: ${result.user}`
                    : '❌ Cookies are invalid or expired. Please login again.'
                }
              ]
            };
          }

          case 'douyin_upload_video': {
            const params = UploadVideoArgsSchema.parse(args);
            const result = await this.uploader.uploadVideo(params);
            return {
              content: [
                {
                  type: 'text',
                  text: result.success
                    ? `✅ Video upload ${result.published ? 'and publish' : ''} successful!\nTitle: ${result.title}\nStatus: ${result.status}`
                    : `❌ Upload failed: ${result.error}`
                }
              ]
            };
          }

          case 'douyin_get_cookies': {
            const info = await this.uploader.getCookiesInfo();
            return {
              content: [
                {
                  type: 'text',
                  text: info.exists
                    ? `Cookies found:\n- Count: ${info.count}\n- User: ${info.user || 'Unknown'}\n- Created: ${info.created}`
                    : 'No saved cookies found.'
                }
              ]
            };
          }

          case 'douyin_clear_cookies': {
            await this.uploader.clearData();
            return {
              content: [
                {
                  type: 'text',
                  text: '✅ Cookies and browser data cleared successfully.'
                }
              ]
            };
          }

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `❌ Error: ${error instanceof Error ? error.message : String(error)}`
            }
          ]
        };
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Douyin MCP Server v2.0 running');
  }
}

const server = new DouyinMCPServer();
server.run().catch(console.error);