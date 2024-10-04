export enum Skill {
    Command,
    Conn,
    Engineering,
    Security,
    Science,
    Medicine,

    None
}

export class Skills {
    getSkills() {
        let skills: Skill[] = [];
        for (var s = 0; s <= Skill.Medicine; s++) {
            skills.push(s);
        }

        return skills;
    }

    getSkillName(skill: Skill) {
        if (skill === Skill.None) {
            return "";
        }

        return Skill[skill];
    }

    getSkillByName(name: string) {
        for (var i = 0; i < Skill.None; i++) {
            const skill = Skill[i];
            if (skill === name) {
                return i as Skill;
            }
        }

        return undefined;
    }
}

export const SkillsHelper = new Skills();