import {Source} from './sources';

export class AliasModel {
    name: string;
    source: Source

    constructor(name: string, source: Source) {
        this.name = name;
        this.source = source;
    }

    get localizedName() {
        return this.name;
    }
}
