// ---------- helpers ----------
const $ = s => document.querySelector(s);
const h = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
const rnd = n => Math.floor(Math.random() * n);
const pick = a => a[rnd(a.length)];
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const wait = ms => new Promise(r => setTimeout(r, ms));
const store = {
  get(k, d) { try { const v = JSON.parse(localStorage.getItem('had_' + k)); return v == null ? d : v; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('had_' + k, JSON.stringify(v)); } catch (e) {} }
};
// pick something the player has not seen lately (remembered between sessions)
function pickFresh(key, pool) {
  const idOf = x => typeof x === 'string' ? x : (x.n || x.id || x[0]);
  let seen = store.get('seen_' + key, []);
  let avail = pool.filter(x => !seen.includes(idOf(x)));
  if (!avail.length) { seen = seen.slice(-1); avail = pool.filter(x => !seen.includes(idOf(x))); if (!avail.length) avail = pool; }
  const c = pick(avail); seen.push(idOf(c)); store.set('seen_' + key, seen); return c;
}

// ---------- screens ----------
const stage = $('#stage');
let screenToken = 0;           // bumps on every screen change so old timers can bail out
const timers = new Set();
function later(fn, ms) { const tk = screenToken; const id = setTimeout(() => { timers.delete(id); if (tk === screenToken) fn(); }, ms); timers.add(id); return id; }
function every(fn, ms) { const tk = screenToken; const id = setInterval(() => { if (tk !== screenToken) { clearInterval(id); return; } fn(); }, ms); timers.add(id); return id; }
function screen(cls) {
  screenToken++; timers.forEach(id => { clearTimeout(id); clearInterval(id); }); timers.clear();
  document.querySelectorAll('.banner').forEach(b => b.remove());
  stage.innerHTML = ''; stage.className = 'stage ' + (cls || ''); stage.scrollTop = 0; return stage;
}
function topbar(mid, right) {
  const t = h('div', 'topbar');
  const back = h('button', 'chip', '&#9664; MENU'); back.onclick = () => { Synth.sfx('flip'); Menu.show(); };
  t.append(back, h('div', 'mid', mid || ''), right || muteBtn());
  return t;
}
function muteBtn() {
  const b = h('button', 'chip', Synth.muted ? 'SOUND OFF' : 'SOUND ON');
  b.onclick = () => { Synth.toggle(); b.textContent = Synth.muted ? 'SOUND OFF' : 'SOUND ON'; };
  return b;
}
function banner(html, ms) {   // full screen card, resolves on tap or timeout
  return new Promise(res => {
    const tk = screenToken;
    const b = h('div', 'banner fade', html); document.body.append(b);
    let done = false; const end = () => { if (done) return; done = true; b.remove(); if (tk === screenToken) res(); };
    b.onclick = end; if (ms) setTimeout(end, ms);
  });
}
function toast(icon, title, line) {
  const t = h('div', 'toast', `${Art.svg(icon)}<div><b>${title}</b><span>${line}</span></div>`);
  $('#toasts').append(t); setTimeout(() => t.remove(), 3400);
}

// ---------- backdrop: trees, spores, lightning ----------
(function backdrop() {
  function tree(seed) {
    let s = seed; const r = () => (s = (s * 9301 + 49297) % 233280) / 233280;
    let d = '';
    for (let i = 0; i < 5; i++) {
      const x = 10 + i * 34 + r() * 16, w = 4 + r() * 7, top = 40 + r() * 160;
      d += `M${x} 600 L${x + w * .2} ${top} L${x + w} 600Z`;
      for (let k = 0; k < 4; k++) {
        const y = top + 30 + r() * 260, len = 14 + r() * 34, dir = r() > .5 ? 1 : -1;
        d += `M${x + w / 2} ${y} l${dir * len} ${-len * (.5 + r() * .6)} l${dir * 3} 4 L${x + w / 2} ${y + 7}Z`;
      }
    }
    return `<svg viewBox="0 0 200 600" preserveAspectRatio="xMinYMax slice"><path d="${d}" fill="#0d0505"/></svg>`;
  }
  const T = $('#trees'); T.innerHTML = tree(7) + tree(23);
  T.children[0].classList.add('l'); T.children[1].classList.add('r');

  const c = $('#spores'), g = c.getContext('2d'); let W, H, P = [];
  function size() { W = c.width = innerWidth; H = c.height = innerHeight; }
  size(); addEventListener('resize', size);
  for (let i = 0; i < 70; i++) P.push({ x: Math.random(), y: Math.random(), r: 1 + Math.random() * 2.2, v: .0004 + Math.random() * .0009, p: Math.random() * 6 });
  (function loop(t) {
    g.clearRect(0, 0, W, H);
    for (const p of P) {
      p.y -= p.v; if (p.y < -.02) { p.y = 1.02; p.x = Math.random(); }
      const x = (p.x + Math.sin(t / 1900 + p.p) * .012) * W;
      g.globalAlpha = .25 + .35 * Math.sin(t / 700 + p.p) ** 2; g.fillStyle = '#ffd9c9';
      g.beginPath(); g.arc(x, p.y * H, p.r, 0, 7); g.fill();
    }
    requestAnimationFrame(loop);
  })(0);
  setInterval(() => { if (Math.random() < .35) lightning(); }, 7000);
})();
function lightning(loud) {
  const s = $('#sky'); s.classList.remove('bolt'); void s.offsetWidth; s.classList.add('bolt');
  if (loud) Synth.sfx('thunder');
}
function glitch() { document.body.classList.add('glitch'); setTimeout(() => document.body.classList.remove('glitch'), 450); }

// ---------- fx: confetti ----------
const FX = (function () {
  const c = $('#fx'), g = c.getContext('2d'); let parts = [], running = false;
  function size() { c.width = innerWidth; c.height = innerHeight; } size(); addEventListener('resize', size);
  function loop() {
    g.clearRect(0, 0, c.width, c.height);
    parts = parts.filter(p => p.life > 0);
    for (const p of parts) {
      p.vy += .25; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life--;
      g.save(); g.translate(p.x, p.y); g.rotate(p.rot); g.globalAlpha = Math.min(1, p.life / 30);
      g.fillStyle = p.c; g.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * .6); g.restore();
    }
    if (parts.length) requestAnimationFrame(loop); else running = false;
  }
  return {
    burst(n = 60, x = innerWidth / 2, y = innerHeight * .4) {
      const cols = ['#EF0B0B', '#F3DDC8', '#ffd34d', '#940001', '#ff7a59'];
      for (let i = 0; i < n; i++) { const a = Math.random() * 6.28, v = 4 + Math.random() * 10;
        parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 5, s: 6 + Math.random() * 9, rot: 0, vr: (Math.random() - .5) * .5, life: 70 + rnd(40), c: pick(cols) }); }
      if (!running) { running = true; loop(); }
    }
  };
})();
