import { DominionWarUniformPack } from "./dominionWarUniformPack";
import { EnterpriseUniformPack } from "./enterpriseUniformPack";
import { KlingonArmorUniformPack } from "./klingonArmorUniformPack";
import { MonsterMaroonUniformPack } from "./monsterMaroonUniformPack";
import { TosKlingonUniformPack } from "./tosKlingonUniformPack";
import { TosUniformPack } from "./tosUniformPack";
import { UniformEra } from "./uniformEra";

export default class UniformPackCollection {

    uniformPacks: { [era: number]: EnterpriseUniformPack|DominionWarUniformPack|KlingonArmorUniformPack|TosKlingonUniformPack|MonsterMaroonUniformPack|TosUniformPack } = {};

    private static _instance: UniformPackCollection;

    public static get instance() {
        if (UniformPackCollection._instance == null) {
            UniformPackCollection._instance = new UniformPackCollection();
        }
        return UniformPackCollection._instance;
    }

    getUniformPack(uniformEra: UniformEra) {
        if (this.isLoaded(uniformEra)) {
            return this.uniformPacks[uniformEra];
        } else {
            let pack = this.createUniformPack(uniformEra);
            this.uniformPacks[uniformEra] = pack;
            return pack;
        }
    }

    private createUniformPack(era: UniformEra) {
        if (era === UniformEra.MonsterMaroon) {
            return new MonsterMaroonUniformPack();
        } else if (era === UniformEra.Enterprise) {
            return new EnterpriseUniformPack();
        } else if (era === UniformEra.OriginalSeries) {
            return new TosUniformPack();
        } else if (era === UniformEra.OriginalSeriesKlingon) {
            return new TosKlingonUniformPack();
        } else if (era === UniformEra.Klingon) {
            return new KlingonArmorUniformPack();
        } else {
            return new DominionWarUniformPack();
        }
    }

    isLoaded(uniformEra: UniformEra) {
        return this.uniformPacks[uniformEra] != null;
    }
}