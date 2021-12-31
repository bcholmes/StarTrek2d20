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

    toSkill(name: string) {
        for (var i = 0; i < Skill.None; i++) {
            const skill = Skill[i];
            if (skill === name) {
                return i as Skill;
            }
        }

        return Skill.None;
    }
    findSkill(name: string) {
        if (!isNaN(Number(name)) && Number(name) >= 0 && Number(name) < Skill.None) {
            return Skill[Number(name)];
        } else {
            return this.toSkill(name);
        }
    }
}

export const SkillsHelper = new Skills();