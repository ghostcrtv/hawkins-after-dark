const Menu = (function () {
  const LOGO = `<div class="script">Leighton's</div><h1 class="neon big">Hawkins</h1>
      <div class="bars"><i></i><h2 class="neon small">After Dark</h2><i></i></div>`;
  const vhs = (pos, txt) => h('div', 'vhs ' + pos, txt);
  function title() {
    const st = screen('title'); Synth.start('menu');
    const w = h('div', 'titlewrap');
    w.append(h('div', 'logo', LOGO), h('div', 'start blink', 'TAP TO BEGIN'));
    st.append(vhs('tl', 'PLAY &#9654;'), vhs('bl', 'NOV. 6 1983&nbsp;&nbsp;PM 9:47'), vhs('tr', 'SP'), w);
    st.onclick = () => { st.onclick = null; Synth.unlock(); Synth.sfx('boom'); lightning(); glitch(); later(show, 350); };
  }
  function show() {
    const st = screen('menu'); Synth.start('menu');
    const logo = h('div', 'logo fade', LOGO);
    const modes = h('div', 'modes');
    const endings = store.get('endings', []).length, trophies = store.get('trophies', []).length;
    const tb = store.get('triviaBest', 0), mb = store.get('lightsBest', 0), cb = store.get('codeBest', 0);
    [['missing', 'THE VANISHING', 'A horror story. You are in it.', `ENDINGS ${endings}/12`, Story.start],
     ['report', 'FINAL EXAM', '75 questions. Five seasons.', `HI ${String(tb).padStart(2, '0')}/75 &middot; ${trophies} AWARDS`, Trivia.start],
     ['lights', 'LIGHTS OUT', 'Match fast. It is coming.', `HI ${String(mb).padStart(5, '0')}`, Match.start],
     ['tower', 'CODE RED', 'Decode. Tune in. Close the gate.', `HI ${String(cb).padStart(5, '0')}`, CodeRed.start]
    ].forEach(([ic, name, sub, hi, fn], i) => {
      const b = h('button', `cab c${i + 1} fade`, `<div class="cab-top"><span>${i + 1}UP</span><span>${hi}</span></div>
        <div class="cab-body">${Art.svg(ic)}<div><b>${name}</b><span>${sub}</span></div></div>
        <div class="cab-foot"><span>1 PLAYER</span><span class="blink">PRESS START</span></div>`);
      b.style.animationDelay = (.1 + i * .1) + 's';
      b.onclick = () => { Synth.unlock(); Synth.sfx('whoosh'); lightning(); fn(); };
      modes.append(b);
    });
    const row = h('div', 'row'); row.append(muteBtn());
    const credit = h('div', 'credit', 'CREDIT 01 &nbsp;&middot;&nbsp; &copy; 1983 HAWKINS A.V. CLUB');
    const fine = h('div', 'fine', `Made for Leighton, by Steve R. &middot; An unofficial fan game, not affiliated with or endorsed by Netflix or the makers of Stranger Things. Spoilers for all five seasons. Story mode is scary.`);
    const w = h('div', 'wrap'); w.append(logo, modes, credit, row, fine); st.append(w);
  }
  title();
  if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
  return { show, title };
})();
