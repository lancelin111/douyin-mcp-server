#!/usr/bin/env node

import { DouyinUploader } from '../mcp-server/dist/douyin-uploader.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const uploader = new DouyinUploader();
  
  // 检查登录状态
  console.log('检查登录状态...');
  const loginCheck = await uploader.checkLogin(true);
  
  if (!loginCheck.isValid) {
    console.log('需要登录，请在浏览器中完成登录');
    const loginResult = await uploader.login(false, 180000);
    if (!loginResult.success) {
      console.log('登录失败');
      return;
    }
    console.log(`登录成功: ${loginResult.user}`);
  } else {
    console.log(`已登录: ${loginCheck.user}`);
  }
  
  // 上传视频
  const uploadResult = await uploader.uploadVideo({
    videoPath: path.join(__dirname, '../test-video.mp4'),
    title: `测试视频 ${Date.now()}`,
    description: '这是一个测试视频',
    tags: ['测试'],
    headless: false,
    autoPublish: true
  });
  
  if (uploadResult.success) {
    console.log('上传成功！');
    console.log(`状态: ${uploadResult.status}`);
  } else {
    console.log('上传失败:', uploadResult.error);
  }
}

main().catch(console.error);