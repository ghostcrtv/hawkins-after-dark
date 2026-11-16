const Trivia = (function () {
  const SEASONS = [
    ['ONE', '1983 &middot; The Vanishing', 'Intro to Disappearances'],
    ['TWO', '1984 &middot; The Shadow', 'Shadow Monster Studies'],
    ['THREE', '1985 &middot; The Mall', 'Mall Economics &amp; Russian'],
    ['FOUR', '1986 &middot; The Curse', 'Advanced Curses'],
    ['FIVE', '1987 &middot; The Last Stand', 'Senior Seminar: The Abyss']
  ];
  const TIERS = ['EASY &middot; BIKE RIDE', 'MEDIUM &middot; INTO THE WOODS', 'HARD &middot; THE UPSIDE DOWN'];
  const TIME = 20000;
  const AWARDS = {
    tier: [['star', 'Gold Star from Mr. Clarke', 'Perfect round. Science is neat.'], ['skateboard', 'Zoomer Certified', 'Five for five, no brakes.'],
      ['d20', 'Paladin of the Party', 'A flawless round of rolls.'], ['radio', 'AV Club President', 'Perfect signal, zero static.'],
      ['d20', 'Hellfire Honor Roll', 'The Dungeon Master approves.'], ['walkie', 'Cerebro Signal Boost', 'Loud and clear, five straight.'],
      ['bat', 'Nail-Bat Slugger', 'Knocked that round out of the park.'], ['waffle', 'Eggo Extravaganza', 'A full stack of right answers.'],
      ['compass', 'Mirkwood Pathfinder', 'Never lost, not once.'], ['cone', 'Scoops Troop MVP', 'Ahoy! A perfect round.'],
      ['cassette', 'Mixtape Masterpiece', 'Every track a hit.'], ['bulb', 'All Lights Lit', 'The whole string is glowing.']],
    streak5: [['bike', 'Pedal to the Metal', '5 in a row.'], ['flashlight', 'Bright Idea', '5 in a row.'], ['arcade', 'Combo Starter', '5 in a row.'], ['pizza', 'Hot Slice Streak', '5 in a row.'], ['camera', 'Picture Perfect', '5 in a row.']],
    streak10: [['arcade', 'Palace Arcade High Score', '10 in a row!'], ['boombox', 'Volume at Eleven', '10 in a row!'], ['key', 'Keys to Hawkins', '10 in a row!'], ['phone', 'Hotline to Hawkins', '10 in a row!']],
    streak15: [['trophy', 'Unflayable', '15 in a row!!'], ['rift', 'Gate Crasher', '15 in a row!!'], ['clock', 'Beat the Clock', '15 in a row!!']],
    streak25: [['trophy', 'Legend of Hawkins', '25 in a row. Unreal.'], ['star', 'Psychic, Probably', '25 in a row. Are you Eleven?']],
    fast: [['bike', 'Bike Chase Reflexes', 'Four lightning-fast answers.'], ['cassette', 'Running Up That Quiz', 'Four lightning-fast answers.'], ['skateboard', 'Demodog Dodger', 'Four lightning-fast answers.'], ['flashlight', 'Faster Than Lightning', 'Four lightning-fast answers.']],
    comeback: [['rift', 'Back from the Upside Down', 'Missed one, then nailed five.'], ['bulb', 'Not Dead Yet', 'Missed one, then nailed five.'], ['walkie', 'Do You Copy?', 'Missed one, then nailed five.']],
    season: [['trophy', 'Season Sweep', 'A perfect 15 out of 15.'], ['book', 'Read the Whole Script', 'A perfect 15 out of 15.'], ['star', 'Curiosity Voyage Complete', 'A perfect 15 out of 15.']]
  };
  const GRADES = [
    [97, 'A+', ['Dungeon Master Supreme', 'The Eleven of Trivia', 'Valedictorian of Hawkins High', 'Sorcerer of the Party', 'Keeper of All Hawkins Lore', 'Mage of the Rightside Up', 'Head of the Hawkins AV Club', 'Curiosity Voyager, First Class'],
      ['Frankly, the faculty is a little scared of you.', 'You know Hawkins better than the people who live there.', 'Please stop correcting the teacher. You are right, but please stop.', 'Suspected psychic. Recommend extra Eggos.']],
    [90, 'A', ['Hellfire Club Hall of Famer', 'Scoops Troop Captain', 'Cerebro Operator, First Class', 'Party Paladin', 'Honorary Hawkins Detective', 'Ace Reporter, Hawkins Post', 'Nail-Bat Knight', 'Zoomer Elite'],
      ['Outstanding. Would trust with a walkie-talkie.', 'A pleasure to have in class, even during monster attacks.', 'Excellent work. Keep the door open three inches.', 'Top marks. The party is lucky to have you.']],
    [80, 'B', ['Deputy of Hawkins PD', 'Palace Arcade High Scorer', 'Family Video Employee of the Month', 'Trusted Babysitter', 'Ranger of Mirkwood', 'Snow Ball Royalty', 'Junior Lab Escapee', 'Wrist-Rocket Sharpshooter'],
      ['Solid work. A rewatch of season two would not hurt.', 'Good instincts. Occasionally distracted by the arcade.', 'Reliable in a crisis. Mostly.', 'Strong showing. The Demogorgon is mildly concerned.']],
    [70, 'C', ['Scoops Ahoy Trainee', 'Hawkins Middle Hall Monitor', 'Benchwarmer for the Tigers', 'Substitute Dungeon Master', 'Mall Rat, Starcourt Division', 'Camp Know Where Camper', 'Backup Babysitter', 'Part-Time Party Member'],
      ['Passing. Barely. Like the bus out of the junkyard.', 'Spends too much time at the mall.', 'Has potential. Needs more Christmas lights.', 'Average. So was New Coke.']],
    [60, 'D', ['Mouth Breather (Recovering)', 'Lost in Mirkwood', 'Demodog Chew Toy', 'Tourist in Hawkins', 'New Coke Enthusiast', 'Level One Bard', 'Guy Who Missed the Bus', 'Flickering Bulb'],
      ['Was this student even watching?', 'Rolled low. Repeatedly.', 'See me after class. Bring a flashlight.', 'Needs a binge. Urgently.']],
    [0, 'F', ['Guest of the Upside Down', 'Demogorgon Snack', 'Certified Mouth Breather', 'Flayed and Confused', 'Rolled a One', 'Stuck in the Void', 'Missing Poster Model', 'Mayor Kline Voter'],
      ['Student appears to have been in the Upside Down all semester.', 'Friends do not lie: this was rough.', 'Recommend starting again from Chapter One.', 'We checked the Void. The answers were not there either.']]
  ];
  let S;

  function start() {
    Synth.start('trivia');
    S = { qs: [], i: 0, right: 0, streak: 0, fast: 0, since: -1, awards: [], per: [0, 0, 0, 0, 0], tierRight: 0, marks: [], given: {} };
    for (let s = 0; s < 5; s++) for (let t = 0; t < 3; t++) shuffle(TRIVIA[s][t]).slice(0, 5).forEach(q => S.qs.push({ s, t, q }));
    ask();
  }
  function give(kind) {
    const cap = { fast: 1, comeback: 1, streak5: 2 }[kind]; S.given[kind] = (S.given[kind] || 0) + 1;
    if (cap && S.given[kind] > cap) return;
    const pool = AWARDS[kind].filter(a => !S.awards.some(x => x[1] === a[1]));
    if (!pool.length) return;
    const a = pickFresh('aw_' + kind, pool); S.awards.push(a);
    toast(a[0], a[1], a[2]); Synth.sfx('award'); FX.burst(70);
    const all = store.get('trophies', []); if (!all.includes(a[1])) { all.push(a[1]); store.set('trophies', all); }
  }
  async function ask() {
    if (S.i >= S.qs.length) return finish();
    const Q = S.qs[S.i], inSeason = S.i % 15, inTier = S.i % 5;
    if (inSeason === 0) {
      screen(); lightning(true);
      await banner(`<div class="sub">SEASON</div><h1 class="neon n flick">${SEASONS[Q.s][0]}</h1><div class="h2">${SEASONS[Q.s][1]}</div><div class="sub">15 questions &middot; tap to begin</div>`);
    } else if (inTier === 0) {
      await banner(`<div class="sub">DIFFICULTY RISING</div><div class="h2">${TIERS[Q.t]}</div>`, 1300);
    }
    const st = screen();
    const hud = h('div', 'row');
    hud.append(h('span', 'chip', `Q ${S.i + 1}/75`), h('span', 'chip', `SCORE ${S.right}`), h('span', 'chip', `STREAK ${S.streak}`));
    const lights = h('div', 'lights'); const cols = ['#ffd34d', '#ff5a5a', '#5ab0ff', '#62e88a'];
    for (let k = 0; k < 15; k++) { const b = h('i'); const m = S.marks[Q.s * 15 + k]; if (m === 1) { b.className = 'on'; b.style.setProperty('--c', cols[k % 4]); } else if (m === 0) b.className = 'off'; lights.append(b); }
    const timer = h('div', 'timer', '<i></i>');
    const panel = h('div', 'panel fade'); panel.append(h('div', 'qcard', Q.q[0]));
    const opts = h('div', 'opts'); const order = shuffle(Q.q.slice(1));
    const w = h('div', 'wrap');
    w.append(hud, lights, timer, panel, opts);
    st.append(topbar(`SEASON ${Q.s + 1} &middot; ${TIERS[Q.t].split(' ')[0]}`), w);
    const t0 = Date.now(); let done = false;
    const bar = timer.firstChild; requestAnimationFrame(() => requestAnimationFrame(() => { bar.style.transition = `transform ${TIME}ms linear`; bar.style.transform = 'scaleX(0)'; }));
    const answer = (btn, txt) => {
      if (done) return; done = true;
      const ok = txt === Q.q[1], secs = (Date.now() - t0) / 1000;
      const frozen = getComputedStyle(bar).transform; bar.style.transition = 'none'; bar.style.transform = frozen;
      [...opts.children].forEach(b => { b.classList.add('lock'); if (b.textContent === Q.q[1]) b.classList.add('good'); });
      S.marks[S.i] = ok ? 1 : 0;
      if (ok) {
        S.right++; S.per[Q.s]++; S.streak++; S.tierRight++; Synth.sfx('good');
        const r = btn.getBoundingClientRect(); FX.burst(16, r.left + r.width / 2, r.top);
        S.fast = secs < 4 ? S.fast + 1 : 0;
        if (S.since >= 0) S.since++;
        if (S.streak === 5) give('streak5'); else if (S.streak === 10) give('streak10'); else if (S.streak === 15) give('streak15'); else if (S.streak === 25) give('streak25');
        else if (S.fast === 4) { give('fast'); S.fast = 0; }
        else if (S.since === 5) { give('comeback'); S.since = -1; }
      } else {
        if (btn) btn.classList.add('bad'); S.streak = 0; S.fast = 0; S.since = 0; Synth.sfx('bad'); glitch();
      }
      if (inTier === 4) { if (S.tierRight === 5) later(() => give('tier'), 500); S.tierRight = 0; }
      if (inSeason === 14 && S.per[Q.s] === 15) later(() => give('season'), 1100);
      S.i++; later(ask, ok ? 1000 : 1700);
    };
    order.forEach(txt => { const b = h('button', 'opt'); b.textContent = txt; b.onclick = () => answer(b, txt); opts.append(b); });
    later(() => answer(null, null), TIME);
  }
  function letter(p) { return GRADES.find(g => p >= g[0]); }
  function finish() {
    const pct = Math.round(S.right / 75 * 100), G = letter(pct);
    const title = pickFresh('title_' + G[1], G[2]), comment = pickFresh('cmt_' + G[1], G[3]);
    const best = store.get('triviaBest', 0); if (S.right > best) store.set('triviaBest', S.right);
    const st = screen(); Synth.sfx(pct >= 70 ? 'win' : 'lose'); if (pct >= 70) { FX.burst(140); lightning(); }
    const rows = SEASONS.map((s, i) => `<tr><td>${s[2]}</td><td>${S.per[i]}/15</td><td>${letter(Math.round(S.per[i] / 15 * 100))[1]}</td></tr>`).join('');
    const rep = h('div', 'report pop', `
      <div class="grade">${G[1]}</div>
      <h3>HAWKINS HIGH SCHOOL</h3><small style="text-align:center">OFFICIAL REPORT CARD &middot; CLASS OF '89</small>
      <table>${rows}<tr><td><b>FINAL SCORE</b></td><td><b>${S.right}/75</b></td><td>${pct}%</td></tr></table>
      <small>This student is hereby awarded the title of</small>
      <div class="title">${title}</div>
      <small><b>Teacher's note:</b> ${comment}</small>
      ${S.awards.length ? `<div class="badges">${S.awards.map(a => `<span>${a[1]}</span>`).join('')}</div>` : ''}
      <small style="margin-top:8px;text-align:center">${S.right > best ? 'NEW PERSONAL BEST!' : 'Personal best: ' + Math.max(best, S.right) + '/75'}</small>`);
    const row = h('div', 'row'); const again = h('button', 'btn', 'RETAKE THE EXAM'); again.onclick = start;
    const menu = h('button', 'btn ghost', 'MENU'); menu.onclick = () => Menu.show(); row.append(again, menu);
    const w = h('div', 'wrap'); w.append(rep, row); st.append(w);
  }
  return { start };
})();
