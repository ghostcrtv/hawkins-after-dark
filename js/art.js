// Original line-art icons (64x64), drawn for this game.
const Art = (function () {
  const I = {
    bike: '<circle cx="14" cy="44" r="10"/><circle cx="50" cy="44" r="10"/><path d="M14 44L26 26H42L50 44M26 26L32 44H14M32 44L42 26M21 21h10M42 26l-2-9h7"/>',
    walkie: '<rect x="22" y="18" width="20" height="40" rx="3"/><path d="M27 18V4M27 26h10M27 31h10M27 36h10"/><circle cx="32" cy="48" r="4"/>',
    waffle: '<circle cx="32" cy="32" r="25"/><path d="M20 12v40M32 8v48M44 12v40M12 20h40M8 32h48M12 44h40"/>',
    bulb: '<path d="M4 10Q32 24 60 10"/><rect x="27" y="17" width="10" height="7"/><ellipse cx="32" cy="39" rx="10" ry="15"/><path d="M28 36q4-6 8 0"/>',
    cassette: '<rect x="5" y="13" width="54" height="38" rx="4"/><rect x="15" y="21" width="34" height="17" rx="3"/><circle cx="24" cy="29.5" r="4"/><circle cx="40" cy="29.5" r="4"/><path d="M17 51l4-8h22l4 8"/>',
    d20: '<path d="M32 4L56 18V46L32 60L8 46V18ZM32 18L46 42H18ZM32 18V4M32 18L8 18M32 18L56 18M46 42L56 18M46 42L56 46M46 42L32 60M18 42L32 60M18 42L8 46M18 42L8 18"/>',
    flashlight: '<path d="M4 26H32L42 18H54V46H42L32 38H4ZM14 26V38M58 24l4-3M59 32h4M58 40l4 3"/>',
    skateboard: '<path d="M4 26q4 8 12 8H48q8 0 12-8"/><circle cx="20" cy="42" r="5"/><circle cx="44" cy="42" r="5"/>',
    arcade: '<path d="M18 60V20L24 6H40L46 20V60ZM18 34H46"/><rect x="24" y="12" width="16" height="13"/><circle cx="27" cy="42" r="2"/><path d="M37 38v6M24 52h16"/>',
    boombox: '<rect x="4" y="20" width="56" height="34" rx="4"/><circle cx="17" cy="38" r="8"/><circle cx="47" cy="38" r="8"/><rect x="27" y="27" width="10" height="8"/><path d="M14 20V10H50V20M27 44h10"/>',
    compass: '<circle cx="32" cy="32" r="26"/><path d="M32 12L39 32L32 52L25 32ZM25 32H39M32 3v5"/>',
    camera: '<rect x="5" y="19" width="54" height="34" rx="4"/><circle cx="32" cy="36" r="11"/><circle cx="32" cy="36" r="4"/><path d="M13 19V12H25V19"/><circle cx="50" cy="27" r="2"/>',
    phone: '<path d="M8 22Q32 2 56 22L50 30Q43 24 40 28V38H24V28Q21 24 14 30Z"/><rect x="12" y="38" width="40" height="20" rx="4"/><circle cx="32" cy="48" r="5"/>',
    cone: '<path d="M19 30L32 60L45 30ZM24 41l14 5M27 50l8-14"/><circle cx="32" cy="18" r="13"/>',
    clock: '<path d="M20 60V12Q32 0 44 12V60ZM20 30H44M32 18V12M32 18h5M32 30V46"/><circle cx="32" cy="18" r="9"/><circle cx="32" cy="50" r="4"/>',
    key: '<circle cx="16" cy="32" r="11"/><circle cx="16" cy="32" r="3"/><path d="M27 32H60M48 32V43M57 32V40"/>',
    pizza: '<path d="M32 60L8 14Q32 2 56 14Z"/><circle cx="25" cy="23" r="3.5"/><circle cx="40" cy="25" r="3.5"/><circle cx="32" cy="40" r="3.5"/><path d="M12 21Q32 11 52 21"/>',
    bat: '<path d="M10 56L16 50M16 50L40 20Q46 10 52 12Q56 16 48 24L20 54ZM38 14l-5-5M46 30l6 4M52 20l7 1M44 8l1-6"/>',
    star: '<path d="M32 4L40 23L60 25L45 38L50 58L32 47L14 58L19 38L4 25L24 23Z"/>',
    trophy: '<path d="M18 8H46V24Q46 38 32 40Q18 38 18 24ZM18 12H6Q6 28 20 30M46 12H58Q58 28 44 30M32 40V50M20 58H44V50H20Z"/>',
    book: '<path d="M32 14Q20 6 6 10V52Q20 48 32 56Q44 48 58 52V10Q44 6 32 14ZM32 14V56"/>',
    rift: '<path d="M32 2L24 16L34 24L20 36L30 44L22 62L42 44L32 36L46 24L36 16Z"/>',
    radio: '<rect x="6" y="22" width="52" height="34" rx="4"/><circle cx="22" cy="39" r="9"/><path d="M38 32h14M38 39h14M38 46h14M14 22L44 6"/>'
  };
  const cardSet = ['bike','walkie','waffle','bulb','cassette','d20','flashlight','skateboard','arcade','boombox','compass','camera','phone','cone','clock','key','pizza','bat'];
  return {
    svg: (n) => `<svg class="ic" viewBox="0 0 64 64">${I[n] || I.star}</svg>`,
    cardSet
  };
})();
