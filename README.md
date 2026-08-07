<h1 align="center">DeepSeek-Refined</h1>
<p align="center">
  <strong>一个 Tampermonkey 用户脚本，为网页版 DeepSeek注入 Obsidian Border 主题风格的 Markdown 美化样式。通过覆盖 DeepSeek 的 CSS，实现深色/浅色模式的全面配色定制。支持粗体、斜体、行内代码、数学公式的颜色自定义；各级标题左侧添加彩色圆角竖条装饰；引用块使用 Border 标志性的点阵图案背景。同时调整消息宽度为 75% 以获得更好的阅读体验。安装后自动跟随系统深浅色模式切换。</strong>
</p>
<p align="center">
  <img src="https://img.shields.io/github/stars/djh2203/DeepSeek-Refined?style=flat-square&logo=github" alt="stars" />
  <img src="https://img.shields.io/github/license/djh2203/DeepSeek-Refined?style=flat-square" alt="license" />
  <img src="https://img.shields.io/badge/DeepSeek-5786FE?style=flat-square&logo=deepseek&logoColor=white" alt="DeepSeek" />
  <img src="https://img.shields.io/badge/Obsidian-7C3AED?style=flat-square&logo=obsidian&logoColor=white" alt="Obsidian" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/Tampermonkey-0049B0?style=flat-square&logo=tampermonkey&logoColor=white" alt="Tampermonkey" />
</p>
<p align="center">
  <img src="https://i-blog.csdnimg.cn/direct/5848e2ca601447409c7f807768158d99.png" width="860" alt="对比图">
</p>

## 功能特性

### 全局配色

- 深色模式背景: ![#27282e](https://placehold.co/12x12/27282e/27282e.png) `#27282e`
- 浅色模式背景: **柔和渐变背景** - 使用柔和的粉色、紫色渐变
- 文字颜色采用 Border 主题的柔和灰度配色
- 支持深色/浅色模式自动切换

### Markdown 元素美化

| 元素          | 深色模式                                                               | 浅色模式                                                                                   |
| ----------- | ------------------------------------------------------------------ | -------------------------------------------------------------------------------------- |
| 粗体 (bold)   | ![#ff7881](https://placehold.co/12x12/ff7881/ff7881.png) `#ff7881` | ![hsl(350,80%,55%)](https://placehold.co/12x12/e03045/e03045.png) `hsl(350, 80%, 55%)` |
| 斜体 (italic) | ![#fbbb83](https://placehold.co/12x12/fbbb83/fbbb83.png) `#fbbb83` | ![hsl(28,80%,50%)](https://placehold.co/12x12/e67e00/e67e00.png) `hsl(28, 80%, 50%)`   |
| 行内代码        | ![#f2b6de](https://placehold.co/12x12/f2b6de/f2b6de.png) `#f2b6de` | ![#dd1399](https://placehold.co/12x12/dd1399/dd1399.png) `#dd1399`                     |
| 数学公式        | ![#8dd3f6](https://placehold.co/12x12/8dd3f6/8dd3f6.png) `#8dd3f6` |![#1a6fb5](https://placehold.co/12x12/1a6fb5/1a6fb5.png) `#1a6fb5`                     |

### 标题样式

各级标题左侧带有彩色圆角竖条:

| 级别 | 深色模式                                                               | 浅色模式                                                               |
| -- | ------------------------------------------------------------------ | ------------------------------------------------------------------ |
| H1 | ![#d18989](https://placehold.co/12x12/d18989/d18989.png) `#d18989` | ![#bd5151](https://placehold.co/12x12/bd5151/bd5151.png) `#bd5151` |
| H2 | ![#cea38d](https://placehold.co/12x12/cea38d/cea38d.png) `#cea38d` | ![#c77b23](https://placehold.co/12x12/c77b23/c77b23.png) `#c77b23` |
| H3 | ![#93c89c](https://placehold.co/12x12/93c89c/93c89c.png) `#93c89c` | ![#478f14](https://placehold.co/12x12/478f14/478f14.png) `#478f14` |
| H4 | ![#7eb8f1](https://placehold.co/12x12/7eb8f1/7eb8f1.png) `#7eb8f1` | ![#0585a8](https://placehold.co/12x12/0585a8/0585a8.png) `#0585a8` |
| H5 | ![#bab3ef](https://placehold.co/12x12/bab3ef/bab3ef.png) `#bab3ef` | ![#726293](https://placehold.co/12x12/726293/726293.png) `#726293` |
| H6 | ![#7ec8c5](https://placehold.co/12x12/7ec8c5/7ec8c5.png) `#7ec8c5` | ![#127d52](https://placehold.co/12x12/127d52/127d52.png) `#127d52` |

### 引用块样式

- 移除默认左侧边框
- 添加 Border 风格的点阵图案背景
- 使用 `::before` 伪元素实现圆角竖条装饰
- 嵌套引用不重复显示点阵图案

### 布局调整

- 消息最大宽度: `75%`（仅宽屏 ≥768px 生效，手机端保持默认原样）
- 表格最大宽度: `70%`

### 交互功能

- **行内代码点击复制**: 点击任意行内代码（如 `code`）即可自动复制到剪贴板，并显示优雅的 Toast 提示

## 安装方法

### 方式一：Greasy Fork 安装（推荐）

1. 安装 [Tampermonkey](https://www.tampermonkey.net/) 浏览器扩展
2. 进入  [DeepSeek-Refined - Greasy Fork](https://greasyfork.org/zh-CN/scripts/585012-deepseek-refined)   并安装

### 方式二：本地安装

1. 在 GitHub 打开 [main.js](https://github.com/djh2203/DeepSeek-Refined/blob/main/main.js)
2. 点击页面右上角的 **Raw**，复制全部代码
3. 点击浏览器工具栏 Tampermonkey 图标 → **管理面板** → **+ 新建脚本**
4. 删除默认内容，粘贴复制的代码，按 `Ctrl + S`（macOS 为 `Cmd + S`）保存

## 更新与卸载

- **更新**：Tampermonkey 会定期自动检查脚本版本，有新版本时会在管理面板提示，点击即可更新；也可在管理面板手动点击"检查更新"。
- **卸载**：Tampermonkey 管理面板 → 找到 DeepSeek-Refined → 点击删除；想要临时关闭而不卸载，可点击开关暂停脚本。

## 常见问题

- **Q: 某天脚本突然失效，样式突然恢复成原样？**  
  A: 通常是 DeepSeek 前端改版、DOM 或 CSS 类名变动导致的。可先确认 Tampermonkey 已启用且脚本为最新版本；若仍无效，欢迎到 [GitHub Issues](https://github.com/djh2203/DeepSeek-Refined/issues) 反馈。

- **Q: 想恢复官方默认样式？**  
  A: 在 Tampermonkey 管理面板暂停或删除本脚本即可，不会对 DeepSeek 本身产生任何改动。

## 自定义修改

> 所有修改都在 `main.js` 顶部的 `<style>` 标签内进行。改完后保存脚本并刷新 DeepSeek 页面即可生效。

### 修改深色模式背景色

```css
body[data-ds-dark-theme] {
    --dsw-alias-bg-base: #27282e;   /* 改为你的颜色，如 #1e1e2e */
}
```

若侧边栏也需同步，同时修改下方硬编码的背景色：

```css
body[data-ds-dark-theme] ._189b4a0,
body[data-ds-dark-theme] ._6ffc3c9 {
    background-color: #27282e;      /* 与上面保持一致 */
}
```

### 修改浅色模式背景色

浅色背景在 `body` 和 `body::before` 两处定义了同样的 `background-color` 与 `background-image`，**两处都要改**。想换成纯色，把 `background-image` 删掉、只留 `background-color`：

```css
body {
    background-color: #F9F6F4;      /* 改为你的颜色 */
    background-image:
        radial-gradient(ellipse 80% 60% at 20% 40%, rgba(235, 213, 216, 0.5) 0%, transparent 70%),
        radial-gradient(ellipse 70% 80% at 75% 25%, rgba(220, 209, 228, 0.4) 0%, transparent 70%),
        radial-gradient(ellipse 60% 70% at 50% 80%, rgba(211, 224, 223, 0.45) 0%, transparent 70%);
}
```

### 修改 Markdown 元素颜色

| 元素 | 深色模式 | 浅色模式 |
| -- | -- | -- |
| 粗体 | `body[data-ds-dark-theme] .ds-markdown strong` | `body .ds-markdown strong` |
| 斜体 | `body[data-ds-dark-theme] .ds-markdown em` | `body .ds-markdown em` |
| 行内代码 | `.ds-markdown code:not(pre code):not(.md-code-block code)` | 同上，前面加 `body:not([data-ds-dark-theme])` |
| 数学公式 | `body[data-ds-dark-theme] .ds-markdown-math` | `body:not([data-ds-dark-theme]) .ds-markdown-math` |

例如把深色模式粗体改成绿色：

```css
body[data-ds-dark-theme] .ds-markdown strong {
    color: #98c379 !important;
}
```

> 数学公式选择器较长（包含 `.katex` 及其子元素），直接修改对应块的 `color` 值即可。

### 修改标题竖条颜色

```css
/* 深色模式 H1 */
body[data-ds-dark-theme] .ds-markdown h1::before {
    background: #d18989;            /* 改为你的颜色 */
}
```

`h2` ~ `h6` 同理，浅色模式去掉 `[data-ds-dark-theme]` 前缀即可。

### 修改消息宽度

```css
@media (min-width: 768px) {
    :root {
        --message-list-max-width: 75%;  /* 改为 90% 等任意值 */
    }
}
```

手机端（<768px）不设置该变量，保持 DeepSeek 默认的全宽布局；如想调整断点，修改 `768px` 即可。

### 修改表格宽度

```css
.ds-markdown table {
    max-width: 70%;                 /* 改为 100% 等任意值 */
}
```

