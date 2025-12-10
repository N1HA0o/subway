# 阈光之旅 (Threshold Light Journey)

一个使用手势控制的交互式2D横版探索游戏，灵感来源于《地狱边境》(LIMBO) 和《INSIDE》。

![Project Banner](https://img.shields.io/badge/Status-Beta-yellow)
![License](https://img.shields.io/badge/License-MIT-blue)

## 🌐 在线演示

### 部署选项：

1. **GitHub Pages**（推荐）
   - 需要在 GitHub 仓库设置中启用 Pages
   - 预期链接：`https://n1ha0o.github.io/subway/`

2. **快速部署到 Netlify**
   - [![部署到 Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/N1HA0o/subway)
   - 一键部署，自动获得 HTTPS 链接

3. **本地运行**
   - 参考下方的"快速开始"章节

📖 **详细部署指南**: 请查看 [DEPLOYMENT.md](DEPLOYMENT.md)

## 🎮 核心特性

- **手势控制**: 使用摄像头捕捉手部动作，通过 MediaPipe Hands 实现手势识别
- **动态光照**: 周期性的地铁经过事件，带来逼真的光影变化
- **剪影风格**: 高对比度的黑白视觉风格，灵感来自 LIMBO
- **细腻光影**: 参考 INSIDE 的灰度层次和光照质感
- **沉浸式音效**: 环境音和地铁声音营造孤独、静谧的氛围

## 🎨 艺术风格

### 视觉参考
- **LIMBO**: 黑白剪影、强烈明暗对比
- **INSIDE**: 丰富的灰度层次、动态光源

### 核心体验
主角从昏睡中醒来，身处一个幽闭、抽象的地铁站环境。玩家通过手势控制角色探索，感受光影交替带来的视觉冲击。

## 🕹️ 操控方式

| 手势 | 动作 |
|------|------|
| 🤚 伸出右手 | 向右移动 |
| 🤚 伸出左手 | 向左移动 |

## 🔧 技术栈

- **渲染引擎**: PixiJS v7 - 强大的 2D WebGL 渲染
- **手势识别**: MediaPipe Hands - Google 的实时手部追踪
- **音频**: Web Audio API - 动态环境音效
- **语言**: Vanilla JavaScript (ES6+)

## 📦 项目结构

```
subway/
├── index.html              # 主页面
├── styles.css              # 样式表
├── js/
│   ├── config.js          # 配置参数
│   ├── gestureDetector.js # 手势识别系统
│   ├── character.js       # 角色控制与动画
│   ├── lighting.js        # 地铁灯光系统
│   ├── scene.js           # 场景渲染
│   ├── particles.js       # 粒子效果（灰尘）
│   ├── audio.js           # 音频系统
│   ├── game.js            # 游戏主循环
│   └── main.js            # 应用入口
└── README.md
```

## 🚀 快速开始

### 前置要求
- 现代浏览器（Chrome、Firefox、Safari、Edge）
- 摄像头权限
- 本地服务器（推荐使用 Python 或 Node.js）

### 运行方式

#### 方法 1: Python 服务器
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

#### 方法 2: Node.js 服务器
```bash
# 安装 http-server（如果没有）
npm install -g http-server

# 运行
http-server -p 8000
```

#### 方法 3: VS Code Live Server
1. 安装 "Live Server" 扩展
2. 右键点击 `index.html`
3. 选择 "Open with Live Server"

然后在浏览器中访问 `http://localhost:8000`

## ⚙️ 配置参数

在 `js/config.js` 中可以调整：

- **地铁间隔**: 14-20 秒随机
- **光照持续时间**: 5 秒
- **角色移动速度**: 可调节
- **手势识别阈值**: 灵敏度调整
- **DEBUG 模式**: 显示 FPS 和手势状态

## 🎯 核心系统说明

### 1. 手势识别系统
使用 MediaPipe Hands 进行实时手部关键点检测：
- 检测手指伸展状态
- 判断手的位置（左/右）
- 防抖处理避免误触
- 最小持续时间验证（100ms）

### 2. 地铁灯光系统
周期性事件系统：
- 随机间隔（14-20秒）
- 三阶段光照：接近 → 峰值 → 消退
- 动态光照强度（缓动函数）
- 实时照亮角色和环境

### 3. 角色系统
- 物理模拟（加速度、减速）
- 动画状态机（idle、walk_left、walk_right）
- 光照反馈（灰度而非纯白）
- 动态阴影

### 4. 粒子系统
- 50 个灰尘粒子
- 仅在光束中可见
- 漂浮动画（正弦波模拟）
- 淡入淡出效果

## 🐛 调试功能

按 `D` 键切换调试界面，显示：
- 实时 FPS
- 当前手势状态

在 `config.js` 中设置 `DEBUG: true` 启用控制台日志。

## 📱 浏览器兼容性

| 浏览器 | 版本 | 支持 |
|--------|------|------|
| Chrome | 90+ | ✅ |
| Firefox | 88+ | ✅ |
| Safari | 14+ | ✅ |
| Edge | 90+ | ✅ |

## 🔒 隐私说明

- 摄像头数据仅用于本地手势识别
- 不上传任何视频或图像数据
- 完全在浏览器端运行
- 无需服务器处理

## 🎓 学习资源

- [PixiJS 文档](https://pixijs.download/release/docs/index.html)
- [MediaPipe Hands](https://google.github.io/mediapipe/solutions/hands.html)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)

## 📝 许可证

MIT License

## 👥 贡献

欢迎提交 Issue 和 Pull Request！

## 🙏 致谢

- **Playdead** - LIMBO 和 INSIDE 的艺术风格启发
- **Google MediaPipe** - 手势识别技术
- **PixiJS 团队** - 优秀的 2D 渲染引擎

---

**享受你的阈光之旅！** ✨
