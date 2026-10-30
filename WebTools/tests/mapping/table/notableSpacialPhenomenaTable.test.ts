import { test, expect } from '@jest/globals';
import { D20 } from '../../../src/common/die';
import { notableSpatialPhenomenaTable } from '../../../src/mapping/table/notableSpacialPhenomenaTable';
import { SpectralClass } from '../../../src/mapping/table/spectralClass';
import { SpecialSectors } from '../../../src/mapping/table/star';

test('notableSpatialPhenomenaTable covers all branches', () => {
  const origRoll = D20.roll;
  const origRand = Math.random;
  try {
    (D20 as any).roll = () => 1;
    expect(
      notableSpatialPhenomenaTable(SpectralClass.G, null as any),
    ).toBeDefined();
    (D20 as any).roll = () => 4;
    expect(
      notableSpatialPhenomenaTable(SpectralClass.K, null as any),
    ).toBeDefined();
    (D20 as any).roll = () => 9;
    expect(
      notableSpatialPhenomenaTable(SpectralClass.F, null as any),
    ).toBeDefined();
    (D20 as any).roll = () => 14;
    expect(
      notableSpatialPhenomenaTable(SpectralClass.A, null as any),
    ).toBeDefined();
    (D20 as any).roll = () => 18;
    expect(
      notableSpatialPhenomenaTable(SpectralClass.M, null as any),
    ).toBeDefined();

    (D20 as any).roll = () => 1;
    Math.random = () => 0;
    expect(
      notableSpatialPhenomenaTable(SpectralClass.B, null as any),
    ).toBeDefined();
    Math.random = () => 0.5;
    expect(
      notableSpatialPhenomenaTable(SpectralClass.O, null as any),
    ).toBeDefined();
    Math.random = origRand;

    for (const sc of [
      SpectralClass.L,
      SpectralClass.T,
      SpectralClass.Y,
      SpectralClass.WhiteDwarf,
      SpectralClass.BrownDwarf,
    ]) {
      for (const r of [1, 4, 9, 14, 18]) {
        (D20 as any).roll = () => r;
        Math.random = () => 0;
        expect(notableSpatialPhenomenaTable(sc, null as any)).toBeDefined();
      }
    }
    Math.random = origRand;

    const sectors = [
      SpecialSectors.PinwheelSector,
      SpecialSectors.EnduranceDivide,
      SpecialSectors.EmberSector,
      SpecialSectors.TKalNursery,
      SpecialSectors.GeneralExpanse,
    ];
    for (const s of sectors) {
      for (const r of [1, 4, 9, 14, 18]) {
        (D20 as any).roll = () => r;
        Math.random = () => 0.2;
        expect(notableSpatialPhenomenaTable(SpectralClass.G, s)).toBeDefined();
      }
    }
    Math.random = origRand;

    for (const r of [1, 4, 9, 14, 18]) {
      (D20 as any).roll = () => r;
      Math.random = () => 0.7;
      expect(
        notableSpatialPhenomenaTable(SpectralClass.G, undefined),
      ).toBeDefined();
    }
    Math.random = origRand;
  } finally {
    (D20 as any).roll = origRoll;
    Math.random = origRand;
  }
});
