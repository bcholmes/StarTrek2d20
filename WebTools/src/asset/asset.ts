import { Rank } from "../helpers/ranks";
import { Spaceframe } from "../helpers/spaceframeEnum";
import { AssetType } from "./assetType";

export class AssetStat {
    readonly base: number;
    readonly critical: number;

    constructor(base: number, critical: number) {
        this.base = base;
        this.critical = critical;
    }

    get asString() {
        return this.base + "/" + this.critical;
    }
}

export class Asset {
    readonly type: AssetType;
    readonly name: string;
    readonly additionalInformation?: Spaceframe|Rank;
    readonly stats: AssetStat[];

    constructor(type: AssetType, name: string, stats: AssetStat[], additionalInformation?: Spaceframe|Rank) {
        this.type = type;
        this.name = name;
        this.stats = stats;
        this.additionalInformation = additionalInformation;
    }
}