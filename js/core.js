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
  stage.innerHTML = ''; stage.className = 'stage ' + (cls || ''); document.body.className = cls || 'play'; stage.scrollTop = 0; return stage;
}
function topbar(mid, right) {
  const t = h('div', 'topbar');
  const back = h('button', 'chip', '&#9664; MENU'); back.onclick = () => { Synth.sfx('flip'); Menu.show(); };
  t.append(back, h('div', 'mid', mid || ''), right || muteBtn());
  return t;
}
function muteBtn() {
  const b = h('button', 'chip', Synth.muted ? 'SOUND OFF' : 'SOUND ON'); b.dataset.mute = 1;
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

// ---------- backdrop: living storm sky, lightning, spores, Hawkins skyline ----------
const Sky = (function () {
  const c = $('#sky'), g = c.getContext('2d'); let W, H; const S = .5;
  function size() { W = c.width = Math.ceil(innerWidth * S); H = c.height = Math.ceil(innerHeight * S); }
  size(); addEventListener('resize', size);
  function sprite(r, gr, b) {
    const o = document.createElement('canvas'); o.width = o.height = 128; const x = o.getContext('2d');
    const rg = x.createRadialGradient(64, 64, 4, 64, 64, 64);
    rg.addColorStop(0, `rgba(${r},${gr},${b},1)`); rg.addColorStop(.5, `rgba(${r},${gr},${b},.55)`); rg.addColorStop(1, `rgba(${r},${gr},${b},0)`);
    x.fillStyle = rg; x.fillRect(0, 0, 128, 128); return o;
  }
  const dark = sprite(6, 1, 2), ember = sprite(190, 30, 8), hot = sprite(255, 120, 40);
  const clouds = [];
  for (let i = 0; i < 46; i++) clouds.push({ x: Math.random(), y: Math.random() * .55 - .08, r: .16 + Math.random() * .3, v: (.004 + Math.random() * .012) * (i % 2 ? 1 : -1), lit: i % 3 === 0, p: Math.random() * 6 });
  const vortex = []; for (let i = 0; i < 16; i++) vortex.push({ a: Math.random() * 6.28, d: .05 + Math.random() * .2, r: .08 + Math.random() * .12, v: .1 + Math.random() * .25 });
  const spores = []; for (let i = 0; i < 80; i++) spores.push({ x: Math.random(), y: Math.random(), r: .6 + Math.random() * 1.6, v: .008 + Math.random() * .02, p: Math.random() * 6 });
  let bolts = [], flash = 0, last = 0;
  function bolt() {
    const pts = []; let x = W * (.12 + Math.random() * .76), y = H * (.02 + Math.random() * .12); const end = H * (.62 + Math.random() * .16);
    pts.push([x, y]); while (y < end) { y += H * (.02 + Math.random() * .05); x += (Math.random() - .5) * W * .09; pts.push([x, y]); }
    const kids = [];
    for (let k = 0; k < 2; k++) { const i = 2 + rnd(Math.max(1, pts.length - 4)); let [bx, by] = pts[i]; const dir = Math.random() < .5 ? -1 : 1, br = [[bx, by]];
      for (let j = 0; j < 4; j++) { bx += dir * W * (.02 + Math.random() * .04); by += H * (.015 + Math.random() * .035); br.push([bx, by]); } kids.push(br); }
    bolts.push({ pts, kids, life: 1 }); flash = 1;
  }
  function stroke(pts, w, col) { g.beginPath(); pts.forEach((p, i) => i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); g.lineWidth = w; g.strokeStyle = col; g.stroke(); }
  function frame(ms) {
    const t = ms / 1000, dt = Math.min(.05, t - last); last = t;
    const sky = g.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, '#1c0203'); sky.addColorStop(.28, '#560706'); sky.addColorStop(.56, '#a80e08'); sky.addColorStop(.74, '#d2260a'); sky.addColorStop(.8, '#ff7d2e'); sky.addColorStop(.83, '#3a0502'); sky.addColorStop(1, '#000');
    g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1; g.fillStyle = sky; g.fillRect(0, 0, W, H);
    // the rift: a slow red vortex breathing behind the clouds
    const cx = W * .5, cy = H * .36, pulse = .75 + .25 * Math.sin(t * 1.3);
    g.globalCompositeOperation = 'lighter';
    g.globalAlpha = .5 * pulse; g.drawImage(ember, cx - W * .34, cy - W * .26, W * .68, W * .52);
    g.globalAlpha = .35 * pulse; g.drawImage(hot, cx - W * .09, cy - W * .07, W * .18, W * .14);
    for (const c2 of clouds) if (c2.lit) { const x = ((c2.x + t * c2.v) % 1.4 + 1.4) % 1.4 - .2, r = c2.r * W;
      g.globalAlpha = .3 + .14 * Math.sin(t * .7 + c2.p); g.drawImage(ember, x * W - r, c2.y * H + r * .25 - r * .5, r * 2, r); }
    g.globalCompositeOperation = 'source-over';
    for (const v of vortex) { v.a += v.v * dt; const d = v.d * W * (1 + .12 * Math.sin(t + v.d * 40)), r = v.r * W;
      g.globalAlpha = .75; g.drawImage(dark, cx + Math.cos(v.a) * d * 1.5 - r, cy + Math.sin(v.a) * d * .6 - r * .5, r * 2, r); }
    for (const c2 of clouds) if (!c2.lit) { const x = ((c2.x + t * c2.v) % 1.4 + 1.4) % 1.4 - .2, r = c2.r * W;
      g.globalAlpha = .9; g.drawImage(dark, x * W - r, c2.y * H - r * .5, r * 2, r * (1 + .08 * Math.sin(t * .5 + c2.p))); }
    // lightning
    if (bolts.length) {
      g.globalCompositeOperation = 'lighter'; g.lineJoin = 'round'; g.lineCap = 'round';
      for (const b of bolts) { const a = b.life * (Math.random() < .25 ? .3 : 1);
        g.globalAlpha = a * .5; stroke(b.pts, 7, '#ff2a14'); g.globalAlpha = a; stroke(b.pts, 2.2, '#ffe9df');
        b.kids.forEach(k => { g.globalAlpha = a * .4; stroke(k, 4, '#ff2a14'); g.globalAlpha = a * .8; stroke(k, 1.2, '#ffd5c8'); }); b.life -= dt * 3.2; }
      bolts = bolts.filter(b => b.life > 0);
    }
    if (flash > 0) { g.globalCompositeOperation = 'lighter'; g.globalAlpha = flash * .35; g.fillStyle = '#ff5a3c'; g.fillRect(0, 0, W, H); flash -= dt * 2.6; }
    // spores
    g.globalCompositeOperation = 'source-over'; g.fillStyle = '#ffd9c9';
    for (const p of spores) { p.y -= p.v * dt; if (p.y < -.02) { p.y = 1.02; p.x = Math.random(); }
      g.globalAlpha = .2 + .4 * Math.sin(t * 1.4 + p.p) ** 2; g.beginPath(); g.arc((p.x + Math.sin(t * .5 + p.p) * .012) * W, p.y * H, p.r, 0, 7); g.fill(); }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  setInterval(() => { if (!document.hidden && Math.random() < .5) bolt(); }, 4200);

  // skyline: bare trees, telephone poles, a road out of town
  (function ground() {
    let sd = 11; const r = () => (sd = (sd * 9301 + 49297) % 233280) / 233280; let d = '';
    function limb(x, y, len, ang, w, depth) {
      const x2 = x + Math.cos(ang) * len, y2 = y + Math.sin(ang) * len;
      d += `<path d="M${x.toFixed(1)} ${y.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}" stroke-width="${w.toFixed(1)}"/>`;
      if (depth > 0) { const n = 2 + (r() > .6 ? 1 : 0); for (let i = 0; i < n; i++) limb(x + (x2 - x) * (.45 + r() * .55), y + (y2 - y) * (.45 + r() * .55), len * (.5 + r() * .25), ang + (r() - .5) * 1.5, w * .55, depth - 1); }
    }
    [[30, 330], [95, 250], [160, 300], [230, 200], [300, 150], [700, 150], [770, 210], [840, 290], [905, 240], [970, 330]].forEach(([x, hgt]) => limb(x + r() * 20, 400, hgt * (.5 + r() * .2), -Math.PI / 2 + (r() - .5) * .16, 5 + hgt / 40, 4));
    const poles = [[372, 150, 1], [420, 100, .62], [448, 70, .4]].map(([x, hh, k]) => `<path d="M${x} 262V${262 - hh}M${x - 16 * k} ${268 - hh}h${32 * k}M${x - 12 * k} ${278 - hh}h${24 * k}" stroke-width="${4 * k}"/>`).join('');
    $('#ground').innerHTML = `<svg viewBox="0 0 1000 400" preserveAspectRatio="xMidYMax slice">
      <path d="M0 262Q250 246 500 258T1000 258V400H0Z" fill="#050102"/>
      <path d="M452 258L548 258L760 400H240Z" fill="#120606"/>
      <path d="M500 262v10M500 284v16M500 316v26M500 362v38" stroke="#b8380f" stroke-width="5" opacity=".7"/>
      <g stroke="#050102" stroke-linecap="round" fill="none">${d}${poles}
        <path d="M356 118Q392 150 410 160M388 118Q420 150 432 160M410 160Q436 180 444 188M432 160Q448 180 454 188" stroke-width="1"/></g>
      <g fill="#050102"><rect x="596" y="196" width="92" height="38" rx="3"/><rect x="606" y="232" width="5" height="34"/><rect x="673" y="232" width="5" height="34"/></g>
      <text x="642" y="211" text-anchor="middle" font-family="Josefin Sans,sans-serif" font-size="9" fill="#a8320c" letter-spacing="1">WELCOME TO</text>
      <text x="642" y="226" text-anchor="middle" font-family="Young Serif,serif" font-size="14" fill="#d8420f">HAWKINS</text>
      <g stroke="#050102" stroke-width="2.5" fill="none"><circle cx="318" cy="276" r="13"/><circle cx="352" cy="282" r="13"/><path d="M318 276l14-12 20 18M332 264l-6-6"/></g></svg>`;
  })();
  return { bolt };
})();
function lightning(loud) { Sky.bolt(); if (loud) Synth.sfx('thunder'); }
function glitch() { document.body.classList.add('glitch'); setTimeout(() => document.body.classList.remove('glitch'), 450); }
function scare() { Synth.sfx('scare'); Sky.bolt(); glitch(); const f = $('#flash'); f.classList.remove('go'); void f.offsetWidth; f.classList.add('go'); }

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
