// ---- ACESSIBILIDADE – ABNT NBR 17225:2025 ----
// 5.11.2  Contraste aprimorado (alto contraste 7:1)
// 5.12.1  Entrelinhas (mín. 1.5×)
// 5.12.2  Espaçamento entre parágrafos (mín. 2em)
// 5.12.3  Espaçamento entre letras (mín. 0.12em)
// 5.12.4  Espaçamento entre palavras (mín. 0.16em)
// 5.12.7  Texto redimensionado até 200% sem rolagem horizontal

(function () {
  'use strict';

  // ---- VALORES PADRÃO E LIMITES ----
  const DEFAULTS = {
    fontScale:     1.0,
    lineHeight:    1.7,
    paraSpacing:   2.0,
    letterSpacing: 0.12,
    wordSpacing:   0.16,
    highContrast:  false,
  };

  const MIN = { fontScale: 1.0, lineHeight: 1.5, paraSpacing: 2.0, letterSpacing: 0.12, wordSpacing: 0.16 };
  const MAX = { fontScale: 2.0, lineHeight: 3.0, paraSpacing: 4.0, letterSpacing: 0.5,  wordSpacing: 0.8  };

  // ---- ESTADO ----
  let state = loadState();

  function loadState() {
    try {
      const saved = sessionStorage.getItem('a11y_prefs');
      return saved ? { ...DEFAULTS, ...JSON.parse(saved) } : { ...DEFAULTS };
    } catch (_) { return { ...DEFAULTS }; }
  }

  function saveState() {
    try { sessionStorage.setItem('a11y_prefs', JSON.stringify(state)); } catch (_) {}
  }

  // ---- APLICAR CONFIGURAÇÕES ----
  function applyAll() {
    const root = document.documentElement;

    // 5.12.7 escala de fonte
    root.style.fontSize = (state.fontScale * 100) + '%';

    // 5.12.1 entrelinhas
    root.style.setProperty('--line-height-base', state.lineHeight);
    root.style.setProperty('--line-height-text', state.lineHeight);
    root.style.setProperty('--lh',               state.lineHeight);

    // 5.12.2 parágrafos
    root.style.setProperty('--paragraph-spacing', state.paraSpacing + 'em');

    // 5.12.3 letras
    root.style.setProperty('--letter-spacing-base', state.letterSpacing + 'em');
    root.style.setProperty('--ls',                  state.letterSpacing + 'em');

    // 5.12.4 palavras
    root.style.setProperty('--word-spacing-base', state.wordSpacing + 'em');
    root.style.setProperty('--ws',                state.wordSpacing + 'em');

    // 5.11.2 alto contraste
    document.body.classList.toggle('a11y-high-contrast', state.highContrast);

    saveState();
    syncUI();
  }

  // ---- SINCRONIZAR PAINEL ----
  function syncUI() {
    setSlider('a11y-font-scale',     state.fontScale,     v => (v * 100).toFixed(0) + '%');
    setSlider('a11y-line-height',    state.lineHeight,    v => v.toFixed(1) + '×');
    setSlider('a11y-para-spacing',   state.paraSpacing,   v => v.toFixed(1) + 'em');
    setSlider('a11y-letter-spacing', state.letterSpacing, v => v.toFixed(2) + 'em');
    setSlider('a11y-word-spacing',   state.wordSpacing,   v => v.toFixed(2) + 'em');
    const btn = document.getElementById('a11y-contrast-btn');
    if (btn) btn.classList.toggle('active', state.highContrast);
  }

  function setSlider(id, value, fmt) {
    const s = document.getElementById(id);
    const l = document.getElementById(id + '-val');
    if (s) s.value = value;
    if (l) l.textContent = fmt(value);
  }

  // ---- MONTAR PAINEL ----
  function buildPanel() {
    const panel = document.createElement('div');
    panel.id = 'a11y-panel';
    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-label', 'Painel de Acessibilidade');

    panel.innerHTML = `
      <div id="a11y-box" role="dialog" aria-label="Configurações de acessibilidade">
        <h2>♿ Acessibilidade</h2>

        <div class="a11y-group">
          <label>5.11.2 · Contraste</label>
          <div class="a11y-btn-row">
            <button class="a11y-btn" id="a11y-contrast-btn"
              onclick="A11Y.toggleContrast()"
              aria-pressed="${state.highContrast}">◐ Alto Contraste (7:1)</button>
          </div>
        </div>

        <div class="a11y-group">
          <label>5.12.7 · Tamanho do Texto</label>
          <div class="a11y-row">
            <input type="range" id="a11y-font-scale"
              min="${MIN.fontScale}" max="${MAX.fontScale}" step="0.1"
              aria-label="Escala do texto"
              oninput="A11Y.setFontScale(+this.value)">
            <span class="a11y-val" id="a11y-font-scale-val"></span>
          </div>
        </div>

        <div class="a11y-group">
          <label>5.12.1 · Entrelinhas (mín. 1.5×)</label>
          <div class="a11y-row">
            <input type="range" id="a11y-line-height"
              min="${MIN.lineHeight}" max="${MAX.lineHeight}" step="0.1"
              aria-label="Espaçamento entre linhas"
              oninput="A11Y.setLineHeight(+this.value)">
            <span class="a11y-val" id="a11y-line-height-val"></span>
          </div>
        </div>

        <div class="a11y-group">
          <label>5.12.2 · Parágrafos (mín. 2em)</label>
          <div class="a11y-row">
            <input type="range" id="a11y-para-spacing"
              min="${MIN.paraSpacing}" max="${MAX.paraSpacing}" step="0.1"
              aria-label="Espaço entre parágrafos"
              oninput="A11Y.setParaSpacing(+this.value)">
            <span class="a11y-val" id="a11y-para-spacing-val"></span>
          </div>
        </div>

        <div class="a11y-group">
          <label>5.12.3 · Letras (mín. 0.12em)</label>
          <div class="a11y-row">
            <input type="range" id="a11y-letter-spacing"
              min="${MIN.letterSpacing}" max="${MAX.letterSpacing}" step="0.01"
              aria-label="Espaçamento entre letras"
              oninput="A11Y.setLetterSpacing(+this.value)">
            <span class="a11y-val" id="a11y-letter-spacing-val"></span>
          </div>
        </div>

        <div class="a11y-group">
          <label>5.12.4 · Palavras (mín. 0.16em)</label>
          <div class="a11y-row">
            <input type="range" id="a11y-word-spacing"
              min="${MIN.wordSpacing}" max="${MAX.wordSpacing}" step="0.01"
              aria-label="Espaçamento entre palavras"
              oninput="A11Y.setWordSpacing(+this.value)">
            <span class="a11y-val" id="a11y-word-spacing-val"></span>
          </div>
        </div>

        <button class="a11y-reset" onclick="A11Y.reset()">↺ Restaurar Padrões</button>
      </div>

      <button id="a11y-toggle-btn"
        onclick="A11Y.toggle()"
        aria-expanded="false"
        aria-controls="a11y-box">♿ Acessibilidade</button>
    `;

    document.body.appendChild(panel);
    syncUI();
  }

  // ---- API PÚBLICA ----
  window.A11Y = {
    toggle() {
      const box = document.getElementById('a11y-box');
      const btn = document.getElementById('a11y-toggle-btn');
      btn.setAttribute('aria-expanded', box.classList.toggle('open'));
    },
    toggleContrast() {
      state.highContrast = !state.highContrast;
      const btn = document.getElementById('a11y-contrast-btn');
      if (btn) btn.setAttribute('aria-pressed', state.highContrast);
      applyAll();
    },
    setFontScale(v)     { state.fontScale     = Math.min(MAX.fontScale,     Math.max(MIN.fontScale,     v)); applyAll(); },
    setLineHeight(v)    { state.lineHeight     = Math.min(MAX.lineHeight,    Math.max(MIN.lineHeight,    v)); applyAll(); },
    setParaSpacing(v)   { state.paraSpacing    = Math.min(MAX.paraSpacing,   Math.max(MIN.paraSpacing,   v)); applyAll(); },
    setLetterSpacing(v) { state.letterSpacing  = Math.min(MAX.letterSpacing, Math.max(MIN.letterSpacing, v)); applyAll(); },
    setWordSpacing(v)   { state.wordSpacing    = Math.min(MAX.wordSpacing,   Math.max(MIN.wordSpacing,   v)); applyAll(); },
    reset()             { state = { ...DEFAULTS }; applyAll(); },
  };

  // ---- INIT ----
  function init() { buildPanel(); applyAll(); }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }

})();
