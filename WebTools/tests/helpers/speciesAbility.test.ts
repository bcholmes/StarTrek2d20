import { test, expect, describe } from '@jest/globals'
import { SpeciesAbilityList, SpeciesAbility, SpeciesAbilityChoice } from '../../src/helpers/speciesAbility';
import { Species } from '../../src/helpers/speciesEnum';

describe('SpeciesAbilityList', () => {
    test('singleton instance', () => {
        expect(SpeciesAbilityList.instance).toBe(SpeciesAbilityList.instance);
    });

    test('getBySpecies returns ability for known species', () => {
        const ability = SpeciesAbilityList.instance.getBySpecies(Species.Human);
        expect(ability).toBeDefined();
        expect(ability.species).toBe(Species.Human);
    });

    test('getBySpecies returns undefined for unknown species', () => {
        expect(SpeciesAbilityList.instance.getBySpecies(999 as Species)).toBeUndefined();
    });

    test('Betazoid has talent names', () => {
        const ability = SpeciesAbilityList.instance.getBySpecies(Species.Betazoid);
        expect(ability.isTalentSelectionSupported).toBeTruthy();
        expect(ability.talentNames).toContain("Telepathy2e");
    });

    test('Human has no talent names', () => {
        const ability = SpeciesAbilityList.instance.getBySpecies(Species.Human);
        expect(ability.isTalentSelectionSupported).toBeFalsy();
    });

    test('Edosian has species talent names for 2e', () => {
        const ability = SpeciesAbilityList.instance.getBySpecies(Species.Edosian);
        expect(ability.isTalentSelectionSupported).toBeTruthy();
        expect(ability.talentNames).toContain("Multi-Tasking (Edosian)");
        expect(ability.talentNames).toContain("The Long View");
    });
});

describe('SpeciesAbility', () => {
    test('isChoiceRequired returns true when multiple choices', () => {
        const ability = SpeciesAbilityList.instance.getBySpecies(Species.Jelna);
        expect(ability.isChoiceRequired).toBeTruthy();
    });

    test('isChoiceRequired returns false when single choice', () => {
        const ability = SpeciesAbilityList.instance.getBySpecies(Species.Human);
        expect(ability.isChoiceRequired).toBeFalsy();
    });

    test('isValidTalentSelection returns true when talent is null', () => {
        const ability = SpeciesAbilityList.instance.getBySpecies(Species.Betazoid);
        expect(ability.isValidTalentSelection(null)).toBeTruthy();
    });

    test('isValidTalentSelection returns true for valid talent', () => {
        const ability = SpeciesAbilityList.instance.getBySpecies(Species.Betazoid);
        expect(ability.isValidTalentSelection({ name: "Telepathy2e" })).toBeTruthy();
    });

    test('isValidTalentSelection returns false for invalid talent', () => {
        const ability = SpeciesAbilityList.instance.getBySpecies(Species.Betazoid);
        expect(ability.isValidTalentSelection({ name: "Nonexistent" })).toBeFalsy();
    });

    test('isValidTalentSelection returns false when no talents supported', () => {
        const ability = SpeciesAbilityList.instance.getBySpecies(Species.Human);
        expect(ability.isValidTalentSelection({ name: "Anything" })).toBeFalsy();
    });
});
