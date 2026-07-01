// ==UserScript==
// @name         DeepSeek-Refined
// @namespace    https://github.com/djh2203/DeepSeek-Refined
// @version      1.0
// @description  一个 Tampermonkey 用户脚本，为网页版 DeepSeek Chat (chat.deepseek.com) 注入 Obsidian Border 主题风格的 Markdown 美化样式。通过覆盖 DeepSeek 的 CSS 变量系统，实现深色/浅色模式的全面配色定制。支持粗体、斜体、行内代码、数学公式的颜色自定义；各级标题左侧添加彩色圆角竖条装饰；引用块使用 Border 标志性的点阵图案背景。同时调整消息宽度为 75% 以获得更好的阅读体验。安装后自动跟随系统深浅色模式切换，无需手动配置。配色灵感来源于 Obsidian Border 主题。
// @author       djh2203
// @match        https://chat.deepseek.com/*
// @icon         https://www.deepseek.com/favicon.ico
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
        :root {
            --message-list-max-width: 75%;
        }
        .ds-markdown table {
            width: max-content;
            max-width: 70%;
        }

        /* ========== 浅色模式 - Border 主题配色 ========== */
        body {
            --dsw-alias-bg-base: #ffffff;
            --dsw-alias-bg-layer-1: #ffffff;
            --dsw-alias-bg-layer-2: #fafafa;
            --dsw-alias-bg-layer-3: #f7f7f7;

            --dsw-alias-label-primary: hsl(232, 6%, 12%);
            --dsw-alias-label-secondary: hsl(232, 9%, 36%);
            --dsw-alias-label-tertiary: hsl(232, 12%, 64%);
            --dsw-alias-label-caption: hsl(232, 12%, 64%);

            --dsw-alias-brand-primary: hsl(232, 70%, 55%);
            --dsw-alias-brand-text: hsl(232, 70%, 45%);

            --dsw-alias-border-l1: rgba(0, 0, 0, 0.04);
            --dsw-alias-border-l2: rgba(0, 0, 0, 0.08);
            --dsw-alias-border-l3: rgba(0, 0, 0, 0.12);

            --dsw-alias-markdown-inline-code: #f0f0f0;
            --dsw-alias-markdown-code-block: #fafafa;
            --dsw-alias-markdown-code-block-banner: #f7f7f7;
        }

        /* ========== 深色模式 - Border 主题配色 ========== */
        body[data-ds-dark-theme] {
            --dsw-alias-bg-base: #27282e;
            --dsw-alias-bg-layer-1: #27282e;
            --dsw-alias-bg-layer-2: #2d2e34;
            --dsw-alias-bg-layer-3: #32333a;

            --dsw-alias-label-primary: hsl(232, 6%, 88%);
            --dsw-alias-label-secondary: hsl(232, 9%, 64%);
            --dsw-alias-label-tertiary: hsl(232, 12%, 48%);
            --dsw-alias-label-caption: hsl(232, 9%, 56%);

            --dsw-alias-brand-primary: hsl(232, 70%, 65%);
            --dsw-alias-brand-text: hsl(232, 70%, 70%);
        }

        /* 侧边栏背景同步 */
        body[data-ds-dark-theme] ._189b4a0,
        body[data-ds-dark-theme] ._6ffc3c9 {
            background-color: #27282e;
        }

        /* 深色模式下强调文字颜色 */
        body[data-ds-dark-theme] .ds-markdown strong {
            color: #ff7881 !important;
        }
        body[data-ds-dark-theme] .ds-markdown em {
            color: #fbbb83 !important;
        }

        /* 浅色模式下强调文字颜色 */
        body .ds-markdown strong {
            color: hsl(350, 80%, 55%) !important;
        }
        body .ds-markdown em {
            color: hsl(28, 80%, 50%) !important;
        }

        /* 数学公式颜色 */
        body[data-ds-dark-theme] .ds-markdown-math,
        body[data-ds-dark-theme] .ds-markdown-math.katex-display,
        body[data-ds-dark-theme] .ds-markdown-math-display,
        body[data-ds-dark-theme] .ds-markdown-math-svg,
        body[data-ds-dark-theme] .katex,
        body[data-ds-dark-theme] .katex * {
            color: #8dd3f6ff !important;
        }

        /* 行内代码颜色 */
        .ds-markdown code:not(pre code):not(.md-code-block code) {
            color: #f2b6de !important;
        }
        body:not([data-ds-dark-theme]) .ds-markdown code:not(pre code):not(.md-code-block code) {
            color: #dd1399 !important;
        }

        /* 标题左侧竖条 */
        .ds-markdown h1, .ds-markdown h2, .ds-markdown h3,
        .ds-markdown h4, .ds-markdown h5, .ds-markdown h6 {
            border-left: none !important;
            padding-left: 16px !important;
            position: relative;
        }
        .ds-markdown h1::before, .ds-markdown h2::before, .ds-markdown h3::before,
        .ds-markdown h4::before, .ds-markdown h5::before, .ds-markdown h6::before {
            content: "";
            position: absolute;
            left: 0;
            top: 4px;
            bottom: 4px;
            width: 4px;
            border-radius: 4px;
        }

        /* 深色模式标题竖条颜色 */
        body[data-ds-dark-theme] .ds-markdown h1::before { background: #d18989; }
        body[data-ds-dark-theme] .ds-markdown h2::before { background: #cea38d; }
        body[data-ds-dark-theme] .ds-markdown h3::before { background: #93c89c; }
        body[data-ds-dark-theme] .ds-markdown h4::before { background: #7eb8f1; }
        body[data-ds-dark-theme] .ds-markdown h5::before { background: #bab3ef; }
        body[data-ds-dark-theme] .ds-markdown h6::before { background: #7ec8c5; }

        /* 浅色模式标题竖条颜色 */
        body .ds-markdown h1::before { background: #bd5151; }
        body .ds-markdown h2::before { background: #c77b23; }
        body .ds-markdown h3::before { background: #478f14; }
        body .ds-markdown h4::before { background: #0585a8; }
        body .ds-markdown h5::before { background: #726293; }
        body .ds-markdown h6::before { background: #127d52; }

        /* 引用块样式 - Border 风格 */
        .ds-markdown blockquote {
            border-left: none !important;
            border-radius: 6px;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%23000000' fill-opacity='0.12' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E");
            position: relative;
        }
        body[data-ds-dark-theme] .ds-markdown blockquote {
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%23ffffff' fill-opacity='0.12' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E");
        }
        .ds-markdown blockquote blockquote {
            background-image: none !important;
        }
        .ds-markdown blockquote::before {
            content: "";
            position: absolute;
            left: 0;
            top: 8px;
            bottom: 8px;
            width: 4px;
            border-radius: 4px;
            background: var(--dsw-alias-brand-primary);
        }
    `;
    document.head.appendChild(style);
})();
