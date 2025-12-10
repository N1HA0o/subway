# 部署指南 - 阈光之旅

这个项目是纯前端应用，可以部署到多个免费的静态网站托管平台。

## 方法 1: GitHub Pages（推荐）

### 步骤：

1. **在 GitHub 上打开你的仓库**
   - 访问：`https://github.com/N1HA0o/subway`

2. **进入 Settings**
   - 点击仓库顶部的 `Settings` 标签

3. **配置 Pages**
   - 在左侧菜单找到 `Pages`
   - 在 `Source` 下拉菜单中选择：
     - Branch: `claude/subway-gesture-game-01UXHGhBH9feksU9ArBsfSWv`
     - Folder: `/ (root)`
   - 点击 `Save`

4. **等待部署**
   - GitHub 会自动部署（1-2分钟）
   - 部署完成后会显示网址：
     ```
     https://n1ha0o.github.io/subway/
     ```

5. **访问网站**
   - 点击提供的链接即可访问！

---

## 方法 2: Netlify（最简单）

### 通过拖放部署：

1. **访问 Netlify**
   - 打开 [netlify.com](https://www.netlify.com/)
   - 登录或注册（支持 GitHub 登录）

2. **部署**
   - 将整个 `subway` 文件夹拖放到 Netlify Drop 区域
   - 或者通过 GitHub 连接自动部署

3. **获取链接**
   - 部署完成后会获得一个随机链接，如：
     ```
     https://threshold-light-journey.netlify.app/
     ```
   - 可以自定义域名

---

## 方法 3: Vercel

1. **访问 Vercel**
   - 打开 [vercel.com](https://vercel.com/)
   - 使用 GitHub 账号登录

2. **导入项目**
   - 点击 `New Project`
   - 选择你的 GitHub 仓库 `N1HA0o/subway`
   - 选择分支 `claude/subway-gesture-game-01UXHGhBH9feksU9ArBsfSWv`

3. **配置**
   - Framework Preset: `Other`
   - Root Directory: `./`
   - Build Command: 留空
   - Output Directory: 留空

4. **部署**
   - 点击 `Deploy`
   - 获得链接，如：
     ```
     https://subway.vercel.app/
     ```

---

## 方法 4: 本地运行（开发测试）

如果只是想在本地预览：

### 使用 Python:
```bash
cd /home/user/subway
python -m http.server 8000
```

### 使用 Node.js:
```bash
npx http-server -p 8000
```

### 使用 PHP:
```bash
php -S localhost:8000
```

然后访问：`http://localhost:8000`

---

## 重要提醒 ⚠️

### HTTPS 要求
- MediaPipe 手势识别**需要 HTTPS** 才能访问摄像头
- GitHub Pages、Netlify、Vercel **自动提供 HTTPS**
- 本地运行时使用 `localhost` 也可以（浏览器允许）

### 摄像头权限
- 首次访问时浏览器会请求摄像头权限
- 请点击"允许"以启用手势控制

### 浏览器兼容性
- 推荐使用 **Chrome** 或 **Firefox**
- Safari 14+ 也支持
- 移动端浏览器也支持（但手势识别可能不够精确）

---

## 快速部署命令（Netlify CLI）

如果你有 Netlify CLI：

```bash
# 安装 Netlify CLI
npm install -g netlify-cli

# 部署
cd /home/user/subway
netlify deploy --prod
```

---

## 推荐方案对比

| 平台 | 难度 | 速度 | HTTPS | 自定义域名 |
|------|------|------|-------|------------|
| GitHub Pages | ⭐⭐ | 中 | ✅ | ✅ |
| Netlify | ⭐ | 快 | ✅ | ✅ |
| Vercel | ⭐ | 快 | ✅ | ✅ |
| 本地服务器 | ⭐⭐⭐ | 即时 | ⚠️ | ❌ |

**最推荐**: Netlify（最简单）或 GitHub Pages（与代码同步）

---

## 故障排除

### 问题：摄像头无法访问
- **原因**：网站不是 HTTPS
- **解决**：使用上述任一在线部署方案

### 问题：手势识别不工作
- **原因**：光线不足或手势不明显
- **解决**：
  - 确保房间光线充足
  - 手要伸出明显（远离身体）
  - 按 `D` 键查看调试信息

### 问题：游戏卡顿
- **原因**：设备性能不足
- **解决**：
  - 使用桌面浏览器而非移动端
  - 关闭其他标签页
  - 降低浏览器缩放比例

---

## 联系支持

如果遇到问题，请在 GitHub 上提交 Issue：
`https://github.com/N1HA0o/subway/issues`

---

🎮 **享受你的阈光之旅！**
