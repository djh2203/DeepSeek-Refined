// ==UserScript==
// @name         DeepSeek-Refined
// @namespace    https://github.com/djh2203/DeepSeek-Refined
// @version      1.7
// @description  一个 Tampermonkey 用户脚本，为网页版 DeepSeek Chat (chat.deepseek.com) 注入 Obsidian Border 主题风格的 Markdown 美化样式。通过覆盖 DeepSeek 的 CSS 变量系统，实现深色/浅色模式的全面配色定制。支持粗体、斜体、行内代码、数学公式的颜色自定义；各级标题左侧添加彩色圆角竖条装饰；引用块使用 Border 标志性的点阵图案背景。同时调整消息宽度为 75% 以获得更好的阅读体验。安装后自动跟随系统深浅色模式切换，无需手动配置。配色灵感来源于 Obsidian Border 主题。额外提供文字替换功能：点击右上角 ✎ 按钮可为页面文字配置替换规则，支持一个词对应多个替换词（随机生效）。
// @author       djh2203
// @match        https://chat.deepseek.com/*
// @icon         https://www.deepseek.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/585012/DeepSeek-Refined.user.js
// @updateURL https://update.greasyfork.org/scripts/585012/DeepSeek-Refined.meta.js
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

                /* 侧边栏填充色：DeepSeek 用它绘制侧边栏底色、日期标签的 box-shadow、底部渐隐等。
                   不覆盖的话，这些残留元素会保持 DeepSeek 原配色（深色下为 #1b1b1c，近黑），
                   在自定义底色上就会露出一条条黑条 */
                --dsw-specific-sidebar-fill: ${L.bg};

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

                /* 同步侧边栏填充色（含日期标签 box-shadow、日期行右侧“更多”按钮底色、底部渐隐） */
                --dsw-specific-sidebar-fill: ${D.bg};
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

        /* 日期标签 .f3d18f6a 自带 box-shadow: 4px 0 0（原本用于遮住滚动内容，
           让标签底色延伸到列表内容区右缘）。标签被透明化后，这条阴影会作为一条
           孤立的竖条残留在每个日期右侧，颜色取自 DeepSeek 原侧边栏底色（深色下 #1b1b1c），
           与主题背景不一致时就表现为“黑条”，这里直接去掉 */
        .f3d18f6a {
            box-shadow: none !important;
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

    // ========== 文字替换功能 ==========
    (function installTextReplacer() {
        'use strict';

        const RULES_KEY = 'dsr_text_replace_rules';
        const CFG_KEY = 'dsr_text_replace_config';
        const DEFAULT_CFG = { enabled: true, onlySpan: true, useRegex: false };

        // ---------- 存储 ----------
        function loadRules() {
            try {
                const arr = JSON.parse(localStorage.getItem(RULES_KEY));
                if (!Array.isArray(arr)) return [];
                // 兼容旧格式：to 为字符串时规范化为数组
                return arr.map((r) => {
                    if (r && typeof r === 'object' && typeof r.from === 'string') {
                        if (typeof r.to === 'string') r.to = [r.to];
                        if (!Array.isArray(r.to)) r.to = [];
                    }
                    return r;
                });
            } catch (e) { return []; }
        }
        function saveRules(rules) {
            try { localStorage.setItem(RULES_KEY, JSON.stringify(rules)); } catch (e) { /* ignore */ }
        }
        function loadCfg() {
            try {
                const c = JSON.parse(localStorage.getItem(CFG_KEY));
                return Object.assign({}, DEFAULT_CFG, c || {});
            } catch (e) { return Object.assign({}, DEFAULT_CFG); }
        }
        function saveCfg(cfg) {
            try { localStorage.setItem(CFG_KEY, JSON.stringify(cfg)); } catch (e) { /* ignore */ }
        }

        // ---------- 替换逻辑 ----------
        // 需要排除的区域：脚本自身 UI、输入框、代码区等
        function isExcluded(el) {
            if (!el) return true;
            if (typeof el.closest === 'function') {
                // 本脚本自己的 UI：文字替换面板、主题选择器、复制提示
                if (el.closest('.dsr-replacer, .dsr-theme-picker, .ds-copy-toast')) return true;
                if (el.closest('script,style,noscript,textarea,input,select,option')) return true;
                const ce = el.closest('[contenteditable]');
                if (ce && (ce.getAttribute('contenteditable') || '').toLowerCase() === 'true') return true;
            }
            return false;
        }

        function applyRulesToTextNode(node, rules, cfg) {
            if (!node || node.nodeType !== Node.TEXT_NODE) return;
            let text = node.nodeValue;
            if (!text) return;
            let changed = false;
            for (const rule of rules) {
                if (!rule || !rule.from) continue;
                // 多个替换词：每个匹配位置随机选一个
                const tos = (Array.isArray(rule.to) ? rule.to : [rule.to]).filter((t) => t != null);
                if (!tos.length) continue;
                const pick = () => tos.length === 1 ? tos[0] : tos[Math.floor(Math.random() * tos.length)];
                try {
                    let next;
                    if (cfg.useRegex) {
                        next = text.replace(new RegExp(rule.from, 'g'), () => pick());
                    } else {
                        next = text.split(rule.from).map((part, i, arr) => i === arr.length - 1 ? part : part + pick()).join('');
                    }
                    if (next !== text) { text = next; changed = true; }
                } catch (e) { /* 非法正则等，跳过该规则 */ }
            }
            if (changed) node.nodeValue = text;
        }

        function walkRoot(root) {
            if (!root) return;
            const cfg = loadCfg();
            const rules = loadRules().filter((r) => r && r.from && !r.disabled);
            if (!cfg.enabled || rules.length === 0) return;

            // 文本节点直接处理
            if (root.nodeType === Node.TEXT_NODE) {
                const parent = root.parentElement;
                if (parent && !isExcluded(parent) && (!cfg.onlySpan || parent.tagName === 'SPAN')) {
                    applyRulesToTextNode(root, rules, cfg);
                }
                return;
            }
            if (root.nodeType !== Node.ELEMENT_NODE) return;
            if (isExcluded(root)) return;

            const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
                acceptNode(node) {
                    const p = node.parentElement;
                    if (!p || isExcluded(p)) return NodeFilter.FILTER_REJECT;
                    if (cfg.onlySpan && p.tagName !== 'SPAN') return NodeFilter.FILTER_REJECT;
                    return NodeFilter.FILTER_ACCEPT;
                }
            });
            const nodes = [];
            while (walker.nextNode()) nodes.push(walker.currentNode);
            nodes.forEach((n) => applyRulesToTextNode(n, rules, cfg));
        }

        // ---------- 监听 DOM 变化（DeepSeek 是动态渲染，消息会不断更新） ----------
        let applying = false;
        const pending = new Set();
        let queued = false;

        function flush() {
            queued = false;
            if (applying || pending.size === 0) return;
            applying = true;
            try {
                const items = Array.from(pending);
                pending.clear();
                items.forEach(walkRoot);
            } finally {
                applying = false;
            }
        }
        function scheduleFlush() {
            if (queued) return;
            queued = true;
            // 用微任务调度：在浏览器绘制该帧之前完成替换，避免官方文字闪现
            Promise.resolve().then(flush);
        }

        const mo = new MutationObserver((records) => {
            let needs = false;
            for (const r of records) {
                if (r.type === 'characterData') {
                    pending.add(r.target);
                    needs = true;
                } else if (r.type === 'childList') {
                    r.addedNodes.forEach((n) => { pending.add(n); needs = true; });
                }
            }
            if (needs) scheduleFlush();
        });

        // ---------- 样式 ----------
        const style = document.createElement('style');
        style.textContent = `
            .dsr-replacer-btn {
                position: fixed;
                top: var(--dsr-btn-top, 58px);
                right: var(--dsr-btn-right, 14px);
                width: 36px; height: 36px; border-radius: 50%;
                border: 1px solid var(--dsw-alias-border-l2, rgba(0,0,0,.12));
                background: var(--dsw-alias-bg-layer-3, #ffffff);
                color: var(--dsw-alias-brand-primary, #793f82);
                cursor: pointer; display: flex; align-items: center; justify-content: center;
                box-shadow: 0 2px 10px rgba(0,0,0,.2);
                z-index: 2147483000; transition: transform .15s ease;
            }
            .dsr-replacer-btn:hover { transform: scale(1.08); }
            .dsr-replacer-btn svg { width: 18px; height: 18px; }
            .dsr-replacer-tip {
                position: fixed;
                right: var(--dsr-btn-right, 14px);
                top: calc(var(--dsr-btn-top, 58px) + 44px);
                max-width: 220px; padding: 8px 12px;
                background: var(--dsw-alias-bg-layer-3, #ffffff);
                color: var(--dsw-alias-label-primary, #333);
                border: 1px solid var(--dsw-alias-border-l3, rgba(0,0,0,.14));
                border-radius: 10px; box-shadow: 0 6px 20px rgba(0,0,0,.2);
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                font-size: 12px; line-height: 1.5; text-align: center;
                z-index: 2147483000; pointer-events: none;
                animation: dsr-tip-fade 8s forwards;
            }
            @keyframes dsr-tip-fade {
                0% { opacity: 0; transform: translateY(6px); }
                5% { opacity: 1; transform: translateY(0); }
                85% { opacity: 1; }
                100% { opacity: 0; transform: translateY(-4px); }
            }
            .dsr-replacer-panel {
                position: fixed;
                right: var(--dsr-btn-right, 14px);
                top: calc(var(--dsr-btn-top, 58px) + 44px);
                width: 320px; max-height: 60vh; overflow: hidden;
                background: var(--dsw-alias-bg-layer-3, #ffffff);
                color: var(--dsw-alias-label-primary, #333);
                border: 1px solid var(--dsw-alias-border-l3, rgba(0,0,0,.14));
                border-radius: 12px; box-shadow: 0 8px 30px rgba(0,0,0,.2);
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                font-size: 13px; line-height: 1.5;
                z-index: 2147483000; display: none;
            }
            .dsr-replacer.open .dsr-replacer-panel { display: block; }
            .dsr-replacer-head {
                display: flex; align-items: center; justify-content: space-between;
                padding: 10px 14px; font-weight: 600;
                border-bottom: 1px solid var(--dsw-alias-border-l2, rgba(0,0,0,.08));
            }
            .dsr-replacer-close {
                border: none; background: transparent; color: inherit;
                font-size: 18px; line-height: 1; cursor: pointer; padding: 0 4px;
            }
            .dsr-replacer-switch {
                display: flex; align-items: center; gap: 6px;
                padding: 6px 14px; cursor: pointer; user-select: none;
            }
            .dsr-replacer-switch input { accent-color: var(--dsw-alias-brand-primary, #793f82); }
            .dsr-replacer-list {
                padding: 6px 10px; max-height: 220px; overflow-y: auto;
                scrollbar-width: none; -ms-overflow-style: none;
                border-top: 1px solid var(--dsw-alias-border-l1, rgba(0,0,0,.05)); margin-top: 4px;
            }
            .dsr-replacer-list::-webkit-scrollbar { display: none; width: 0; height: 0; }
            .dsr-replacer-empty { padding: 10px; text-align: center; opacity: .6; }
            .dsr-replacer-item {
                display: grid;
                grid-template-columns: auto minmax(0, 1fr) auto;
                align-items: start;
                gap: 4px 6px;
                padding: 6px 8px; border-radius: 8px; margin-bottom: 4px;
                background: var(--dsw-alias-bg-layer-2, #f5f5f5);
            }
            .dsr-replacer-item.disabled { opacity: .5; }
            .dsr-replacer-item .dsr-replacer-item-enable {
                grid-column: 1; grid-row: 1 / span 2;
                margin-top: 6px;
            }
            .dsr-replacer-item-from {
                grid-column: 2; grid-row: 1;
                min-width: 0; padding: 2px 6px; border-radius: 4px;
                background: var(--dsw-alias-bg-base, #fff); outline: none;
                overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
                cursor: text;
            }
            .dsr-replacer-item-from:focus {
                box-shadow: 0 0 0 2px var(--dsw-alias-brand-primary, #793f82);
                white-space: normal;
                overflow-wrap: break-word;
                text-overflow: clip;
            }
            .dsr-replacer-tos {
                grid-column: 2; grid-row: 2;
                display: flex; flex-direction: column; gap: 4px;
            }
            .dsr-replacer-to-row {
                display: flex; align-items: center; gap: 4px;
            }
            .dsr-replacer-to {
                flex: 1; min-width: 0; padding: 2px 6px; border-radius: 4px;
                background: var(--dsw-alias-bg-base, #fff); outline: none;
                overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
                cursor: text;
            }
            .dsr-replacer-to:focus {
                box-shadow: 0 0 0 2px var(--dsw-alias-brand-primary, #793f82);
                white-space: normal;
                overflow-wrap: break-word;
                text-overflow: clip;
            }
            .dsr-replacer-item-arrow { opacity: .6; flex-shrink: 0; font-size: 12px; }
            .dsr-replacer-del-to {
                border: none; background: transparent; color: inherit;
                opacity: .5; cursor: pointer; font-size: 13px; line-height: 1;
                flex-shrink: 0; padding: 0 3px;
            }
            .dsr-replacer-del-to:hover { opacity: 1; }
            .dsr-replacer-addto {
                align-self: flex-start;
                border: 1px dashed var(--dsw-alias-border-l3, rgba(0,0,0,.18));
                background: transparent; color: inherit; opacity: .7;
                border-radius: 6px; padding: 2px 8px; cursor: pointer;
                font-size: 12px; flex-shrink: 0;
            }
            .dsr-replacer-addto:hover { opacity: 1; }
            .dsr-replacer-item-del {
                grid-column: 3; grid-row: 1;
                border: none; background: transparent; color: inherit;
                opacity: .6; cursor: pointer; font-size: 14px;
                flex-shrink: 0; padding: 0 4px;
            }
            .dsr-replacer-item-del:hover { opacity: 1; }
            .dsr-replacer-add {
                display: flex; gap: 6px; padding: 10px 14px;
                border-top: 1px solid var(--dsw-alias-border-l2, rgba(0,0,0,.08));
            }
            .dsr-replacer-input {
                flex: 1; min-width: 0; padding: 5px 8px; border-radius: 6px;
                border: 1px solid var(--dsw-alias-border-l3, rgba(0,0,0,.16));
                background: var(--dsw-alias-bg-base, #fff); color: inherit; font-size: 13px; outline: none;
            }
            .dsr-replacer-input:focus { box-shadow: 0 0 0 2px var(--dsw-alias-brand-primary, #793f82); }
            .dsr-replacer-addbtn {
                flex-shrink: 0; border: none; border-radius: 6px; padding: 5px 12px;
                background: var(--dsw-alias-brand-primary, #793f82);
                color: #fff; cursor: pointer; font-size: 13px;
            }
            .dsr-replacer-addbtn:hover { filter: brightness(1.1); }
            .dsr-replacer-hint { padding: 4px 14px 10px; font-size: 12px; opacity: .6; }
        `;
        document.head.appendChild(style);

        // ---------- 界面 ----------
        function buildUI() {
            if (document.querySelector('.dsr-replacer')) return;
            const cfg = loadCfg();

            const root = document.createElement('div');
            root.className = 'dsr-replacer';

            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'dsr-replacer-btn';
            btn.title = '文字替换';
            btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>';
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                root.classList.toggle('open');
            });

            const panel = document.createElement('div');
            panel.className = 'dsr-replacer-panel';

            const head = document.createElement('div');
            head.className = 'dsr-replacer-head';
            const title = document.createElement('span');
            title.textContent = '文字替换';
            const close = document.createElement('button');
            close.type = 'button';
            close.className = 'dsr-replacer-close';
            close.textContent = '×';
            close.title = '关闭';
            close.addEventListener('click', () => root.classList.remove('open'));
            head.append(title, close);
            panel.appendChild(head);

            [
                { key: 'enabled', label: '启用替换' },
                { key: 'onlySpan', label: '仅替换 span 标签内的文字' },
                { key: 'useRegex', label: '将"原文本"视为正则表达式' },
            ].forEach(({ key, label }) => {
                const lab = document.createElement('label');
                lab.className = 'dsr-replacer-switch';
                const cb = document.createElement('input');
                cb.type = 'checkbox';
                cb.checked = !!cfg[key];
                cb.addEventListener('change', () => {
                    const c = loadCfg();
                    c[key] = cb.checked;
                    saveCfg(c);
                    if (document.body) walkRoot(document.body);
                });
                lab.append(cb, document.createTextNode(' ' + label));
                panel.appendChild(lab);
            });

            const list = document.createElement('div');
            list.className = 'dsr-replacer-list';
            panel.appendChild(list);

            const addRow = document.createElement('div');
            addRow.className = 'dsr-replacer-add';
            const fromInput = document.createElement('input');
            fromInput.type = 'text';
            fromInput.className = 'dsr-replacer-input';
            fromInput.placeholder = '原文本';
            const toInput = document.createElement('input');
            toInput.type = 'text';
            toInput.className = 'dsr-replacer-input';
            toInput.placeholder = '替换为';
            const addBtn = document.createElement('button');
            addBtn.type = 'button';
            addBtn.className = 'dsr-replacer-addbtn';
            addBtn.textContent = '添加';
            addBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const from = fromInput.value.trim();
                if (!from) { fromInput.focus(); return; }
                const rules = loadRules();
                rules.push({ from: from, to: [toInput.value], disabled: false });
                saveRules(rules);
                fromInput.value = '';
                toInput.value = '';
                renderRules();
                if (document.body) walkRoot(document.body);
            });
            // 在输入框里按 Enter 也可以直接添加规则
            const addOnEnter = (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    addBtn.click();
                }
            };
            fromInput.addEventListener('keydown', addOnEnter);
            toInput.addEventListener('keydown', addOnEnter);
            addRow.append(fromInput, toInput, addBtn);
            panel.appendChild(addRow);

            const hint = document.createElement('div');
            hint.className = 'dsr-replacer-hint';
            hint.textContent = '提示：替换文本请勿包含原文本，避免无限循环。';
            panel.appendChild(hint);

            // 首次使用显示引导气泡
            try {
                if (!localStorage.getItem('dsr_text_replace_tip_shown')) {
                    const tip = document.createElement('div');
                    tip.className = 'dsr-replacer-tip';
                    tip.textContent = '点击右上角主题按钮下方的 ✎ 可修改页面文字';
                    document.body.appendChild(tip);
                    setTimeout(() => {
                        if (tip.parentNode) tip.remove();
                        localStorage.setItem('dsr_text_replace_tip_shown', '1');
                    }, 8000);
                }
            } catch (e) { /* ignore */ }

            root.append(btn, panel);
            document.body.appendChild(root);

            // 让笔按钮跟随主题按钮（dsr-theme-btn）正下方
            function positionBtn() {
                if (!btn.isConnected) return;
                const themeBtn = document.querySelector('.dsr-theme-btn');
                if (!themeBtn) return;
                const rect = themeBtn.getBoundingClientRect();
                const gap = 8;
                root.style.setProperty('--dsr-btn-right', Math.max(8, Math.round(window.innerWidth - rect.right)) + 'px');
                root.style.setProperty('--dsr-btn-top', Math.round(rect.bottom + gap) + 'px');
            }
            positionBtn();
            window.addEventListener('resize', positionBtn);
            // 主题按钮若稍后出现（如被框架重新渲染），延迟重试
            setTimeout(positionBtn, 500);
            setTimeout(positionBtn, 2000);

            // 主题菜单展开时，临时隐藏笔按钮，避免遮挡
            const themePicker = document.querySelector('.dsr-theme-picker');
            if (themePicker) {
                const syncVisibility = () => {
                    btn.style.visibility = themePicker.classList.contains('open') ? 'hidden' : '';
                };
                syncVisibility();
                new MutationObserver(syncVisibility).observe(themePicker, {
                    attributes: true, attributeFilter: ['class']
                });
            }

            function renderRules() {
                list.innerHTML = '';
                const rules = loadRules();
                if (rules.length === 0) {
                    const empty = document.createElement('div');
                    empty.className = 'dsr-replacer-empty';
                    empty.textContent = '暂无规则，请在下方添加';
                    list.appendChild(empty);
                    return;
                }
                rules.forEach((rule, idx) => {
                    list.appendChild(createRuleItem(rule, idx));
                });
            }

            // 创建单个规则条目：原文本 + 多个替换词（可增删）
            function createRuleItem(rule, idx) {
                const item = document.createElement('div');
                item.className = 'dsr-replacer-item' + (rule.disabled ? ' disabled' : '');

                const enable = document.createElement('input');
                enable.type = 'checkbox';
                enable.className = 'dsr-replacer-item-enable';
                enable.checked = !rule.disabled;
                enable.title = '启用/禁用此规则';
                enable.addEventListener('change', () => {
                    const rs = loadRules();
                    rs[idx].disabled = !enable.checked;
                    saveRules(rs);
                    item.classList.toggle('disabled', rs[idx].disabled);
                    if (document.body) walkRoot(document.body);
                });

                const fromSpan = document.createElement('span');
                fromSpan.className = 'dsr-replacer-item-from';
                fromSpan.textContent = rule.from;
                fromSpan.contentEditable = 'true';
                fromSpan.spellcheck = false;
                fromSpan.title = '点击编辑，回车保存';
                fromSpan.addEventListener('blur', () => {
                    const rs = loadRules();
                    const v = fromSpan.textContent.trim();
                    if (v) { rs[idx].from = v; saveRules(rs); if (document.body) walkRoot(document.body); }
                    else { renderRules(); }
                });
                // 回车保存
                fromSpan.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        fromSpan.blur();
                    }
                });

                // 替换词列表（可多个，随机生效）
                const tosWrap = document.createElement('div');
                tosWrap.className = 'dsr-replacer-tos';

                function renderTos() {
                    tosWrap.innerHTML = '';
                    const rs = loadRules();
                    if (!Array.isArray(rs[idx].to)) rs[idx].to = [rs[idx].to || ''];
                    const tos = rs[idx].to;
                    if (tos.length === 0) tos.push('');
                    tos.forEach((t, ti) => {
                        const row = document.createElement('div');
                        row.className = 'dsr-replacer-to-row';

                        const arrow = document.createElement('span');
                        arrow.className = 'dsr-replacer-item-arrow';
                        arrow.textContent = '→';

                        const toSpan = document.createElement('span');
                        toSpan.className = 'dsr-replacer-to';
                        toSpan.textContent = t;
                        toSpan.contentEditable = 'true';
                        toSpan.spellcheck = false;
                        toSpan.title = '点击编辑，回车保存';
                        toSpan.addEventListener('blur', () => {
                            const r2 = loadRules();
                            if (!Array.isArray(r2[idx].to)) r2[idx].to = [];
                            r2[idx].to[ti] = toSpan.textContent;
                            saveRules(r2);
                            if (document.body) walkRoot(document.body);
                        });
                        toSpan.addEventListener('keydown', (e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                toSpan.blur();
                            }
                        });

                        const delTo = document.createElement('button');
                        delTo.type = 'button';
                        delTo.className = 'dsr-replacer-del-to';
                        delTo.textContent = '×';
                        delTo.title = '删除这个替换词';
                        delTo.addEventListener('click', (e) => {
                            e.stopPropagation();
                            const r2 = loadRules();
                            if (!Array.isArray(r2[idx].to)) r2[idx].to = [];
                            r2[idx].to.splice(ti, 1);
                            if (r2[idx].to.length === 0) r2[idx].to.push('');
                            saveRules(r2);
                            renderTos();
                            if (document.body) walkRoot(document.body);
                        });

                        row.append(arrow, toSpan, delTo);
                        tosWrap.appendChild(row);
                    });

                    const addTo = document.createElement('button');
                    addTo.type = 'button';
                    addTo.className = 'dsr-replacer-addto';
                    addTo.textContent = '+ 添加替换';
                    addTo.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const r2 = loadRules();
                        if (!Array.isArray(r2[idx].to)) r2[idx].to = [];
                        r2[idx].to.push('');
                        saveRules(r2);
                        renderTos();
                        const rows = tosWrap.querySelectorAll('.dsr-replacer-to');
                        if (rows.length) rows[rows.length - 1].focus();
                    });
                    tosWrap.appendChild(addTo);
                }
                renderTos();

                const del = document.createElement('button');
                del.type = 'button';
                del.className = 'dsr-replacer-item-del';
                del.textContent = '×';
                del.title = '删除规则';
                del.addEventListener('click', (e) => {
                    e.stopPropagation(); // 防止点击后列表重建导致面板误关闭
                    const rs = loadRules();
                    rs.splice(idx, 1);
                    saveRules(rs);
                    renderRules();
                    if (document.body) walkRoot(document.body);
                });

                item.append(enable, fromSpan, tosWrap, del);
                return item;
            }
            renderRules();

            // 用 mousedown 判定点击外部：拖选文字时 mouseup 可能在面板外，
            // 用 click 会误判为点击外部导致面板关闭；mousedown 在面板内按下则不会关闭
            document.addEventListener('mousedown', (e) => {
                if (!root.contains(e.target)) root.classList.remove('open');
            });
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') root.classList.remove('open');
            });
        }

        // ---------- 启动 ----------
        function start() {
            mo.observe(document.body, { childList: true, subtree: true, characterData: true });
            walkRoot(document.body); // 页面现有内容立即应用
            buildUI();
        }
        if (document.body) {
            start();
        } else {
            document.addEventListener('DOMContentLoaded', start, { once: true });
        }
    })();
})();
