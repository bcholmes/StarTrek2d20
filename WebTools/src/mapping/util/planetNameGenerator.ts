import { WorldClass } from '../table/worldClass';

const syllables = [
  'ae',
  'lia',
  'ora',
  'vae',
  'elu',
  'nara',
  'syl',
  'eira',
  'lyra',
  'iona',
  'mira',
  'thal',
  'aura',
  'sel',
  'kor',
  'veth',
  'drak',
  'zar',
  'karth',
  'brak',
  'tor',
  'rax',
  'gorn',
  'vok',
  'kran',
  'durn',
  'vek',
  'mal',
  'vey',
  'ron',
  'aris',
  'elan',
  'nyx',
  'tal',
  'or',
  'ion',
  'mar',
  'sol',
  'zen',
  'var',
  'cal',
  'rion',
  'astra',
  'aurel',
  'orion',
  'cael',
  'seren',
  'myr',
  'thalun',
  'elys',
  'varos',
  'ignar',
  'noct',
  'velor',
  'altair',
  'astra',
  'cel',
  'nova',
  'lumi',
  'orion',
  'veyr',
  'zen',
  'sol',
  'lyr',
  'aeth',
  'ion',
  'stara',
  'aurel',
  'cael',
  'vesta',
  'seren',
  'novus',
  'alar',
  'corv',
  'elium',
  'veris',
  'magn',
  'oria',
  'prim',
  'skarn',
  'ulv',
  'eyr',
  'frost',
  'varn',
  'kael',
  'run',
  'thyr',
  'bjorn',
  'sval',
  'odr',
  'heim',
  'sah',
  'azir',
  'qor',
  'dune',
  'amun',
  'ra',
  'zahir',
  'kesh',
  'var',
  'siro',
  'khur',
  'esh',
  'thal',
  'mare',
  'coral',
  'nere',
  'aqua',
  'pel',
  'orin',
  'tide',
  'vasa',
  'lym',
  'io',
  'sira',
  'xen',
  'qir',
  'zha',
  'ul',
  'vrax',
  'ix',
  'qo',
  'nyx',
  'zel',
  'uur',
  'kaq',
  'thex',
  'xen',
  'kor',
  'vex',
  'ion',
  'nova',
  'prime',
  'cy',
  'rax',
  'zen',
  'or',
  'ix',
  'tal',
  'elys',
  'aura',
  'myr',
  'thal',
  'ser',
  'olym',
  'val',
  'aurel',
  'nyra',
  'cael',
  'dris',
  'nyx',
  'obs',
  'noct',
  'mor',
  'vorn',
  'dusk',
  'khar',
  'umb',
  'shad',
  'vel',
  'goth',
  'ela',
  'ser',
  'lora',
  'aeri',
  'vel',
  'is',
  'mira',
  'syl',
  'ora',
  'lum',
  'vael',
  'krag',
  'vok',
  'drak',
  'tharn',
  'zod',
  'krax',
  'gorr',
  'brak',
  'vek',
  'zug',
  'cel',
  'astra',
  'luna',
  'sol',
  'stara',
  'orion',
  'nova',
  'lyra',
  'halo',
  'aeth',
];

const suffixCategory = (worldClass: WorldClass) => {
  switch (worldClass) {
    case WorldClass.I:
    case WorldClass.J:
      return ['Jovia', 'Nimbus', 'Vapor', 'Cyclon', 'Auralis'];
    case WorldClass.Y:
      return ['Ignis', 'Vulkar', 'Pyra', 'Magmor', 'Cinder'];
    case WorldClass.C:
    case WorldClass.D:
    case WorldClass.P:
      return ['Frost', 'Cryo', 'Glacia', 'Sval', 'Icel'];
    case WorldClass.H:
      return ['Dune', 'Azir', 'Siro', 'Kesh', 'Sahar'];
    case WorldClass.O:
      return ['Mare', 'Thal', 'Nere', 'Coralis', 'Pelag'];
    case WorldClass.R:
      return ['Noct', 'Drift', 'Umbra', 'Vagrant', 'Nyx', 'Void'];
    case WorldClass.M:
      return [
        'Sylva',
        'Verdan',
        'Elderglen',
        'Mossar',
        'Liora',
        'Aurel',
        'Elyrium',
        'Primara',
        'Caelus',
        'Vesta',
        'Proxima',
        'Meta',
        'Gamma',
        'Alpha',
        'Neo',
        'Sigma',
      ];
    default:
      return ['Xen', 'Zha', 'Qir', 'Vrax', 'Ulon'];
  }
};

const designations = [
  'Luna',
  'Vale',
  'Eden',
  'Halo',
  'Aerie',
  'Bloom',
  'Prime',
  'Bastion',
  'Forge',
  'Citadel',
  'IX',
  'VII',
  'Station',
  'Reach',
  'Minor',
  'Major',
  'Orbit',
  'Sector',
  'Prime',
  'Aeterna',
  'Regis',
  'Sanctum',
  'Ultima',
  'Vara',
  'IX',
  'Prime',
  '-7',
  'X-42',
  'Station',
  'Nexus',
  'Elysium',
  'Oracle',
  'Crown',
  'Aeterna',
  'Sanctum',
  'Vale',
  'Obsidian',
  'Nocturne',
  'Umbra',
  'Eclipse',
  'Black',
  'Dusk',
  'Aurora',
  'Vale',
  'Serene',
  'Liora',
  'Crown',
  'Halo',
  'Krag',
  'Vektor',
  'Rift',
  'Anvil',
  '-9',
  'Fortress',
  'Prime',
  'Halo',
  'Nova',
  'Zenith',
  'Orbit',
  'Crescent',
];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getPools(worldClass: WorldClass) {
  let pools = [...syllables];
  if (suffixCategory(worldClass)) {
    pools = pools.concat(suffixCategory(worldClass));
  }

  return pools;
}

function makeCoreName(worldClass: WorldClass) {
  const lengths = [2, 2, 2, 2, 2, 3, 3, 3, 4];
  const pool = getPools(worldClass);
  const syllables = lengths[Math.floor(Math.random() * lengths.length)];
  const parts = [];

  for (let i = 0; i < syllables; i++) {
    parts.push(getRandomItem(pool).toLowerCase());
  }

  let name = parts.join('');
  name = name.charAt(0).toUpperCase() + name.slice(1);

  return name;
}

function makeDesignation() {
  return getRandomItem([...designations]);
}

export const generatePlanetName = (worldClass: WorldClass) => {
  let generated = undefined;
  let attempts = 0;

  while (generated == null && attempts < 500) {
    attempts++;
    const core = makeCoreName(worldClass);
    const suffix = makeDesignation();

    const joiner = /^[\-0-9]/.test(suffix) ? '' : ' ';
    generated = core + joiner + suffix;
  }

  return generated;
};
