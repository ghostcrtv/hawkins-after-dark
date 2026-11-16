// "The Vanishing" — an original pick-a-path story set in Hawkins.
// Premise, ally, location, threat and showdown are shuffled every game; the ending depends on your choices.
const Story = (function () {
  let s, queue, idx;
  const al = (yes, no) => s.A ? yes : no;          // text with / without an ally
  const cap = t => t[0].toUpperCase() + t.slice(1);

  const PREMISES = [
    { L: 'Danny', rel: 'little brother', he: 'he', him: 'him', his: 'his',
      t: () => `Tuesday, 9:47 p.m. Hawkins, Indiana.\n\nYour little brother Danny's bed is empty, his window is open, and the walkie-talkie on his pillow is hissing. Under the static there is a voice the size of a whisper, and it is saying your name.\n\nThe bulb in his reading lamp swells bright, dims, swells again. Like something breathing.` },
    { L: 'Grandpa Walt', rel: 'grandfather', he: 'he', him: 'him', his: 'his',
      t: () => `Grandpa Walt's recliner is still rocking. His program is on, but the TV shows only snow, and in the snow there is a shape like a doorway.\n\nHis slippers are on the porch, toes pointed at the woods. One by one, the porch lights of Maple Street flicker in a slow wave, heading the same direction.` },
    { L: 'Jo', rel: 'best friend', he: 'she', him: 'her', his: 'her',
      t: () => `Jo was right behind you when you left the Palace Arcade. Now there is only her bike on its side, back wheel still ticking.\n\nInside, every cabinet resets at once. On the Dig Dug high-score screen, letters type themselves in. J. O. Then four more: H-E-L-P.` },
    { L: 'Ray', rel: 'cousin', he: 'he', him: 'him', his: 'his',
      t: () => `Your cousin Ray came down from Chicago to see "the most boring town in America." He went out to the shed for firewood twenty minutes ago.\n\nThe shed door is open. His flashlight is on the ground, still on, and its beam is bending toward the trees. Light should not bend.` }
  ];
  const ALLIES = [
    { n: 'Sparks', t: 'Call Tasha "Sparks" Okafor, the AV Club radio genius', fx: { wits: 2 },
      r: () => `Sparks shows up with a backpack that hums. "I've been picking up something on channel six all week," she says. "It isn't English. It isn't anything."` },
    { n: 'Donnie', t: 'Get Donnie Kowalski, Tigers linebacker and human wall', fx: { grit: 2 },
      r: () => `Donnie answers the door eating a drumstick. He hears the word "monster," nods once, and comes back with a Louisville Slugger. "Coach says I need more cardio anyway."` },
    { n: 'Priya', t: 'Wake Priya Raman, who runs the meanest D&D campaign in town', fx: { wits: 1, heart: 1 },
      r: () => `Priya doesn't blink. She closes her Monster Manual around one finger. "Describe it. Slowly. And don't leave out the smell."` },
    { n: 'Gus', t: 'Knock on Old Gus\'s trailer at the junkyard', fx: { grit: 1, wits: 1 },
      r: () => `Gus did maintenance at the lab for eleven years and has never once talked about it. He looks at your face, takes his truck keys off the nail, and says, "I wondered when somebody would come."` }
  ];

  const hook = () => ({
    title: 'THE VANISHING', text: s.P.t,
    choices: [
      { t: 'Grab your bike and follow the trail right now.', fx: { grit: 1 }, r: () => `No time. You're pedaling before the screen door slaps shut. The night smells like a struck match.` },
      { t: 'Raid the garage first: flashlight, hairspray, lighter, walkie.', fx: { wits: 1 }, flag: 'gear', r: () => `Three minutes. Flashlight, a can of your mom's hairspray, a lighter, your walkie. If Hawkins has taught anybody anything, it's that fire is usually a good idea.` },
      { t: 'Leave a note on the fridge so somebody knows.', fx: { heart: 1 }, flag: 'note', r: () => `"Gone to find ${s.L}. Not kidding. If the lights start acting weird, PAY ATTENTION TO THEM." You pin it under the pineapple magnet and go.` }
    ]
  });
  const ally = () => {
    const two = shuffle(ALLIES).slice(0, 2);
    return {
      title: 'THE PARTY', text: () => `At the corner of Cornwallis and Kerley you skid to a stop.\n\nGoing alone is how people end up on milk cartons. But every minute you spend knocking on doors is a minute ${s.L} spends wherever ${s.he} is.`,
      choices: two.map(a => ({ t: a.t + '.', fx: a.fx, set: { A: a.n }, r: a.r })).concat([
        { t: 'Nobody. Go alone.', fx: { grit: 1, doom: 1 }, r: () => `Alone, then. Fewer people to explain it to. Fewer people to lose. The streetlight over your head pops and goes dark, as if it agrees.` }
      ])
    };
  };
  const LOCATIONS = [
    () => ({ title: 'THE LAB', text: () => `The trail ends at the chain-link fence of Hawkins National Laboratory. Officially: closed for years. Unofficially: there's a light on in the basement, and the fence is humming.${al(` ${s.A} stares up at it. "Of course it's here."`, '')}`,
      choices: [
        { t: 'Crawl in through the storm drain on the east side.', fx: { wits: 1 }, r: () => `The pipe is tight and stinks of rust, but it spits you out past the cameras. People say somebody small crawled out this way once, in a hospital gown.` },
        { t: 'Climb the fence.', fx: { grit: 1, doom: 1 }, r: () => `Halfway over, floodlights slam on. You drop, roll, and run with a torn sleeve and your heart in your teeth. Somebody knows you're here now.` },
        { t: 'Walk up to the gate and bluff the lone guard.', fx: { heart: 1 }, r: () => `"My ${s.rel} wandered in here," you say, which is almost true. The guard is nineteen and scared of this place too. He looks the other way for exactly ten seconds.` }
      ] }),
    () => ({ title: 'THE LAKE', text: () => `Lover's Lake is flat and black. Sixty feet out, the water glows red from underneath, like a coal under a blanket. An old rowboat knocks against the dock.`,
      choices: [
        { t: 'Row out and look straight down.', fx: { grit: 1 }, r: () => `The glow is a tear in the lake bed, its edges moving like gills. A current tugs at the oars. It wants the boat. You let it have the boat, and hold your breath.` },
        { t: 'Check your compass before you do anything.', fx: { wits: 1 }, r: () => `The needle swings off north and points dead at the glow. A gate throws off an electromagnetic field. Mr. Clarke would be proud. Now you know exactly where it is, and how wide.` },
        { t: `Shout ${s.L}'s name across the water.`, fx: { heart: 1, doom: 1 }, r: () => `Your voice comes back wrong: half a second late and half a step low. Something out there is practicing the sound of you.` }
      ] }),
    () => ({ title: 'THE HOUSE', text: () => `The old Creel house has been boarded up since the fifties. Tonight the stained-glass rose over the door is lit from inside, and somewhere in there a grandfather clock is ticking loud enough to hear from the street.`,
      choices: [
        { t: 'Pry the boards off the front door.', fx: { grit: 1 }, r: () => `Nails squeal. The door swings in on its own, like the house was waiting to exhale. Dust, wallpaper roses, and a staircase going up into a red glow.` },
        { t: 'Find the cellar window around back.', fx: { wits: 1 }, r: () => `Quiet, unseen, and straight into the cellar, where the walls are sweating and a crack in the foundation pulses like a vein. You found the gate without ever using the front door.` },
        { t: `Call softly through the mail slot for ${s.L}.`, fx: { heart: 1, doom: 1 }, r: () => `The ticking stops. In the silence, from the attic, something says your name the way you'd read it off a list.` }
      ] }),
    () => ({ title: 'THE MALL', text: () => `What's left of Starcourt Mall is a burned shell behind a fence of CONDEMNED signs. The neon over the food court is dead.\n\nSo why can you hear an ice cream jingle?`,
      choices: [
        { t: 'Slip in through the loading dock, the way the Russians did.', fx: { wits: 1 }, r: () => `The dock door is warped open. Down the service hall is a keypad door with a faded red star and, past it, an elevator shaft breathing cold air up from very far down.` },
        { t: 'Go straight through the front atrium.', fx: { grit: 1, doom: 1 }, r: () => `Glass crunches like frost. In the middle of the atrium the floor is scorched in a shape with too many legs. Up in the rafters, something shifts its weight.` },
        { t: 'Follow the music.', fx: { heart: 1 }, r: () => `The jingle leads to the old ice cream counter. A melted sailor hat. And on the freezer door, pressed into the frost from the inside: a handprint. ${cap(s.his)} size.` }
      ] })
  ];
  const THREATS = [
    () => ({ title: 'THE PACK', text: () => `They come out of the dark low and fast. Four of them, dog-sized, no eyes, heads splitting open like wet flowers.\n\nDemodogs.${al(` ${s.A} says a word you've never heard ${s.A} say.`, '')}`,
      choices: [
        { t: 'Fire. They hate fire.', fx: { wits: 1 }, r: () => s.gear ? `Hairspray plus lighter equals six feet of dragon's breath. The pack screams and scatters, and the smell is something you'll be tasting until Christmas.` : `No lighter. But there's a road flare in an emergency box on the wall, and it catches on the first strike. The pack screams and scatters from the red light.` },
        { t: 'Toss them the 3 Musketeers bar in your pocket and run.', fx: { heart: 1 }, r: () => `A kid named Henderson swears this works. The pack piles onto the nougat like it's a religious experience. You do not wait to see who wins.` },
        { t: 'Stand perfectly still. Maybe they track movement.', fx: { doom: 2 }, r: () => `They don't have eyes. They never needed them. You figure this out one second too late, and getting away costs you a sneaker and some skin.` }
      ] }),
    () => ({ title: 'THE VINES', text: () => `The floor is carpeted in vines, gray and slick, and every one of them is connected. You step over the first. ${al(`${s.A} doesn't quite clear it.`, `Your heel doesn't quite clear the second.`)}\n\nA vine whips tight around an ankle, and the whole room wakes up.`,
      choices: [
        { t: 'Burn it.', fx: { wits: 1 }, r: () => `${s.gear ? 'The lighter does it.' : 'You grind a sparking wire from the wall against it.'} The vine shrieks without a mouth and lets go. Everything in the hive felt that. But you're free, and moving.` },
        { t: 'Hack at it with whatever is in reach.', fx: { grit: 1, doom: 1 }, r: () => `You get loose, but every cut makes the walls flinch. One mind, a million pieces. Hurt one, and all of them come looking.` },
        { t: 'Go limp and wait for it to relax.', fx: { doom: 2 }, r: () => `It does not relax. It reels you in. By the time you thrash free you've been dragged forty feet and something has had a long, careful look at you.` }
      ] }),
    () => ({ title: 'THE CLOCK', sfx: 'chime', text: () => `A clock chimes. Four times.\n\nYour nose is bleeding and the room is gone. You are standing in red fog in front of a grandfather clock with a cracked face, and a voice like wet gravel says it has been watching you for a long time.\n\nYour feet leave the ground.`,
      choices: [
        { t: 'Reach for your favorite song. You can almost hear it.', fx: { heart: 1 }, r: () => `${al(`Out in the real world, ${s.A} is jamming headphones over your ears.`, `Out in the real world, your thumb finds PLAY on the Walkman in your jacket.`)} The song you've rewound a thousand times tears a doorway in the fog, and you run for it like the last bus out of town.` },
        { t: 'Punch the clock.', fx: { grit: 1, doom: 1 }, r: () => `Your fist goes through the glass and comes out covered in spiders that aren't there. You wake up on the floor screaming. But you wake up.` },
        { t: 'Listen to what the voice wants.', fx: { doom: 2 }, r: () => `It tells you things about yourself that nobody knows. All of them are true. You come back eight minutes later with no memory of falling and a headache shaped like a hand.` }
      ] }),
    () => ({ title: 'THE VANS', text: () => `Headlights. Three white vans, no plates. People in hazmat suits spill out holding instruments that crackle.\n\nOne of them lowers her hood. "You're out past curfew," she says, friendly as a dentist. "What exactly have you seen tonight?"`,
      choices: [
        { t: `Play it straight: "I'm looking for my ${s.rel}."`, fx: { heart: 1 }, r: () => `It's the truth and it shows. She studies you, writes something down, and says, "Go home." You nod, walk until the vans are out of sight, and double back.` },
        { t: 'Ask her what happened to the last kid who saw something.', fx: { wits: 1 }, r: () => `Her smile holds, but her eyes flick to the nearest van. Inside it you glimpse a map of Hawkins stuck with red pins. One pin is exactly where you were headed. Thanks for the directions.` },
        { t: 'Run for the trees.', fx: { grit: 1, doom: 1 }, r: () => `You're fast. Their radios are faster. You lose them in the woods, but now there's a file somewhere with your name on the tab.` }
      ] })
  ];
  const cross = () => ({ title: 'THE OTHER SIDE', text: () => `The gate is a wound in the world, wet and red and just wide enough.\n\nYou push through, and you're standing in the same place. Except colder. Except darker. Except the air is full of drifting white flecks that aren't snow and the sky growls.\n\nThe Upside Down. And somewhere ahead, faint: ${pick([`someone humming`, `a cough`, `a flashlight clicking on and off`, `footsteps that stop when yours do`])}.`,
    choices: [
      { t: 'Mark your trail so you can find the way back.', fx: { wits: 1 }, flag: 'trail', r: () => `You tie strips of your shirt to the vines every twenty feet. It's slow. It may also be the smartest thing you do tonight.` },
      { t: 'Follow the sound, calling quietly.', fx: { heart: 1 }, r: () => `"${s.L}?" A pause. Then, from deeper in, three knocks on something hollow. You know that knock. You've known it your whole life.` },
      { t: 'Run. Speed is everything now.', fx: { grit: 1, doom: 1 }, r: () => `You cover ground fast and breathe deep, which means breathing them: the flecks. You cough something gray into your fist and decide not to look at it.` }
    ] });
  const FINDS = [
    () => ({ title: 'FOUND', text: () => `${s.L} is in the upside-down echo of the public library, webbed to the wall between the stacks. Eyes closed. Breathing. A thin vine runs from the wall to the corner of ${s.his} mouth.${al(`\n\n${s.A} whispers, "Is ${s.he}...?"`, '')}`,
      choices: [
        { t: 'Ease the vine out, slow and gentle.', fx: { heart: 1 }, r: () => `It takes a full minute and it is the longest minute of your life. Then ${s.L} gags, gasps, and grabs your jacket with both fists. "Took you long enough."` },
        { t: 'Cut the webbing first, vine last.', fx: { wits: 1 }, r: () => `Smart. With ${s.his} arms free, ${s.L} helps you, and the vine comes out clean. ${cap(s.he)} is weak, but ${s.he} is walking.` },
        { t: 'Rip everything loose and go.', fx: { grit: 1, doom: 1 }, r: () => `It works. It is also loud, and the wall you tore it from shudders all the way up to the ceiling, and beyond the ceiling, and beyond that.` }
      ] }),
    () => ({ title: 'FOUND', text: () => `${s.L} isn't trapped. ${s.L} is hiding: wedged inside a fort of branches and an old tarp, the dark twin of some kid's backyard hideout.\n\n"It comes back every time the lights flicker," ${s.he} whispers. "I counted. It's been eleven times."`,
      choices: [
        { t: 'Hug first. Questions later.', fx: { heart: 1 }, r: () => `${cap(s.he)} is freezing and shaking and real. For three seconds nothing else in either world matters. Then, far off, the lights flicker. Twelve.` },
        { t: 'Ask what it does when it comes. Know your enemy.', fx: { wits: 1 }, r: () => `"It sniffs," ${s.L} says. "It doesn't look. It follows blood, I think. I scraped my knee and it came straight to me." Useful. Horrible, but useful.` },
        { t: `Haul ${s.him} up and move. Now.`, fx: { grit: 1 }, r: () => `No speeches. You get ${s.his} arm over your shoulder and go. ${cap(s.he)} keeps up. Barely.` }
      ] })
  ];
  const crew = () => s.A ? `${s.L} and ${s.A}` : s.L;
  const SHOWDOWNS = [
    () => ({ title: 'THE MONSTER', bolt: 1, text: () => `Every light you aren't carrying begins to flicker.\n\nThen it unfolds out of the dark between you and the way home. Tall. Gray. Faceless, until the face opens.\n\nThe Demogorgon.`,
      choices: [
        { t: 'Stand your ground and fight.', test: 'grit', pass: () => `You've been scared all night, and somewhere back there it burned down into something harder. You hit it with everything.${al(` ${s.A} hits it with everything else.`, '')} It staggers. It actually staggers. You don't wait for a second opinion.`, fail: () => `You swing. It catches. For one long second you're off the ground and looking down its throat, and then ${s.L} is screaming and pulling and you tear loose, leaving it your jacket and a good deal of your nerve.` },
        { t: 'It hunts by blood. Use that.', test: 'wits', pass: () => `You drag your scraped palm down a dead branch and hurl it as far as you can. The petal-face snaps toward the sound, the smell, and the thing lopes off after it. You have maybe ninety seconds. You use eighty.`, fail: () => `Good idea. Bad throw. The branch lands twenty feet away, and the thing glances at it and then back at you, almost insulted. You run, and it follows, and it is faster than anything that size should be.` },
        { t: `Send ${crew()} ahead. Hold it off from this side.`, flag: 'sacrifice', r: () => `"Go," you say, and you make it sound like you have a plan. ${s.L} looks at you for one second too long, then runs. You turn around. It tilts its head at you. You pick up a rock.` }
      ] }),
    () => ({ title: 'THE SWARM', bolt: 1, text: () => `A sound like a thousand wet umbrellas opening.\n\nDemobats. A tornado of them, funneling down out of the red sky, and the gate is two hundred yards away across open ground.`,
      choices: [
        { t: 'Crank your walkie to full static and throw it the other way.', test: 'wits', pass: () => `The squeal carries across the dead field. The whole swarm banks toward it like one animal. Nobody in the history of Hawkins has ever run two hundred yards faster than you do right now.`, fail: () => `Half the swarm takes the bait. Half is still a lot. You make the gate with claw marks down your back and a wing in your hair, and you will hear that sound in the shower for a year.` },
        { t: `Shield ${s.L} and bull straight through.`, test: 'grit', pass: () => `Head down. Arm over ${s.his} head. They hit you like hail made of teeth, and you just keep going, because stopping isn't one of the options. The gate. The gate. The gate.`, fail: () => `You make it thirty yards before the weight of them takes you to your knees. It's ${s.L} who drags you the rest of the way, and you both leave blood on the edge of the gate.` },
        { t: 'Be the distraction. Buy them time.', flag: 'sacrifice', r: () => `You pull out your flashlight, switch it on, and run the wrong way, whooping like it's the last day of school. Every bat in the sky turns to follow you. Behind you, small and getting smaller, ${crew()} reach${s.A ? '' : 'es'} the gate.` }
      ] }),
    () => ({ title: 'THE VOICE', sfx: 'chime', text: () => `No monster comes.\n\nInstead the red lightning freezes mid-fork, and the voice behind everything speaks, almost kindly. It says ${s.L} can go home. It says everyone can.\n\nAll it asks is that someday, back in Hawkins, you open one small door when it tells you to. A handshake's worth of trouble.`,
      choices: [
        { t: 'Refuse. Loudly.', test: 'heart', pass: () => `"No." Then louder. Then you're shouting every good thing you can think of: bike rides, bad pizza, ${s.L} laughing so hard milk came out. The frozen lightning cracks like ice. The voice, for the first time, sounds annoyed. You run through the gap.`, fail: () => `"No," you say, and it laughs, and the laugh goes through you like a cold key. It lets you leave. That's the part that will bother you later. It LET you leave.` },
        { t: `Keep it talking while ${s.L} crawls for the gate.`, test: 'wits', pass: () => `You ask about the door. You ask about terms. You haggle like your uncle buying a used Pinto, and behind your back your hand says go, go, go. By the time the voice notices, ${s.L} is through and you're diving after.`, fail: () => `You stall. It knows you're stalling; it has been listening to people stall since before your town had a name. It closes its attention on you like a fist, and you get out only because ${s.L} comes back for you.` },
        { t: 'Accept.', flag: 'bargain', r: () => `It doesn't shake your hand. It doesn't need to. Something small and cold settles at the back of your neck, like a coin dropped down your collar, and the way home opens wide and easy.` }
      ] })
  ];

  const CODAS = [
    `They rebuilt the fence the next week. Nobody said why.`,
    `The Hawkins Post called it a gas leak. The Hawkins Post always calls it a gas leak.`,
    `You never did get that sneaker back.`,
    `Your bike is still out there somewhere. You decided it can stay.`,
    `For a month afterward, every light bulb in the house burned out early.`,
    `At school, a kid you barely know slid you a note: "You saw it too. Basement of the AV room, Friday."`,
    `You sleep with the hall light on now. Nobody in your family mentions it.`,
    `Mr. Clarke gave you an A on your science fair project, "Theoretical Gates," and a very long look.`,
    `Somebody left a box of waffles on your porch. No note.`,
    `The compass on your desk still twitches at 9:47 every night.`
  ];
  const top = () => ['heart', 'wits', 'grit'].sort((a, b) => s[b] - s[a])[0];
  const ENDINGS = {
    vessel: ['VESSEL', () => `Everyone comes home. ${s.L} is fine. You're fine. The doctors say so.\n\nSometimes, in class, you catch yourself drawing a door. And some nights the back of your neck goes cold, and you sit up in bed, and you wait to be told which one.`],
    hold: ['HOLD THE DOOR', () => `You lasted four minutes on the wrong side, which is three and a half longer than anyone would've bet.\n\nThen a hand came through the closing gate, got a fistful of your collar, and pulled. ${s.L} never did learn how to do what ${s.he} was told. You have the scar, the story, and a ${s.rel} who owes you nothing, because you're even.`],
    flicker: ['FLICKERING', () => `The gate closed with you on the wrong side of it.\n\nBack home, ${s.L} strings every Christmas light in the house across the living room wall and paints the alphabet underneath. It takes you two days to work out how to reach them.\n\nThe first thing you spell is: S-T-I-L-L H-E-R-E.`],
    home: ['EVERYBODY COMES HOME', () => `You come out of the gate at sunrise, all of you, coughing and laughing and smelling like a wet basement.\n\n${s.L} sleeps for nineteen hours and wakes up asking for pancakes.${al(` ${s.A} swears you both to secrecy and then tells the story at lunch anyway, badly.`, '')} Nobody believes a word. It's the best breakfast of your life.`],
    shut: ['THE GATE STAYS SHUT', () => `Getting out was only half of it. You go back the next night${al(` with ${s.A}`, '')}, a car battery and every roll of duct tape in Hawkins, and you do something to that gate that Mr. Clarke would call "wildly unsafe" and "technically brilliant."\n\nIt hasn't glowed since. You check. Every Tuesday, 9:47.`],
    legend: ['LOCAL LEGEND', () => `By Monday, the story has grown. You fought it with a bat. You fought it with a car. You fought it with your bare hands and then made it apologize.\n\nYou don't correct anybody. ${s.L} just smiles into ${s.his} cereal. Down at the arcade, someone has entered your initials at the top of every machine.`],
    static: ['STATIC', () => `${s.L} came home. ${cap(s.he)} eats, ${s.he} laughs, ${s.he} is ${s.L}.\n\nBut the radio fuzzes when ${s.he} walks past it. And last night you heard the bathroom tap running at 3 a.m., and coughing, and something small and wet hitting the sink.`],
    cover: ['COVER STORY', () => `The white vans were waiting when you came out. Blankets. Cocoa. A woman with a friendly smile and a nine-page form.\n\nOfficially, ${s.L} got lost in the woods and you found ${s.him}. You signed. So did your parents. The check cleared. Sometimes a van is parked at the end of your street, and you wave, and nobody waves back.`],
    scar: ['THE SCAR', () => `You all made it. Mostly.\n\nIt left a mark on you, a pale line across the shoulder that no doctor can quite explain. It itches when storms come in. And twice now, when the lights have flickered, you have known a half second BEFORE they did.`],
    short: ['ONE SHORT', () => `You and ${s.L} came through the gate. You turned around to pull ${s.A} through after you.\n\nThere was no gate. There was a wall, and your own two handprints.\n\nThe posters go up Thursday. You put up most of them yourself. You haven't stopped looking, and you are not going to.`],
    poster: ['MISSING POSTER', () => `${s.L} stumbles out of the woods at dawn, alone, and can't say how.\n\nYour photo goes up at Melvald's, at the school, on the pole outside the arcade. It's last year's picture. You always hated that picture.\n\nSomewhere cold and dark, you keep walking, and you keep an eye out for a light.`],
    lights: ['LISTEN TO THE LIGHTS', () => `You didn't come home. But your note did its job.\n\nYour mom read it four times, then drove to the hardware store and bought every string of lights on the shelf. They're up in the living room now. She sits there every night, watching.\n\nTonight, one of them blinks. Then another. You've got a lot to tell her.`]
  };
  function ending() {
    const d = s.doom, t = top();
    if (s.bargain) return 'vessel';
    if (s.sacrifice) return d <= 2 ? 'hold' : 'flicker';
    if (d <= 1) return { heart: 'home', wits: 'shut', grit: 'legend' }[t];
    if (d <= 3) return { heart: 'static', wits: 'cover', grit: 'scar' }[t];
    return s.A ? 'short' : (s.note ? 'lights' : 'poster');
  }

  // ---------- engine ----------
  function start() {
    Synth.start('story');
    const P = pickFresh('premise', PREMISES.map((p, i) => ({ n: 'p' + i, p }))).p;
    s = { P, L: P.L, rel: P.rel, he: P.he, him: P.him, his: P.his, A: null, grit: 0, wits: 0, heart: 0, doom: 0 };
    queue = [hook, ally, pickFresh('loc', LOCATIONS.map((f, i) => ({ n: 'l' + i, f }))).f, pickFresh('thr', THREATS.map((f, i) => ({ n: 't' + i, f }))).f,
      cross, pick(FINDS), pickFresh('show', SHOWDOWNS.map((f, i) => ({ n: 's' + i, f }))).f];
    idx = 0; scene();
  }
  function typeOut(el, text, done) {
    let i = 0, fin = false; const tk = screenToken;
    const finish = () => { if (fin) return; fin = true; el.textContent = text; el.onclick = null; done(); };
    el.onclick = finish;
    (function step() {
      if (fin || tk !== screenToken) return;
      i += 2; el.textContent = text.slice(0, i);
      if (i % 6 === 0) Synth.sfx('type');
      if (i >= text.length) finish(); else setTimeout(step, 22);
    })();
  }
  function scene() {
    if (idx >= queue.length) return showEnding();
    const sc = queue[idx](); const st = screen();
    if (sc.sfx) Synth.sfx(sc.sfx); if (sc.bolt) lightning(true);
    const panel = h('div', 'panel fade'), body = h('div', 'story'), ch = h('div', 'choices');
    panel.append(body);
    const w = h('div', 'wrap'); w.append(h('div', 'chap', `CHAPTER ${idx + 1} OF ${queue.length}`), h('h2', 'h2 flick', sc.title), panel, ch);
    st.append(topbar('THE VANISHING'), w);
    typeOut(body, sc.text(), () => {
      sc.choices.forEach((c, k) => {
        const b = h('button', 'opt fade'); b.style.animationDelay = k * .12 + 's'; b.textContent = c.t;
        b.onclick = () => choose(c, body, ch); ch.append(b);
      });
    });
  }
  function choose(c, body, ch) {
    Synth.sfx('tap'); ch.innerHTML = '';
    let txt;
    if (c.test) { const ok = s[c.test] + (s.A ? 1 : 0) >= 3; if (!ok) { s.doom += 2; glitch(); Synth.sfx('bad'); } txt = (ok ? c.pass : c.fail)(); }
    if (c.fx) for (const k in c.fx) s[k] += c.fx[k];
    if (c.fx && c.fx.doom >= 2) { glitch(); Synth.sfx('bad'); }
    if (c.set) Object.assign(s, c.set);
    if (c.flag) s[c.flag] = true;
    if (!txt) txt = c.r();
    typeOut(body, txt, () => {
      const b = h('button', 'btn fade', idx === queue.length - 1 ? 'SEE HOW IT ENDS' : 'CONTINUE');
      b.onclick = () => { Synth.sfx('flip'); idx++; scene(); }; ch.append(b);
    });
  }
  function showEnding() {
    const key = ending(), E = ENDINGS[key];
    const found = store.get('endings', []); const isNew = !found.includes(key); if (isNew) { found.push(key); store.set('endings', found); }
    const good = ['home', 'shut', 'legend', 'hold'].includes(key);
    const st = screen(); lightning(true); Synth.sfx(good ? 'win' : 'lose'); if (good) FX.burst(120);
    const total = Object.keys(ENDINGS).length;
    const panel = h('div', 'panel endcard'), body = h('div', 'story'); body.style.textAlign = 'left';
    panel.append(h('div', 'no', `ENDING ${Object.keys(ENDINGS).indexOf(key) + 1} OF ${total}${isNew ? ' &middot; NEW!' : ''}`), h('h1', 'neon flick', E[0]), body);
    panel.querySelector('h1').style.fontSize = 'clamp(30px,7vw,64px)'; panel.querySelector('h1').style.margin = '10px 0 16px';
    const stats = h('div', 'statline', `<span class="chip">GRIT ${s.grit}</span><span class="chip">WITS ${s.wits}</span><span class="chip">HEART ${s.heart}</span><span class="chip">ENDINGS FOUND ${found.length}/${total}</span>`);
    const row = h('div', 'row'); const again = h('button', 'btn', 'TELL ANOTHER STORY'); again.onclick = start;
    const menu = h('button', 'btn ghost', 'MENU'); menu.onclick = () => Menu.show(); row.append(again, menu);
    const w = h('div', 'wrap'); w.append(panel, stats, row); st.append(w);
    typeOut(body, E[1]() + '\n\n' + pickFresh('coda', CODAS), () => {});
  }
  return { start };
})();
