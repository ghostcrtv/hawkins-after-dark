// "Flickering Lights" — memory match that gets meaner every level.
const Match = (function () {
  const LEVELS = [
    { pairs: 6, cols: 4, time: 0, name: 'THE BASEMENT', tip: 'Find the pairs. No pressure. Yet.' },
    { pairs: 8, cols: 4, time: 70, name: 'THE ARCADE', tip: 'Now the clock is running.' },
    { pairs: 10, cols: 5, time: 80, name: 'THE MALL', tip: 'More cards, and mismatches hide faster.', quick: 1 },
    { pairs: 12, cols: 6, time: 95, name: 'THE LAB', tip: 'Power surges make hidden cards trade places.', quick: 1, swap: 1 },
    { pairs: 15, cols: 6, time: 120, name: 'THE UPSIDE DOWN', tip: 'Half the pictures are upside down. Of course they are.', quick: 1, swap: 1, flip: 1 }
  ];
  const TITLES = ['Eagle-Eyed Party Member', 'Keeper of the Christmas Lights', 'Human Polaroid', 'Mind Like a Steel Bear Trap', 'Hawkins Lab Test Subject (Gifted)',
    'Total Recall, Indiana Edition', 'Librarian of the Upside Down', 'The One Who Remembers', 'Photographic Memory, Byers Grade', 'Flicker Whisperer'];
  let L, cards, open, lock, moves, totalMoves, left, tLeft, t0;

  function start() { Synth.start('match'); L = 0; totalMoves = 0; t0 = Date.now(); intro(); }
  async function intro() {
    screen(); const lv = LEVELS[L];
    await banner(`<div class="sub">LEVEL ${L + 1} OF ${LEVELS.length}</div><h1 class="neon flick" style="font-size:clamp(34px,9vw,80px)">${lv.name}</h1><div class="h2" style="font-size:22px">${lv.tip}</div><div class="sub">tap to start</div>`);
    play();
  }
  function play() {
    const lv = LEVELS[L], st = screen();
    const icons = shuffle(Art.cardSet).slice(0, lv.pairs);
    cards = shuffle(icons.concat(icons).map((ic, i) => ({ ic, flip: lv.flip && i >= icons.length })));
    open = []; lock = false; moves = 0; left = lv.pairs; tLeft = lv.time;
    const rows = Math.ceil(cards.length / lv.cols), gap = 8;
    const availW = Math.min(innerWidth - 32, 900), availH = innerHeight - 170;
    const cw = Math.max(40, Math.floor(Math.min((availW - gap * (lv.cols - 1)) / lv.cols, ((availH - gap * (rows - 1)) / rows) * .75)));
    const grid = h('div', 'grid'); grid.style.gridTemplateColumns = `repeat(${lv.cols},1fr)`; grid.style.width = (cw * lv.cols + gap * (lv.cols - 1)) + 'px';
    const info = h('span', 'chip'), clock = h('span', 'chip');
    const hud = h('div', 'row'); hud.append(h('span', 'chip', lv.name), info, clock);
    const upd = () => { info.textContent = `MOVES ${moves}`; clock.textContent = lv.time ? `TIME ${tLeft}` : 'NO TIMER'; clock.style.borderColor = lv.time && tLeft <= 10 ? 'var(--red)' : ''; };
    cards.forEach((c, i) => {
      const b = h('button', 'mcard' + (c.flip ? ' flip' : ''), `<div><div class="b">H</div><div class="f">${Art.svg(c.ic)}</div></div>`);
      c.el = b; b.onclick = () => tap(i, upd); grid.append(b);
    });
    const w = h('div', 'wrap'); w.style.gap = '10px'; w.append(hud, grid);
    st.append(topbar('FLICKERING LIGHTS'), w); upd();
    if (lv.time) every(() => { tLeft--; upd(); if (tLeft <= 10 && tLeft > 0) Synth.sfx('flip'); if (tLeft <= 0) fail(); }, 1000);
    if (lv.swap) every(surge, 9000);
  }
  function tap(i, upd) {
    const c = cards[i]; if (lock || c.done || open.includes(c)) return;
    c.el.classList.add('up'); Synth.sfx('flip'); open.push(c);
    if (open.length < 2) return;
    moves++; totalMoves++; upd(); lock = true;
    const [a, b] = open;
    if (a.ic === b.ic) {
      later(() => { a.done = b.done = true; a.el.classList.add('done'); b.el.classList.add('done'); Synth.sfx('pair');
        const r = b.el.getBoundingClientRect(); FX.burst(14, r.left + r.width / 2, r.top + r.height / 2);
        open = []; lock = false; if (--left === 0) later(win, 600); }, 350);
    } else {
      later(() => { a.el.classList.remove('up'); b.el.classList.remove('up'); open = []; lock = false; }, LEVELS[L].quick ? 650 : 1000);
    }
  }
  function surge() {   // two hidden cards trade places
    const hidden = cards.filter(c => !c.done && !open.includes(c)); if (hidden.length < 4 || lock) return;
    const [a, b] = shuffle(hidden); lightning(); Synth.sfx('zap');
    a.el.classList.add('swap'); b.el.classList.add('swap');
    later(() => {
      [a.ic, b.ic] = [b.ic, a.ic]; [a.flip, b.flip] = [b.flip, a.flip];
      [a, b].forEach(c => { c.el.querySelector('.f').innerHTML = Art.svg(c.ic); c.el.classList.toggle('flip', !!c.flip); });
    }, 250);
    later(() => { a.el.classList.remove('swap'); b.el.classList.remove('swap'); }, 520);
  }
  async function fail() {
    screen(); Synth.sfx('lose'); glitch();
    await banner(`<h1 class="neon" style="font-size:clamp(34px,9vw,80px)">LIGHTS OUT</h1><div class="h2" style="font-size:22px">The clock beat you. Shake it off.</div><div class="sub">tap to retry this level</div>`);
    intro();
  }
  async function win() {
    Synth.sfx('win'); FX.burst(90);
    if (L < LEVELS.length - 1) { L++; return intro(); }
    const secs = Math.round((Date.now() - t0) / 1000), best = store.get('matchBest', 0);
    const isBest = !best || totalMoves < best; if (isBest) store.set('matchBest', totalMoves);
    const st = screen(); lightning(true);
    const p = h('div', 'panel endcard pop', `<div class="no">ALL FIVE LEVELS CLEARED</div><div class="big-num">${totalMoves} MOVES</div>
      <div class="sub">in ${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}${isBest ? ' &middot; NEW BEST!' : ' &middot; best ' + best}</div>
      <p class="sub" style="margin-top:14px">You are hereby known as</p><div class="script" style="font-size:clamp(30px,6vw,48px);transform:none">${pickFresh('matchTitle', TITLES)}</div>`);
    const row = h('div', 'row'); const again = h('button', 'btn', 'PLAY AGAIN'); again.onclick = start;
    const menu = h('button', 'btn ghost', 'MENU'); menu.onclick = () => Menu.show(); row.append(again, menu);
    const w = h('div', 'wrap'); w.append(p, row); st.append(w);
  }
  return { start };
})();
