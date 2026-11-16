// Original 80s-style synth score, generated live with WebAudio (no files needed).
// To swap in your own tracks, drop MP3s into /music named menu.mp3, trivia.mp3,
// story.mp3, match.mp3, code.mp3 and the game will use them instead.
const Synth = (function () {
  let ctx, master, music, fxg, delay, timerId = null, step = 0, nextT = 0, cur = null, curName = null, mp3 = null;
  const api = { muted: store.get('muted', false) };
  const m2f = m => 440 * Math.pow(2, (m - 69) / 12);
  // chord = [root midi, minor?]
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
    master = ctx.createGain(); master.gain.value = api.muted ? 0 : .9; master.connect(ctx.destination);
    music = ctx.createGain(); music.gain.value = .5; music.connect(master);
    fxg = ctx.createGain(); fxg.gain.value = .8; fxg.connect(master);
    delay = ctx.createDelay(1); delay.delayTime.value = .33;
    const fb = ctx.createGain(); fb.gain.value = .35; delay.connect(fb); fb.connect(delay); delay.connect(music);
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
  function kick(t) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(40, t + .12);
    g.gain.setValueAtTime(.7, t); g.gain.exponentialRampToValueAtTime(.001, t + .22);
    o.connect(g); g.connect(music); o.start(t); o.stop(t + .25);
  }
  function chord(c) { const third = c[1] ? 3 : 4; return [c[0], c[0] + third, c[0] + 7, c[0] + 12]; }
  function tick() {
    if (!cur) return;
    const s16 = 60 / cur.bpm / 4;
    while (nextT < ctx.currentTime + .15) {
      const bar = Math.floor(step / 16), st = step % 16, ch = chord(cur.prog[bar % cur.prog.length]);
      const lift = (bar % 8 >= 4) ? 12 : 0;   // second half of the phrase climbs an octave
      if (st === 0) pad([ch[0], ch[1], ch[2]], nextT, s16 * 16);
      if (st % cur.every === 0) {
        const n = ch[cur.arp[(st / cur.every) % cur.arp.length]] + 12 + lift;
        voice(m2f(n), nextT, s16 * cur.every * 1.6, 'sawtooth', .11, cur.cut, true);
      }
      if (cur.bass.includes(st)) voice(m2f(ch[0] - 12), nextT, s16 * 2.2, 'square', .16, 500, false);
      if (cur.drums) {
        if (st % 4 === 0) kick(nextT);
        if (cur.drums > 1 && (st === 4 || st === 12)) noise(nextT, .22, .28, 1500, 'bandpass');
        if (st % 2 === 0) noise(nextT, .04, .07, 7000);
      } else if (st === 0 && cur.bpm > 70) kick(nextT);
      nextT += s16; step++;
    }
  }
  api.unlock = function () { init(); if (ctx && ctx.state === 'suspended') ctx.resume(); };
  api.start = function (name) {
    if (curName === name) return;
    init(); if (!ctx) return;
    api.stop(); curName = name;
    // try a user-supplied MP3 first; fall back to the built-in synth
    const a = new Audio(); a.loop = true; a.volume = .6; a.muted = api.muted;
    let settled = false;
    const useSynth = () => { if (settled || curName !== name) return; settled = true; cur = TR[name]; step = 0; nextT = ctx.currentTime + .08; timerId = setInterval(tick, 50); };
    a.addEventListener('canplay', () => { if (settled || curName !== name) return; settled = true; mp3 = a; a.play().catch(() => { mp3 = null; settled = false; useSynth(); }); });
    a.addEventListener('error', useSynth);
    setTimeout(useSynth, 1200);
    a.src = 'music/' + name + '.mp3';
  };
  api.stop = function () { if (timerId) clearInterval(timerId); timerId = null; cur = null; curName = null; if (mp3) { mp3.pause(); mp3 = null; } };
  api.toggle = function () { api.muted = !api.muted; store.set('muted', api.muted); if (master) master.gain.value = api.muted ? 0 : .9; if (mp3) mp3.muted = api.muted; };
  api.sfx = function (name) {
    if (!ctx || api.muted) return; const t = ctx.currentTime;
    const v = (m, at, d, type, vol, cut) => voice(m2f(m), t + at, d, type || 'square', vol || .2, cut || 3000, false, fxg);
    switch (name) {
      case 'good': v(76, 0, .12); v(83, .09, .25); break;
      case 'bad': v(40, 0, .4, 'sawtooth', .3, 600); v(39, 0, .4, 'sawtooth', .3, 600); break;
      case 'flip': v(64, 0, .05, 'square', .12); break;
      case 'tap': v(72, 0, .06, 'triangle', .2); break;
      case 'pair': v(72, 0, .1); v(76, .08, .1); v(79, .16, .2); break;
      case 'award': [72, 76, 79, 84, 88].forEach((m, i) => v(m, i * .09, .3, 'sawtooth', .16)); break;
      case 'win': [60, 64, 67, 72, 67, 72, 76].forEach((m, i) => v(m, i * .13, .35, 'sawtooth', .16)); break;
      case 'lose': [57, 53, 50, 45].forEach((m, i) => v(m, i * .22, .5, 'sawtooth', .2, 900)); break;
      case 'zap': noise(t, .25, .4, 2000, 'bandpass', fxg); break;
      case 'thunder': noise(t, 1.6, .5, 220, 'lowpass', fxg); break;
      case 'chime': v(45, 0, 1.6, 'triangle', .35, 800); v(57, 0, 1.2, 'sine', .2); break;
      case 'type': v(90, 0, .02, 'square', .04); break;
    }
  };
  addEventListener('pointerdown', api.unlock, { passive: true });
  addEventListener('keydown', api.unlock);
  document.addEventListener('visibilitychange', () => { if (!ctx) return; if (document.hidden) ctx.suspend(); else ctx.resume(); });
  return api;
})();
