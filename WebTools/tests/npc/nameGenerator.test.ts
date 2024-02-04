import { test, expect, describe } from '@jest/globals'
import { NameGenerator } from '../../src/npc/nameGenerator';
import { ISpecies, NameModel } from '../../src/helpers/species';
import { Species } from '../../src/helpers/speciesEnum';

class MockSpecies implements ISpecies {
    id: Species;
    name: string;
    nameSuggestions: NameModel[] = [];

    constructor(id: Species, name: string) {
        this.id = id;
        this.name = name;
    }
}

describe('testing name generation', () => {
    test('should create name', () => {
        const { name, pronouns } = NameGenerator.instance.createName(new MockSpecies(Species.Human, "Human") );
        expect(name).toBeDefined();
        expect(pronouns).toBeDefined();
    });

    test('should create female name', () => {
        for (let i = 100; i >= 0; i--) {
            const { name, pronouns } = NameGenerator.instance.createName(new MockSpecies(Species.Human, "Human"), "Female" );
            expect(name).toBeDefined();
            expect(pronouns).toBe("she/her");
        }
    });

    test('should create male name', () => {
        for (let i = 100; i >= 0; i--) {
            const { name, pronouns } = NameGenerator.instance.createName(new MockSpecies(Species.Human, "Human"), "Male" );
            expect(name).toBeDefined();
            expect(pronouns).toBe("he/him");
        }
    });

    test('should create Vulcan name', () => {
        const { name } = NameGenerator.instance.createName(new MockSpecies(Species.Vulcan, "Vulcan") );
        expect(name.indexOf(" ") >= 0).toBeFalsy();
    });

});