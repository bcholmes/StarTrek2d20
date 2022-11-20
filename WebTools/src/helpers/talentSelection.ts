import { TalentModel, TalentsHelper } from "./talents";

export class TalentSelection {
    readonly talent: TalentModel;
    readonly rank: number;
    readonly qualifier?: string;

    constructor(talent: TalentModel, rank: number = 1, qualifier?: string) {
        this.talent = talent;
        this.rank = rank;
        this.qualifier = qualifier;
    }

    get description() {
        let result = this.nameWithoutRank;
        if (this.rank > 1) {
            result += " [x" + this.rank + "]";
        }

        return result;
    }

    get nameWithoutRank() {
        let result = this.talent.name;
        if (this.qualifier) {
            result += " [" + this.qualifier + "]";
        }
        return result;
    }

    public static selectTalent(talentName: string, rank: number = 1) {
        const talent = TalentsHelper.getTalent(talentName);
        if (talent) {
            if (talent.name !== talentName && talentName.indexOf('[') >= 0 && talentName.indexOf(']') >= 0) {
                let qualifier = talentName.substring(talentName.indexOf('[') + 1, talentName.indexOf(']'));
                return new TalentSelection(talent, rank, qualifier);
            } else {
                return new TalentSelection(talent, rank);
            }
        } else {
            return null;
        }
    }
}

