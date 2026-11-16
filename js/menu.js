const Menu = (function () {
  function show() {
    const st = screen('menu'); Synth.start('menu');
    const logo = h('div', 'logo fade', `<div class="script">Leighton's</div><h1 class="neon big flick">HAWKINS</h1>
      <div class="bars"><i></i><h2 class="neon small">AFTER DARK</h2><i></i></div>`);
    const modes = h('div', 'modes');
    const endings = store.get('endings', []).length, trophies = store.get('trophies', []).length;
    const tb = store.get('triviaBest', 0), mb = store.get('matchBest', 0), cb = store.get('codeBest', 0);
    [['book', 'THE VANISHING', `Story mode &middot; a new tale every time<br>${endings}/12 endings found`, Story.start],
     ['d20', 'FINAL EXAM', `75 questions &middot; five seasons<br>${tb ? 'best ' + tb + '/75' : 'earn your report card'} &middot; ${trophies} awards`, Trivia.start],
     ['bulb', 'FLICKERING LIGHTS', `Memory match &middot; five levels<br>${mb ? 'best ' + mb + ' moves' : 'it gets strange'}`, Match.start],
     ['radio', 'CODE RED', `Lights, radio, gate &middot; one mission<br>${cb ? 'high score ' + cb : 'close the gate'}`, CodeRed.start]
    ].forEach(([ic, name, sub, fn], i) => {
      const b = h('button', 'mode fade', `${Art.svg(ic)}<div><b>${name}</b><span>${sub}</span></div>`);
      b.style.animationDelay = (.15 + i * .1) + 's';
      b.onclick = () => { Synth.unlock(); Synth.sfx('tap'); lightning(); fn(); };
      modes.append(b);
    });
    const row = h('div', 'row'); row.append(muteBtn());
    const fine = h('div', 'fine', `Made for Leighton, by Steve R. &middot; An unofficial fan game. Not affiliated with, endorsed by, or connected to Netflix or the makers of Stranger Things. All art and music here are original. Trivia covers all five seasons: spoilers ahead.`);
    const w = h('div', 'wrap'); w.append(logo, modes, row, fine); st.append(w);
  }
  show();
  if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
  return { show };
})();
