/**
 * ============================================================================
 * DSH Refined
 * ============================================================================
 * DeepSeek-Refined 的 DeepSeek Harness 移植版 —— 一个动态 Cordis 插件。
 *
 * 将网页版 DeepSeek 的 Tampermonkey 美化脚本移植到 DeepSeek Harness 前端：
 *   - 5 套 Obsidian Border 风格主题（Border / Nord / Twilight / GitHub / Atom One）
 *   - 通过 DSH 的 theme.overrideTokens() 覆盖 --dsw-alias-* 设计令牌（与网页版
 *     同一套变量名），深色/浅色自动跟随系统
 *   - Markdown 美化：标题彩色圆角竖条、引用块点阵图案背景、粗体/斜体/行内代码/
 *     KaTeX 公式配色
 *   - 会话头部右侧主题切换按钮，选择保存在 Host 进程内（页面刷新后保持）
 *
 * 安装方法（DSH 动态 Cordis 插件）：
 *   1. 新建插件（idPrefix 建议 dsrf）
 *   2. code.host   填入下方「HOST」段内容
 *   3. code.client 填入下方「CLIENT」段内容
 *   4. 运行即可；主题立即生效，无需重启 DSH
 *
 * 与 Tampermonkey 原版（../main.js）的差异：
 *   - 选择器适配：DSH 的 Markdown 容器是 CSS Modules 哈希类名，使用
 *     [class*="_markdown_"] 前缀匹配，避免依赖具体哈希
 *   - 深色模式钩子相同：body[data-ds-dark-theme]
 *   - 未移植：行内代码点击复制（依赖页面全局 document）、消息宽度 75%、
 *     表格宽度 70%（DSH 自带自适应布局，强行收窄会破坏版面）
 * ============================================================================
 */

/* ============================================================================
 * HOST 段 —— 填入动态插件的 code.host
 * 作用：主题选择持久化。保存在 Host 进程内，页面刷新后客户端可恢复；
 *       Host 进程重启后回到默认主题（动态插件本身即进程级临时扩展）。
 * ==========================================================================*/
return {
  apply(ctx) {
    // 主题选择持久化：保存在 Host 进程内，页面刷新后仍可恢复（Host 重启后回到默认）。
    let savedTheme = null
    harness.handle('dsr-state', async (args) => {
      const op = args && args.op
      if (op === 'get') {
        return { theme: savedTheme }
      }
      if (op === 'set') {
        if (args && typeof args.theme === 'string') savedTheme = args.theme
        return { ok: true }
      }
      return { ok: false }
    })
  },
}

/* ============================================================================
 * CLIENT 段 —— 填入动态插件的 code.client
 * ==========================================================================*/
return {
  async apply(ctx) {
    // ============ 主题调色板（移植自 DeepSeek-Refined） ============
    const THEMES = {
      'Border': {
        light: {
          bg: '#F9F6F4', bgBase: '#F9F6F4', bgLayer2: '#F2E0E4', bgLayer3: '#EBE4F0',
          labelPrimary: '#4A4348', labelSecondary: '#8B7F88', labelTertiary: '#A9A0A6', labelCaption: '#8B7F88',
          brandPrimary: '#793f82', brandText: '#9B7AA0',
          borderL1: 'rgba(74, 67, 72, 0.06)', borderL2: 'rgba(74, 67, 72, 0.10)', borderL3: 'rgba(74, 67, 72, 0.14)',
          inlineCodeBg: '#F2E0E4', codeBlockBg: '#FEFBF5', codeBannerBg: '#F7F0E3',
          strong: 'hsl(350, 80%, 55%)', em: 'hsl(28, 80%, 50%)', math: '#1a6fb5', inlineCodeText: '#dd1399',
          heading: ['#bd5151', '#c77b23', '#478f14', '#0585a8', '#726293', '#127d52'],
          blockquoteDot: '000000', toastBg: '#fff', toastText: '#333',
        },
        dark: {
          bg: '#27282e', bgBase: '#27282e', bgLayer1: '#27282e', bgLayer2: '#2d2e34', bgLayer3: '#32333a',
          labelPrimary: 'hsl(232, 6%, 88%)', labelSecondary: 'hsl(232, 9%, 64%)', labelTertiary: 'hsl(232, 12%, 48%)', labelCaption: 'hsl(232, 9%, 56%)',
          brandPrimary: 'hsl(232, 70%, 65%)', brandText: 'hsl(232, 70%, 70%)',
          borderL1: 'rgba(255, 255, 255, 0.06)', borderL2: 'rgba(255, 255, 255, 0.10)', borderL3: 'rgba(255, 255, 255, 0.14)',
          inlineCodeBg: '#2d2e34', codeBlockBg: '#2d2e34', codeBannerBg: '#32333a',
          strong: '#ff7881', em: '#fbbb83', math: '#8dd3f6', inlineCodeText: '#f2b6de',
          heading: ['#d18989', '#cea38d', '#93c89c', '#7eb8f1', '#bab3ef', '#7ec8c5'],
          blockquoteDot: 'ffffff', toastBg: '#2d2e34', toastText: '#e0e0e0',
        },
      },
      'Nord': {
        light: {
          bg: '#ECEFF4', bgBase: '#ECEFF4', bgLayer2: '#E5E9F0', bgLayer3: '#D8DEE9',
          labelPrimary: '#2E3440', labelSecondary: '#4C566A', labelTertiary: '#7B88A1', labelCaption: '#4C566A',
          brandPrimary: '#5E81AC', brandText: '#5E81AC',
          borderL1: 'rgba(46, 52, 64, 0.06)', borderL2: 'rgba(46, 52, 64, 0.10)', borderL3: 'rgba(46, 52, 64, 0.14)',
          inlineCodeBg: '#E5E9F0', codeBlockBg: '#FFFFFF', codeBannerBg: '#D8DEE9',
          strong: '#BF616A', em: '#D08770', math: '#5E81AC', inlineCodeText: '#5E81AC',
          heading: ['#BF616A', '#D08770', '#A88B3F', '#7FA46B', '#5E81AC', '#8E6F9E'],
          blockquoteDot: '000000', toastBg: '#FFFFFF', toastText: '#2E3440',
        },
        dark: {
          bg: '#2E3440', bgBase: '#2E3440', bgLayer1: '#2E3440', bgLayer2: '#3B4252', bgLayer3: '#434C5E',
          labelPrimary: '#ECEFF4', labelSecondary: '#D8DEE9', labelTertiary: '#7B88A1', labelCaption: '#D8DEE9',
          brandPrimary: '#88C0D0', brandText: '#88C0D0',
          borderL1: 'rgba(216, 222, 233, 0.06)', borderL2: 'rgba(216, 222, 233, 0.10)', borderL3: 'rgba(216, 222, 233, 0.14)',
          inlineCodeBg: '#434C5E', codeBlockBg: '#3B4252', codeBannerBg: '#434C5E',
          strong: '#BF616A', em: '#D08770', math: '#88C0D0', inlineCodeText: '#8FBCBB',
          heading: ['#BF616A', '#D08770', '#EBCB8B', '#A3BE8C', '#88C0D0', '#B48EAD'],
          blockquoteDot: 'ffffff', toastBg: '#3B4252', toastText: '#ECEFF4',
        },
      },
      'Twilight': {
        light: {
          bg: '#F7F3FB', bgBase: '#F7F3FB', bgLayer2: '#EDE4F5', bgLayer3: '#E3D4EF',
          labelPrimary: '#3D2E4F', labelSecondary: '#6E5C82', labelTertiary: '#9C8AB0', labelCaption: '#6E5C82',
          brandPrimary: '#8B5CF6', brandText: '#7C3AED',
          borderL1: 'rgba(61, 46, 79, 0.06)', borderL2: 'rgba(61, 46, 79, 0.10)', borderL3: 'rgba(61, 46, 79, 0.14)',
          inlineCodeBg: '#EDE4F5', codeBlockBg: '#FFFFFF', codeBannerBg: '#EDE4F5',
          strong: '#DB2777', em: '#D97706', math: '#6D28D9', inlineCodeText: '#8B5CF6',
          heading: ['#DB2777', '#D97706', '#A16207', '#059669', '#2563EB', '#7C3AED'],
          blockquoteDot: '000000', toastBg: '#FFFFFF', toastText: '#3D2E4F',
        },
        dark: {
          bg: '#1A1124', bgBase: '#1A1124', bgLayer1: '#1A1124', bgLayer2: '#241736', bgLayer3: '#2E1F44',
          labelPrimary: '#EDE4F5', labelSecondary: '#B9A6CC', labelTertiary: '#7E6C96', labelCaption: '#A894BC',
          brandPrimary: '#C084FC', brandText: '#D3A9FF',
          borderL1: 'rgba(237, 228, 245, 0.06)', borderL2: 'rgba(237, 228, 245, 0.10)', borderL3: 'rgba(237, 228, 245, 0.14)',
          inlineCodeBg: '#2E1F44', codeBlockBg: '#241736', codeBannerBg: '#2E1F44',
          strong: '#FF79C6', em: '#FFD866', math: '#82AAFF', inlineCodeText: '#C084FC',
          heading: ['#FF79C6', '#FFB86C', '#F1FA8C', '#50FA7B', '#8BE9FD', '#BD93F9'],
          blockquoteDot: 'ffffff', toastBg: '#241736', toastText: '#EDE4F5',
        },
      },
      'GitHub': {
        light: {
          bg: '#FFFFFF', bgBase: '#FFFFFF', bgLayer2: '#F6F8FA', bgLayer3: '#EFF3F6',
          labelPrimary: '#1F2328', labelSecondary: '#59636E', labelTertiary: '#8D959E', labelCaption: '#59636E',
          brandPrimary: '#0969DA', brandText: '#0969DA',
          borderL1: 'rgba(31, 35, 40, 0.06)', borderL2: 'rgba(31, 35, 40, 0.10)', borderL3: 'rgba(31, 35, 40, 0.14)',
          inlineCodeBg: '#EFF1F3', codeBlockBg: '#F6F8FA', codeBannerBg: '#EFF3F6',
          strong: '#CF222E', em: '#9A6700', math: '#8250DF', inlineCodeText: '#8250DF',
          heading: ['#CF222E', '#BC4C00', '#1A7F37', '#0969DA', '#8250DF', '#1F2328'],
          blockquoteDot: '000000', toastBg: '#FFFFFF', toastText: '#1F2328',
        },
        dark: {
          bg: '#0D1117', bgBase: '#0D1117', bgLayer1: '#0D1117', bgLayer2: '#161B22', bgLayer3: '#21262D',
          labelPrimary: '#E6EDF3', labelSecondary: '#9198A1', labelTertiary: '#7D8590', labelCaption: '#9198A1',
          brandPrimary: '#4493F8', brandText: '#4493F8',
          borderL1: 'rgba(230, 237, 243, 0.06)', borderL2: 'rgba(230, 237, 243, 0.10)', borderL3: 'rgba(230, 237, 243, 0.14)',
          inlineCodeBg: '#21262D', codeBlockBg: '#161B22', codeBannerBg: '#21262D',
          strong: '#FF7B72', em: '#D29922', math: '#A371F7', inlineCodeText: '#79C0FF',
          heading: ['#FF7B72', '#FFA657', '#7EE787', '#79C0FF', '#A371F7', '#9198A1'],
          blockquoteDot: 'ffffff', toastBg: '#21262D', toastText: '#E6EDF3',
        },
      },
      'Atom One': {
        light: {
          bg: '#FAFAFA', bgBase: '#FAFAFA', bgLayer2: '#F0F0F1', bgLayer3: '#E5E5E6',
          labelPrimary: '#383A42', labelSecondary: '#696C77', labelTertiary: '#A0A1A7', labelCaption: '#696C77',
          brandPrimary: '#4078F2', brandText: '#4078F2',
          borderL1: 'rgba(56, 58, 66, 0.06)', borderL2: 'rgba(56, 58, 66, 0.10)', borderL3: 'rgba(56, 58, 66, 0.14)',
          inlineCodeBg: '#F0F0F1', codeBlockBg: '#F5F5F6', codeBannerBg: '#E8E8EA',
          strong: '#E45649', em: '#C18401', math: '#4078F2', inlineCodeText: '#A626A4',
          heading: ['#E45649', '#C18401', '#986801', '#50A14F', '#4078F2', '#A626A4'],
          blockquoteDot: '000000', toastBg: '#FFFFFF', toastText: '#383A42',
        },
        dark: {
          bg: '#282C34', bgBase: '#282C34', bgLayer1: '#282C34', bgLayer2: '#2C313A', bgLayer3: '#353B45',
          labelPrimary: '#ABB2BF', labelSecondary: '#7F848E', labelTertiary: '#5C6370', labelCaption: '#7F848E',
          brandPrimary: '#61AFEF', brandText: '#61AFEF',
          borderL1: 'rgba(171, 178, 191, 0.06)', borderL2: 'rgba(171, 178, 191, 0.10)', borderL3: 'rgba(171, 178, 191, 0.14)',
          inlineCodeBg: '#353B45', codeBlockBg: '#21252B', codeBannerBg: '#2C313A',
          strong: '#E06C75', em: '#D19A66', math: '#61AFEF', inlineCodeText: '#98C379',
          heading: ['#E06C75', '#D19A66', '#E5C07B', '#98C379', '#61AFEF', '#C678DD'],
          blockquoteDot: 'ffffff', toastBg: '#2C313A', toastText: '#ABB2BF',
        },
      },
    }

    // ============ 由调色板生成主题 token 覆盖层（写入 body 内联样式） ============
    function buildTokens(p) {
      const L = p.light
      const D = p.dark
      return {
        '--dsw-alias-bg-base': { light: L.bgBase, dark: D.bgBase },
        '--dsw-alias-bg-layer-1': { light: L.bgLayer1 || L.bgBase, dark: D.bgLayer1 || D.bgBase },
        '--dsw-alias-bg-layer-2': { light: L.bgLayer2, dark: D.bgLayer2 },
        '--dsw-alias-bg-layer-3': { light: L.bgLayer3, dark: D.bgLayer3 },
        '--dsw-alias-bg-overlay': { light: L.toastBg, dark: D.toastBg },
        '--dsw-alias-border-l1': { light: L.borderL1, dark: D.borderL1 },
        '--dsw-alias-border-l2': { light: L.borderL2, dark: D.borderL2 },
        '--dsw-alias-brand-primary': { light: L.brandPrimary, dark: D.brandPrimary },
        '--dsw-alias-label-primary': { light: L.labelPrimary, dark: D.labelPrimary },
        '--dsw-alias-label-secondary': { light: L.labelSecondary, dark: D.labelSecondary },
        '--dsw-alias-label-tertiary': { light: L.labelTertiary, dark: D.labelTertiary },
        '--dsw-alias-label-caption': { light: L.labelCaption, dark: D.labelCaption },
        '--dsw-alias-markdown-inline-code': { light: L.inlineCodeBg, dark: D.inlineCodeBg },
        '--dsw-alias-markdown-code-block': { light: L.codeBlockBg, dark: D.codeBlockBg },
        '--dsw-alias-markdown-code-block-banner': { light: L.codeBannerBg, dark: D.codeBannerBg },
        '--dsw-specific-sidebar-fill': { light: L.bg, dark: D.bg },
        '--dsw-specific-bubble': { light: L.bgLayer2, dark: D.bgLayer2 },
      }
    }

    // ============ 由调色板生成 Markdown 美化 CSS ============
    function buildCss(p) {
      const L = p.light
      const D = p.dark
      const md = '[class*="_markdown_"]'
      return `
        /* 标题左侧彩色圆角竖条 */
        ${md} :where(h1,h2,h3,h4,h5,h6) {
          border-left: none !important;
          padding-left: 16px !important;
          position: relative;
        }
        ${md} :where(h1,h2,h3,h4,h5,h6)::before {
          content: "";
          position: absolute;
          left: 0;
          top: 4px;
          bottom: 4px;
          width: 4px;
          border-radius: 4px;
        }
        ${md} h1::before { background: ${L.heading[0]}; }
        ${md} h2::before { background: ${L.heading[1]}; }
        ${md} h3::before { background: ${L.heading[2]}; }
        ${md} h4::before { background: ${L.heading[3]}; }
        ${md} h5::before { background: ${L.heading[4]}; }
        ${md} h6::before { background: ${L.heading[5]}; }
        body[data-ds-dark-theme] ${md} h1::before { background: ${D.heading[0]}; }
        body[data-ds-dark-theme] ${md} h2::before { background: ${D.heading[1]}; }
        body[data-ds-dark-theme] ${md} h3::before { background: ${D.heading[2]}; }
        body[data-ds-dark-theme] ${md} h4::before { background: ${D.heading[3]}; }
        body[data-ds-dark-theme] ${md} h5::before { background: ${D.heading[4]}; }
        body[data-ds-dark-theme] ${md} h6::before { background: ${D.heading[5]}; }

        /* 粗体 / 斜体 */
        ${md} strong { color: ${L.strong} !important; }
        body[data-ds-dark-theme] ${md} strong { color: ${D.strong} !important; }
        ${md} em { color: ${L.em} !important; }
        body[data-ds-dark-theme] ${md} em { color: ${D.em} !important; }

        /* 数学公式（KaTeX） */
        ${md} .katex, ${md} .katex * { color: ${L.math} !important; }
        body[data-ds-dark-theme] ${md} .katex, body[data-ds-dark-theme] ${md} .katex * { color: ${D.math} !important; }

        /* 行内代码文字颜色 */
        ${md} :not(pre)>code { color: ${L.inlineCodeText} !important; }
        body[data-ds-dark-theme] ${md} :not(pre)>code { color: ${D.inlineCodeText} !important; }

        /* 引用块：Border 点阵图案背景 + 圆角竖条 */
        ${md} blockquote {
          border-left: none !important;
          border-radius: 6px;
          position: relative;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%23${L.blockquoteDot}' fill-opacity='0.12' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E");
        }
        body[data-ds-dark-theme] ${md} blockquote {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%23${D.blockquoteDot}' fill-opacity='0.12' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E");
        }
        ${md} blockquote blockquote { background-image: none !important; }
        ${md} blockquote::before {
          content: "";
          position: absolute;
          left: 0;
          top: 8px;
          bottom: 8px;
          width: 4px;
          border-radius: 4px;
          background: var(--dsw-alias-brand-primary);
        }
      `
    }

    // ============ 主题切换按钮（会话头部右侧） ============
    function ThemePicker(props) {
      const [open, setOpen] = React.useState(false)
      const [name, setName] = React.useState(props.initial)
      const [scheme, setScheme] = React.useState(props.initialScheme)

      React.useEffect(() => {
        return props.ctx.on('theme/change', (snapshot) => {
          setScheme(snapshot.active.colorScheme)
        })
      }, [])

      const names = Object.keys(props.themes)
      const pal = props.themes[name][scheme]

      const optionStyle = (n) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
        padding: '8px 12px',
        borderRadius: 6,
        fontSize: 13,
        lineHeight: 1.4,
        cursor: 'pointer',
        color: n === name ? pal.brandPrimary : pal.labelPrimary,
        fontWeight: n === name ? 600 : 400,
      })

      return React.createElement('div', { style: { position: 'relative' } },
        React.createElement('button', {
          type: 'button',
          title: '切换主题',
          'aria-label': '切换主题',
          'aria-expanded': open,
          onClick: () => setOpen(!open),
          style: {
            width: 32,
            height: 32,
            border: '1px solid ' + pal.borderL2,
            borderRadius: 8,
            background: 'transparent',
            color: pal.labelSecondary,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          },
        },
          React.createElement('svg', { viewBox: '0 0 24 24', fill: 'currentColor', width: 18, height: 18 },
            React.createElement('circle', { cx: 12, cy: 12, r: 3 }),
            React.createElement('circle', { cx: 12, cy: 5, r: 1.7 }),
            React.createElement('circle', { cx: 19, cy: 9, r: 1.7 }),
            React.createElement('circle', { cx: 17, cy: 18, r: 1.7 }),
            React.createElement('circle', { cx: 7, cy: 18, r: 1.7 }),
            React.createElement('circle', { cx: 5, cy: 9, r: 1.7 }),
          ),
        ),
        open && React.createElement('div', {
          onClick: () => setOpen(false),
          style: { position: 'fixed', inset: 0, zIndex: 40 },
        }),
        open && React.createElement('div', {
          style: {
            position: 'absolute',
            top: 'calc(100% + 6px)',
            right: 0,
            minWidth: 150,
            padding: 4,
            borderRadius: 10,
            background: pal.toastBg,
            color: pal.labelPrimary,
            border: '1px solid ' + pal.borderL2,
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
            zIndex: 50,
          },
        },
          names.map((n) => React.createElement('div', {
            key: n,
            onClick: () => { props.onPick(n); setName(n); setOpen(false) },
            style: optionStyle(n),
          },
            React.createElement('span', null, n),
            React.createElement('span', { style: { visibility: n === name ? 'visible' : 'hidden' } }, '✓'),
          )),
        ),
      )
    }

    // ============ 激活 ============
    const theme = ctx.get('theme')
    if (theme === undefined) return
    const slots = ctx.get('slots')

    let tokenDisposer = null
    let cssDisposer = null
    let current = 'Border'
    let applied = false

    function applyTheme(name) {
      if (!THEMES[name]) return
      if (applied && name === current) return
      current = name
      if (tokenDisposer) { tokenDisposer(); tokenDisposer = null }
      if (cssDisposer) { cssDisposer(); cssDisposer = null }
      tokenDisposer = theme.overrideTokens('dsh-refined', buildTokens(THEMES[name]))
      cssDisposer = styles.insert(buildCss(THEMES[name]))
      applied = true
      host.call('dsr-state', { op: 'set', theme: name }).catch(() => {})
    }

    let initial = 'Border'
    try {
      const saved = await host.call('dsr-state', { op: 'get' })
      if (saved && saved.theme && THEMES[saved.theme]) initial = saved.theme
    } catch (e) { /* Host 不可用时使用默认主题 */ }
    applyTheme(initial)

    if (slots === undefined) return
    slots.inject('conversation.session.header.utilities', () => slots.register(
      { name: 'conversation.session.header.utilities', id: 'dsh-refined-picker', order: 100 },
      (props) => React.createElement(ThemePicker, {
        ctx: ctx,
        themes: THEMES,
        initial: initial,
        initialScheme: theme.getTheme().active.colorScheme,
        onPick: applyTheme,
      }),
    ))
  },
}
