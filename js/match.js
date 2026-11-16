// "LIGHTS OUT" — memory match against a rising dread meter. Miss, and it gets closer. Fill the meter and it finds you.
const Match = (function () {
  const WAVES = [
    { pairs: 6, cols: 4, rate: 1.1, peek: 2200, name: 'The Basement' },
    { pairs: 8, cols: 4, rate: 1.3, peek: 2400, name: 'The Woods' },
    { pairs: 10, cols: 5, rate: 1.5, peek: 2600, name: 'The Lab', swap: 1 },
    { pairs: 12, cols: 6, rate: 1.6, peek: 2800, name: 'The Tunnels', swap: 1, dark: 1 },
    { pairs: 15, cols: 6, rate: 1.7, peek: 3200, name: 'The Upside Down', swap: 1, dark: 1, flip: 1 }
  ];
  const TITLES = ['The One It Could Not Catch', 'Keeper of the Christmas Lights', 'Human Polaroid', 'Nerves of Steel, Hands of Lightning', 'Lab Test Subject (Gifted)',
    'Librarian of the Upside Down', 'Last One Standing', 'Photographic Memory, Byers Grade', 'Flicker Whisperer', 'Fastest Hands in Hawkins'];
  const DEATHS = ['It found you.', 'You looked away for one second.', 'The lights went out. All of them.', 'It was behind you the whole time.', 'You were so close.'];
  let W, cards, open, lock, left, dread, score, combo, best, over, eyes, bar, grid;

  async function start() {
    Synth.start('match'); W = 0; score = 0; screen();
    await banner(`<div class="sub">do not let the meter fill</div><h1 class="neon flick" style="font-size:clamp(40px,10vw,96px)">Lights Out</h1>
      <div class="say">You get a quick look at the cards. Then they turn over.<br>Every second it gets closer. Every miss, closer still.<br>Matches drive it back. Chains of matches drive it back further.</div><div class="sub blink">tap to start</div>`);
    wave();
  }
  function hud() { bar.firstChild.style.width = Math.min(100, dread) + '%'; eyes.style.opacity = Math.max(0, (dread - 45) / 55); }
  function wave() {
    const lv = WAVES[W], st = screen('play dread');
    const icons = shuffle(Art.cardSet).slice(0, lv.pairs);
    cards = shuffle(icons.concat(icons).map((ic, i) => ({ ic, flip: lv.flip && i >= icons.length })));
    open = []; lock = true; left = lv.pairs; dread = Math.max(0, (dread || 0) - 40); if (W === 0) dread = 0; combo = 0; over = false;
    const rows = Math.ceil(cards.length / lv.cols), gap = 8;
    const availW = Math.min(innerWidth - 32, 900), availH = innerHeight - 190;
    const cw = Math.max(40, Math.floor(Math.min((availW - gap * (lv.cols - 1)) / lv.cols, ((availH - gap * (rows - 1)) / rows) * .75)));
    grid = h('div', 'grid'); grid.style.gridTemplateColumns = `repeat(${lv.cols},1fr)`; grid.style.width = (cw * lv.cols + gap * (lv.cols - 1)) + 'px';
    bar = h('div', 'dreadbar', '<i></i><b>IT IS COMING</b>'); eyes = h('div', 'eyes', '<i></i><i></i>');
    const sc = h('span', 'chip'), cb = h('span', 'chip');
    const top = h('div', 'row'); top.append(h('span', 'chip', `${W + 1}/5 ${lv.name.toUpperCase()}`), sc, cb);
    const upd = () => { sc.textContent = `SCORE ${score}`; cb.textContent = combo > 1 ? `CHAIN x${combo}` : 'CHAIN -'; cb.style.borderColor = combo > 1 ? '#ffc938' : ''; };
    cards.forEach((c, i) => {
      const b = h('button', 'mcard up' + (c.flip ? ' flip' : ''), `<div><div class="b">?</div><div class="f">${Art.svg(c.ic)}</div></div>`);
      c.el = b; b.onclick = () => tap(i, upd); grid.append(b);
    });
    const w = h('div', 'wrap'); w.style.gap = '10px'; w.append(top, bar, grid);
    st.append(eyes, topbar('Lights Out'), w); upd(); hud(); Synth.sfx('whoosh');
    later(() => {   // the peek is over
      cards.forEach(c => c.el.classList.remove('up')); Synth.sfx('flip'); lock = false;
      let beat = 0;
      every(() => {
        if (over) return;
        dread += lv.rate * .1; hud(); if (dread >= 100) return caught();
        beat += .1; const gapS = 1.15 - Math.min(.8, dread / 125);
        if (beat >= gapS) { beat = 0; Synth.sfx('heart', .35 + dread / 150); }
      }, 100);
      if (lv.swap) every(surge, 7000);
      if (lv.dark) every(() => { if (dread > 35 && !over) { grid.classList.remove('dark'); void grid.offsetWidth; grid.classList.add('dark'); Synth.sfx('zap'); } }, 5200);
    }, lv.peek);
  }
  function tap(i, upd) {
    const c = cards[i]; if (lock || over || c.done || open.includes(c)) return;
    c.el.classList.add('up'); Synth.sfx('flip'); open.push(c);
    if (open.length < 2) return;
    lock = true; const [a, b] = open;
    if (a.ic === b.ic) {
      combo++; score += 100 * combo; dread = Math.max(0, dread - (7 + combo * 2)); upd(); hud();
      later(() => { a.done = b.done = true; a.el.classList.add('done'); b.el.classList.add('done'); Synth.sfx('pair');
        const r = b.el.getBoundingClientRect(); FX.burst(10 + combo * 4, r.left + r.width / 2, r.top + r.height / 2);
        open = []; lock = false; if (--left === 0) cleared(); }, 260);
    } else {
      combo = 0; dread += 7; upd(); hud(); Synth.sfx('bad'); glitch();
      later(() => { a.el.classList.remove('up'); b.el.classList.remove('up'); open = []; lock = false; if (dread >= 100) caught(); }, 520);
    }
  }
  function surge() {   // two hidden cards trade places
    const hidden = cards.filter(c => !c.done && !open.includes(c)); if (hidden.length < 4 || lock || over) return;
    const [a, b] = shuffle(hidden); lightning(); Synth.sfx('zap');
    a.el.classList.add('swap'); b.el.classList.add('swap');
    later(() => { [a.ic, b.ic] = [b.ic, a.ic]; [a.flip, b.flip] = [b.flip, a.flip];
      [a, b].forEach(c => { c.el.querySelector('.f').innerHTML = Art.svg(c.ic); c.el.classList.toggle('flip', !!c.flip); }); }, 250);
    later(() => { a.el.classList.remove('swap'); b.el.classList.remove('swap'); }, 520);
  }
  function cleared() {
    over = true; const bonus = Math.round((100 - dread) * 5) * (W + 1); score += bonus; Synth.sfx('win'); FX.burst(90); lightning(true);
    later(async () => {
      if (W < WAVES.length - 1) {
        W++; screen();
        await banner(`<div class="sub">you got away. for now.</div><div class="h2">Calm bonus +${bonus}</div><h1 class="neon flick" style="font-size:clamp(34px,8vw,76px)">${WAVES[W].name}</h1><div class="sub">it follows you &middot; tap to keep going</div>`, 6000);
        wave();
      } else result(true);
    }, 900);
  }
  function caught() { if (over) return; over = true; scare(); Synth.sfx('lose'); later(() => result(false), 900); }
  function result(won) {
    best = store.get('lightsBest', 0); const isBest = score > best; if (isBest) store.set('lightsBest', score);
    const st = screen(won ? 'play' : 'play dread'); if (won) { Synth.sting('win'); FX.burst(160); }
    const p = h('div', 'panel endcard pop', `<div class="no">${won ? 'ALL FIVE ROOMS SURVIVED' : 'CAUGHT IN ' + WAVES[W].name.toUpperCase()}</div>
      <h1 class="neon flick" style="font-size:clamp(30px,7vw,62px);margin:12px 0">${won ? 'You Escaped' : pickFresh('death', DEATHS)}</h1>
      <div class="big-num">${String(score).padStart(5, '0')}</div><div class="sub">${isBest ? 'NEW HIGH SCORE' : 'high score ' + best}</div>
      ${won ? `<p class="sub" style="margin-top:14px">you are hereby known as</p><div class="script" style="font-size:clamp(28px,6vw,46px);transform:none">${pickFresh('matchTitle', TITLES)}</div>` : ''}`);
    const row = h('div', 'row'); const again = h('button', 'btn', won ? 'Play again' : 'Try again'); again.onclick = start;
    const menu = h('button', 'btn ghost', 'Menu'); menu.onclick = () => Menu.show(); row.append(again, menu);
    const w = h('div', 'wrap'); w.append(p, row); st.append(w);
  }
  return { start };
})();
