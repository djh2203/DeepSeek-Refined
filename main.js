// ==UserScript==
// @name         DeepSeek-Refined
// @namespace    https://github.com/djh2203/DeepSeek-Refined
// @version      1.5
// @description  一个 Tampermonkey 用户脚本，为网页版 DeepSeek Chat (chat.deepseek.com) 注入 Obsidian Border 主题风格的 Markdown 美化样式。通过覆盖 DeepSeek 的 CSS 变量系统，实现深色/浅色模式的全面配色定制。支持粗体、斜体、行内代码、数学公式的颜色自定义；各级标题左侧添加彩色圆角竖条装饰；引用块使用 Border 标志性的点阵图案背景。同时调整消息宽度为 75% 以获得更好的阅读体验。安装后自动跟随系统深浅色模式切换，无需手动配置。配色灵感来源于 Obsidian Border 主题。
// @author       djh2203
// @match        https://chat.deepseek.com/*
// @icon         https://www.deepseek.com/favicon.ico
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    if (window.__deepseek_refined_initialized) return;
    window.__deepseek_refined_initialized = true;

    // ========== 主题调色板 ==========
    const THEMES = {
        'Border': {
            light: {
                bg: '#F9F6F4',
                bgBase: '#F9F6F400',
                bgLayer2: '#F2E0E4',
                bgLayer3: '#EBE4F0',
                labelPrimary: '#4A4348',
                labelSecondary: '#8B7F88',
                labelTertiary: '#A9A0A6',
                labelCaption: '#8B7F88',
                brandPrimary: '#793f82',
                brandText: '#9B7AA0',
                borderL1: 'rgba(74, 67, 72, 0.06)',
                borderL2: 'rgba(74, 67, 72, 0.10)',
                borderL3: 'rgba(74, 67, 72, 0.14)',
                inlineCodeBg: '#F2E0E4',
                codeBlockBg: '#FEFBF5',
                codeBannerBg: '#F7F0E3',
                strong: 'hsl(350, 80%, 55%)',
                em: 'hsl(28, 80%, 50%)',
                math: '#1a6fb5',
                inlineCodeText: '#dd1399',
                heading: ['#bd5151', '#c77b23', '#478f14', '#0585a8', '#726293', '#127d52'],
                blockquoteDot: '000000',
                toastBg: '#fff',
                toastText: '#333',
            },
            dark: {
                bg: '#27282e',
                bgBase: '#27282e',
                bgLayer1: '#27282e',
                bgLayer2: '#2d2e34',
                bgLayer3: '#32333a',
                labelPrimary: 'hsl(232, 6%, 88%)',
                labelSecondary: 'hsl(232, 9%, 64%)',
                labelTertiary: 'hsl(232, 12%, 48%)',
                labelCaption: 'hsl(232, 9%, 56%)',
                brandPrimary: 'hsl(232, 70%, 65%)',
                brandText: 'hsl(232, 70%, 70%)',
                strong: '#ff7881',
                em: '#fbbb83',
                math: '#8dd3f6',
                inlineCodeText: '#f2b6de',
                heading: ['#d18989', '#cea38d', '#93c89c', '#7eb8f1', '#bab3ef', '#7ec8c5'],
                blockquoteDot: 'ffffff',
                toastBg: '#2d2e34',
                toastText: '#e0e0e0',
            },
        },
    };

    // ========== 由调色板生成 CSS ==========
    function buildCSS(theme) {
        const L = theme.light;
        const D = theme.dark;
        return `
            /* 仅在宽屏下收窄消息宽度，手机端保持原样 */
            @media (min-width: 768px) {
                :root {
                    --message-list-max-width: 75%;
                }
            }
            .ds-markdown table {
                width: max-content;
                max-width: 70%;
            }

            /* ========== 浅色模式 - Border 配色 ========== */
            body {
                --dsw-alias-bg-base: ${L.bgBase};
                --dsw-alias-bg-layer-1: ${L.bgBase};
                --dsw-alias-bg-layer-2: ${L.bgLayer2};
                --dsw-alias-bg-layer-3: ${L.bgLayer3};

                --dsw-alias-label-primary: ${L.labelPrimary};
                --dsw-alias-label-secondary: ${L.labelSecondary};
                --dsw-alias-label-tertiary: ${L.labelTertiary};
                --dsw-alias-label-caption: ${L.labelCaption};

                --dsw-alias-brand-primary: ${L.brandPrimary};
                --dsw-alias-brand-text: ${L.brandText};

                --dsw-alias-border-l1: ${L.borderL1};
                --dsw-alias-border-l2: ${L.borderL2};
                --dsw-alias-border-l3: ${L.borderL3};

                --dsw-alias-markdown-inline-code: ${L.inlineCodeBg};
                --dsw-alias-markdown-code-block: ${L.codeBlockBg};
                --dsw-alias-markdown-code-block-banner: ${L.codeBannerBg};

                /* 浅色模式纯色背景 */
                background-color: ${L.bg};
            }

            /* 确保纯色背景覆盖根容器 */
            html,
            #root,
            #root > div {
                background: inherit !important;
            }

            /* ========== 深色模式 - Border 主题配色 ========== */
            body[data-ds-dark-theme] {
                /* === 重置 body 背景为深色纯色 === */
                background-image: none !important;
                background-size: auto !important;
                animation: none !important;
                background-color: ${D.bg} !important;

                --dsw-alias-bg-base: ${D.bgBase};
                --dsw-alias-bg-layer-1: ${D.bgLayer1};
                --dsw-alias-bg-layer-2: ${D.bgLayer2};
                --dsw-alias-bg-layer-3: ${D.bgLayer3};

                --dsw-alias-label-primary: ${D.labelPrimary};
                --dsw-alias-label-secondary: ${D.labelSecondary};
                --dsw-alias-label-tertiary: ${D.labelTertiary};
                --dsw-alias-label-caption: ${D.labelCaption};

                --dsw-alias-brand-primary: ${D.brandPrimary};
                --dsw-alias-brand-text: ${D.brandText};
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

            /* 侧边栏背景同步 */
            body[data-ds-dark-theme] ._189b4a0,
            body[data-ds-dark-theme] ._6ffc3c9 {
                background-color: ${D.bg};
            }

        /* 深色模式下强调文字颜色 */
            body[data-ds-dark-theme] .ds-markdown strong {
                color: ${D.strong} !important;
            }
            body[data-ds-dark-theme] .ds-markdown em {
                color: ${D.em} !important;
            }

        /* 浅色模式下强调文字颜色 */
            body .ds-markdown strong {
            color: ${L.strong} !important;
            }
            body .ds-markdown em {
            color: ${L.em} !important;
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
                color: ${D.math} !important;
            }

            /* 数学公式颜色 - 浅色模式 */
            body:not([data-ds-dark-theme]) .ds-markdown-math,
            body:not([data-ds-dark-theme]) .katex,
            body:not([data-ds-dark-theme]) .katex *,
            body:not([data-ds-dark-theme]) .math-inline,
            body:not([data-ds-dark-theme]) .math-block {
                color: ${L.math} !important;
            }

            /* 行内代码颜色 */
            body .ds-markdown code:not(pre code):not(.md-code-block code) {
            color: ${L.inlineCodeText} !important;
            }
            body[data-ds-dark-theme] .ds-markdown code:not(pre code):not(.md-code-block code) {
            color: ${D.inlineCodeText} !important;
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
            body[data-ds-dark-theme] .ds-markdown h1::before { background: ${D.heading[0]}; }
            body[data-ds-dark-theme] .ds-markdown h2::before { background: ${D.heading[1]}; }
            body[data-ds-dark-theme] .ds-markdown h3::before { background: ${D.heading[2]}; }
            body[data-ds-dark-theme] .ds-markdown h4::before { background: ${D.heading[3]}; }
            body[data-ds-dark-theme] .ds-markdown h5::before { background: ${D.heading[4]}; }
            body[data-ds-dark-theme] .ds-markdown h6::before { background: ${D.heading[5]}; }

        /* 浅色模式标题竖条颜色 */
        body .ds-markdown h1::before { background: ${L.heading[0]}; }
        body .ds-markdown h2::before { background: ${L.heading[1]}; }
        body .ds-markdown h3::before { background: ${L.heading[2]}; }
        body .ds-markdown h4::before { background: ${L.heading[3]}; }
        body .ds-markdown h5::before { background: ${L.heading[4]}; }
        body .ds-markdown h6::before { background: ${L.heading[5]}; }

        /* 引用块样式 - Border 风格 */
            .ds-markdown blockquote {
                border-left: none !important;
                border-radius: 6px;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%23${L.blockquoteDot}' fill-opacity='0.12' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E");
                position: relative;
            }
            body[data-ds-dark-theme] .ds-markdown blockquote {
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%23${D.blockquoteDot}' fill-opacity='0.12' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E");
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
                background: ${L.toastBg};
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
                color: ${L.toastText};
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
                background: ${D.toastBg};
                color: ${D.toastText};
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
            }
        `;
    }

    const style = document.createElement('style');
    style.textContent = buildCSS(THEMES['Border']);
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

    document.addEventListener('click', function (e) {
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
