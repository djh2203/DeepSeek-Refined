// ==UserScript==
// @name         DeepSeek-Refined
// @namespace    https://github.com/djh2203/DeepSeek-Refined
// @version      2.0
// @description  一个 Tampermonkey 用户脚本，为网页版 DeepSeek Chat (chat.deepseek.com) 注入 Obsidian Border 主题风格的 Markdown 美化样式。通过覆盖 DeepSeek 的 CSS 变量系统，实现深色/浅色模式的全面配色定制。支持粗体、斜体、行内代码、数学公式的颜色自定义；各级标题左侧添加彩色圆角竖条装饰；引用块使用 Border 标志性的点阵图案背景。同时调整消息宽度为 75% 以获得更好的阅读体验。安装后自动跟随系统深浅色模式切换，无需手动配置。配色灵感来源于 Obsidian Border 主题。额外提供文字替换功能：点击右上角 ✎ 按钮可为页面文字配置替换规则，支持一个词对应多个替换词（随机生效）。AI 回复中的中英文括号（()、（）、[]、【】）连同括号内文字统一显示为 #9C9C9C 灰色，代码块与公式区域不受影响；该效果在主题面板底部提供「括号灰色」开关，可与其他主题自由组合开关。
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

    // AI 回复中中英文括号（小括号/中括号）的固定颜色，深浅色模式一致
    const BRACKET_COLOR = '#9C9C9C';

    // 「括号灰色」开关：与主题独立，默认开启
    const BRACKET_GRAY_KEY = 'dsr_bracket_gray';

    function isBracketGray() {
        try {
            const saved = localStorage.getItem(BRACKET_GRAY_KEY);
            if (saved === null) return true;
            return saved === '1';
        } catch (e) {
            return true;
        }
    }

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
            /* 侧边栏背景与页面背景一致 */
            .b8812f16 {
                background-color: ${L.bg} !important;
                background: ${L.bg} !important;
            }
            body[data-ds-dark-theme] .b8812f16 {
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

            /* ========== AI 回复中的中英文括号着色（()（）[]【】），可在主题面板里关闭 ========== */
            ${isBracketGray() ? `
            body .ds-markdown .dsr-bracket {
                color: ${BRACKET_COLOR} !important;
            }` : ''}

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
            /* 主题列表与「括号灰色」开关之间的分隔线 */
            .dsr-theme-divider {
                height: 1px;
                margin: 4px 6px;
                background: currentColor;
                opacity: 0.12;
            }

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

    // 由括号着色模块在初始化时注入，用于切换开关后立即重算
    let refreshBrackets = null;

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
        document.querySelectorAll('.dsr-theme-option[data-theme]').forEach((opt) => {
            opt.classList.toggle('active', opt.dataset.theme === name);
        });
    }

    // 「括号灰色」开关：可与其他主题并选，互不影响
    function setBracketGray(enabled) {
        try {
            localStorage.setItem(BRACKET_GRAY_KEY, enabled ? '1' : '0');
        } catch (e) { /* ignore */ }
        style.textContent = buildCSS(THEMES[getThemeName()]);
        const opt = document.querySelector('.dsr-bracket-option');
        if (opt) opt.classList.toggle('active', enabled);
        if (typeof refreshBrackets === 'function') refreshBrackets();
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

        // 分隔线 + 「括号灰色」开关（与主题独立，可同时选中或都取消）
        const divider = document.createElement('div');
        divider.className = 'dsr-theme-divider';
        menu.appendChild(divider);

        const bracketOpt = document.createElement('div');
        bracketOpt.className = 'dsr-theme-option dsr-bracket-option';
        bracketOpt.title = 'AI 回复中的括号及括号内文字是否显示为 #9C9C9C';
        bracketOpt.innerHTML = '<span>括号灰色</span><span class="dsr-check">✓</span>';
        if (isBracketGray()) bracketOpt.classList.add('active');
        bracketOpt.addEventListener('click', (e) => {
            e.stopPropagation();
            const next = !isBracketGray();
            setBracketGray(next);
            // 不关闭面板，方便和主题一起切换
        });
        menu.appendChild(bracketOpt);

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

    // ========== AI 回复括号着色 ==========
    // 把 .ds-markdown（AI 输出的 Markdown 区域）里成对的中英文小括号 ()、（）、
    // 中英文中括号 []、【】连同括号内的文字一起包进 span.dsr-bracket，
    // 由上面的 CSS 统一染成 #9C9C9C。未配对的括号只染括号本身。
    // 代码块、行内代码、数学公式等区域不处理，避免破坏渲染与复制。
    (function installBracketStyler() {
        'use strict';

        // 中英文小括号 + 中英文中括号
        const BRACKET_RE = /[()（）[\]【】]/;
        const OPENERS = { '(': ')', '（': '）', '[': ']', '【': '】' };
        const CLOSERS = { ')': '(', '）': '（', ']': '[', '】': '【' };
        const SKIP_SELECTOR = 'pre, code, .md-code-block, .md-code-block-banner-wrap, .katex, .katex-display, .ds-markdown-math, .math-inline, .math-block, .dsr-replacer, .ds-copy-toast, textarea, input, script, style';
        // 以块级容器为处理单元：括号配对不跨段落 / 列表项，流式更新时也只重排一小段
        const SCOPE_SELECTOR = 'p, li, h1, h2, h3, h4, h5, h6, blockquote, td, th, dt, dd, figcaption, .ds-markdown';

        // 处理单元：最近的块级容器
        function findScope(el) {
            if (!el || typeof el.closest !== 'function') return null;
            return el.closest(SCOPE_SELECTOR);
        }

        // 收集属于该处理单元的文本节点，拼成整串方便做括号配对
        function collect(scope) {
            const entries = [];
            let text = '';
            const walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT, {
                acceptNode(node) {
                    const p = node.parentElement;
                    if (!p || p.closest(SKIP_SELECTOR)) return NodeFilter.FILTER_REJECT;
                    // 只处理直属本文本单元的文本，嵌套块交给它自己处理
                    if (findScope(p) !== scope) return NodeFilter.FILTER_REJECT;
                    return NodeFilter.FILTER_ACCEPT;
                }
            });
            while (walker.nextNode()) {
                const node = walker.currentNode;
                const value = node.nodeValue;
                if (!value) continue;
                entries.push({ node: node, start: text.length, end: text.length + value.length });
                text += value;
            }
            return { entries: entries, text: text };
        }

        // 括号配对：返回需要着色的区间（含括号本身），未配对的括号只标括号
        function findRanges(text) {
            const stack = [];
            const ranges = [];
            for (let i = 0; i < text.length; i++) {
                const ch = text.charAt(i);
                if (OPENERS[ch]) {
                    stack.push({ ch: ch, index: i });
                } else if (CLOSERS[ch]) {
                    let hit = -1;
                    for (let j = stack.length - 1; j >= 0; j--) {
                        if (stack[j].ch === CLOSERS[ch]) { hit = j; break; }
                    }
                    if (hit === -1) {
                        // 孤立的闭括号
                        ranges.push({ start: i, end: i });
                    } else {
                        ranges.push({ start: stack[hit].index, end: i });
                        stack.splice(hit, 1);
                    }
                }
            }
            // 未闭合的开括号：只给括号本身着色
            stack.forEach((item) => ranges.push({ start: item.index, end: item.index }));

            ranges.sort((a, b) => (a.start - b.start) || (b.end - a.end));
            // 去掉被外层区间完全覆盖的内层区间
            const flat = [];
            let cursor = 0;
            ranges.forEach((r) => {
                if (r.start < cursor) return;
                flat.push(r);
                cursor = r.end + 1;
            });
            return flat;
        }

        // 把文本节点中 [start, end] 这一段包进 span.dsr-bracket
        function wrapInNode(node, start, end) {
            let target = node;
            if (start > 0) target = target.splitText(start);
            const len = end - start + 1;
            if (len < target.nodeValue.length) target.splitText(len);
            const parent = target.parentNode;
            if (!parent) return;
            const span = document.createElement('span');
            span.className = 'dsr-bracket';
            parent.insertBefore(span, target);
            span.appendChild(target);
        }

        // 从右往左应用区间，保证同一文本节点内的偏移效
        function applyRanges(entries, ranges) {
            for (let i = ranges.length - 1; i >= 0; i--) {
                const range = ranges[i];
                for (let k = entries.length - 1; k >= 0; k--) {
                    const entry = entries[k];
                    if (entry.end <= range.start || entry.start > range.end) continue;
                    const start = Math.max(range.start, entry.start) - entry.start;
                    const end = Math.min(range.end, entry.end - 1) - entry.start;
                    wrapInNode(entry.node, start, end);
                }
            }
        }

        // 只还原本处理单元自己生成的 span
        function ownedSpans(scope) {
            return Array.from(scope.querySelectorAll('.dsr-bracket')).filter((span) => {
                return span.parentElement && findScope(span.parentElement) === scope;
            });
        }

        function unwrapAll(scope) {
            ownedSpans(scope).forEach((span) => {
                if (span.isConnected) span.replaceWith(...Array.from(span.childNodes));
            });
        }

        function processScope(scope) {
            if (!scope || !scope.isConnected) return;
            if (scope.closest(SKIP_SELECTOR)) return;
            if (!scope.closest('.ds-markdown')) return;

            // 开关关闭：把已有的括号 span 还原成纯文本
            if (!isBracketGray()) {
                if (ownedSpans(scope).length) unwrapAll(scope);
                scope.__dsrBracketSig = '';
                scope.__dsrBracketSpanCount = 0;
                return;
            }

            const found = collect(scope);
            const text = found.text;

            if (!BRACKET_RE.test(text)) {
                if (ownedSpans(scope).length) unwrapAll(scope);
                scope.__dsrBracketSig = '';
                scope.__dsrBracketSpanCount = 0;
                return;
            }

            // 文字没变、包裹结构也还在 → 直接跳过，避免自己的改动反复触发自身
            const spanCount = ownedSpans(scope).length;
            if (scope.__dsrBracketSig === text && scope.__dsrBracketSpanCount === spanCount) return;

            unwrapAll(scope);
            const fresh = collect(scope);
            if (!fresh.text) return;
            applyRanges(fresh.entries, findRanges(fresh.text));
            scope.__dsrBracketSig = fresh.text;
            scope.__dsrBracketSpanCount = ownedSpans(scope).length;
        }

        // 开关切换后：先接/断监听，再清缓存重算（关闭时会把已有 span 全部还原）
        function refresh() {
            syncObserver();
            document.querySelectorAll('.ds-markdown').forEach((block) => {
                const scopes = [block].concat(Array.from(block.querySelectorAll(SCOPE_SELECTOR)));
                scopes.forEach((scope) => {
                    scope.__dsrBracketSig = null;
                    scope.__dsrBracketSpanCount = -1;
                    processScope(scope);
                });
            });
        }
        refreshBrackets = refresh;

        const pending = new Set();
        let scheduled = false;

        function flush() {
            scheduled = false;
            const items = Array.from(pending);
            pending.clear();
            items.forEach(processScope);
        }

        function schedule() {
            if (scheduled) return;
            scheduled = true;
            // 合并同一帧内的多次流式更新，避免每条 token 都重排 DOM
            requestAnimationFrame(flush);
        }

        // 把发生变化的节点归到它所属的处理单元（新插入的子树则整体扫描一遍）
        function queueScopes(node) {
            if (!node || !node.isConnected) return;
            const el = node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement;
            if (!el || typeof el.closest !== 'function') return;
            const scope = findScope(el);
            if (scope) pending.add(scope);
            if (node.nodeType === Node.ELEMENT_NODE && node.querySelectorAll) {
                node.querySelectorAll(SCOPE_SELECTOR).forEach((s) => pending.add(s));
            }
        }

        const mo = new MutationObserver((records) => {
            let dirty = false;
            for (const r of records) {
                if (r.type === 'characterData') {
                    queueScopes(r.target);
                    dirty = true;
                } else if (r.type === 'childList') {
                    r.addedNodes.forEach((n) => {
                        queueScopes(n);
                        dirty = true;
                    });
                }
            }
            if (dirty && pending.size) schedule();
        });

        const MO_OPTS = { childList: true, subtree: true, characterData: true };

        // 开关关闭时不监听 DOM（否则每次变动都要逐块 querySelectorAll，纯属白做功）
        function syncObserver() {
            if (document.body && isBracketGray()) mo.observe(document.body, MO_OPTS);
            else mo.disconnect();
        }

        function start() {
            syncObserver();
            if (!document.body || !isBracketGray()) return;
            queueScopes(document.body);
            if (pending.size) flush();
        }

        if (document.body) {
            start();
        } else {
            document.addEventListener('DOMContentLoaded', start, { once: true });
        }
    })();

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
            // 不 stopPropagation：那会吞掉 DeepSeek 自己的点击处理
            e.preventDefault();
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
        // 需要排除的区域：脚本自身 UI、输入框、代码/脚本、可编辑区。一次 closest 走完，不必分离多次
        const EXCLUDE_SELECTOR = '.dsr-replacer, .dsr-theme-picker, .ds-copy-toast, script, style, noscript, textarea, input, select, option, [contenteditable="true"]';

        function isExcluded(el) {
            if (!el) return true;
            return typeof el.closest === 'function' && el.closest(EXCLUDE_SELECTOR) !== null;
        }

        // 本脚本自己写过的文本节点内容
        const selfWrites = new WeakMap();

        function applyRulesToTextNode(node, rules, cfg) {
            if (!node || node.nodeType !== Node.TEXT_NODE) return;
            let text = node.nodeValue;
            if (!text) return;
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
                    if (next !== text) text = next;
                } catch (e) { /* 非法正则等，跳过该规则 */ }
            }
            // 只有净结果真的变了才写：多条规则互相抵消时不动 DOM，省掉一次无谓的
            // characterData 变更（MutationObserver 会看到它，还得靠 selfWrites 再挡一次）。
            // selfWrites 用来跳过自己在 MO 里听到的回声，否则替换词含原文本会自我触发
            if (text !== node.nodeValue) { node.nodeValue = text; selfWrites.set(node, text); }
        }

        // 一次解析出当前生效的配置与规则；不生效时返回 null
        function activeRules() {
            const cfg = loadCfg();
            const rules = loadRules().filter((r) => r && r.from && !r.disabled);
            return cfg.enabled && rules.length ? { cfg: cfg, rules: rules } : null;
        }

        function walkRoot(root, state) {
            if (!root) return;
            const s = state || activeRules();
            if (!s) return;
            const cfg = s.cfg;
            const rules = s.rules;

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
        const pending = new Set();
        let queued = false;

        function flush() {
            queued = false;
            if (pending.size === 0) return;
            const s = activeRules();
            if (!s) { pending.clear(); return; }
            const items = Array.from(pending);
            pending.clear();
            items.forEach((root) => walkRoot(root, s));
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
                    if (selfWrites.get(r.target) === r.target.nodeValue) {
                        selfWrites.delete(r.target);
                        continue; // 自己刚写的，不再处理，避免自我循环
                    }
                    pending.add(r.target);
                    needs = true;
                } else if (r.type === 'childList') {
                    r.addedNodes.forEach((n) => { pending.add(n); needs = true; });
                }
            }
            if (needs) scheduleFlush();
        });

        // 功能关闭或没有规则时断开监听，省掉每次 DOM 变动的遍历
        const MO_OPTS = { childList: true, subtree: true, characterData: true };
        function syncObserver() {
            if (document.body && activeRules()) mo.observe(document.body, MO_OPTS);
            else mo.disconnect();
        }
        function refreshAll() {
            syncObserver();
            if (document.body) walkRoot(document.body);
        }

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
                    refreshAll();
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
                refreshAll();
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
                    refreshAll();
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
                    if (v) { rs[idx].from = v; saveRules(rs); refreshAll(); }
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
                            refreshAll();
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
                            refreshAll();
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
                    refreshAll();
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
            syncObserver();
            walkRoot(document.body); // 页面现有内容立即应用
            buildUI();
        }
        if (document.body) {
            start();
        } else {
            document.addEventListener('DOMContentLoaded', start, { once: true });
        }
    })();

    // ====================================================================
    // 自定义背景图模块（自包含，与上游主题/文字替换逻辑完全解耦）
    // --------------------------------------------------------------------
    // 合并指南：本块是整份脚本里唯一与「背景图」有关的代码。上游脚本更新后，
    //   只需把本块原样搬到新版本最外层 IIFE 结束前即可，无需改动任何上游函数。
    // 设计要点：
    //   1. 自有 <style> 元素，不复用主 style —— 主题切换不会冲掉它；
    //   2. UI 直接挂载到已有的 .dsr-theme-menu —— 不修改 createThemePicker；
    //   3. 面板配色一律走 CSS 变量 var(--dsw-alias-*) —— 深浅色自动跟随；
    //   4. 垫底色沿用 body 自身的主题背景（传播到 canvas）—— 不依赖 THEMES。
    // ====================================================================
    (function installBackgroundImage() {
        'use strict';

        const BG_CFG_KEY = 'dsr_bg_image';
        const BG_CFG_DEFAULT = {
            opacity: 100,
            blur: 0,
            fit: 'cover',              // cover / contain / auto / tile
            position: 'center center', // 九宫格位置
            flipX: false,
            flipY: false,
        };

        // 任何要拼进 CSS 的值都必须走白名单，绝不能把 localStorage 里的任意字符串直接塞进样式
        const FIT_VALUES = ['cover', 'contain', 'auto', 'tile'];
        const POSITION_VALUES = [
            'left top', 'center top', 'right top',
            'left center', 'center center', 'right center',
            'left bottom', 'center bottom', 'right bottom',
        ];
        const FIT_LABELS = { cover: '裁切铺满', contain: '完整显示', auto: '原尺寸', tile: '平铺' };
        const POS_LABELS = {
            'left top': '左上', 'center top': '上中', 'right top': '右上',
            'left center': '左中', 'center center': '居中', 'right center': '右中',
            'left bottom': '左下', 'center bottom': '下中', 'right bottom': '右下',
        };

        const LEGACY_BG_KEY = 'dsr_custom_bg';   // 旧版「背景色」用过的键，仅迁移滑块值
        const IDB_NAME = 'dsr_bg_store';
        const IDB_STORE = 'files';
        const IDB_KEY = 'image';
        const BG_HAS_KEY = 'dsr_bg_has_image';

        // 落盘前的体积/边长上限：IndexedDB 比 localStorage 能装，但浏览器仍可能清理，
        // 移动端解码 4K 图也吃内存。超限就先压缩再存（见 normalizeImage）。
        const MAX_STORE_BYTES = 12 * 1024 * 1024;
        const MAX_EDGE = 2560;

        // 当前图片的 objectURL；为空表示「没有自定义背景图，跟随主题」
        let bgImageUrl = '';
        // 图片异步恢复后刷新缩略图/滑块的回调，由 UI 装配时填入
        let bgSyncUI = null;

        function clampNumber(value, min, max, fallback) {
            const n = typeof value === 'number' ? value : Number(value);
            if (!Number.isFinite(n)) return fallback;
            return Math.max(min, Math.min(max, n));
        }

        function pickEnum(value, allowed, fallback) {
            return allowed.indexOf(value) !== -1 ? value : fallback;
        }

        function toBool(value) {
            return value === true || value === 1 || value === '1' || value === 'true';
        }

        // 把任意来源的配置规整成合法值：数值夹紧、枚举走白名单、布尔归一
        function normalizeCfg(src, fromLegacy) {
            const obj = src || {};
            return {
                opacity: clampNumber(fromLegacy ? obj.alpha : obj.opacity, 0, 100, BG_CFG_DEFAULT.opacity),
                blur: clampNumber(obj.blur, 0, 30, BG_CFG_DEFAULT.blur),
                fit: pickEnum(obj.fit, FIT_VALUES, BG_CFG_DEFAULT.fit),
                position: pickEnum(obj.position, POSITION_VALUES, BG_CFG_DEFAULT.position),
                flipX: toBool(obj.flipX),
                flipY: toBool(obj.flipY),
            };
        }

        function getBgCfg() {
            try {
                const raw = localStorage.getItem(BG_CFG_KEY);
                if (raw) return normalizeCfg(JSON.parse(raw), false);
                // 旧版「背景色」只存过 alpha/blur，迁移一次滑块数值，省得用户重调
                const legacyRaw = localStorage.getItem(LEGACY_BG_KEY);
                if (legacyRaw) return normalizeCfg(JSON.parse(legacyRaw), true);
            } catch (e) { /* ignore */ }
            return Object.assign({}, BG_CFG_DEFAULT);
        }

        function saveBgCfg(patch) {
            const next = normalizeCfg(Object.assign(getBgCfg(), patch || {}), false);
            try { localStorage.setItem(BG_CFG_KEY, JSON.stringify(next)); } catch (e) { /* ignore */ }
            return next;
        }

        // ---------- IndexedDB：只存一个 Blob ----------
        function openBgDB() {
            return new Promise((resolve, reject) => {
                let req;
                try { req = indexedDB.open(IDB_NAME, 1); }
                catch (e) { reject(e); return; }
                req.onupgradeneeded = () => {
                    const db = req.result;
                    if (!db.objectStoreNames.contains(IDB_STORE)) db.createObjectStore(IDB_STORE);
                };
                req.onsuccess = () => resolve(req.result);
                req.onerror = () => reject(req.error || new Error('indexedDB open failed'));
            });
        }

        function idbRun(mode, act) {
            return openBgDB().then((db) => new Promise((resolve, reject) => {
                let tx;
                try { tx = db.transaction(IDB_STORE, mode); }
                catch (e) { db.close(); reject(e); return; }
                const store = tx.objectStore(IDB_STORE);
                let result;
                try {
                    const req = act(store);
                    if (req) req.onsuccess = () => { result = req.result; };
                } catch (e) {
                    // act 抛错时事务已创建，显式中止，避免留下一个空提交的事务
                    try { tx.abort(); } catch (e2) { /* ignore */ }
                    db.close();
                    reject(e);
                    return;
                }
                tx.oncomplete = () => { db.close(); resolve(result); };
                // tx.error 可能为 null，reject(null) 会让调用方 catch 到 null，补一个真实 Error
                tx.onerror = () => { db.close(); reject(tx.error || new Error('idb transaction error')); };
                tx.onabort = () => { db.close(); reject(tx.error || new Error('idb transaction aborted')); };
            }));
        }

        function dbGetImage() { return idbRun('readonly', (s) => s.get(IDB_KEY)); }
        function dbPutImage(blob) { return idbRun('readwrite', (s) => s.put(blob, IDB_KEY)); }
        function dbDelImage() { return idbRun('readwrite', (s) => s.delete(IDB_KEY)); }

        function markHasImage(has) {
            try {
                if (has) localStorage.setItem(BG_HAS_KEY, '1');
                else localStorage.removeItem(BG_HAS_KEY);
            } catch (e) { /* ignore */ }
        }

        // 名字直说语义：返回 true 只代表「可能存过图片，值得去 IndexedDB 查一次」，
        // 不代表真的存在。localStorage 读不到（无痕/被禁用）时保守返回 true，
        // 由恢复流程自己去确认；查不到就顺手清掉标记。
        function mayHaveStoredImage() {
            try { return localStorage.getItem(BG_HAS_KEY) === '1'; }
            catch (e) { return true; }
        }

        // 换图时释放旧的 objectURL，否则每换一张漏一份内存
        function setBgImageUrl(url) {
            const old = bgImageUrl;
            bgImageUrl = url || '';
            if (old && old !== bgImageUrl) {
                try { URL.revokeObjectURL(old); } catch (e) { /* ignore */ }
            }
        }

        // 上传图过大/过长时，等比压到 MAX_EDGE 内并优先转 WebP（保留透明），
        // 失败则原样返回。小图完全不处理，无损。
        function normalizeImage(file) {
            if (file.size <= MAX_STORE_BYTES || typeof createImageBitmap !== 'function') {
                return Promise.resolve(file);
            }
            return createImageBitmap(file).then((bmp) => {
                const longest = Math.max(bmp.width, bmp.height);
                const scale = Math.min(1, MAX_EDGE / longest);
                const w = Math.max(1, Math.round(bmp.width * scale));
                const h = Math.max(1, Math.round(bmp.height * scale));
                const canvas = document.createElement('canvas');
                canvas.width = w;
                canvas.height = h;
                const ctx = canvas.getContext('2d');
                if (!ctx) { if (bmp.close) bmp.close(); return file; }
                ctx.drawImage(bmp, 0, 0, w, h);
                if (bmp.close) bmp.close();
                return new Promise((resolve) => {
                    if (typeof canvas.toBlob !== 'function') { resolve(file); return; }
                    canvas.toBlob((blob) => resolve(blob || file), 'image/webp', 0.9);
                });
            }).catch(() => file);
        }

        // ---------- 自有 style：面板样式常驻，图片层只在有图时注入 ----------
        const bgStyle = document.createElement('style');
        bgStyle.id = 'dsr-bg-image-style';
        document.head.appendChild(bgStyle);

        // 缩放模式 -> background-size / repeat
        function sizeDecl(fit) {
            switch (fit) {
                case 'contain': return 'background-size: contain; background-repeat: no-repeat;';
                case 'auto': return 'background-size: auto; background-repeat: no-repeat;';
                case 'tile': return 'background-size: auto; background-repeat: repeat;';
                default: return 'background-size: cover; background-repeat: no-repeat;';
            }
        }

        function buildBgCSS() {
            const cfg = getBgCfg();
            const blur = clampNumber(cfg.blur, 0, 30, 0);
            const opacity = clampNumber(cfg.opacity, 0, 100, 100) / 100;
            const spread = blur > 0 ? Math.ceil(blur * 2 + 6) : 0; // 模糊向外扩散，层要外扩
            const has = !!bgImageUrl;
            const fit = pickEnum(cfg.fit, FIT_VALUES, 'cover');
            const position = pickEnum(cfg.position, POSITION_VALUES, 'center center');

            const transforms = [];
            if (cfg.flipX) transforms.push('scaleX(-1)');
            if (cfg.flipY) transforms.push('scaleY(-1)');
            const transformDecl = transforms.length ? `transform: ${transforms.join(' ')};` : '';

            // 图片层 + 容器让位：仅在有图时生成。
            // body 自身的主题背景色作为垫底（传播到 canvas），半透明图片混到其上，
            // 于是「调低不透明度」= 图片往主题色淡出，而不是往浏览器白底淡出。
            const pictureCSS = has ? `
            html, #root, #root > div,
            .b8812f16,
            body[data-ds-dark-theme] .b8812f16 {
                background: transparent !important;
            }
            body, body[data-ds-dark-theme] {
                --dsw-alias-bg-base: transparent;
                --dsw-alias-bg-layer-1: transparent;
                --dsw-specific-sidebar-fill: transparent;
            }
            body::after {
                content: "";
                position: fixed;
                inset: -${spread}px;
                z-index: -1;
                background-image: url("${bgImageUrl}");
                ${sizeDecl(fit)}
                background-position: ${position};
                ${transformDecl}
                opacity: ${Math.round(opacity * 1000) / 1000};
                filter: blur(${blur}px);
                pointer-events: none;
            }` : '';

            return `
            /* 主题面板增高并可滚动，容纳背景设置区块 */
            .dsr-theme-menu { max-height: 72vh; overflow-y: auto; scrollbar-width: thin; }

            /* ===== 背景设置区块（配色走主题变量，深浅色自动跟随） ===== */
            .dsr-bg-box { display:flex; flex-direction:column; gap:6px; padding:4px 12px 10px; font-size:12px; line-height:1.4; }
            .dsr-bg-title { font-size:11px; letter-spacing:0.04em; opacity:0.5; padding-bottom:2px; }
            .dsr-bg-row { display:flex; align-items:center; gap:8px; white-space:nowrap; }
            .dsr-bg-label { flex:0 0 48px; opacity:0.8; }
            .dsr-bg-thumb { flex:0 0 30px; width:30px; height:22px; border:1px solid var(--dsw-alias-border-l2); border-radius:5px; background-color:var(--dsw-alias-bg-layer-2); background-size:cover; background-position:center; background-repeat:no-repeat; box-sizing:border-box; }
            .dsr-bg-thumb.is-empty { border-style:dashed; opacity:0.6; }
            .dsr-bg-pick, .dsr-bg-reset { padding:2px 8px; border:1px solid var(--dsw-alias-border-l2); border-radius:5px; background:transparent; color:inherit; font-size:11px; line-height:1.7; cursor:pointer; opacity:0.78; white-space:nowrap; }
            .dsr-bg-pick { flex:1; min-width:0; overflow:hidden; text-overflow:ellipsis; }
            .dsr-bg-reset { margin-left:auto; }
            .dsr-bg-pick:hover, .dsr-bg-reset:hover { opacity:1; }
            .dsr-bg-select { flex:1; min-width:0; padding:2px 4px; border:1px solid var(--dsw-alias-border-l2); border-radius:5px; background:transparent; color:inherit; font-size:11px; line-height:1.6; cursor:pointer; }
            .dsr-bg-grid { display:grid; grid-template-columns:repeat(3,16px); grid-template-rows:repeat(3,16px); gap:2px; }
            .dsr-bg-cell { width:16px; height:16px; padding:0; border:1px solid var(--dsw-alias-border-l2); border-radius:3px; background:transparent; cursor:pointer; opacity:0.45; }
            .dsr-bg-cell:hover { opacity:0.8; }
            .dsr-bg-cell.active { opacity:1; outline:1px solid var(--dsw-alias-brand-primary); outline-offset:-1px; }
            .dsr-bg-toggle { padding:2px 6px; border:1px solid var(--dsw-alias-border-l2); border-radius:5px; background:transparent; color:inherit; font-size:11px; line-height:1.7; cursor:pointer; opacity:0.62; }
            .dsr-bg-toggle:hover { opacity:0.9; }
            .dsr-bg-toggle[aria-pressed="true"] { opacity:1; border-color:var(--dsw-alias-brand-primary); color:var(--dsw-alias-brand-primary); }
            .dsr-bg-select[disabled], .dsr-bg-toggle[disabled], .dsr-bg-cell[disabled],
            .dsr-bg-reset[disabled] { cursor:default; opacity:0.35; }
            .dsr-bg-range { flex:1; min-width:56px; accent-color:var(--dsw-alias-brand-primary); cursor:pointer; }
            .dsr-bg-val { flex:0 0 36px; text-align:right; opacity:0.7; font-variant-numeric:tabular-nums; }
            .dsr-bg-note { font-size:11px; line-height:1.4; opacity:0.5; white-space:normal; }
            .dsr-bg-box.is-default .dsr-bg-range { opacity:0.55; }
            .dsr-bg-box.is-default .dsr-bg-val { opacity:0.45; }
            ${pictureCSS}
            `;
        }

        function rebuild() { bgStyle.textContent = buildBgCSS(); }

        // 拖滑块会连续触发，合并成一次刷新；带兜底定时器防 rAF 被后台节流
        let rebuildPending = false;
        function scheduleRebuild() {
            if (rebuildPending) return;
            rebuildPending = true;
            let done = false;
            const run = () => {
                if (done) return;
                done = true; rebuildPending = false; rebuild();
            };
            requestAnimationFrame(run);
            setTimeout(run, 150);
        }

        // ---------- UI：挂载到已有主题面板 ----------
        function mountUI(menu) {
            const divider = document.createElement('div');
            divider.className = 'dsr-theme-divider';
            menu.appendChild(divider);

            const box = document.createElement('div');
            box.className = 'dsr-bg-box';
            const title = document.createElement('div');
            title.className = 'dsr-bg-title';
            title.textContent = '背景图';
            box.appendChild(title);

            const initial = getBgCfg();

            // 选图行：缩略图 + 选择图片 + 移除
            const imgRow = document.createElement('div');
            imgRow.className = 'dsr-bg-row';
            const thumb = document.createElement('div');
            thumb.className = 'dsr-bg-thumb is-empty';
            thumb.title = '当前背景图';
            thumb.setAttribute('role', 'img');
            thumb.setAttribute('aria-label', '未选择背景图');
            const pickBtn = document.createElement('button');
            pickBtn.type = 'button';
            pickBtn.className = 'dsr-bg-pick';
            pickBtn.textContent = '选择图片';
            pickBtn.title = '从本地选一张图作为页面背景';
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*';
            fileInput.style.display = 'none';
            fileInput.setAttribute('aria-hidden', 'true');
            fileInput.tabIndex = -1;
            const resetBtn = document.createElement('button');
            resetBtn.type = 'button';
            resetBtn.className = 'dsr-bg-reset';
            resetBtn.textContent = '移除';
            resetBtn.title = '删除背景图，恢复主题原底色';
            imgRow.append(thumb, pickBtn, resetBtn, fileInput);
            box.appendChild(imgRow);

            // 不透明度行
            const opacityRow = document.createElement('div');
            opacityRow.className = 'dsr-bg-row';
            const opacityLabel = document.createElement('span');
            opacityLabel.className = 'dsr-bg-label';
            opacityLabel.textContent = '不透明度';
            const opacityInput = document.createElement('input');
            opacityInput.type = 'range';
            opacityInput.min = '0';
            opacityInput.max = '100';
            opacityInput.step = '1';
            opacityInput.className = 'dsr-bg-range';
            opacityInput.value = String(initial.opacity);
            opacityInput.title = '背景图的不透明度，越低主题底色透出越多';
            opacityInput.setAttribute('aria-label', '背景图不透明度');
            const opacityVal = document.createElement('span');
            opacityVal.className = 'dsr-bg-val';
            opacityVal.textContent = initial.opacity + '%';
            opacityRow.append(opacityLabel, opacityInput, opacityVal);
            box.appendChild(opacityRow);

            // 模糊行
            const blurRow = document.createElement('div');
            blurRow.className = 'dsr-bg-row';
            const blurLabel = document.createElement('span');
            blurLabel.className = 'dsr-bg-label';
            blurLabel.textContent = '模糊值';
            const blurInput = document.createElement('input');
            blurInput.type = 'range';
            blurInput.min = '0';
            blurInput.max = '30';
            blurInput.step = '1';
            blurInput.className = 'dsr-bg-range';
            blurInput.value = String(initial.blur);
            blurInput.title = '背景图的高斯模糊半径';
            blurInput.setAttribute('aria-label', '背景图模糊值');
            const blurVal = document.createElement('span');
            blurVal.className = 'dsr-bg-val';
            blurVal.textContent = initial.blur + 'px';
            blurRow.append(blurLabel, blurInput, blurVal);
            box.appendChild(blurRow);

            // 缩放模式行
            const fitRow = document.createElement('div');
            fitRow.className = 'dsr-bg-row';
            const fitLabel = document.createElement('span');
            fitLabel.className = 'dsr-bg-label';
            fitLabel.textContent = '缩放';
            const fitSelect = document.createElement('select');
            fitSelect.className = 'dsr-bg-select';
            fitSelect.title = '背景图的铺放方式';
            fitSelect.setAttribute('aria-label', '背景图缩放模式');
            FIT_VALUES.forEach((v) => {
                const opt = document.createElement('option');
                opt.value = v;
                opt.textContent = FIT_LABELS[v];
                fitSelect.appendChild(opt);
            });
            fitSelect.value = initial.fit;
            fitRow.append(fitLabel, fitSelect);
            box.appendChild(fitRow);

            // 位置行：九宫格 + 两个翻转开关
            const posRow = document.createElement('div');
            posRow.className = 'dsr-bg-row';
            const posLabel = document.createElement('span');
            posLabel.className = 'dsr-bg-label';
            posLabel.textContent = '位置';
            const grid = document.createElement('div');
            grid.className = 'dsr-bg-grid';
            const posButtons = POSITION_VALUES.map((pos) => {
                const b = document.createElement('button');
                b.type = 'button';
                b.className = 'dsr-bg-cell';
                b.dataset.pos = pos;
                b.title = POS_LABELS[pos];
                b.setAttribute('aria-label', '背景位置：' + POS_LABELS[pos]);
                grid.appendChild(b);
                return b;
            });
            const flipXBtn = document.createElement('button');
            flipXBtn.type = 'button';
            flipXBtn.className = 'dsr-bg-toggle';
            flipXBtn.textContent = '水平翻转';
            flipXBtn.title = '水平翻转';
            flipXBtn.setAttribute('aria-pressed', 'false');
            const flipYBtn = document.createElement('button');
            flipYBtn.type = 'button';
            flipYBtn.className = 'dsr-bg-toggle';
            flipYBtn.textContent = '垂直翻转';
            flipYBtn.title = '垂直翻转';
            flipYBtn.setAttribute('aria-pressed', 'false');
            posRow.append(posLabel, grid, flipXBtn, flipYBtn);
            box.appendChild(posRow);

            const note = document.createElement('div');
            note.className = 'dsr-bg-note';
            box.appendChild(note);
            menu.appendChild(box);

            // 面板内交互全部落在 box 里：这里统一止住冒泡，避免被 document 判成「点击外部」而收起。
            // 用委托而不是逐个控件挂，才能覆盖之后新增的 select / 九宫格 / 翻转按钮。
            ['click', 'mousedown', 'pointerdown', 'touchstart'].forEach((type) => {
                box.addEventListener(type, (e) => e.stopPropagation());
            });

            function syncUI() {
                const cfg = getBgCfg();
                const has = !!bgImageUrl;
                box.classList.toggle('is-default', !has);
                thumb.classList.toggle('is-empty', !has);
                thumb.style.backgroundImage = has ? `url("${bgImageUrl}")` : '';
                thumb.setAttribute('aria-label', has ? '当前背景图缩略图' : '未选择背景图');
                opacityInput.value = String(cfg.opacity);
                opacityVal.textContent = Math.round(cfg.opacity) + '%';
                blurInput.value = String(cfg.blur);
                blurVal.textContent = Math.round(cfg.blur) + 'px';
                fitSelect.value = cfg.fit;
                posButtons.forEach((b) => b.classList.toggle('active', b.dataset.pos === cfg.position));
                flipXBtn.setAttribute('aria-pressed', cfg.flipX ? 'true' : 'false');
                flipYBtn.setAttribute('aria-pressed', cfg.flipY ? 'true' : 'false');
                // 没图时这些选项无意义，直接禁用（视觉变淡 + 真正不可聚焦）
                fitSelect.disabled = !has;
                posButtons.forEach((b) => { b.disabled = !has; });
                flipXBtn.disabled = !has;
                flipYBtn.disabled = !has;
                resetBtn.disabled = !has;
                note.textContent = has
                    ? '当前：' + FIT_LABELS[cfg.fit] + '；不透明度越低主题底色透出越多'
                    : '未选图片时背景跟随主题，支持 jpg / png / webp / gif';
            }
            bgSyncUI = syncUI;
            syncUI();

            opacityInput.addEventListener('input', () => {
                opacityVal.textContent = opacityInput.value + '%';
                saveBgCfg({ opacity: Number(opacityInput.value) });
                scheduleRebuild();
            });
            blurInput.addEventListener('input', () => {
                blurVal.textContent = blurInput.value + 'px';
                saveBgCfg({ blur: Number(blurInput.value) });
                scheduleRebuild();
            });
            fitSelect.addEventListener('change', () => {
                saveBgCfg({ fit: fitSelect.value });
                syncUI();
                rebuild();
            });
            posButtons.forEach((b) => b.addEventListener('click', (e) => {
                e.stopPropagation();
                if (!bgImageUrl) return;
                saveBgCfg({ position: b.dataset.pos });
                syncUI();
                rebuild();
            }));
            flipXBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (!bgImageUrl) return;
                saveBgCfg({ flipX: !getBgCfg().flipX });
                syncUI();
                rebuild();
            });
            flipYBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (!bgImageUrl) return;
                saveBgCfg({ flipY: !getBgCfg().flipY });
                syncUI();
                rebuild();
            });
            pickBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                fileInput.click();
            });
            fileInput.addEventListener('change', () => {
                const file = fileInput.files && fileInput.files[0];
                fileInput.value = '';
                if (!file) return;
                if (!/^image\//.test(file.type)) {
                    note.textContent = '只支持图片文件（jpg / png / webp / gif）';
                    return;
                }
                // 先立即上图（原图 objectURL，零等待），再异步压缩落盘
                setBgImageUrl(URL.createObjectURL(file));
                syncUI();
                rebuild();

                const oversized = file.size > MAX_STORE_BYTES;
                if (oversized) note.textContent = '图片较大，正在压缩后保存…';

                normalizeImage(file).then((blob) => dbPutImage(blob).then(() => blob)).then((blob) => {
                    markHasImage(true);
                    note.textContent = (blob !== file)
                        ? '已压缩到 ' + Math.round(blob.size / 1024) + ' KB 并保存，下次打开自动恢复'
                        : '已保存到本地，下次打开自动恢复';
                }).catch(() => {
                    note.textContent = '图片仅本次会话有效：浏览器存储写入失败';
                });
            });
            resetBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                dbDelImage().catch(() => { /* ignore */ });
                markHasImage(false);
                setBgImageUrl('');
                syncUI();
                rebuild();
            });
        }

        // 主题面板在本模块之前已由 createThemePicker 建好；加轮询兜底防时序变化
        let mountTries = 0;
        (function tryMount() {
            const menu = document.querySelector('.dsr-theme-menu');
            if (menu) {
                mountUI(menu);
            } else if (mountTries++ < 40) {
                setTimeout(tryMount, 50);
            }
        })();

        rebuild();

        // 首帧后从 IndexedDB 恢复图片（异步，读完重建一次样式与 UI）
        (function restoreBgImage() {
            if (!mayHaveStoredImage()) return;
            try {
                dbGetImage().then((blob) => {
                    if (!blob) { markHasImage(false); return; }
                    setBgImageUrl(URL.createObjectURL(blob));
                    rebuild();
                    if (typeof bgSyncUI === 'function') bgSyncUI();
                }).catch(() => { /* 无痕模式等场景 IndexedDB 不可用，静默降级为跟随主题 */ });
            } catch (e) { /* ignore */ }
        })();
    })();


})();
