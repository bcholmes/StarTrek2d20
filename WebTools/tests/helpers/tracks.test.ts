import { afterEach, describe, expect, jest, test } from '@jest/globals';
import i18next from 'i18next';
import { CharacterType } from '../../src/common/characterType';
import { makeKey } from '../../src/common/translationKey';
import { Attribute } from '../../src/helpers/attributes';
import { Department } from '../../src/helpers/department';
import { Source } from '../../src/helpers/sources';
import { Track } from '../../src/helpers/trackEnum';
import {
  AttributeImprovementRule,
  DepartmentImprovementRule,
  ImprovementRuleType,
  TrackFocuses,
  TrackModel,
  TracksHelper,
} from '../../src/helpers/tracks';
import { hasAnySource, hasSource } from '../../src/state/contextFunctions';

const mockTranslations: Record<string, string> = {};

jest.mock('i18next', () => {
  const mockI18n: any = (key: string) => key;
  mockI18n.t = (key: string) => mockTranslations[key] ?? key;
  mockI18n.use = function () {
    return this;
  };
  mockI18n.init = function () {
    return this;
  };
  mockI18n.on = function () {
    return this;
  };
  mockI18n.changeLanguage = function () {
    return Promise.resolve();
  };
  return mockI18n;
});

jest.mock('../../src/state/contextFunctions', () => ({
  hasAnySource: jest.fn(),
  hasSource: jest.fn(),
}));

const hasAnySourceMock = jest.mocked(hasAnySource);
const hasSourceMock = jest.mocked(hasSource);

const trackIds = (tracks: TrackModel[]) => tracks.map((track) => track.id);

const allowAllSources = () => {
  hasAnySourceMock.mockReturnValue(true);
  hasSourceMock.mockReturnValue(true);
};

describe('improvement rule descriptions', () => {
  test('describes attribute rules with one or several attributes', () => {
    const single = new AttributeImprovementRule(
      ImprovementRuleType.AT_LEAST_ONE,
      Attribute.Control,
    );
    const multiple = new AttributeImprovementRule(
      ImprovementRuleType.AT_LEAST_ONE,
      Attribute.Control,
      Attribute.Daring,
    );

    expect(single.describeAttributes()).toBe('Control');
    expect(single.describe()).toBe(
      'At least one point must be spent on Control.',
    );
    expect(multiple.describeAttributes()).toBe('either Control or Daring');
    expect(multiple.describe()).toBe(
      'At least one point must be spent on either Control or Daring.',
    );
  });

  test('describes department rules by rule type and department count', () => {
    const decrement = new DepartmentImprovementRule(
      ImprovementRuleType.MAY_DECREMENT_ONE,
    );
    const single = new DepartmentImprovementRule(
      ImprovementRuleType.MUST_INCLUDE_ALL,
      Department.Command,
    );
    const multiple = new DepartmentImprovementRule(
      ImprovementRuleType.MUST_INCLUDE_ALL,
      Department.Command,
      Department.Security,
    );

    expect(decrement.describe()).toBe(
      'You may optionally decrement one Discipline, and assign that point to another Discipline.',
    );
    expect(single.describeDepartments()).toBe('Command');
    expect(single.describe()).toBe('Points must be distributed to Command.');
    expect(multiple.describeDepartments()).toBe('each of Command and Security');
    expect(multiple.describe()).toBe(
      'Points must be distributed to each of Command and Security.',
    );
  });
});

describe('TrackModel', () => {
  test('normalizes source and focus inputs', () => {
    const focuses = new TrackFocuses(['Diplomacy'], ['Persuasion']);
    const fromArray = new TrackModel(
      Track.Command,
      'Array sources',
      [Source.Core, Source.PlayersGuide],
      'Description',
      [],
      [],
      focuses,
    );
    const fromSingle = new TrackModel(
      Track.Command,
      'Single source',
      Source.Core,
      'Description',
      [],
      [],
      ['Diplomacy'],
    );

    expect(fromArray.sources).toEqual([Source.Core, Source.PlayersGuide]);
    expect(fromArray.focuses).toBe(focuses);
    expect(fromArray.focuses.requiredFocuses).toEqual(['Persuasion']);
    expect(fromSingle.sources).toEqual([Source.Core]);
    expect(fromSingle.focuses).toBeInstanceOf(TrackFocuses);
    expect(fromSingle.focuses.focusSuggestions).toEqual(['Diplomacy']);
    expect(fromSingle.focuses.requiredFocuses).toEqual([]);
  });

  test('localizes names and descriptions with fallback and translated keys', () => {
    const model = new TrackModel(
      Track.Command,
      'Command Track',
      Source.Core,
      'Description',
      [],
      [],
      [],
      undefined,
      undefined,
      false,
      'Track.command.',
    );
    const nameKey = makeKey('Track.command.', Track[Track.Command]);
    const name2eKey = makeKey('Track.command.', Track[Track.Command], '.2e');
    const descriptionKey = makeKey(
      'Track.command.',
      Track[Track.Command],
      '.description',
    );

    expect(model.localizedName).toBe('Command Track');
    expect(model.localizedName2e).toBe('Command Track');
    expect(model.localizedDescription).toBe('Description');

    mockTranslations[nameKey] = 'Translated name';
    mockTranslations[name2eKey] = 'Translated 2e name';
    mockTranslations[descriptionKey] = 'Translated description';
    expect(model.localizedName).toBe('Translated name');
    expect(model.localizedName2e).toBe('Translated 2e name');
    expect(model.localizedDescription).toBe('Translated description');

    delete mockTranslations[name2eKey];
    expect(model.localizedName2e).toBe('Translated name');
  });
});

describe('TracksHelper', () => {
  afterEach(() => {
    hasAnySourceMock.mockReset();
    hasSourceMock.mockReset();
    jest.restoreAllMocks();
    Object.keys(mockTranslations).forEach(
      (key) => delete mockTranslations[key],
    );
  });

  test('exposes a singleton', () => {
    expect(TracksHelper.instance).toBe(TracksHelper.instance);
  });

  test('selects track lists by character type and version', () => {
    allowAllSources();
    const helper = TracksHelper.instance;

    expect(
      trackIds(helper.getTracks(CharacterType.AlliedMilitary, 1)),
    ).toContain(Track.RankAndFile);
    expect(
      trackIds(helper.getTracks(CharacterType.AmbassadorDiplomat, 1)),
    ).toContain(Track.DiplomaticCorps);
    expect(trackIds(helper.getTracks(CharacterType.Civilian, 1))).toContain(
      Track.FreightAndTransport,
    );
    expect(
      trackIds(helper.getTracks(CharacterType.KlingonWarrior, 1)),
    ).toContain(Track.Technical);

    const cadetV1 = trackIds(helper.getTracks(CharacterType.Cadet, 1));
    const cadetV2 = trackIds(helper.getTracks(CharacterType.Cadet, 2));
    expect(cadetV1).toHaveLength(3);
    expect(cadetV1).toEqual(
      expect.arrayContaining([Track.Command, Track.Operations, Track.Sciences]),
    );
    expect(cadetV2).toHaveLength(3);
    expect(cadetV2).toEqual(
      expect.arrayContaining([Track.Command, Track.Operations, Track.Sciences]),
    );
  });

  test('getTracks filters by source, omits enlisted security training, and sorts', () => {
    allowAllSources();
    const tracks = TracksHelper.instance.getTracks(CharacterType.Starfleet, 1);

    expect(trackIds(tracks)).not.toContain(Track.EnlistedSecurityTraining);
    const names = tracks.map((track) => track.localizedName);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));

    hasAnySourceMock.mockReturnValue(false);
    expect(TracksHelper.instance.getTracks(CharacterType.Starfleet, 1)).toEqual(
      [],
    );
  });

  test('getSoloTracks returns the expected lists', () => {
    const helper = TracksHelper.instance;
    const starfleet = trackIds(helper.getSoloTracks(CharacterType.Starfleet));

    expect(starfleet).toHaveLength(3);
    expect(starfleet).toEqual(
      expect.arrayContaining([Track.Command, Track.Operations, Track.Sciences]),
    );
    expect(
      trackIds(helper.getSoloTracks(CharacterType.AlliedMilitary)),
    ).toContain(Track.RankAndFile);
    expect(
      trackIds(helper.getSoloTracks(CharacterType.AmbassadorDiplomat)),
    ).toContain(Track.DiplomaticCorps);
    expect(trackIds(helper.getSoloTracks(CharacterType.Civilian))).toContain(
      Track.FreightAndTransport,
    );
  });

  test('getSoloTrack finds tracks across solo lists', () => {
    const helper = TracksHelper.instance;

    expect(helper.getSoloTrack(Track.Command)?.name).toBe('Command Track');
    expect(helper.getSoloTrack(Track.RankAndFile)?.name).toBe('Rank and File');
    expect(helper.getSoloTrack(Track.DiplomaticCorps)?.name).toBe(
      'Diplomatic Corps',
    );
    expect(helper.getSoloTrack(Track.FreightAndTransport)?.name).toBe(
      'Freight and Transport',
    );
    expect(helper.getSoloTrack(999 as Track)).toBeUndefined();
  });

  test('getTrack selects version 2 tracks for Starfleet', () => {
    const helper = TracksHelper.instance;

    expect(
      helper.getTrack(Track.Enlisted, CharacterType.Starfleet, 2)?.id,
    ).toBe(Track.Enlisted);
    expect(
      helper.getTrack(Track.Enlisted, CharacterType.Starfleet, 1),
    ).toBeNull();
    expect(
      helper.getTrack(Track.RankAndFile, CharacterType.AlliedMilitary, 1)?.id,
    ).toBe(Track.RankAndFile);
    expect(helper.getTrack(Track.Command, CharacterType.Cadet, 1)?.id).toBe(
      Track.Command,
    );
  });

  test('source-gated methods respect context sources', () => {
    const helper = TracksHelper.instance;

    hasSourceMock.mockReturnValue(true);
    expect(trackIds(helper.getOtherStarfleetTracks())).toEqual(
      expect.arrayContaining([
        Track.UniversityAlumni,
        Track.ResearchInternship,
      ]),
    );
    expect(helper.getVersion2StarfleetTracks().length).toBeGreaterThan(0);

    hasSourceMock.mockReturnValue(false);
    expect(helper.getOtherStarfleetTracks()).toEqual([]);
    expect(helper.getVersion2StarfleetTracks()).toEqual([]);
  });

  test('officer and enlisted lists apply their exclusions', () => {
    allowAllSources();
    const helper = TracksHelper.instance;

    const officer = trackIds(helper.getOfficerStarfleetTracks());
    expect(officer).toContain(Track.Command);
    expect(officer).not.toContain(Track.UniversityAlumni);
    expect(officer).not.toContain(Track.ResearchInternship);
    expect(officer).not.toContain(Track.EnlistedSecurityTraining);

    const enlisted = trackIds(helper.getEnlistedStarfleetTracks());
    expect(enlisted).not.toContain(Track.UniversityAlumni);
    expect(enlisted).not.toContain(Track.ResearchInternship);
    expect(enlisted).toContain(Track.EnlistedSecurityTraining);
  });

  test('generateTrack uses the expected list for each character type', () => {
    const helper = TracksHelper.instance;
    const random = jest.spyOn(Math, 'random');

    random.mockReturnValue(0);
    expect(helper.generateTrack(CharacterType.Starfleet, 1)).toBe(
      Track.Command,
    );
    random.mockReturnValue(0.5);
    expect(helper.generateTrack(CharacterType.Starfleet, 1)).toBe(
      Track.Operations,
    );
    random.mockReturnValue(0.99);
    expect(helper.generateTrack(CharacterType.Starfleet, 1)).toBe(
      Track.Sciences,
    );
    random.mockReturnValue(0);
    expect(helper.generateTrack(CharacterType.Starfleet, 2)).toBe(
      Track.Command,
    );
    expect(helper.generateTrack(CharacterType.Civilian, 1)).toBe(
      Track.FreightAndTransport,
    );
  });
});
