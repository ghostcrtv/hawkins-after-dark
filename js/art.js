// Original icons drawn for this game (64x64). Classes: .f = solid fill, .t = soft tint fill.
const Art = (function () {
  const tx = (x, y, s, str, font) => `<text class="f" x="${x}" y="${y}" font-size="${s}" text-anchor="middle" font-family="${font || 'Special Elite,monospace'}">${str}</text>`;
  const bulb = (x, y) => `<path class="f" d="M${x - 3} ${y}h6v4h-6z"/><ellipse class="t" cx="${x}" cy="${y + 11}" rx="4.5" ry="7.5"/>`;
  const I = {
    // the alphabet wall
    lights: `<path d="M1 8Q32 22 63 8"/>${bulb(10, 11)}${bulb(21, 14)}${bulb(32, 15)}${bulb(43, 14)}${bulb(54, 11)}${tx(32, 58, 21, 'R U N')}`,
    // the bat with nails
    nailbat: `<path class="t" d="M9 52L13 56L52 22Q60 11 54 5Q47 0 38 9Z"/><circle class="f" cx="9" cy="56" r="4.5"/><path d="M34 13l-8-6M41 7l-4-7M49 3l2-3M56 14l8-3M52 23l9 4M45 30l6 8M30 19l-9 1M38 37l4 8M17 45l5 5M22 40l5 5"/>`,
    walkie: `<rect class="t" x="19" y="20" width="26" height="42" rx="4"/><path d="M26 20V1M26 1h0"/><path class="f" d="M36 13h6v7h-6zM14 27h5v12h-5z"/><path d="M25 28h14M25 32h14M25 36h14M25 40h14"/><rect class="f" x="25" y="46" width="14" height="7" rx="1"/><circle class="f" cx="32" cy="57" r="1.6"/>`,
    eggo: `<path d="M1 55h62"/><rect class="t" x="7" y="43" width="50" height="10" rx="5"/><rect class="t" x="10" y="32" width="44" height="10" rx="5"/><rect class="t" x="13" y="21" width="38" height="10" rx="5"/><path d="M19 22v8M26 22v8M33 22v8M40 22v8M17 33v8M25 33v8M33 33v8M41 33v8M48 33v8M15 44v8M24 44v8M33 44v8M42 44v8M50 44v8"/><rect class="f" x="25" y="13" width="13" height="8" rx="1.5"/><path class="f" d="M47 26q6 2 5 9q-1 5 -3 0z"/>`,
    d20: `<path class="t" d="M32 3L57 17.5V46.5L32 61L7 46.5V17.5Z"/><path d="M32 17L47 43H17ZM32 17V3M32 17L7 17.5M32 17L57 17.5M47 43L57 17.5M47 43L57 46.5M47 43L32 61M17 43L32 61M17 43L7 46.5M17 43L7 17.5"/>${tx(32, 38.5, 13, '20')}`,
    // the ice cream shop sailor hat
    hat: `<path class="t" d="M10 32Q14 8 32 8Q50 8 54 32Z"/><path d="M32 8V4"/><circle class="f" cx="32" cy="4" r="2.5"/><rect x="5" y="32" width="54" height="13" rx="4"/>${tx(32, 42.5, 10, 'AHOY')}<path class="f" d="M44 45l5 15l4-5l5 3l-7-13z"/>`,
    // headphones and tape player
    walkman: `<path d="M13 28V22a19 19 0 0 1 38 0V28"/><rect class="f" x="7" y="26" width="10" height="16" rx="4"/><rect class="f" x="47" y="26" width="10" height="16" rx="4"/><rect class="t" x="19" y="40" width="26" height="22" rx="3"/><rect x="23" y="44" width="18" height="9" rx="1.5"/><circle class="f" cx="28" cy="48.5" r="2"/><circle class="f" cx="36" cy="48.5" r="2"/><path d="M24 57h5M33 57h8M52 42q6 10-7 12"/>`,
    clock: `<path class="t" d="M19 62V14Q32 -2 45 14V62Z"/><circle cx="32" cy="19" r="9.5"/><path d="M32 19V12.5M32 19l5 3M19 33H45M32 33V47"/><path class="f" d="M27 13l3 5l-3 3l4 5l-2 3l-4-5l2-4z"/><circle class="f" cx="32" cy="51" r="4.5"/><path d="M14 62h36"/>`,
    bike: `<circle class="t" cx="13" cy="45" r="11"/><circle class="t" cx="50" cy="45" r="11"/><path d="M13 45L25 27H42L50 45M25 27L31 45H13M31 45L42 27M20 22h11M42 27l-3-11h8"/><circle class="f" cx="31" cy="45" r="2.5"/><path d="M51 12l11-5M52 16h12M51 20l11 5"/>`,
    // wrist rocket
    slingshot: `<path d="M32 62V40M32 40Q16 36 15 12M32 40Q48 36 49 12" stroke-width="5"/><path d="M15 12Q32 34 49 12" stroke-width="1.6"/><rect class="f" x="27" y="19" width="10" height="7" rx="2"/><path d="M28 48h8M28 53h8M28 58h8" stroke-width="1.6"/><circle class="f" cx="32" cy="7" r="4"/><path d="M26 3l-3-3M38 3l3-3"/>`,
    skate: `<path class="t" d="M13 6h15v19l24 7q7 2 7 11H13Z"/><path d="M13 43h46M17 13h9M17 19h9M17 25h9M28 25l10 3"/><circle class="t" cx="22" cy="54" r="6.5"/><circle class="t" cx="48" cy="54" r="6.5"/><circle class="f" cx="22" cy="54" r="2"/><circle class="f" cx="48" cy="54" r="2"/><path class="f" d="M5 44h8v6h-5z"/>`,
    pizza: `<path class="t" d="M32 62L6 14Q32 0 58 14Z"/><path d="M11 22Q32 11 53 22"/><circle class="f" cx="24" cy="25" r="4"/><circle class="f" cx="41" cy="27" r="4"/><circle class="f" cx="32" cy="43" r="4"/><path d="M30 30l5 3l-5 3zM22 37l4 1M40 38l-3 4"/><path class="f" d="M12 26q-5 8-1 12q4-2 3-8z"/>`,
    arcade: `<path class="t" d="M16 62V20L23 3H41L48 20V62Z"/><path d="M16 36H48M23 3l-3 7h24l-3-7"/><rect x="22" y="13" width="20" height="16"/><path class="f" d="M27 17h3v3h-3zM34 17h3v3h-3zM27 23h10v3h-10zM24 20h3v3h-3zM37 20h3v3h-3z"/><path d="M27 41v6"/><circle class="f" cx="27" cy="40" r="2.5"/><circle class="f" cx="37" cy="43" r="2"/><circle class="f" cx="42" cy="41" r="2"/><rect x="24" y="52" width="16" height="6"/>`,
    camera: `<rect class="t" x="4" y="20" width="56" height="34" rx="4"/><path d="M20 20l3-8h14l3 8"/><circle cx="30" cy="37" r="12"/><circle class="t" cx="30" cy="37" r="7"/><circle class="f" cx="27" cy="34" r="2"/><rect class="f" x="47" y="24" width="9" height="6" rx="1"/><rect class="f" x="7" y="15" width="8" height="5"/><path d="M52 8l2 4M58 9l-2 4M47 10l3 3"/>`,
    compass: `<circle class="t" cx="32" cy="34" r="25"/><circle cx="32" cy="34" r="19"/><path class="f" d="M32 17L37 34H27Z"/><path d="M27 34L32 51L37 34"/><circle class="f" cx="32" cy="34" r="2.5"/><path d="M32 9V3M27 3h10M8 16q-6 8-5 20M56 16q6 8 5 20"/>`,
    // the gate
    rift: `<path class="t" d="M32 1L22 15L33 24L18 37L30 45L20 63L45 45L33 37L48 24L37 15Z"/><path d="M22 29q-12-4-18 6M43 33q10-2 17-12M24 51q-10 2-12 12M41 12q8-4 10-11"/><circle class="f" cx="4" cy="36" r="2"/><circle class="f" cx="60" cy="20" r="2"/><circle class="f" cx="12" cy="62" r="2"/>`,
    boombox: `<rect class="t" x="3" y="20" width="58" height="36" rx="4"/><path d="M13 20V9H51V20"/><circle cx="16" cy="40" r="9"/><circle class="f" cx="16" cy="40" r="3.5"/><circle cx="48" cy="40" r="9"/><circle class="f" cx="48" cy="40" r="3.5"/><rect x="27" y="27" width="10" height="9"/><path d="M27 42h10M27 47h10M27 52h10M55 20l6-18"/>`,
    // the wall phone
    phone: `<rect class="t" x="17" y="14" width="30" height="46" rx="5"/><path class="f" d="M9 9Q32 -3 55 9V20H45V14Q32 9 19 14V20H9Z"/><circle cx="32" cy="38" r="10"/><circle class="f" cx="32" cy="38" r="3"/><circle class="f" cx="32" cy="31" r="1.3"/><circle class="f" cx="38" cy="35" r="1.3"/><circle class="f" cx="38" cy="42" r="1.3"/><circle class="f" cx="26" cy="35" r="1.3"/><circle class="f" cx="26" cy="42" r="1.3"/><path d="M19 54q-9 2-8 8M11 62q8 2 6-4"/>`,
    flashlight: `<path class="t" d="M3 26H30L40 17H50V47H40L30 38H3Z"/><path d="M12 26V38M17 26V38"/><rect class="f" x="21" y="29" width="7" height="5" rx="1"/><path d="M54 20l9-6M55 28h9M55 36h9M54 44l9 6"/>`,
    cassette: `<rect class="t" x="4" y="12" width="56" height="40" rx="4"/><rect x="11" y="18" width="42" height="20" rx="2"/><circle cx="23" cy="31" r="4"/><circle cx="41" cy="31" r="4"/><path d="M27 31h10M15 52l4-9h26l4 9"/>${tx(32, 26, 7.5, 'MIX #1')}<circle class="f" cx="23" cy="31" r="1.3"/><circle class="f" cx="41" cy="31" r="1.3"/>`,
    // menu + award icons
    missing: `<rect class="t" x="10" y="2" width="44" height="60" rx="2"/>${tx(32, 13, 9, 'MISSING', 'Josefin Sans,sans-serif')}<rect x="18" y="17" width="28" height="27"/><circle class="f" cx="32" cy="27" r="6"/><path class="f" d="M20 44q12-16 24 0z"/><path d="M16 50h32M20 56h24"/>`,
    report: `<rect class="t" x="10" y="3" width="44" height="58" rx="2"/><path d="M16 12h18M16 19h12M16 34h32M16 41h32M16 48h22"/><circle cx="43" cy="18" r="9.5"/>${tx(43, 22.5, 12, 'A', 'Young Serif,serif')}<path class="f" d="M44 50l8-3l-2 8z"/>`,
    tower: `<path d="M32 12L18 62M32 12L46 62M23 44h18M27 28h10M21 53l21-9M43 53l-21-9M26 36l10-8M38 36l-10-8"/><circle class="f" cx="32" cy="9" r="3.5"/><path d="M21 3a15 15 0 0 0 0 14M43 3a15 15 0 0 1 0 14M13 0a24 24 0 0 0 0 21M51 0a24 24 0 0 1 0 21"/>`,
    star: `<path class="t" d="M32 3L41 23L62 25L46 39L51 60L32 49L13 60L18 39L2 25L23 23Z"/><circle class="f" cx="32" cy="35" r="5"/>`,
    trophy: `<path class="t" d="M17 5H47V24Q47 39 32 41Q17 39 17 24Z"/><path d="M17 10H5Q5 27 20 30M47 10H59Q59 27 44 30M32 41V50M19 60H45V50H19Z"/>${tx(32, 28, 15, '1', 'Young Serif,serif')}`
  };
  const cardSet = ['lights', 'nailbat', 'walkie', 'eggo', 'd20', 'hat', 'walkman', 'clock', 'bike', 'slingshot', 'skate', 'pizza', 'arcade', 'camera', 'compass', 'rift', 'boombox', 'phone', 'flashlight', 'cassette'];
  const alias = { bulb: 'lights', bat: 'nailbat', waffle: 'eggo', skateboard: 'skate', cone: 'hat', radio: 'tower', book: 'missing', key: 'compass' };
  return { svg: n => `<svg class="ic" viewBox="0 0 64 64">${I[n] || I[alias[n]] || I.star}</svg>`, cardSet };
})();
