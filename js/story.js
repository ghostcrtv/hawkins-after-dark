// "The Vanishing" — an original horror story set inside the world of the show. You are the main character.
// The opening, your ally, the location, the threat and the showdown are shuffled every game; choices decide the ending.
const Story = (function () {
  let s, queue, idx;
  const al = (yes, no) => s.A ? yes : no;
  const cap = t => t[0].toUpperCase() + t.slice(1);

  const PREMISES = [
    { L: 'Danny', rel: 'little brother', he: 'he', him: 'him', his: 'his',
      t: () => `Hawkins, Indiana. 1986.\n\nYour basement. Hour six of the campaign. Your little brother Danny rolls, and the d20 skitters off the table and under the stairs. He crawls in after it.\n\nThe bulb over the table buzzes, swells white, and dies.\n\nWhen it comes back, the die is sitting in the middle of the table. It shows a one. Danny is not under the stairs. Where he was, the concrete wall is wet, and bulging slowly outward, like something on the other side is leaning its face against it.` },
    { L: 'Jo', rel: 'best friend', he: 'she', him: 'her', his: 'her',
      t: () => `Hawkins, Indiana. 1986.\n\nYou wake at 3:04 a.m. because a clock is chiming. You don't own a clock that chimes.\n\nJo, who is sleeping over, is standing at the foot of your bed with her back to you. Her eyes have rolled white. Blood runs from her nose to her chin. Her feet are two inches off the carpet.\n\nAbove her the ceiling splits open like a wet red mouth. Something reaches down, wraps her ankle, and takes her up into it. The ceiling closes. One drop falls on your pillow.` },
    { L: 'Mom', rel: 'mom', he: 'she', him: 'her', his: 'her',
      t: () => `Hawkins, Indiana. 1986.\n\nThe kitchen phone rings. You answer. Static, breathing, and then your mother's voice, very far away: "Honey? I can see you. Why can't you see me?"\n\nYou turn around. The back door is open. Her cigarette is still burning in the ashtray. Every magnet on the fridge has slid to one side.\n\nThe Christmas lights you never took down begin to blink, one at a time, as if something is walking along the wall toward you.` },
    { L: 'Ray', rel: 'older brother', he: 'he', him: 'him', his: 'his',
      t: () => `Hawkins, Indiana. 1986.\n\nYou're in the garage holding the flashlight while your brother Ray works under the car. The radio is playing something good. Then it isn't playing anything. Just a low, wet clicking.\n\n"Ray?"\n\nYou crouch. Under the car there is no Ray. There is a hole in the concrete floor, ragged and red, breathing cold air up at you. His wrench lies at the edge. As you watch, something pulls the wrench in.` }
  ];
  const ALLIES = [
    { n: 'Steve', t: 'Call Steve Harrington. He keeps a bat full of nails in his trunk.', fx: { grit: 2 },
      r: () => `Steve pulls up in four minutes flat. Perfect hair. Scared eyes. He pops the trunk, and the bat is wrapped in a beach towel like something he's ashamed of.\n\n"Okay," he says. "Okay. How many of them, and how big?"` },
    { n: 'Nancy', t: 'Call Nancy Wheeler. She does not miss.', fx: { grit: 1, wits: 1 },
      r: () => `Nancy listens to all of it without interrupting. Then she takes a shoebox down from her closet and starts thumbing shells into a sawed-off shotgun as calmly as other girls put on lipstick.\n\n"Show me where."` },
    { n: 'Dustin', t: 'Radio Dustin Henderson. He always knows what it is.', fx: { wits: 2 },
      r: () => `"Slow down. SLOW down," Dustin says over the walkie. You can hear him pulling on shoes. "Did the lights flicker first? Is your compass acting weird? Do NOT go near it. I'm coming. Do you copy? Do NOT go near it."\n\nHe arrives with a backpack, a compass, and a face that says he has done this before and hated it.` },
    { n: 'Eddie', t: 'Find Eddie Munson. Everyone says he is a freak. Tonight you need one.', fx: { grit: 1, heart: 1 },
      r: () => `Eddie opens the trailer door with a guitar pick between his teeth. He hears you out, and the grin slides off his face a little at a time.\n\n"So it's real," he says quietly. "The stuff we roll dice about." He grabs his jacket and a trash can lid. "I run from things. You should know that going in. I'm trying to quit."` },
    { n: 'Robin', t: 'Call Robin Buckley. She notices everything.', fx: { wits: 1, heart: 1 },
      r: () => `"For the record, I had plans tonight, and by plans I mean a movie and not dying," Robin says, already lacing her shoes. "Tell me everything twice. You'll leave something out the first time. People always do."` }
  ];

  const hook = () => ({
    title: 'The Vanishing', scare: 1, text: s.P.t,
    choices: [
      { t: 'Go after ' + s.him + '. Right now.', fx: { grit: 1 }, r: () => `You don't think. If you think, you'll stop. You are on your bike and into the dark before the screen door finishes closing, and behind you every light in your house goes out at once.` },
      { t: 'Arm yourself first. Fire. They hate fire.', fx: { wits: 1 }, flag: 'gear', r: () => `Three minutes. A flashlight. A can of your mom's hairspray and a lighter. Your walkie. Everyone in Hawkins has heard the stories, and the ones who lived all say the same thing: it burns.` },
      { t: 'Leave a message. If you vanish too, someone has to know.', fx: { heart: 1 }, flag: 'note', r: () => `You write it on the fridge door in black marker, because paper can blow away.\n\n"SOMETHING TOOK ${s.L.toUpperCase()}. I WENT AFTER ${s.him.toUpperCase()}. IF THE LIGHTS BLINK, IT'S ME. TALK TO THEM."` }
    ]
  });
  const ally = () => {
    const two = shuffle(ALLIES).slice(0, 2);
    return {
      title: 'The Party', text: () => `You stop under the last working streetlight on Cornwallis.\n\nPeople who go into this alone end up on a poster at Melvald's. But every minute you spend finding help is a minute ${s.L} spends in the cold and the dark, with it.`,
      choices: two.map(a => ({ t: a.t, fx: a.fx, set: { A: a.n }, r: a.r })).concat([
        { t: 'There is no time. Go alone.', fx: { grit: 1, doom: 1 }, r: () => `Alone, then. Nobody to slow you down. Nobody to hear you if you scream.\n\nThe streetlight above you pops and goes dark, as if something agrees.` }
      ])
    };
  };
  const LOCATIONS = [
    () => ({ title: 'The Lab', text: () => `The trail of flickering lights ends at Hawkins National Laboratory.\n\nIt has been empty for years. Chains on the gate. Weeds in the lot. But down on the basement level one window glows a dull, pulsing red, and the chain-link fence is humming against your palm like a live wire.${al(`\n\n${s.A} looks up at the building. "Of course it's here. It's always here."`, '')}`,
      choices: [
        { t: 'Crawl in through the storm drain. A little girl got out that way once.', fx: { wits: 1 }, r: () => `The pipe is tight and stinks of rust and old water. Halfway through, your hand lands on something soft: a child's hospital gown, rotted to lace.\n\nYou come out inside the wire, unseen.` },
        { t: 'Climb the fence.', fx: { grit: 1, doom: 1 }, r: () => `At the top, the floodlights slam on by themselves. The building is supposed to have no power.\n\nYou drop and run with your sleeve torn open. Whatever is in there now knows exactly which door you're coming through.` },
        { t: 'Find the room with the rainbow on the wall. Kids were kept there.', fx: { heart: 1 }, r: () => `The paint is peeling but the rainbow is still there, and so are the toys, set out in a neat circle as if a game was interrupted.\n\nOne of the toys is ${s.L}'s house key. It's still warm.` }
      ] }),
    () => ({ title: 'The Lake', text: () => `Lover's Lake is flat and black and wrong.\n\nSixty feet out the water glows red from underneath, like a coal under a blanket. There are dead fish in a ring around it, hundreds of them, all pointing inward. A rowboat knocks softly against the dock.`,
      choices: [
        { t: 'Row out and look down.', fx: { grit: 1 }, r: () => `The glow is a tear in the lake bed, its edges moving like gills. Something long passes underneath the boat. Then it passes again, closer.\n\nYou take a breath you hope is not your last, and you dive.` },
        { t: 'Check your compass first.', fx: { wits: 1 }, r: () => `The needle swings off north and points dead at the glow. A gate throws an electromagnetic field strong enough to drag a compass.\n\nNow you know exactly where it is, how wide it is, and that it is getting wider.` },
        { t: `Call ${s.L}'s name across the water.`, fx: { heart: 1, doom: 1 }, r: () => `Your voice comes back from the middle of the lake half a second late and half a step too low.\n\nThen it comes back again, without you saying anything. Something out there is practicing being you.` }
      ] }),
    () => ({ title: 'The House', sfx: 'chime', text: () => `The old Creel house has been boarded up since 1959, when a family sat down to dinner there and most of them never got up.\n\nTonight the stained-glass rose over the door is lit from inside. Somewhere in the house a grandfather clock is ticking, slow as a pulse, loud enough to hear from the street.`,
      choices: [
        { t: 'Pry the boards off the front door.', fx: { grit: 1 }, r: () => `The nails scream coming out. The door swings inward on its own, as if the house was waiting to exhale.\n\nDust. Roses on the wallpaper. A dinner table still set for five. And spiders. So many spiders.` },
        { t: 'Go in through the cellar.', fx: { wits: 1 }, r: () => `Quiet and unseen, down into the cellar, where the walls are sweating and a crack in the foundation pulses like a vein.\n\nYou've found the gate without ever walking past that clock.` },
        { t: `Whisper ${s.L}'s name through the mail slot.`, fx: { heart: 1, doom: 1 }, r: () => `The ticking stops.\n\nIn the silence, from the attic, a voice like wet gravel says your name. Not ${s.L}'s. Yours. Your full name, the way it's written on your birth certificate.` }
      ] }),
    () => ({ title: 'The Mall', text: () => `What's left of Starcourt Mall is a burned skeleton behind a fence of CONDEMNED signs. Thirty people died here on the Fourth of July. The papers said fire.\n\nThe neon is dead. The power has been cut for a year.\n\nSo why is the ice cream jingle playing?`,
      choices: [
        { t: 'Use the loading dock, the way the Russians did.', fx: { wits: 1 }, r: () => `The dock door is warped open. Down the service hall is a steel door with a keypad and a faded red star, and past it an elevator shaft going down, and down, breathing cold air up at you from somewhere very far below.` },
        { t: 'Go straight through the food court.', fx: { grit: 1, doom: 1 }, r: () => `Glass crunches like frost. In the middle of the food court the floor is scorched in the shape of something enormous with too many legs.\n\nThe shape is old. The wet footprints leading away from it are not.` },
        { t: 'Follow the music.', fx: { heart: 1 }, r: () => `The jingle leads to the ice cream counter. A melted sailor hat. A scoop still in the tub.\n\nOn the freezer door, pressed into the frost from the inside, is a handprint. ${cap(s.his)} size. Beside it, much larger, is another.` }
      ] })
  ];
  const THREATS = [
    () => ({ title: 'The Pack', scare: 1, dread: 1, text: () => `You hear them before you see them. Claws on tile. A chittering, clicking purr.\n\nThey come out of the dark low and fast: four of them, dog-sized, no eyes, no face at all until the whole head splits open like a wet flower lined with teeth.\n\nDemodogs.${al(` ${s.A} breathes one word, and it's not a nice one.`, '')}`,
      choices: [
        { t: 'Fire.', fx: { wits: 1 }, r: () => s.gear ? `Hairspray and a lighter make six feet of dragon's breath. The lead one goes up shrieking and the rest scatter, and the smell is something you'll be tasting until Christmas.` : `No lighter. But there's a road flare in the emergency box on the wall and it catches on the first strike. The pack screams and breaks from the red light, all four heads snapping shut at once.` },
        { t: 'Throw the candy bar in your pocket. Nougat. Then run.', fx: { heart: 1 }, r: () => `A kid named Henderson swears one of these things once loved 3 Musketeers. You throw it. The pack piles onto the nougat like a religious experience.\n\nYou do not stay to see who wins.` },
        { t: 'Stand perfectly still.', fx: { doom: 2 }, r: () => `They don't have eyes. They never needed eyes.\n\nYou work this out one second too late. Getting away costs you a shoe, a strip of your calf, and the last of the idea that you might be in control of tonight.` }
      ] }),
    () => ({ title: 'The Vines', dread: 1, text: () => `The floor here is carpeted in vines. Gray, slick, thick as your wrist, and every one of them connected to every other.\n\nYou step over the first. ${al(`${s.A} doesn't quite clear the second.`, `Your heel doesn't quite clear the second.`)}\n\nA vine whips tight around an ankle. Then one closes around a throat. And the whole room wakes up.`,
      choices: [
        { t: 'Burn it.', fx: { wits: 1 }, r: () => `${s.gear ? 'The lighter does it.' : 'You jam a sparking wire from the wall into it.'} The vine shrieks without a mouth and lets go.\n\nEverything in the hive felt that. Every vine. Every creature. One mind. It knows your face now. But you're breathing.` },
        { t: 'Tear it off with your hands.', fx: { grit: 1, doom: 1 }, r: () => `You get loose with your palms slick and stinging. But every vine you rip makes the walls flinch, and far away, something very large turns its attention toward the pain.` },
        { t: 'Go limp. Maybe it will let go.', fx: { doom: 2 }, r: () => `It does not let go. It pulls.\n\nBy the time you thrash free you've been dragged forty feet into the dark, something has been down your throat as far as your collarbone, and you can still taste it.` }
      ] }),
    () => ({ title: 'The Clock', sfx: 'chime', scare: 1, dread: 1, text: () => `A grandfather clock chimes. Four times.\n\nYour nose is bleeding. The room is gone. You're standing in red fog among floating wreckage, and in front of you is a clock with a cracked face, and beyond it a tall figure made of burned flesh and vines, who has been watching you for a very long time.\n\n"It is time," he says.\n\nBack in the real world, your feet leave the ground.`,
      choices: [
        { t: 'Find your favorite song. Run toward it.', fx: { heart: 1 }, r: () => `${al(`Out in the real world, ${s.A} is jamming headphones over your ears and screaming your name.`, `Out in the real world, your thumb finds PLAY on the Walkman in your jacket.`)}\n\nThe song you've rewound a thousand times tears a hole of daylight in the fog. You run for it. Things grab at your legs. You run for it like the last bus out of town.` },
        { t: 'Fight him.', fx: { grit: 1, doom: 1 }, r: () => `You swing. He catches your wrist without looking, and where his fingers close you feel the bone begin to turn.\n\nYou wake on the floor screaming, with five black bruises on your arm in the shape of a hand. But you wake.` },
        { t: 'Listen to what he wants to show you.', fx: { doom: 2 }, r: () => `He shows you the worst thing you ever did. Then the worst thing that was ever done to you. Then a version of tonight where you're too late.\n\nYou come back eight minutes later with no memory of falling, and a part of you still in there with him.` }
      ] }),
    () => ({ title: 'The Flayed', scare: 1, dread: 1, text: () => `Mr. Tolliver from the hardware store is standing in the middle of the road.\n\nHe is not blinking. He is sweating through his shirt in the cold. Black veins crawl up his neck. Behind him stand eleven more people from town, all perfectly still, all facing you.\n\n"You shouldn't have looked for ${s.him}," Mr. Tolliver says, in a voice with other voices underneath it. "Now we have to see you."`,
      choices: [
        { t: 'Heat. The thing inside them cannot stand heat.', fx: { wits: 1 }, r: () => `${s.gear ? 'Your lighter and the hairspray.' : 'A burning branch from a trash-can fire.'} You don't have to touch him. He recoils from the heat, arching, something moving under the skin of his face.\n\nAll twelve of them scream in one voice. You run through the gap.` },
        { t: `Talk to him. "Mr. Tolliver. You sold me my first bike."`, fx: { heart: 1 }, r: () => `For one second his real eyes surface, wet and terrified. "Run," he whispers, in only his own voice.\n\nThen they go flat again. But one second is enough.` },
        { t: 'Push through them.', fx: { grit: 1, doom: 2 }, r: () => `Their hands are hot and damp and there are so many of them. Someone's teeth close on your shoulder. A woman you've known your whole life tries to push something into your mouth.\n\nYou tear free. You don't check what you swallowed.` }
      ] })
  ];
  const cross = () => ({ title: 'The Other Side', scare: 1, text: () => `The gate is a wound in the world. Wet, red, and just wide enough.\n\nYou push through the membrane and come out in the same place. Except colder. Except darker. Except everything is draped in vines and the air is full of drifting white flecks, and the sky is storm and red lightning with no rain.\n\nThe Upside Down.\n\nA newspaper is lying at your feet. It's dated November 6, 1983. Everything here is.\n\nAnd somewhere ahead, faint: ${pick([`someone humming`, `a wet cough`, `a flashlight clicking on and off`, `footsteps that stop when yours do`])}.`,
    choices: [
      { t: 'Mark your trail so you can find the way back.', fx: { wits: 1 }, flag: 'trail', r: () => `You tie strips of your shirt to the vines every twenty feet. They twitch when you touch them. It's slow. It may also be the only smart thing anyone does tonight.` },
      { t: `Follow the sound, calling quietly for ${s.L}.`, fx: { heart: 1 }, r: () => `"${s.L}?"\n\nA pause. Then, from deeper in, three knocks on something hollow. You know that knock. You've known it your whole life.\n\nIt knocks again. It's not coming from where the first one did.` },
      { t: 'Run. Every second here is a second it can smell you.', fx: { grit: 1, doom: 1 }, r: () => `You cover ground fast and breathe deep, which means breathing them: the flecks.\n\nYou cough something gray and moving into your fist, and decide not to look at it.` }
    ] });
  const FINDS = [
    () => ({ title: 'Found', scare: 1, text: () => `${s.L} is in the dark twin of the public library, webbed to the wall between the stacks.\n\nEyes closed. Skin gray. A vine as thick as a garden hose runs from the wall into ${s.his} mouth, and it is moving. Pulsing. Feeding ${s.him}, or feeding on ${s.him}.\n\nThere are others on the wall. They've been here much longer. You don't look at the others.${al(`\n\n${s.A} whispers, "Is ${s.he} breathing?"`, '')}`,
      choices: [
        { t: 'Ease the vine out. Slow.', fx: { heart: 1 }, r: () => `It comes out hand over hand, a foot and a half of it, wet and warm and trying to hold on. It is the longest minute of your life.\n\nThen ${s.L} gags, gasps, and grabs your jacket with both fists.` },
        { t: 'Cut the webbing first, then the vine.', fx: { wits: 1 }, r: () => `Smart. With ${s.his} arms free, ${s.L} helps you, choking, pulling, until the last of it slides out and hits the floor and crawls away under a shelf.\n\n${cap(s.he)} is weak. But ${s.he} is walking.` },
        { t: 'Rip everything loose and go.', fx: { grit: 1, doom: 1 }, r: () => `It works. It's also loud. The wall you tore ${s.him} from shudders all the way up to the ceiling, and beyond the ceiling, and beyond that.\n\nOutside, something answers.` }
      ] }),
    () => ({ title: 'Found', text: () => `${s.L} isn't trapped. ${s.L} is hiding.\n\nA fort of branches and an old tarp in the woods. Somebody's childhood hideout, grown over with rot. Inside, ${s.L} is hugging ${s.his} knees and whispering the same sentence over and over.\n\n"It only comes when the lights flicker. It only comes when the lights flicker."\n\n${cap(s.he)} looks up. "I counted. Eleven times. It gets closer every time."`,
      choices: [
        { t: 'Hold ' + s.him + '. Questions later.', fx: { heart: 1 }, r: () => `${cap(s.he)} is freezing and shaking and real. For three seconds nothing else in either world matters.\n\nThen, far off through the trees, every dead streetlight in the Upside Down flickers at once.\n\n"Twelve," ${s.L} says.` },
        { t: 'Ask what it does when it comes.', fx: { wits: 1 }, r: () => `"It doesn't look. It doesn't have a face. It smells," ${s.L} says. "I cut my hand and it came straight to me. It likes blood."\n\nYou look down at your own scraped knuckles. Horrible. But useful.` },
        { t: `Get ${s.him} up. Move. Now.`, fx: { grit: 1 }, r: () => `No speeches. You get ${s.his} arm over your shoulder and go. ${cap(s.he)} keeps up. Barely.\n\nBehind you, the fort collapses under the weight of something landing on it.` }
      ] })
  ];
  const crew = () => s.A ? `${s.L} and ${s.A}` : s.L;
  const SHOWDOWNS = [
    () => ({ title: 'The Monster', scare: 1, dread: 1, text: () => `The lights flicker.\n\nIt unfolds out of the dark between you and the way home. Seven feet tall. Gray, wet skin. Arms too long. No eyes, no nose, no face at all, until the head peels open like a flower, and every petal is lined with teeth, and it screams.\n\nThe Demogorgon.`,
      choices: [
        { t: 'Stand and fight.', test: 'grit', pass: () => `You've been afraid all night, and somewhere back there the fear burned down into something harder. You hit it with everything.${al(` ${s.A} hits it with everything else.`, '')}\n\nIt staggers. It actually staggers. You don't wait for a second opinion.`, fail: () => `You swing. It catches. For one long second you're off the ground with that open face an inch from yours, breath like a butcher's drain.\n\nThen ${s.L} is screaming and pulling, and you tear loose, leaving it your jacket and a mouthful of your shoulder.` },
        { t: 'It hunts blood. Give it blood somewhere else.', test: 'wits', pass: () => `You drag your bleeding palm down a dead branch and throw it as far as you can. The petal-face snaps toward the smell, and the thing lopes after it on all fours.\n\nYou have maybe ninety seconds. You use eighty.`, fail: () => `Good idea. Bad throw. The branch lands twenty feet away. The thing turns its head toward it, then slowly back to you, where the smell is so much stronger.\n\nYou run. It's faster than anything that size should be.` },
        { t: `Send ${crew()} ahead. Keep it here.`, flag: 'sacrifice', r: () => `"Go," you say, and you make it sound like you have a plan.\n\n${s.L} looks at you one second too long, then runs. You turn around. It tilts its head. You pick up a rock, and it opens its face.` }
      ] }),
    () => ({ title: 'The Swarm', scare: 1, dread: 1, text: () => `A sound like a thousand wet umbrellas opening.\n\nThe sky above you is moving. Bats, but not bats: leathery things with tails like whips and mouths that open four ways, a tornado of them funneling down out of the red storm.\n\nThe gate is two hundred yards away across open ground.`,
      choices: [
        { t: 'Turn your walkie to full static and throw it.', test: 'wits', pass: () => `The squeal carries across the dead field. The whole swarm banks toward it like one animal.\n\nNobody in the history of Hawkins has run two hundred yards faster than you do right now.`, fail: () => `Half the swarm takes the bait. Half is still hundreds.\n\nA tail wraps your throat from behind and pulls you off your feet, and you're dragged ten yards on your back before you saw through it with your house key. You'll wear that scar like a collar.` },
        { t: `Cover ${s.L} and run straight through.`, test: 'grit', pass: () => `Head down. Arm over ${s.his} head. They hit you like hail made of teeth, and you keep going, because stopping isn't one of the options.\n\nThe gate. The gate. The gate.`, fail: () => `You make it thirty yards before the weight of them takes you to your knees. They're in your hair. One is at your stomach.\n\nIt's ${s.L} who drags you the rest of the way, and you both leave blood on the edge of the gate.` },
        { t: 'Be the distraction. Buy them time.', flag: 'sacrifice', r: () => `You switch on your flashlight and run the wrong way, howling like it's the last day of school.\n\nEvery one of them turns to follow you. Behind you, small and getting smaller, ${crew()} reach${s.A ? '' : 'es'} the gate.` }
      ] }),
    () => ({ title: 'The Voice', sfx: 'chime', dread: 1, text: () => `Nothing attacks.\n\nThe red lightning freezes mid-fork. The flecks hang still in the air. And the voice from the clock speaks from everywhere, almost gently.\n\nHe says ${s.L} can go home. He says you all can. He has no use for you. Not yet.\n\n"One day I will ask you to open a door. A small one. You will hardly notice. Say yes, and walk out of here."`,
      choices: [
        { t: 'Refuse.', test: 'heart', pass: () => `"No."\n\nThen louder. Then you're shouting every good thing you can think of: bike rides, bad pizza, ${s.L} laughing so hard milk came out. Things he never had and cannot stand.\n\nThe frozen lightning cracks like ice. For the first time the voice sounds less than certain. You run through the gap.`, fail: () => `"No," you say, and he laughs, and the laugh goes into you like a cold key into a lock.\n\nHe lets you leave. That is the part that will keep you awake. He LET you leave.` },
        { t: `Keep him talking while ${s.L} crawls for the gate.`, test: 'wits', pass: () => `You ask about the door. You ask about terms. You haggle like your uncle buying a used Pinto, and behind your back your hand says go, go, go.\n\nBy the time he notices, ${s.L} is through and you are diving after.`, fail: () => `You stall. He knows you're stalling. He has listened to people beg and bargain since before you were born.\n\nHis attention closes on you like a fist. Something in your arm snaps. You get out only because ${s.L} comes back for you.` },
        { t: 'Say yes.', flag: 'bargain', r: () => `He doesn't shake your hand. He doesn't need to.\n\nSomething small and cold settles at the back of your neck, like a coin dropped down your collar. The way home opens, wide and easy. Nobody stops you. Nothing even looks at you.` }
      ] })
  ];

  const CODAS = [
    `The Hawkins Post called it a gas leak. The Hawkins Post always calls it a gas leak.`,
    `For a month afterward, every light bulb in your house burned out early.`,
    `You sleep with the hall light on now. Nobody in your family mentions it.`,
    `Somebody left a box of frozen waffles on your porch. No note.`,
    `The compass on your desk still twitches at 3:04 every night.`,
    `You never went down to the basement again.`,
    `At school a kid you barely know slid you a note: "You saw it too. AV room, Friday. Come alone."`,
    `Sometimes the phone rings once, and there's only static, and you stay on the line anyway.`,
    `You kept the newspaper. November 6, 1983. You don't know why.`,
    `In the spring, they found the fence around the lab cut open. From the inside.`
  ];
  const top = () => ['heart', 'wits', 'grit'].sort((a, b) => s[b] - s[a])[0];
  const ENDINGS = {
    vessel: ['Vessel', () => `Everyone comes home. ${s.L} is fine. You're fine. The doctors say so.\n\nBut sometimes, in class, you catch yourself drawing a door. The same door, over and over, pressing so hard the pencil tears the page.\n\nAnd some nights the back of your neck goes cold, and you sit up in the dark, wide awake and perfectly calm, and you wait to be told which one.`],
    hold: ['Hold the Door', () => `You lasted four minutes alone on the wrong side. Nobody would have bet on two.\n\nThen a hand came through the closing gate, got a fistful of your collar, and pulled. ${s.L} never did learn to do what ${s.he} was told.\n\nYou have the scars, and the story, and you are even.`],
    flicker: ['Still Here', () => `The gate closed with you on the wrong side of it.\n\nBack home, ${s.L} strings every Christmas light in the house across the living room wall and paints the alphabet underneath. It takes you two days in the dark to work out how to reach them.\n\nThe first thing you spell is: S-T-I-L-L  H-E-R-E.\n\nThe second thing is: N-O-T  A-L-O-N-E.`],
    home: ['Everybody Comes Home', () => `You come out of the gate at sunrise, all of you, coughing and laughing and smelling like a flooded basement.\n\n${s.L} sleeps for nineteen hours and wakes up asking for pancakes.${al(` ${s.A} swears everyone to secrecy, then looks at you across the table, and nods once. That's all. That's enough.`, '')}\n\nNobody would believe a word of it. It's the best breakfast of your life.`],
    shut: ['The Gate Stays Shut', () => `Getting out was only half of it.\n\nYou go back the next night${al(` with ${s.A}`, '')}, with a car battery, a can of gasoline and every roll of duct tape in Hawkins, and you do something to that gate that Mr. Clarke would call "wildly unsafe" and "technically brilliant."\n\nIt hasn't glowed since. You check. Every night, 3:04.`],
    legend: ['Local Legend', () => `By Monday the story has grown. You fought it with a bat. You fought it with a car. You fought it with your bare hands and made it apologize.\n\nYou don't correct anybody. ${s.L} just smiles into ${s.his} cereal.\n\nOnly the two of you know that you still check the closet before bed. Both of you. Every night.`],
    static: ['Static', () => `${s.L} came home. ${cap(s.he)} eats. ${cap(s.he)} laughs. ${cap(s.he)} is ${s.L}.\n\nBut the radio fuzzes when ${s.he} walks past it. ${cap(s.he)} keeps the house so cold.\n\nAnd last night you heard the bathroom tap running at 3 a.m., and coughing, and something small and wet hitting the sink, and then ${s.his} voice, very quietly, talking to it.`],
    cover: ['Cover Story', () => `White vans were waiting when you came out. Blankets. Cocoa. A woman with a kind smile and a nine-page form.\n\nOfficially, ${s.L} got lost in the woods and you found ${s.him}. You signed. So did your parents. The check cleared.\n\nA van parks at the end of your street most nights now. You wave. Nobody waves back. And you've started to wonder what happens to the kids who don't sign.`],
    scar: ['The Mark', () => `You all made it. Mostly.\n\nIt left something on you: a pale mark across the shoulder that no doctor can explain. It itches when storms come in.\n\nAnd twice now, when the lights have flickered, you have known half a second BEFORE they did. Like something on the other end of a string had tugged.`],
    short: ['One Short', () => `You and ${s.L} came through the gate. You turned around to pull ${s.A} through after you.\n\nThere was no gate. There was a wall, and your own two handprints, and from the other side, very faintly, somebody pounding.\n\nThen not pounding.\n\nThe posters go up Thursday. You staple most of them yourself. You have not stopped looking. You are not going to.`],
    poster: ['Missing', () => `${s.L} stumbles out of the woods at dawn, alone, and can't say how.\n\nYour photo goes up at Melvald's, at the school, on the pole outside the arcade. HAVE YOU SEEN ME? It's last year's picture. You always hated that picture.\n\nSomewhere cold, in a town where it is always November 1983, you keep walking. You keep quiet. And you watch for a light.`],
    lights: ['Talk to the Lights', () => `You didn't come home. But your message did its job.\n\nYour mom read the fridge door four times. Then she drove to the hardware store and bought every string of Christmas lights on the shelf.\n\nThey're up in the living room now. She sits there every night with a cigarette and a paintbrush, watching.\n\nTonight one of them blinks. Then another. You've got a lot to tell her.`]
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
  async function start() {
    Synth.start('story'); screen();
    await banner(`<div class="sub">a story that happens to you</div><h1 class="neon flick" style="font-size:clamp(40px,10vw,96px)">The Vanishing</h1>
      <div class="say">Turn the lights off. Turn the sound up.<br>Every choice changes how this ends.<br>Not all of the endings let you leave.</div><div class="sub blink">tap to begin</div>`);
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
      if (i >= text.length) finish(); else setTimeout(step, text[i - 1] === '\n' ? 260 : 24);
    })();
  }
  function scene() {
    if (idx >= queue.length) return showEnding();
    const sc = queue[idx](); const st = screen('play' + (sc.dread ? ' dread' : ''));
    if (sc.scare) later(scare, 500); if (sc.sfx) Synth.sfx(sc.sfx);
    Synth.sfx('drone');
    if (sc.dread) every(() => Synth.sfx('heart', .7), 850);
    const panel = h('div', 'panel fade'), body = h('div', 'story'), ch = h('div', 'choices');
    panel.append(body);
    const w = h('div', 'wrap'); w.append(h('div', 'chap', `CHAPTER ${idx + 1} OF ${queue.length}`), h('h2', 'h2 flick', sc.title), panel, ch);
    st.append(topbar('The Vanishing'), w);
    typeOut(body, sc.text(), () => {
      sc.choices.forEach((c, k) => {
        const b = h('button', 'opt fade'); b.style.animationDelay = k * .12 + 's'; b.textContent = c.t;
        b.onclick = () => choose(c, body, ch); ch.append(b);
      });
    });
  }
  function choose(c, body, ch) {
    Synth.sfx('tap'); ch.innerHTML = '';
    let txt, hurt = false;
    if (c.test) { const ok = s[c.test] + (s.A ? 1 : 0) >= 3; if (!ok) { s.doom += 2; hurt = true; } txt = (ok ? c.pass : c.fail)(); }
    if (c.fx) for (const k in c.fx) s[k] += c.fx[k];
    if (c.fx && c.fx.doom >= 2) hurt = true;
    if (hurt || c.flag === 'sacrifice' || c.flag === 'bargain') scare(); else Synth.sfx('whoosh');
    if (c.set) Object.assign(s, c.set);
    if (c.flag) s[c.flag] = true;
    if (!txt) txt = c.r();
    typeOut(body, txt, () => {
      const b = h('button', 'btn fade', idx === queue.length - 1 ? 'See how it ends' : 'Continue');
      b.onclick = () => { Synth.sfx('flip'); idx++; scene(); }; ch.append(b);
    });
  }
  function showEnding() {
    const key = ending(), E = ENDINGS[key];
    const found = store.get('endings', []); const isNew = !found.includes(key); if (isNew) { found.push(key); store.set('endings', found); }
    const good = ['home', 'shut', 'legend', 'hold'].includes(key);
    const st = screen(); Synth.sting('story'); if (good) { lightning(true); FX.burst(120); } else scare();
    const total = Object.keys(ENDINGS).length;
    const panel = h('div', 'panel endcard'), body = h('div', 'story'); body.style.textAlign = 'left';
    panel.append(h('div', 'no', `ENDING ${Object.keys(ENDINGS).indexOf(key) + 1} OF ${total}${isNew ? ' &middot; NEW' : ''}`), h('h1', 'neon flick', E[0]), body);
    panel.querySelector('h1').style.fontSize = 'clamp(30px,7vw,64px)'; panel.querySelector('h1').style.margin = '12px 0 18px';
    const stats = h('div', 'statline', `<span class="chip">GRIT ${s.grit}</span><span class="chip">WITS ${s.wits}</span><span class="chip">HEART ${s.heart}</span><span class="chip">ENDINGS FOUND ${found.length}/${total}</span>`);
    const row = h('div', 'row'); const again = h('button', 'btn', 'Tell another story'); again.onclick = start;
    const menu = h('button', 'btn ghost', 'Menu'); menu.onclick = () => Menu.show(); row.append(again, menu);
    const w = h('div', 'wrap'); w.append(panel, stats, row); st.append(w);
    typeOut(body, E[1]() + '\n\n' + pickFresh('coda', CODAS), () => {});
  }
  return { start };
})();
