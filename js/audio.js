// Sound: licensed music beds + sample SFX from /audio, with synthesized horror FX layered on top
// (heartbeat, drones, stabs, thunder). If a bed fails to load, a built-in synth track plays instead.
const Synth = (function () {
  let ctx, master, music, fxg, delay, timerId = null, step = 0, nextT = 0, cur = null, curName = null;
  const api = { muted: store.get('muted', false) };
  const bed = new Audio(); bed.loop = true; bed.preload = 'auto';
  const sting = new Audio();
  const BED_VOL = { menu: .7, story: .6, trivia: .5, match: .6, code: .55 };
  const SAMPLES = { pong: 'sfx-pong', collect: 'sfx-collect', hit: 'sfx-hit', laser: 'sfx-laser', design: 'sfx-design' };
  const buf = {};
  const m2f = m => 440 * Math.pow(2, (m - 69) / 12);
  const TR = {
    menu:   { bpm: 84,  prog: [[50,1],[46,0],[43,1],[45,0]], arp: [0,2,3,2,1,2,3,2], every: 2, bass: [0,8,11], drums: 0, cut: 1400 },
    trivia: { bpm: 112, prog: [[52,1],[48,0],[55,0],[50,0]], arp: [0,1,2,3,2,1,2,3,0,2,1,3,2,3,1,2], every: 1, bass: [0,3,6,8,11,14], drums: 2, cut: 2200 },
    story:  { bpm: 66,  prog: [[48,1],[44,0],[41,1],[43,0]], arp: [0,3,2,1], every: 4, bass: [0], drums: 0, cut: 900 },
    match:  { bpm: 100, prog: [[54,1],[50,0],[57,0],[52,0]], arp: [3,2,1,2,0,2,1,2], every: 2, bass: [0,6,8,14], drums: 1, cut: 1800 },
    code:   { bpm: 128, prog: [[45,1],[45,1],[41,0],[43,0]], arp: [0,2,1,3,2,3,1,2], every: 1, bass: [0,2,4,6,8,10,12,14], drums: 2, cut: 2600 }
  };
  function init() {
    if (ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
    ctx = new AC();
    master = ctx.createGain(); master.gain.value = api.muted ? 0 : 1; master.connect(ctx.destination);
    try { bedGain = ctx.createGain(); bedGain.gain.value = .6; ctx.createMediaElementSource(bed).connect(bedGain); bedGain.connect(master); bed.volume = 1; } catch (e) { bedGain = null; }
    music = ctx.createGain(); music.gain.value = .5; music.connect(master);
    fxg = ctx.createGain(); fxg.gain.value = .9; fxg.connect(master);
    delay = ctx.createDelay(1); delay.delayTime.value = .33;
    const fb = ctx.createGain(); fb.gain.value = .35; delay.connect(fb); fb.connect(delay); delay.connect(music);
    for (const k in SAMPLES) fetch('audio/' + SAMPLES[k] + '.mp3').then(r => r.arrayBuffer())
      .then(a => new Promise((res, rej) => ctx.decodeAudioData(a, res, rej))).then(b => { buf[k] = b; }).catch(() => {});
  }
  function sample(k, vol, rate) {
    if (!buf[k]) return false;
    const s = ctx.createBufferSource(), g = ctx.createGain(); s.buffer = buf[k]; s.playbackRate.value = rate || 1;
    g.gain.value = vol == null ? .8 : vol; s.connect(g); g.connect(fxg); s.start(); return true;
  }
  function voice(freq, t, dur, type, vol, cut, send, dest) {
    const o = ctx.createOscillator(), o2 = ctx.createOscillator(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    o.type = o2.type = type; o.frequency.value = freq; o2.frequency.value = freq * 1.006;
    f.type = 'lowpass'; f.Q.value = 6; f.frequency.setValueAtTime(cut, t); f.frequency.exponentialRampToValueAtTime(Math.max(120, cut * .25), t + dur);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .012); g.gain.exponentialRampToValueAtTime(.0008, t + dur);
    o.connect(f); o2.connect(f); f.connect(g); g.connect(dest || music); if (send) g.connect(delay);
    o.start(t); o2.start(t); o.stop(t + dur + .05); o2.stop(t + dur + .05);
  }
  function pad(notes, t, dur) {
    notes.forEach(n => {
      const o = ctx.createOscillator(), f = ctx.createBiquadFilter(), g = ctx.createGain();
      o.type = 'sawtooth'; o.frequency.value = m2f(n); o.detune.value = (Math.random() - .5) * 18;
      f.type = 'lowpass'; f.frequency.value = 700;
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.045, t + dur * .4); g.gain.linearRampToValueAtTime(0, t + dur);
      o.connect(f); f.connect(g); g.connect(music); o.start(t); o.stop(t + dur + .1);
    });
  }
  function noise(t, dur, vol, freq, type, dest) {
    const n = Math.floor(ctx.sampleRate * dur), b = ctx.createBuffer(1, n, ctx.sampleRate), d = b.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = b; f.type = type || 'highpass'; f.frequency.value = freq;
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.001, t + dur);
    s.connect(f); f.connect(g); g.connect(dest || music); s.start(t);
  }
  function thump(t, f0, vol, dest) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(38, t + .14);
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.001, t + .26);
    o.connect(g); g.connect(dest || music); o.start(t); o.stop(t + .3);
  }
  function chord(c) { const third = c[1] ? 3 : 4; return [c[0], c[0] + third, c[0] + 7, c[0] + 12]; }
  function tick() {
    if (!cur) return;
    const s16 = 60 / cur.bpm / 4;
    while (nextT < ctx.currentTime + .15) {
      const bar = Math.floor(step / 16), st = step % 16, ch = chord(cur.prog[bar % cur.prog.length]);
      const lift = (bar % 8 >= 4) ? 12 : 0;
      if (st === 0) pad([ch[0], ch[1], ch[2]], nextT, s16 * 16);
      if (st % cur.every === 0) voice(m2f(ch[cur.arp[(st / cur.every) % cur.arp.length]] + 12 + lift), nextT, s16 * cur.every * 1.6, 'sawtooth', .11, cur.cut, true);
      if (cur.bass.includes(st)) voice(m2f(ch[0] - 12), nextT, s16 * 2.2, 'square', .16, 500, false);
      if (cur.drums) {
        if (st % 4 === 0) thump(nextT, 150, .7);
        if (cur.drums > 1 && (st === 4 || st === 12)) noise(nextT, .22, .28, 1500, 'bandpass');
        if (st % 2 === 0) noise(nextT, .04, .07, 7000);
      }
      nextT += s16; step++;
    }
  }
  function synthBed(name) { if (!ctx || curName !== name || cur) return; cur = TR[name]; step = 0; nextT = ctx.currentTime + .08; timerId = setInterval(tick, 50); }
  let bedGain = null;
  function vol(v) { if (bedGain) bedGain.gain.value = v; else bed.volume = v; }
  function playBed() { if (api.muted || !curName) return; const p = bed.play(); if (p) p.catch(() => {}); }

  api.unlock = function () { init(); if (ctx && ctx.state === 'suspended') ctx.resume(); if (bed.paused && curName && !cur) playBed(); };
  api.start = function (name) {
    if (curName === name) { vol(BED_VOL[name]); if (sting.paused && bed.paused && !cur) playBed(); return; }
    init(); api.stop(); curName = name;
    bed.onerror = () => synthBed(name);
    bed.src = 'audio/' + name + '.mp3'; vol(BED_VOL[name] || .6); bed.muted = api.muted; playBed();
  };
  api.stop = function () { if (timerId) clearInterval(timerId); timerId = null; cur = null; curName = null; bed.pause(); sting.onended = null; sting.pause(); };
  // one-shot musical sting (endings, report card): ducks the bed, then lets it come back
  api.sting = function (name) {
    if (api.muted) return; const was = curName; bed.pause(); sting.src = 'audio/sting-' + name + '.mp3'; sting.volume = .9;
    const p = sting.play(); if (p) p.catch(() => {});
    sting.onended = () => { if (curName === was && !cur) playBed(); };
  };
  api.duck = function (on) { if (curName) vol(on ? .2 : BED_VOL[curName]); };
  api.toggle = function () { api.muted = !api.muted; store.set('muted', api.muted); if (master) master.gain.value = api.muted ? 0 : 1; bed.muted = api.muted; sting.muted = api.muted; if (!api.muted) api.unlock(); };
  api.sfx = function (name, arg) {
    if (!ctx || api.muted) return; const t = ctx.currentTime;
    const v = (m, at, d, type, vol, cut) => voice(m2f(m), t + at, d, type || 'square', vol || .2, cut || 3000, false, fxg);
    switch (name) {
      case 'tap': case 'flip': if (!sample('pong', name === 'tap' ? .6 : .4, name === 'tap' ? 1 : 1.25)) v(72, 0, .06, 'triangle', .2); break;
      case 'good': if (!sample('collect', .6)) { v(76, 0, .12); v(83, .09, .25); } break;
      case 'pair': sample('collect', .7, 1.12) || v(79, 0, .2); v(84, .1, .25, 'triangle', .12); break;
      case 'bad': sample('hit', .9, .8); v(40, 0, .45, 'sawtooth', .25, 600); v(39.4, 0, .45, 'sawtooth', .25, 600); break;
      case 'award': sample('design', .7); [72, 76, 79, 84, 88].forEach((m, i) => v(m, i * .09, .3, 'sawtooth', .13)); break;
      case 'whoosh': sample('design', .6, .7) || noise(t, .5, .3, 900, 'bandpass', fxg); break;
      case 'win': sample('design', .6, 1.2); [60, 64, 67, 72, 67, 72, 76].forEach((m, i) => v(m, i * .13, .35, 'sawtooth', .13)); break;
      case 'lose': sample('laser', .9); [57, 53, 50, 45].forEach((m, i) => v(m, i * .22, .6, 'sawtooth', .18, 900)); break;
      case 'zap': sample('hit', .7, 1.5); noise(t, .25, .35, 2000, 'bandpass', fxg); break;
      case 'thunder': sample('laser', .8, .9 + Math.random() * .25); noise(t, 1.8, .45, 200, 'lowpass', fxg); break;
      case 'boom': sample('laser', 1, .7); thump(t, 90, 1, fxg); break;
      case 'chime': v(45, 0, 2.4, 'triangle', .4, 700); v(57, 0, 1.8, 'sine', .22); v(52.1, .02, 2, 'sine', .12); break;
      case 'heart': thump(t, 70, arg || .6, fxg); thump(t + .22, 60, (arg || .6) * .7, fxg); break;
      case 'scare':   // dissonant stab + sub drop + shriek
        sample('laser', 1, .6); [61, 62, 67.5, 73, 74].forEach(m => v(m, 0, 1.4, 'sawtooth', .16, 5000));
        noise(t, .7, .5, 3500, 'bandpass', fxg); thump(t, 120, 1, fxg); break;
      case 'drone': v(33, 0, 4, 'sawtooth', .22, 300); v(33.3, 0, 4, 'sawtooth', .2, 260); v(39.9, .5, 3.4, 'sine', .1); break;
      case 'type': v(90, 0, .02, 'square', .035); break;
    }
  };
  addEventListener('pointerdown', api.unlock, { passive: true });
  addEventListener('keydown', api.unlock);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { bed.pause(); sting.pause(); if (ctx) ctx.suspend(); }
    else { if (ctx) ctx.resume(); if (curName && !cur) playBed(); }
  });
  return api;
})();
