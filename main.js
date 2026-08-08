// ==UserScript==
// @name         DeepSeek-Refined
// @namespace    https://github.com/djh2203/DeepSeek-Refined
// @version      1.6
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
                // 页面整体背景色（浅色模式）
                bg: '#F9F6F4',
                // 底层背景变量 --dsw-alias-bg-base（含透明通道）
                bgBase: '#F9F6F4',
                // 次级背景层 --dsw-alias-bg-layer-2（侧边栏/卡片等）
                bgLayer2: '#F2E0E4',
                // 三级背景层 --dsw-alias-bg-layer-3
                bgLayer3: '#EBE4F0',
                // 主要文字颜色
                labelPrimary: '#4A4348',
                // 次要文字颜色
                labelSecondary: '#8B7F88',
                // 三级文字颜色（弱化显示）
                labelTertiary: '#A9A0A6',
                // 说明性文字颜色
                labelCaption: '#8B7F88',
                // 品牌主色（链接/按钮/引用块竖条）
                brandPrimary: '#793f82',
                // 品牌文字颜色
                brandText: '#9B7AA0',
                // 边框颜色 1（最浅）
                borderL1: 'rgba(74, 67, 72, 0.06)',
                // 边框颜色 2
                borderL2: 'rgba(74, 67, 72, 0.10)',
                // 边框颜色 3（最深）
                borderL3: 'rgba(74, 67, 72, 0.14)',
                // 行内代码背景色
                inlineCodeBg: '#F2E0E4',
                // 代码块背景色
                codeBlockBg: '#FEFBF5',
                // 代码块标题栏背景色
                codeBannerBg: '#F7F0E3',
                // 粗体 (bold) 颜色
                strong: 'hsl(350, 80%, 55%)',
                // 斜体 (italic) 颜色
                em: 'hsl(28, 80%, 50%)',
                // 数学公式颜色
                math: '#1a6fb5',
                // 行内代码文字颜色
                inlineCodeText: '#dd1399',
                // 各级标题左侧竖条颜色，顺序为 [h1, h2, h3, h4, h5, h6]
                heading: ['#bd5151', '#c77b23', '#478f14', '#0585a8', '#726293', '#127d52'],
                // 引用块点阵图案颜色（纯 hex，不带 #）
                blockquoteDot: '000000',
                // 复制提示 Toast 背景色
                toastBg: '#fff',
                // 复制提示 Toast 文字颜色
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
                borderL1: 'rgba(255, 255, 255, 0.06)',
                borderL2: 'rgba(255, 255, 255, 0.10)',
                borderL3: 'rgba(255, 255, 255, 0.14)',
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
        'Nord': {
            light: {
                bg: '#ECEFF4',
                bgBase: '#ECEFF4',
                bgLayer2: '#E5E9F0',
                bgLayer3: '#D8DEE9',
                labelPrimary: '#2E3440',
                labelSecondary: '#4C566A',
                labelTertiary: '#7B88A1',
                labelCaption: '#4C566A',
                brandPrimary: '#5E81AC',
                brandText: '#5E81AC',
                borderL1: 'rgba(46, 52, 64, 0.06)',
                borderL2: 'rgba(46, 52, 64, 0.10)',
                borderL3: 'rgba(46, 52, 64, 0.14)',
                inlineCodeBg: '#E5E9F0',
                codeBlockBg: '#FFFFFF',
                codeBannerBg: '#D8DEE9',
                strong: '#BF616A',
                em: '#D08770',
                math: '#5E81AC',
                inlineCodeText: '#5E81AC',
                heading: ['#BF616A', '#D08770', '#A88B3F', '#7FA46B', '#5E81AC', '#8E6F9E'],
                blockquoteDot: '000000',
                toastBg: '#FFFFFF',
                toastText: '#2E3440',
            },
            dark: {
                bg: '#2E3440',
                bgBase: '#2E3440',
                bgLayer1: '#2E3440',
                bgLayer2: '#3B4252',
                bgLayer3: '#434C5E',
                labelPrimary: '#ECEFF4',
                labelSecondary: '#D8DEE9',
                labelTertiary: '#7B88A1',
                labelCaption: '#D8DEE9',
                brandPrimary: '#88C0D0',
                brandText: '#88C0D0',
                borderL1: 'rgba(216, 222, 233, 0.06)',
                borderL2: 'rgba(216, 222, 233, 0.10)',
                borderL3: 'rgba(216, 222, 233, 0.14)',
                inlineCodeBg: '#434C5E',
                codeBlockBg: '#3B4252',
                codeBannerBg: '#434C5E',
                strong: '#BF616A',
                em: '#D08770',
                math: '#88C0D0',
                inlineCodeText: '#8FBCBB',
                heading: ['#BF616A', '#D08770', '#EBCB8B', '#A3BE8C', '#88C0D0', '#B48EAD'],
                blockquoteDot: 'ffffff',
                toastBg: '#3B4252',
                toastText: '#ECEFF4',
            },
        },
        'Twilight': {
            light: {
                bg: '#F7F3FB',
                bgBase: '#F7F3FB',
                bgLayer2: '#EDE4F5',
                bgLayer3: '#E3D4EF',
                labelPrimary: '#3D2E4F',
                labelSecondary: '#6E5C82',
                labelTertiary: '#9C8AB0',
                labelCaption: '#6E5C82',
                brandPrimary: '#8B5CF6',
                brandText: '#7C3AED',
                borderL1: 'rgba(61, 46, 79, 0.06)',
                borderL2: 'rgba(61, 46, 79, 0.10)',
                borderL3: 'rgba(61, 46, 79, 0.14)',
                inlineCodeBg: '#EDE4F5',
                codeBlockBg: '#FFFFFF',
                codeBannerBg: '#EDE4F5',
                strong: '#DB2777',
                em: '#D97706',
                math: '#6D28D9',
                inlineCodeText: '#8B5CF6',
                heading: ['#DB2777', '#D97706', '#A16207', '#059669', '#2563EB', '#7C3AED'],
                blockquoteDot: '000000',
                toastBg: '#FFFFFF',
                toastText: '#3D2E4F',
            },
            dark: {
                bg: '#1A1124',
                bgBase: '#1A1124',
                bgLayer1: '#1A1124',
                bgLayer2: '#241736',
                bgLayer3: '#2E1F44',
                labelPrimary: '#EDE4F5',
                labelSecondary: '#B9A6CC',
                labelTertiary: '#7E6C96',
                labelCaption: '#A894BC',
                brandPrimary: '#C084FC',
                brandText: '#D3A9FF',
                borderL1: 'rgba(237, 228, 245, 0.06)',
                borderL2: 'rgba(237, 228, 245, 0.10)',
                borderL3: 'rgba(237, 228, 245, 0.14)',
                inlineCodeBg: '#2E1F44',
                codeBlockBg: '#241736',
                codeBannerBg: '#2E1F44',
                strong: '#FF79C6',
                em: '#FFD866',
                math: '#82AAFF',
                inlineCodeText: '#C084FC',
                heading: ['#FF79C6', '#FFB86C', '#F1FA8C', '#50FA7B', '#8BE9FD', '#BD93F9'],
                blockquoteDot: 'ffffff',
                toastBg: '#241736',
                toastText: '#EDE4F5',
            },
        },
        'GitHub': {
            light: {
                bg: '#FFFFFF',
                bgBase: '#FFFFFF',
                bgLayer2: '#F6F8FA',
                bgLayer3: '#EFF3F6',
                labelPrimary: '#1F2328',
                labelSecondary: '#59636E',
                labelTertiary: '#8D959E',
                labelCaption: '#59636E',
                brandPrimary: '#0969DA',
                brandText: '#0969DA',
                borderL1: 'rgba(31, 35, 40, 0.06)',
                borderL2: 'rgba(31, 35, 40, 0.10)',
                borderL3: 'rgba(31, 35, 40, 0.14)',
                inlineCodeBg: '#EFF1F3',
                codeBlockBg: '#F6F8FA',
                codeBannerBg: '#EFF3F6',
                strong: '#CF222E',
                em: '#9A6700',
                math: '#8250DF',
                inlineCodeText: '#8250DF',
                heading: ['#CF222E', '#BC4C00', '#1A7F37', '#0969DA', '#8250DF', '#1F2328'],
                blockquoteDot: '000000',
                toastBg: '#FFFFFF',
                toastText: '#1F2328',
            },
            dark: {
                bg: '#0D1117',
                bgBase: '#0D1117',
                bgLayer1: '#0D1117',
                bgLayer2: '#161B22',
                bgLayer3: '#21262D',
                labelPrimary: '#E6EDF3',
                labelSecondary: '#9198A1',
                labelTertiary: '#7D8590',
                labelCaption: '#9198A1',
                brandPrimary: '#4493F8',
                brandText: '#4493F8',
                borderL1: 'rgba(230, 237, 243, 0.06)',
                borderL2: 'rgba(230, 237, 243, 0.10)',
                borderL3: 'rgba(230, 237, 243, 0.14)',
                inlineCodeBg: '#21262D',
                codeBlockBg: '#161B22',
                codeBannerBg: '#21262D',
                strong: '#FF7B72',
                em: '#D29922',
                math: '#A371F7',
                inlineCodeText: '#79C0FF',
                heading: ['#FF7B72', '#FFA657', '#7EE787', '#79C0FF', '#A371F7', '#9198A1'],
                blockquoteDot: 'ffffff',
                toastBg: '#21262D',
                toastText: '#E6EDF3',
            },
        },
        'Atom One': {
            light: {
                bg: '#FAFAFA',
                bgBase: '#FAFAFA',
                bgLayer2: '#F0F0F1',
                bgLayer3: '#E5E5E6',
                labelPrimary: '#383A42',
                labelSecondary: '#696C77',
                labelTertiary: '#A0A1A7',
                labelCaption: '#696C77',
                brandPrimary: '#4078F2',
                brandText: '#4078F2',
                borderL1: 'rgba(56, 58, 66, 0.06)',
                borderL2: 'rgba(56, 58, 66, 0.10)',
                borderL3: 'rgba(56, 58, 66, 0.14)',
                inlineCodeBg: '#F0F0F1',
                codeBlockBg: '#F5F5F6',
                codeBannerBg: '#E8E8EA',
                strong: '#E45649',
                em: '#C18401',
                math: '#4078F2',
                inlineCodeText: '#A626A4',
                heading: ['#E45649', '#C18401', '#986801', '#50A14F', '#4078F2', '#A626A4'],
                blockquoteDot: '000000',
                toastBg: '#FFFFFF',
                toastText: '#383A42',
            },
            dark: {
                bg: '#282C34',
                bgBase: '#282C34',
                bgLayer1: '#282C34',
                bgLayer2: '#2C313A',
                bgLayer3: '#353B45',
                labelPrimary: '#ABB2BF',
                labelSecondary: '#7F848E',
                labelTertiary: '#5C6370',
                labelCaption: '#7F848E',
                brandPrimary: '#61AFEF',
                brandText: '#61AFEF',
                borderL1: 'rgba(171, 178, 191, 0.06)',
                borderL2: 'rgba(171, 178, 191, 0.10)',
                borderL3: 'rgba(171, 178, 191, 0.14)',
                inlineCodeBg: '#353B45',
                codeBlockBg: '#21252B',
                codeBannerBg: '#2C313A',
                strong: '#E06C75',
                em: '#D19A66',
                math: '#61AFEF',
                inlineCodeText: '#98C379',
                heading: ['#E06C75', '#D19A66', '#E5C07B', '#98C379', '#61AFEF', '#C678DD'],
                blockquoteDot: 'ffffff',
                toastBg: '#2C313A',
                toastText: '#ABB2BF',
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
            /* 侧边栏和输入区域背景与页面背景一致 */
            .b8812f16,
            ._519be07,
            ._233f913 {
                background-color: ${L.bg} !important;
                background: ${L.bg} !important;
            }
            body[data-ds-dark-theme] .b8812f16,
            body[data-ds-dark-theme] ._519be07,
            body[data-ds-dark-theme] ._233f913 {
                background-color: ${D.bg} !important;
                background: ${D.bg} !important;
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

            /* ========== 主题切换按钮 ========== */
            .dsr-theme-picker {
                position: fixed;
                top: 14px;
                right: 14px;
                z-index: 2147483000;
            }
            /* 桌面端头部更高，往下移避免遮挡分享图标；手机端保持默认 */
            @media (min-width: 768px) {
                .dsr-theme-picker {
                    top: 60px;
                }
            }
            .dsr-theme-btn {
                width: 36px;
                height: 36px;
                border: 1px solid ${L.borderL2};
                border-radius: 50%;
                background: ${L.toastBg};
                color: ${L.toastText};
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
                transition: transform 0.15s ease;
            }
            .dsr-theme-btn:hover { transform: scale(1.05); }
            .dsr-theme-btn svg { width: 18px; height: 18px; }
            .dsr-theme-menu {
                position: absolute;
                top: 44px;
                right: 0;
                display: none;
                min-width: 150px;
                padding: 4px;
                border-radius: 10px;
                background: ${L.toastBg};
                color: ${L.toastText};
                border: 1px solid ${L.borderL2};
                box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
            }
            .dsr-theme-picker.open .dsr-theme-menu { display: block; }
            .dsr-theme-option {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 8px;
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 13px;
                line-height: 1.4;
                cursor: pointer;
            }
            .dsr-theme-option:hover { background: ${L.bgLayer2}; }
            .dsr-theme-option .dsr-check {
                visibility: hidden;
                font-size: 12px;
            }
            .dsr-theme-option.active {
                color: ${L.brandPrimary};
                font-weight: 600;
            }
            .dsr-theme-option.active .dsr-check { visibility: visible; }

            /* 深色模式主题切换按钮 */
            body[data-ds-dark-theme] .dsr-theme-btn {
                background: ${D.toastBg};
                color: ${D.toastText};
                border-color: ${D.borderL2};
            }
            body[data-ds-dark-theme] .dsr-theme-menu {
                background: ${D.toastBg};
                color: ${D.toastText};
                border-color: ${D.borderL2};
            }
            body[data-ds-dark-theme] .dsr-theme-option:hover { background: ${D.bgLayer2}; }
            body[data-ds-dark-theme] .dsr-theme-option.active { color: ${D.brandPrimary}; }
        `;
    }

    // ========== 主题切换按钮 ==========
    const THEME_STORAGE_KEY = 'dsr_theme';

    function getThemeName() {
        try {
            const saved = localStorage.getItem(THEME_STORAGE_KEY);
            if (saved && THEMES[saved]) return saved;
        } catch (e) { /* ignore */ }
        return Object.keys(THEMES)[0];
    }

    function applyTheme(name) {
        if (!THEMES[name]) return;
        style.textContent = buildCSS(THEMES[name]);
        try {
            localStorage.setItem(THEME_STORAGE_KEY, name);
        } catch (e) { /* ignore */ }
        document.querySelectorAll('.dsr-theme-option').forEach((opt) => {
            opt.classList.toggle('active', opt.dataset.theme === name);
        });
    }

    function createThemePicker() {
        const names = Object.keys(THEMES);
        const current = getThemeName();

        const picker = document.createElement('div');
        picker.className = 'dsr-theme-picker';

        const btn = document.createElement('button');
        btn.className = 'dsr-theme-btn';
        btn.type = 'button';
        btn.title = '切换主题';
        btn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="3"/><circle cx="12" cy="5" r="1.7"/><circle cx="19" cy="9" r="1.7"/><circle cx="17" cy="18" r="1.7"/><circle cx="7" cy="18" r="1.7"/><circle cx="5" cy="9" r="1.7"/></svg>';

        const menu = document.createElement('div');
        menu.className = 'dsr-theme-menu';
        names.forEach((name) => {
            const opt = document.createElement('div');
            opt.className = 'dsr-theme-option';
            opt.dataset.theme = name;
            opt.innerHTML = `<span>${name}</span><span class="dsr-check">✓</span>`;
            opt.addEventListener('click', (e) => {
                e.stopPropagation();
                applyTheme(name);
                picker.classList.remove('open');
            });
            if (name === current) opt.classList.add('active');
            menu.appendChild(opt);
        });

        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            picker.classList.toggle('open');
        });

        picker.appendChild(btn);
        picker.appendChild(menu);
        document.body.appendChild(picker);

        document.addEventListener('click', () => picker.classList.remove('open'));
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') picker.classList.remove('open');
        });
    }

    const style = document.createElement('style');
    style.textContent = buildCSS(THEMES[getThemeName()]);
    document.head.appendChild(style);
    createThemePicker();

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
