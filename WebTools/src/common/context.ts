import { Era } from "../helpers/eras";
import { Source } from "../helpers/sources";

/**
 * The context describes the environment in which the characters/starships are
 * built. It encapsulates things like "what sources are available" and 
 * "what decisions has the GM made about optional items"
 */
export class Context {
    public sources: Source[] = [ Source.Core ];
    public era: Era = Era.NextGeneration;

    public allowCrossSpeciesTalents: boolean = false;
    public allowEsotericTalents: boolean = false;

    addSource(source: Source) {
        this.sources.push(source);
    }

    removeSource(source: Source) {
        if (this.hasSource(source)) {
            this.sources.splice(this.sources.indexOf(source), 1);
        }
    }

    hasSource(source: Source) {
        return this.sources.indexOf(source) > -1 || source === Source.Core;
    }

    hasAnySource(sources: Source[]) {
        var result: boolean = false;
        for (var s of sources) {
            result = result || this.sources.indexOf(s) > -1 || s === Source.Core;
        }
        return result;
    }
}

export let context = new Context();