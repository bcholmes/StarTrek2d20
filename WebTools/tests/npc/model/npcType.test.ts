import { test, expect, describe } from '@jest/globals';
import { NpcType, NpcTypes } from '../../../src/npc/model/npcType';


describe('testing NPC type functions', () => {
    test('should find NPC Type by name', async () => {

        expect(NpcTypes.getNpcTypeByName("Minor")).toBe(NpcType.Minor);
        expect(NpcTypes.getNpcTypeByName("Notable")).toBe(NpcType.Notable);
        expect(NpcTypes.getNpcTypeByName("Major")).toBe(NpcType.Major);

        expect(NpcTypes.getNpcTypeByName("wonky")).toBeUndefined();
    });
});