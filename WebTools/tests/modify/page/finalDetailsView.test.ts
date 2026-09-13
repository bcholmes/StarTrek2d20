import { test, expect, describe, jest } from '@jest/globals';
import { FinalDetailsView } from '../../../src/modify/page/finalDetailsView';
import { Character } from '../../../src/common/character';
import { D20IconButton } from '../../../src/solo/component/d20IconButton';

function isLeafNode(node: any): boolean {
  return node == null || typeof node === 'string' || typeof node === 'number';
}

function hasChildren(children: any): boolean {
  return children != null && typeof children === 'object';
}

function createMockCharacter(name?: string, pronouns?: string) {
  const character = new Character();
  character.name = name ?? 'Jim';
  character.pronouns = pronouns ?? 'he/him';
  return character;
}

function createFinalDetailsView(character: Character, overrides?: any) {
  const props = {
    character,
    t: ((key: string) => key) as any,
    showRandomName: false,
    showPastime: false,
    showLineageAndHouse: false,
    showAdditionalTraits: false,
    onNameChanged: jest.fn(),
    onPronounsChanged: jest.fn(),
    onPasttimeChanged: jest.fn(),
    onLineageChanged: jest.fn(),
    onHouseChanged: jest.fn(),
    onAdditionalTraitsChanged: jest.fn(),
    onRandomName: jest.fn(),
    onDescriptionChanged: jest.fn(),
    ...overrides,
  };
  const instance = new FinalDetailsView(props as any);
  (instance as any).forceUpdate = jest.fn();
  return instance;
}

function findInputs(element: any): any[] {
  const results: any[] = [];
  const walk = (node: any) => {
    if (isLeafNode(node)) {
      return;
    }
    if (node.props?.id != null && node.props?.onChange != null) {
      results.push(node);
    }
    const children = node.props?.children;
    if (Array.isArray(children)) {
      children.forEach(walk);
    } else if (hasChildren(children)) {
      walk(children);
    }
  };
  walk(element);
  return results;
}

describe('FinalDetailsView', () => {
  describe('name field', () => {
    test('renders the character name', () => {
      const character = createMockCharacter('Jim');
      const instance = createFinalDetailsView(character);
      const nameInput = findInputs(instance.render()).find(
        (e) => e.props.id === 'name',
      );
      expect(nameInput.props.value).toBe('Jim');
    });

    test('renders an empty name when the character has no name', () => {
      const character = createMockCharacter();
      character.name = undefined;
      const instance = createFinalDetailsView(character);
      const nameInput = findInputs(instance.render()).find(
        (e) => e.props.id === 'name',
      );
      expect(nameInput.props.value).toBe('');
    });

    test('fires onNameChanged when edited', () => {
      const character = createMockCharacter();
      const onNameChanged = jest.fn();
      const instance = createFinalDetailsView(character, { onNameChanged });
      const nameInput = findInputs(instance.render()).find(
        (e) => e.props.id === 'name',
      );
      nameInput.props.onChange('James');
      expect(onNameChanged).toHaveBeenCalledWith('James');
    });
  });

  describe('pronouns field', () => {
    test('renders the character pronouns', () => {
      const character = createMockCharacter(undefined, 'she/her');
      const instance = createFinalDetailsView(character);
      const pronounsInput = findInputs(instance.render()).find(
        (e) => e.props.id === 'pronouns',
      );
      expect(pronounsInput.props.value).toBe('she/her');
    });

    test('renders an empty value when the character has no pronouns', () => {
      const character = createMockCharacter();
      character.pronouns = undefined;
      const instance = createFinalDetailsView(character);
      const pronounsInput = findInputs(instance.render()).find(
        (e) => e.props.id === 'pronouns',
      );
      expect(pronounsInput.props.value).toBe('');
    });

    test('fires onPronounsChanged when edited', () => {
      const character = createMockCharacter();
      const onPronounsChanged = jest.fn();
      const instance = createFinalDetailsView(character, { onPronounsChanged });
      const pronounsInput = findInputs(instance.render()).find(
        (e) => e.props.id === 'pronouns',
      );
      pronounsInput.props.onChange('they/them');
      expect(onPronounsChanged).toHaveBeenCalledWith('they/them');
    });
  });

  describe('random name button', () => {
    test('renders a random name button when showRandomName is true', () => {
      const character = createMockCharacter();
      const onRandomName = jest.fn();
      const instance = createFinalDetailsView(character, {
        showRandomName: true,
        onRandomName,
      });
      const buttons = findRandomNameButtons(instance.render());
      expect(buttons.length).toBe(1);
      buttons[0].props.onClick();
      expect(onRandomName).toHaveBeenCalled();
    });

    test('does not render a random name button when showRandomName is false', () => {
      const character = createMockCharacter();
      const instance = createFinalDetailsView(character, {
        showRandomName: false,
      });
      expect(findRandomNameButtons(instance.render()).length).toBe(0);
    });
  });

  describe('pastime field', () => {
    test('renders pastimes as a comma-separated string when shown', () => {
      const character = createMockCharacter();
      character.pastime = ['Chess', 'Golf'];
      const instance = createFinalDetailsView(character, { showPastime: true });
      const pastimeInput = findInputs(instance.render()).find(
        (e) => e.props.id === 'pastimes',
      );
      expect(pastimeInput.props.value).toBe('Chess, Golf');
    });

    test('renders an empty value when the character has no pastimes', () => {
      const character = createMockCharacter();
      character.pastime = [];
      const instance = createFinalDetailsView(character, { showPastime: true });
      const pastimeInput = findInputs(instance.render()).find(
        (e) => e.props.id === 'pastimes',
      );
      expect(pastimeInput.props.value).toBe('');
    });

    test('does not render a pastime field when hidden', () => {
      const character = createMockCharacter();
      character.pastime = ['Chess'];
      const instance = createFinalDetailsView(character, {
        showPastime: false,
      });
      const pastimeInput = findInputs(instance.render()).find(
        (e) => e.props.id === 'pastimes',
      );
      expect(pastimeInput).toBeUndefined();
    });

    test('fires onPasttimeChanged when edited', () => {
      const character = createMockCharacter();
      character.pastime = ['Chess'];
      const onPasttimeChanged = jest.fn();
      const instance = createFinalDetailsView(character, {
        showPastime: true,
        onPasttimeChanged,
      });
      const pastimeInput = findInputs(instance.render()).find(
        (e) => e.props.id === 'pastimes',
      );
      pastimeInput.props.onChange('Reading, Chess');
      expect(onPasttimeChanged).toHaveBeenCalledWith('Reading, Chess');
    });
  });

  describe('lineage field', () => {
    test('renders the character lineage when shown', () => {
      const character = createMockCharacter();
      character.lineage = 'Daughter of Martok';
      const instance = createFinalDetailsView(character, {
        showLineageAndHouse: true,
      });
      const lineageInput = findInputs(instance.render()).find(
        (e) => e.props.id === 'lineage',
      );
      expect(lineageInput.props.value).toBe('Daughter of Martok');
    });

    test('renders an empty value when the character has no lineage', () => {
      const character = createMockCharacter();
      const instance = createFinalDetailsView(character, {
        showLineageAndHouse: true,
      });
      const lineageInput = findInputs(instance.render()).find(
        (e) => e.props.id === 'lineage',
      );
      expect(lineageInput.props.value).toBe('');
    });

    test('does not render a lineage field when hidden', () => {
      const character = createMockCharacter();
      character.lineage = 'Daughter of Martok';
      const instance = createFinalDetailsView(character, {
        showLineageAndHouse: false,
      });
      const lineageInput = findInputs(instance.render()).find(
        (e) => e.props.id === 'lineage',
      );
      expect(lineageInput).toBeUndefined();
    });

    test('fires onLineageChanged when edited', () => {
      const character = createMockCharacter();
      const onLineageChanged = jest.fn();
      const instance = createFinalDetailsView(character, {
        showLineageAndHouse: true,
        onLineageChanged,
      });
      const lineageInput = findInputs(instance.render()).find(
        (e) => e.props.id === 'lineage',
      );
      lineageInput.props.onChange('Child of Koloth');
      expect(onLineageChanged).toHaveBeenCalledWith('Child of Koloth');
    });
  });

  describe('house field', () => {
    test('renders the character house when shown', () => {
      const character = createMockCharacter();
      character.house = 'House Duras';
      const instance = createFinalDetailsView(character, {
        showLineageAndHouse: true,
      });
      const houseInput = findInputs(instance.render()).find(
        (e) => e.props.id === 'house',
      );
      expect(houseInput.props.value).toBe('House Duras');
    });

    test('renders an empty value when the character has no house', () => {
      const character = createMockCharacter();
      const instance = createFinalDetailsView(character, {
        showLineageAndHouse: true,
      });
      const houseInput = findInputs(instance.render()).find(
        (e) => e.props.id === 'house',
      );
      expect(houseInput.props.value).toBe('');
    });

    test('does not render a house field when hidden', () => {
      const character = createMockCharacter();
      character.house = 'House Kor';
      const instance = createFinalDetailsView(character, {
        showLineageAndHouse: false,
      });
      const houseInput = findInputs(instance.render()).find(
        (e) => e.props.id === 'house',
      );
      expect(houseInput).toBeUndefined();
    });

    test('fires onHouseChanged when edited', () => {
      const character = createMockCharacter();
      const onHouseChanged = jest.fn();
      const instance = createFinalDetailsView(character, {
        showLineageAndHouse: true,
        onHouseChanged,
      });
      const houseInput = findInputs(instance.render()).find(
        (e) => e.props.id === 'house',
      );
      houseInput.props.onChange('House Martok');
      expect(onHouseChanged).toHaveBeenCalledWith('House Martok');
    });
  });

  describe('additional traits field', () => {
    test('renders the character additional traits when shown', () => {
      const character = createMockCharacter();
      character.additionalTraits = 'Veteran';
      const instance = createFinalDetailsView(character, {
        showAdditionalTraits: true,
      });
      const traitsInput = findInputs(instance.render()).find(
        (e) => e.props.id === 'traits',
      );
      expect(traitsInput.props.value).toBe('Veteran');
    });

    test('renders an empty value when the character has no additional traits', () => {
      const character = createMockCharacter();
      const instance = createFinalDetailsView(character, {
        showAdditionalTraits: true,
      });
      const traitsInput = findInputs(instance.render()).find(
        (e) => e.props.id === 'traits',
      );
      expect(traitsInput.props.value).toBe('');
    });

    test('does not render an additional traits field when hidden', () => {
      const character = createMockCharacter();
      character.additionalTraits = 'Veteran';
      const instance = createFinalDetailsView(character, {
        showAdditionalTraits: false,
      });
      const traitsInput = findInputs(instance.render()).find(
        (e) => e.props.id === 'traits',
      );
      expect(traitsInput).toBeUndefined();
    });

    test('fires onAdditionalTraitsChanged when edited', () => {
      const character = createMockCharacter();
      const onAdditionalTraitsChanged = jest.fn();
      const instance = createFinalDetailsView(character, {
        showAdditionalTraits: true,
        onAdditionalTraitsChanged,
      });
      const traitsInput = findInputs(instance.render()).find(
        (e) => e.props.id === 'traits',
      );
      traitsInput.props.onChange('Veteran, Bold');
      expect(onAdditionalTraitsChanged).toHaveBeenCalledWith('Veteran, Bold');
    });
  });
});

function findRandomNameButtons(element: any): any[] {
  const results: any[] = [];
  const walk = (node: any) => {
    if (isLeafNode(node)) {
      return;
    }
    if (node.type === D20IconButton) {
      results.push(node);
    }
    const children = node.props?.children;
    if (Array.isArray(children)) {
      children.forEach(walk);
    } else if (hasChildren(children)) {
      walk(children);
    }
  };
  walk(element);
  return results;
}
