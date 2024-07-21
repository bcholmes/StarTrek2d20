import { AssetType } from "./assetType";

export class AssetStat {
    readonly base: number;
    readonly critical: number;

    constructor(base: number, critical: number) {
        this.base = base;
        this.critical = critical;
    }
}

export class Asset {
    readonly type: AssetType;
    readonly name: string;
    readonly additionalInformation: string;
    readonly stats: AssetStat[];

    constructor(type: AssetType, name: string, stats: AssetStat[], additionalInformation: string = "") {
        this.type = type;
        this.name = name;
        this.stats = stats;
        this.additionalInformation = additionalInformation;
    }
}