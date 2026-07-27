// ==UserScript==
// @name         DeepSeek-Refined
// @namespace    https://github.com/djh2203/DeepSeek-Refined
// @version      1.3
// @description  一个 Tampermonkey 用户脚本，为网页版 DeepSeek Chat (chat.deepseek.com) 注入 Obsidian Border 主题风格的 Markdown 美化样式。通过覆盖 DeepSeek 的 CSS 变量系统，实现深色/浅色模式的全面配色定制。支持粗体、斜体、行内代码、数学公式的颜色自定义；各级标题左侧添加彩色圆角竖条装饰；引用块使用 Border 标志性的点阵图案背景。同时调整消息宽度为 75% 以获得更好的阅读体验。安装后自动跟随系统深浅色模式切换，无需手动配置。配色灵感来源于 Obsidian Border 主题。
// @author       djh2203
// @match        https://chat.deepseek.com/*
// @icon         https://www.deepseek.com/favicon.ico
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    if (window.__deepseek_refined_initialized) return;
    window.__deepseek_refined_initialized = true;

    const style = document.createElement('style');
    style.textContent = `
            :root {
                --message-list-max-width: 75%;
            }
            .ds-markdown table {
                width: max-content;
                max-width: 70%;
            }

            /* ========== 浅色模式 - 晨光花园 ========== */
            body {
                --dsw-alias-bg-base: #F9F6F400;
                --dsw-alias-bg-layer-1: #F9F6F400;
                --dsw-alias-bg-layer-2: #F2E0E4;
                --dsw-alias-bg-layer-3: #EBE4F0;

                --dsw-alias-label-primary: #4A4348;
                --dsw-alias-label-secondary: #8B7F88;
                --dsw-alias-label-tertiary: #A9A0A6;
                --dsw-alias-label-caption: #8B7F88;

                --dsw-alias-brand-primary: #793f82ff;
                --dsw-alias-brand-text: #9B7AA0;

                --dsw-alias-border-l1: rgba(74, 67, 72, 0.06);
                --dsw-alias-border-l2: rgba(74, 67, 72, 0.10);
                --dsw-alias-border-l3: rgba(74, 67, 72, 0.14);

                --dsw-alias-markdown-inline-code: #F2E0E4;
                --dsw-alias-markdown-code-block: #FEFBF5;
                --dsw-alias-markdown-code-block-banner: #F7F0E3;

                /* 动态渐变背景 */
                background-color: #F9F6F4;
                background-image:
                    radial-gradient(ellipse 80% 60% at 20% 40%, rgba(235, 213, 216, 0.5) 0%, transparent 70%),
                    radial-gradient(ellipse 70% 80% at 75% 25%, rgba(220, 209, 228, 0.4) 0%, transparent 70%),
                    radial-gradient(ellipse 60% 70% at 50% 80%, rgba(211, 224, 223, 0.45) 0%, transparent 70%);
                background-size: 120% 120%;
                animation: morningGardenShift 3s ease-in-out infinite alternate;
            }

            @keyframes morningGardenShift {
                0% {
                    background-position: 0% 0%, 100% 0%, 50% 100%;
                }
                50% {
                    background-position: 80% 60%, 10% 80%, 90% 20%;
                }
                100% {
                    background-position: 30% 90%, 70% 30%, 10% 60%;
                }
            }

            /* 确保渐变背景生效 */
            html,
            #root,
            #root > div {
                background: inherit !important;
            }

            /* 额外的背景容器覆盖 */
            body::before {
                content: "";
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: -999;
                background-color: #F9F6F4;
                background-image:
                    radial-gradient(ellipse 80% 60% at 20% 40%, rgba(235, 213, 216, 0.5) 0%, transparent 70%),
                    radial-gradient(ellipse 70% 80% at 75% 25%, rgba(220, 209, 228, 0.4) 0%, transparent 70%),
                    radial-gradient(ellipse 60% 70% at 50% 80%, rgba(211, 224, 223, 0.45) 0%, transparent 70%);
                background-size: 120% 120%;
                animation: morningGardenShift 3s ease-in-out infinite alternate;
                pointer-events: none;
            }
            /* ========== 深色模式 - Border 风格 ========== */
            body[data-ds-dark-theme] {

                /* === 新增：重置 body 背景 === */
                background-image: none !important;
                background-size: auto !important;
                animation: none !important;
                background-color: #27282e !important; /* 确保纯色背景 */

                /* 同时清除所有继承的渐变（如 html、#root 等） */
            }
            /* 侧边栏和输入区域透明化 */
            .b8812f16,
            ._519be07,
            ._233f913 {
                background-color: transparent !important;
                background: transparent !important;
            }

        /* 侧边栏底部渐变移除 */
        ._1d72f01 {
            background: transparent !important;
        }

        /* 对话头部和日期标签透明化 */
        .f8d1e4c0,
        .the-header,
        .f3d18f6a,
        ._5ab5d64,
        ._74c0879,
        ._245c867 {
            background-color: transparent !important;
            background: transparent !important;
        }

        /* 深色模式下隐藏渐变背景 */
        body[data-ds-dark-theme]::before {
            display: none !important;
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

            /* 数学公式颜色 - 深色模式 */
            body[data-ds-dark-theme] .ds-markdown-math,
            body[data-ds-dark-theme] .ds-markdown-math.katex-display,
            body[data-ds-dark-theme] .ds-markdown-math-display,
            body[data-ds-dark-theme] .ds-markdown-math-svg,
            body[data-ds-dark-theme] .katex,
            body[data-ds-dark-theme] .katex *,
            body[data-ds-dark-theme] .katex .base,
            body[data-ds-dark-theme] .katex .mord,
            body[data-ds-dark-theme] .katex .mbin,
            body[data-ds-dark-theme] .katex .mrel,
            body[data-ds-dark-theme] .katex .mopen,
            body[data-ds-dark-theme] .katex .mclose,
            body[data-ds-dark-theme] .katex .mpunct,
            body[data-ds-dark-theme] .katex .mop,
            body[data-ds-dark-theme] .katex .minner,
            body[data-ds-dark-theme] .math-inline,
            body[data-ds-dark-theme] .math-block {
                color: #8dd3f6 !important;
            }

            /* 数学公式颜色 - 浅色模式 */
            body:not([data-ds-dark-theme]) .ds-markdown-math,
            body:not([data-ds-dark-theme]) .katex,
            body:not([data-ds-dark-theme]) .katex *,
            body:not([data-ds-dark-theme]) .math-inline,
            body:not([data-ds-dark-theme]) .math-block {
                color: #1a6fb5 !important;
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

            /* ========== 行内代码点击复制样式 ========== */
            .ds-markdown code:not(pre code):not(.md-code-block code) {
                cursor: pointer;
            }

            /* Toast 弹窗样式 */
            .ds-copy-toast {
                position: fixed;
                top: 16px;
                left: 50%;
                transform: translateX(-50%) translateY(-20px);
                background: #fff;
                border-radius: 8px;
                padding: 12px 20px;
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
                display: flex;
                align-items: center;
                gap: 8px;
                z-index: 99999;
                opacity: 0;
                transition: all 0.3s ease;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                font-size: 14px;
                color: #333;
            }
            .ds-copy-toast.show {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
            .ds-copy-toast-icon {
                width: 20px;
                height: 20px;
                background: #52c41a;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
            }
            .ds-copy-toast-icon svg {
                width: 12px;
                height: 12px;
                fill: none;
                stroke: #fff;
                stroke-width: 2.5;
                stroke-linecap: round;
                stroke-linejoin: round;
            }

            /* 深色模式 Toast */
            body[data-ds-dark-theme] .ds-copy-toast {
                background: #2d2e34;
                color: #e0e0e0;
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
            }
        `;
    document.head.appendChild(style);

    // ========== 行内代码点击复制功能 ==========
    function showToast(message) {
        const existing = document.querySelector('.ds-copy-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = 'ds-copy-toast';
        toast.innerHTML = `
            <div class="ds-copy-toast-icon">
                <svg viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            </div>
            <span>${message}</span>
        `;
        document.body.appendChild(toast);

        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }

    function isInlineCode(el) {
        if (el.tagName !== 'CODE') return false;
        if (el.closest('pre')) return false;
        if (el.closest('.md-code-block')) return false;
        if (el.closest('.md-code-block-banner-wrap')) return false;
        return true;
    }

    document.addEventListener('click', function(e) {
        const code = e.target.closest('code');
        if (code && isInlineCode(code)) {
            e.preventDefault();
            e.stopPropagation();
            navigator.clipboard.writeText(code.textContent).then(() => {
                showToast('成功复制到剪贴板！');
            }).catch(() => {
                const textArea = document.createElement('textarea');
                textArea.value = code.textContent;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                showToast('成功复制到剪贴板！');
            });
        }
    }, true);
})();
