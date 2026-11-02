import { test, expect, describe, jest } from '@jest/globals';
import { D20 } from '../../../src/common/die';
import { StarshipRandomTalentTable } from '../../../src/solo/table/starshipRandomTalentTable';

const commonTalentsByRoll: string[] = [
  'Advanced Research Facilities',
  'Advanced Sensor Suites',
  'Advanced Shields',
  'Advanced Transporters',
  'Backup EPS Conduits',
  'Diplomatic Suites',
  'Fast Targeting Systems',
  'High-Resolution Sensors',
  'High-Power Tractor Beam',
  'Improved Damage Control',
  'Improved Hull Integrity',
  'Improved Impulse Drive',
  'Improved Power Systems',
  'Improved Reaction Control System',
  'Improved Shield Recharge',
  'Improved Warp Drive',
  'Modular Laboratories',
  'Rugged Design',
  'Secondary Reactors',
  'Slim Sensor Silhouette',
];

const uncommonTalentsByRoll: string[] = [
  'Ablative Armor',
  'Adaptable Energy Weapons',
  'Advanced Medical Ward/Sickbay',
  'Advanced Medical Ward/Sickbay',
  'Automated Defenses',
  'Automated Defenses',
  "Captain's Yacht",
  'Command Ship',
  'Command Ship',
  'Dedicated Subspace Transceiver Array',
  'Deluxe Galley',
  'Deluxe Galley',
  'Dual Environment',
  'Electronic Warfare Systems',
  'Emergency Medical Hologram',
  'Extensive Shuttlebays',
  'Independent Phaser Supply',
  'Rapid-Fire Torpedo Launcher',
  'Variable Geometry Warp Field',
  'Versatile Tractor Beam',
];

const rareTalentsByRoll: string[] = [
  'Ablative Field Projector',
  'Ablative Field Projector',
  'Advanced Emergency Crew Holograms',
  'Advanced Emergency Crew Holograms',
  'Cloaked Mines',
  'Cloaking Device',
  'Multi-Vector Assault Mode',
  'Point Defense System',
  'Point Defense System',
  'Quantum Torpedoes',
  'Quantum Torpedoes',
  'Quantum Torpedoes',
  'Regenerative Hull',
  'Regenerative Hull',
  'Saucer Separation',
  'Saucer Separation',
  'Self-Replicating Mines',
  'Siphoning Shields',
  'Tachyon Detection Field',
  'Wormhole Relay System',
];

const queueRolls = (rolls: number[]) => {
  const remaining = [...rolls];

  return jest.spyOn(D20, 'roll').mockImplementation(() => {
    const value = remaining.shift();
    if (value == null) {
      throw new Error('No mocked D20 roll remaining');
    }
    return value;
  });
};

const expectTalentTable = (
  outerRoll: number,
  expected: string[],
  fallback: string,
) => {
  queueRolls([
    ...expected.flatMap((_, index) => [outerRoll, index + 1]),
    outerRoll,
    21,
  ]);

  for (const talent of expected) {
    expect(StarshipRandomTalentTable()).toBe(talent);
  }

  expect(StarshipRandomTalentTable()).toBe(fallback);
};

describe('starshipRandomTalentTable', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('returns every common talent for inner rolls 1-20', () => {
    expectTalentTable(1, commonTalentsByRoll, 'Slim Sensor Silhouette');
  });

  test('returns every uncommon talent for inner rolls 1-20', () => {
    expectTalentTable(8, uncommonTalentsByRoll, 'Versatile Tractor Beam');
  });

  test('returns every rare talent for inner rolls 1-20', () => {
    expectTalentTable(15, rareTalentsByRoll, 'Wormhole Relay System');
  });

  test('defaults to the rare talent table for outer rolls above 14', () => {
    queueRolls([21, 1]);

    expect(StarshipRandomTalentTable()).toBe('Ablative Field Projector');
  });
});
