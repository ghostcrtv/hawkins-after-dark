// "CODE RED" — a three-act mission: decode the lights, tune the radio, close the gate.
const CodeRed = (function () {
  const WORDS = {
    s: [["What Eleven calls Dr. Brenner", "PAPA"], ["Dustin's pet from the trash can", "DART"], ["Nancy's best friend, taken by the pool", "BARB"], ["The Hendersons' doomed cat", "MEWS"],
      ["Eleven's 'sister', number eight", "KALI"], ["Joyce's boyfriend, the 'superhero'", "BOB"], ["Suzie's home state", "UTAH"], ["Hopper's daughter", "SARA"], ["Scoops ____", "AHOY"], ["Kate ____ saved Max", "BUSH"]],
    m: [["Eleven's favorite food", "EGGOS"], ["Season 4's clock-loving villain", "VECNA"], ["The chief of police", "HOPPER"], ["He delivers Surfer Boy Pizza", "ARGYLE"], ["Steve's ice cream coworker", "ROBIN"],
      ["The youngest Wheeler", "HOLLY"], ["Vecna's first name, back when he was human", "HENRY"], ["Castle ____, Will's fort", "BYERS"], ["The Russian who loved cherry Slurpees", "ALEXEI"], ["Lucas's fearless little sister", "ERICA"]],
    l: [["Dustin's hilltop radio tower", "CEREBRO"], ["Eddie's D&D club", "HELLFIRE"], ["The mall that burned", "STARCOURT"], ["The road where Will vanished", "MIRKWOOD"], ["Holly's name for Vecna's mind-prison", "CAMAZOTZ"],
      ["The monster of season one", "DEMOGORGON"], ["Max's last name", "MAYFIELD"], ["Hawkins is in this state", "INDIANA"]]
  };
  const CALLS = [
    ['Steve', "Uh, this is the guy with the great hair and the bat full of nails. I am NOT the babysitter. Okay. I'm kind of the babysitter. Over."],
    ['Dustin', "Calling from Cerebro! I've got a compass going haywire, a pocket full of nougat, and somebody tell Suzie I said hi. Over!"],
    ['Hopper', "No calls before my coffee. And that bedroom door stays open three inches. That is not a suggestion. Over."],
    ['Eleven', "I found him. In the dark place. Bring waffles. Friends... do not lie. Over."],
    ['Joyce', "The lights are talking again and NO, I am not crazy. I have an axe and forty boxes of Christmas bulbs. Over."],
    ['Murray', "I told you people about the Russians YEARS ago. Bring vodka. Then burn this tape. Over."],
    ['Robin', "Hi, yes: band kid, too many languages, cracked a Russian code between scooping sundaes. You're welcome. Over."],
    ['Max', "Zoomer here. Headphones on, tape rolling, skateboard ready. Nobody touches my Walkman. Over."],
    ['Lucas', "Wrist rocket is loaded. I skipped basketball practice for this, so the monster had better show. Over."],
    ['Eddie', "Dungeon Master speaking. Guitar is tuned, amp is cranked, and this is going to be the most metal concert in history. Over."],
    ['Erica', "You can't spell America without me. I want free ice cream for LIFE or I walk. Over."],
    ['Argyle', "Duuude. Got a van full of pizza and, yes, there is pineapple on it. Keep an open mind, my dude. Over."],
    ['Nancy', "Notebook in one hand, shotgun in the other. I'm going in first. Try to keep up. Over."],
    ['Will', "The back of my neck is tingling. He's close. Give me some crayons and I'll draw you the map. Over."]
  ];
  const FACTS = [
    ["Eleven's mother is named Terry Ives.", 1], ["Steve and Robin worked together at Family Video.", 1], ["Dustin's cat Mews was eaten by Dart.", 1], ["Eddie's band is called Corroded Coffin.", 1],
    ["Erica plays D&D as Lady Applejack.", 1], ["Joyce worked at Melvald's General Store.", 1], ["Billy drove a Camaro.", 1], ["Bob Newby died saving the others at Hawkins Lab.", 1],
    ["Murray Bauman speaks Russian.", 1], ["Will's D&D character is Will the Wise.", 1], ["The Russians built a base under Starcourt Mall.", 1], ["Chrissy was Vecna's first victim in 1986.", 1],
    ["Lucas's weapon of choice is a wrist rocket.", 1], ["Mr. Clarke teaches science at Hawkins Middle.", 1], ["Max came to Hawkins from California.", 1], ["Jonathan is into photography.", 1],
    ["Hopper's cabin hides Eleven in season two.", 1], ["Holly is the youngest Wheeler.", 1], ["Kali can make people see illusions.", 1], ["Suzie lives in Utah.", 1],
    ["Dart loved Snickers bars.", 0], ["Will vanished in 1985.", 0], ["The Snow Ball is held at Hawkins High.", 0], ["Steve's signature weapon is a hockey stick.", 0],
    ["Max moved to Hawkins from Texas.", 0], ["Kali's number is 007.", 0], ["Hopper was imprisoned in China.", 0], ["Starcourt Mall opens in season one.", 0],
    ["Argyle delivers for Enzo's Pizza.", 0], ["Mike's last name is Henderson.", 0], ["Vecna's human name was Victor Creel.", 0], ["The Mind Flayer first appears in season one.", 0],
    ["Robin spent the summer of '85 as a lifeguard.", 0], ["Holly is Lucas's little sister.", 0], ["Eddie leads the Dragonfire Club.", 0], ["In 1987 the gang's radio station is WKRP.", 0],
    ["Jonathan is the younger Byers brother.", 0], ["Dustin is Nancy's brother.", 0], ["Eleven's favorite food is Pop-Tarts.", 0], ["Dustin named his radio tower Magneto.", 0]
  ];
  const ADJ = ['Crimson', 'Midnight', 'Static', 'Neon', 'Phantom', 'Turbo', 'Cosmic', 'Thunder', 'Velvet', 'Radio', 'Atomic', 'Shadow'];
  const NOUN = ['Paladin', 'Zoomer', 'Bard', 'Ranger', 'Waffle', 'Walkie', 'Sorcerer', 'Babysitter', 'Compass', 'Slugger', 'Mage', 'Demodog'];
  const COLS = ['#ff4d4d', '#ffd34d', '#4db8ff', '#5fe08a', '#ff8ad1'];
  let score, log;
  const nap = ms => new Promise(r => later(r, ms));
  const head = (act, name) => topbar(`CODE RED &middot; ${act}`, h('span', 'chip', `SCORE ${score}`));

  async function start() {
    Synth.start('code'); score = 0; log = {};
    screen(); lightning(true);
    await banner(`<div class="sub">INCOMING TRANSMISSION</div><h1 class="neon n flick">CODE RED</h1><div class="h2" style="font-size:22px">Something is coming through. Decode the lights, find the signal, close the gate.</div><div class="sub">three acts &middot; about six minutes &middot; tap to begin</div>`);
    actWall();
  }

  // ---------------- ACT 1: THE WALL ----------------
  async function actWall() {
    await banner(`<div class="sub">ACT ONE</div><div class="h2">THE WALL</div><div class="h2" style="font-size:21px;max-width:560px">Read the clue. The lights will flash the letters of the answer, but <u>scrambled</u>. Tap the bulbs to spell it correctly before the power dies.</div><div class="sub">tap to start</div>`);
    const picks = [...shuffle(WORDS.s).slice(0, 2), ...shuffle(WORDS.m).slice(0, 2), pick(WORDS.l)];
    let got = 0;
    for (let r = 0; r < picks.length; r++) if (await wallRound(picks[r], r)) got++;
    log.wall = got; actRadio();
  }
  function wallRound([clue, ans], r) {
    return new Promise(res => {
      const st = screen(); const T = 20 + r * 2; let t = T, pos = 0, phase = 'flash', over = false;
      const slots = h('div', 'slots'); [...ans].forEach(() => slots.append(h('span', '', '')));
      const timer = h('div', 'timer', '<i></i>'), wall = h('div', 'wall'), bulbs = {};
      ['ABCDEFGH', 'IJKLMNOPQ', 'RSTUVWXYZ'].forEach((row, ri) => {
        const rw = h('div', 'wrow');
        [...row].forEach((ch, i) => { const b = h('button', 'bulb', `<i></i><b>${ch}</b>`); b.style.setProperty('--c', COLS[(i + ri) % COLS.length]); b.onclick = () => tap(ch); bulbs[ch] = b; rw.append(b); });
        wall.append(rw);
      });
      const status = h('div', 'sub', 'WATCH THE LIGHTS...');
      const w = h('div', 'wrap'); w.style.gap = '10px';
      w.append(h('div', 'sub', `SIGNAL ${r + 1} OF 5`), h('div', 'clue', clue), slots, timer, wall, status);
      st.append(head('ACT 1'), w);
      const light = (ch, ms) => { bulbs[ch].classList.add('lit'); later(() => bulbs[ch].classList.remove('lit'), ms); };
      const end = ok => {
        if (over) return; over = true; phase = 'done';
        if (ok) { const pts = 100 + Math.ceil(t) * 10; score += pts; status.textContent = `DECODED! +${pts}`; Synth.sfx('pair'); FX.burst(40); }
        else { status.textContent = 'SIGNAL LOST'; [...ans].forEach((c, i) => slots.children[i].textContent = c); Synth.sfx('lose'); glitch(); }
        later(() => res(ok), 1500);
      };
      function tap(ch) {
        if (phase !== 'input') return;
        if (ch === ans[pos]) { slots.children[pos].textContent = ch; light(ch, 300); Synth.sfx('tap'); pos++; if (pos === ans.length) end(true); }
        else { t -= 3; Synth.sfx('bad'); wall.animate([{ transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'none' }], 200); }
      }
      (async () => {
        await nap(900);
        let seq = shuffle([...ans]); if (r >= 3) seq = seq.slice(0, Math.ceil(seq.length * .7));   // weak signal: some letters missing
        for (const ch of seq) { light(ch, 480); Synth.sfx('flip'); await nap(640); }
        phase = 'input'; status.textContent = r >= 3 ? 'WEAK SIGNAL: SOME LETTERS NEVER FLASHED. SPELL IT!' : 'NOW SPELL IT!';
        every(() => { if (over) return; t -= .1; timer.firstChild.style.transform = `scaleX(${Math.max(0, t / T)})`; if (t <= 0) end(false); }, 100);
      })();
    });
  }

  // ---------------- ACT 2: CEREBRO ----------------
  async function actRadio() {
    screen();
    await banner(`<div class="sub">ACT TWO</div><div class="h2">CEREBRO</div><div class="h2" style="font-size:21px;max-width:560px">Someone is calling in. Slide the dial until the static clears, then say who is on the radio.</div><div class="sub">tap to start</div>`);
    const picks = shuffle(CALLS).slice(0, 5); let got = 0;
    for (let r = 0; r < picks.length; r++) if (await radioRound(picks[r], r)) got++;
    log.radio = got; actGate();
  }
  function radioRound([who, msg], r) {
    return new Promise(res => {
      const st = screen(); const T = 26 - r * 2; let t = T, locked = false, over = false;
      const target = 6 + rnd(89); let start = rnd(101); while (Math.abs(start - target) < 30) start = rnd(101);
      const text = h('div', 'radio'), meter = h('div', 'meter', '<i></i>'), timer = h('div', 'timer', '<i></i>');
      const dial = h('input', 'dial'); dial.type = 'range'; dial.min = 0; dial.max = 100; dial.value = start;
      const opts = h('div', 'opts'); const names = shuffle([who, ...shuffle(CALLS.map(c => c[0]).filter(n => n !== who)).slice(0, 3)]);
      const status = h('div', 'sub', 'FIND THE SIGNAL');
      const G = '#%&$@*?/\\|<>=+~';
      const render = () => {
        const d = Math.abs(dial.value - target), sig = locked ? 1 : Math.max(0, 1 - d / 28);
        meter.firstChild.style.width = sig * 100 + '%';
        text.textContent = locked ? msg : [...msg].map(c => c === ' ' || Math.random() < sig * sig ? c : G[rnd(G.length)]).join('');
        if (!locked && d <= 2) { locked = true; dial.disabled = true; status.textContent = 'SIGNAL LOCKED. WHO IS IT?'; Synth.sfx('good'); text.textContent = msg; [...opts.children].forEach(b => b.disabled = false); }
      };
      const end = (ok, btn) => {
        if (over) return; over = true;
        [...opts.children].forEach(b => { b.classList.add('lock'); if (b.textContent === who) b.classList.add('good'); });
        text.textContent = msg;
        if (ok) { const pts = 150 + Math.ceil(t) * 10; score += pts; status.textContent = `COPY THAT! +${pts}`; Synth.sfx('pair'); FX.burst(40); }
        else { if (btn) btn.classList.add('bad'); status.textContent = `THAT WAS ${who.toUpperCase()}`; Synth.sfx('bad'); glitch(); }
        later(() => res(ok), 1700);
      };
      names.forEach(n => { const b = h('button', 'opt'); b.textContent = n; b.disabled = true; b.onclick = () => end(n === who, b); opts.append(b); });
      dial.oninput = render;
      const w = h('div', 'wrap'); w.style.gap = '10px';
      w.append(h('div', 'sub', `TRANSMISSION ${r + 1} OF 5`), text, meter, dial, timer, status, opts);
      st.append(head('ACT 2'), w); render();
      every(() => { if (over) return; if (!locked) render(); t -= .12; timer.firstChild.style.transform = `scaleX(${Math.max(0, t / T)})`; if (t <= 0) end(false); }, 120);
    });
  }

  // ---------------- ACT 3: CLOSE THE GATE ----------------
  async function actGate() {
    screen(); lightning(true);
    await banner(`<div class="sub">ACT THREE</div><div class="h2">CLOSE THE GATE</div><div class="h2" style="font-size:21px;max-width:560px">Friends don't lie. Call each statement TRUE or LIE. Every right call shrinks the gate; every wrong one tears it wider. Seal it before time runs out.</div><div class="sub">tap to start</div>`);
    const st = screen(); const deck = shuffle(FACTS); let k = 0, g = 60, t = 60, over = false, right = 0;
    const gate = h('div', 'gate', `<svg viewBox="0 0 64 64"><path d="M32 2L24 16L34 24L20 36L30 44L22 62L42 44L32 36L46 24L36 16Z" fill="#EF0B0B" stroke="#ffd0c0" stroke-width="1.5"/></svg>`);
    const stmt = h('div', 'stmt'), clock = h('span', 'chip'), size = h('span', 'chip');
    const tf = h('div', 'tf'); const bt = h('button', 'btn', 'TRUE'), bl = h('button', 'btn lie', 'LIE'); tf.append(bt, bl);
    const hud = h('div', 'row'); hud.append(clock, size);
    const panel = h('div', 'panel'); panel.append(stmt);
    const w = h('div', 'wrap'); w.style.gap = '10px'; w.append(hud, gate, panel, tf); st.append(head('ACT 3'), w);
    const draw = () => { gate.firstChild.style.transform = `scale(${.15 + g / 100 * 1.25})`; clock.textContent = `TIME ${Math.ceil(t)}`; size.textContent = `GATE ${Math.max(0, Math.round(g))}%`; };
    const next = () => { stmt.textContent = deck[k % deck.length][0]; stmt.classList.remove('fade'); void stmt.offsetWidth; stmt.classList.add('fade'); };
    const end = () => {
      if (over) return; over = true; let bonus = 0;
      if (g <= 0) { bonus = 200 + Math.ceil(t) * 10; log.gate = 'sealed'; } else if (g >= 100) log.gate = 'breached'; else { log.gate = 'held'; bonus = Math.round((100 - g) * 2); }
      score += bonus; log.right = right; later(debrief, 700);
    };
    const call = v => {
      if (over) return;
      if (deck[k % deck.length][1] === v) { g -= 6; right++; score += 40; Synth.sfx('good'); } else { g += 11; Synth.sfx('bad'); glitch(); }
      k++; draw(); if (g <= 0 || g >= 100) end(); else next();
    };
    bt.onclick = () => call(1); bl.onclick = () => call(0);
    draw(); next();
    every(() => { if (over) return; t -= .1; g += .1; draw(); if (t <= 0 || g >= 100) end(); }, 100);
  }

  function debrief() {
    const st = screen(); const R = score >= 3000 ? 'PARTY LEGEND' : score >= 2200 ? 'FIELD AGENT' : score >= 1400 ? 'JUNIOR OPERATIVE' : 'LAB RAT';
    const gateLine = { sealed: 'The gate is SEALED. Hawkins sleeps tonight.', held: 'The gate is holding. Barely. Somebody should keep an eye on it.', breached: 'The gate BREACHED. Grab your bike. Run.' }[log.gate];
    const good = log.gate !== 'breached'; if (good) Synth.sting('win'); else Synth.sfx('lose'); lightning(true); if (good) FX.burst(140);
    const best = store.get('codeBest', 0), isBest = score > best; if (isBest) store.set('codeBest', score);
    let code; const seen = store.get('seen_code', []); do { code = `${pick(ADJ)} ${pick(NOUN)}`; } while (seen.includes(code) && seen.length < 100); seen.push(code); store.set('seen_code', seen.slice(-100));
    const p = h('div', 'panel endcard pop', `<div class="no">MISSION DEBRIEF</div><div class="h2">${gateLine}</div>
      <div class="big-num">${score}</div><div class="sub">${isBest ? 'NEW HIGH SCORE!' : 'high score ' + best}</div>
      <div class="statline" style="margin:12px 0"><span class="chip">LIGHTS ${log.wall}/5</span><span class="chip">RADIO ${log.radio}/5</span><span class="chip">TRUTHS ${log.right}</span></div>
      <div class="sub">RANK: ${R}</div><div class="sub">your codename for this mission</div>
      <div class="script" style="font-size:clamp(34px,7vw,56px);transform:none">${code}</div>`);
    const row = h('div', 'row'); const again = h('button', 'btn', 'NEW MISSION'); again.onclick = start;
    const menu = h('button', 'btn ghost', 'MENU'); menu.onclick = () => Menu.show(); row.append(again, menu);
    const w = h('div', 'wrap'); w.append(p, row); st.append(w);
  }
  return { start };
})();
