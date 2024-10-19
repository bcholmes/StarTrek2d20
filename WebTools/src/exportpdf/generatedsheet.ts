import { PDFDocument, PDFFont } from "@cantoo/pdf-lib";
import { ICharacterSheet, SheetTag } from "./icharactersheet";
import fontkit from '@pdf-lib/fontkit'
import { Construct } from "../common/construct";
import { ReadableTalentModel } from "./talentWriter";
import { RoleModel, RolesHelper } from "../helpers/roles";
import { SpeciesAbility } from "../helpers/speciesAbility";
import { Character } from "../common/character";
import { TALENT_NAME_BORG_IMPLANTS, TALENT_NAME_MISSION_POD, TALENT_NAME_UNTAPPED_POTENTIAL, TalentsHelper } from "../helpers/talents";
import { BorgImplants } from "../helpers/borgImplant";
import { Starship } from "../common/starship";

export abstract class BasicGeneratedSheet implements ICharacterSheet {

    formFont: PDFFont;

    getLanguage(): string {
        return "en";
    }
    getName(): string {
        throw new Error('Method not implemented.');
    }
    getThumbnailUrl(): string {
        throw new Error('Method not implemented.');
    }
    getPdfUrl(): string {
        throw new Error('Method not implemented.');
    }

    getDefaultFontPath() {
        return "/static/font/OpenSansCondensed-Light.ttf";
    }

    getTags(): SheetTag[] {
        return [];
    }

    async initializeFonts(pdf: PDFDocument) {

        pdf.registerFontkit(fontkit);
        const baseFontBytes = await fetch(this.getDefaultFontPath()).then(res => res.arrayBuffer());
        const baseFont =  await pdf.embedFont(baseFontBytes)
        this.formFont = baseFont;
        const form = pdf.getForm()
        if (form) {
            const rawUpdateFieldAppearances = form.updateFieldAppearances.bind(form);
            form.updateFieldAppearances = function () {
                return rawUpdateFieldAppearances(baseFont);
            };
        }
    }

    async populate(pdf: PDFDocument, construct: Construct) {
        await this.initializeFonts(pdf);
    }

    createFileName(suffix: string, construct: Construct): string {
        if (construct.name == null || construct.name.length === 0) {
            return suffix + ".pdf";
        } else {
            var escaped = construct.name.replace(/\\/g, '_').replace(/\//g, '_').replace(/\s/g, '_');
            return escaped + '-'  + suffix + ".pdf";
        }
    }


    determineIdealFontWidth(text: string[], maxWidth: number, idealFontSize: number, minimumFontSize: number, font: PDFFont) {
        let fontSize = idealFontSize;
        text.forEach(t => {
            let width = font.widthOfTextAtSize(t, fontSize);
            while (width > maxWidth) {
                fontSize -= 0.25;
                width = font.widthOfTextAtSize(t, fontSize);
                if (fontSize <= minimumFontSize) {
                    break;
                }
            }
        });
        return fontSize;
    }

}

export const assembleWritableItems = (character: Character) => {
    let result: (ReadableTalentModel|RoleModel|SpeciesAbility)[] = [];

    if (character.role != null) {
        let role = RolesHelper.instance.getRole(character.role, character.type);
        if (role) {
            result.push(role);
        }

        if (character.secondaryRole != null) {
            let role = RolesHelper.instance.getRole(character.secondaryRole, character.type);
            if (role) {
                result.push(role);
            }
        }
    }

    if (character.speciesStep?.ability) {
        result.push(character.speciesStep.ability);
    }

    for (let t of character.getDistinctTalentNameList()) {

        const talent = TalentsHelper.getTalent(t);
        if (talent) {
            const readableTalent = new ReadableTalentModel(character.type, talent);

            if (talent.maxRank > 1) {
                readableTalent.rank = character.getRankForTalent(t);
            }

            if (talent.name === TALENT_NAME_BORG_IMPLANTS) {
                readableTalent.implants = character.implants.map(implantType =>
                    BorgImplants.instance.getImplantByType(implantType)
                );
            } else if (talent.name === TALENT_NAME_UNTAPPED_POTENTIAL && character.version > 1) {
                readableTalent.attribute = character.careerStep?.talent?.attribute;
            }
            result.push(readableTalent);
        }
    }

    return result;
}

export const assembleStarshipTalents = (starship: Starship, includeSpecialRules: boolean = false) => {
    let result: (ReadableTalentModel|RoleModel|SpeciesAbility)[] = [];
    let specialRules: (ReadableTalentModel|RoleModel|SpeciesAbility)[] = [];

    for (let t of starship.getDistinctTalentNameList()) {

        const talent = TalentsHelper.getTalent(t);
        if (talent) {
            const readableTalent = new ReadableTalentModel(starship.type, talent);

            if (talent.maxRank > 1) {
                readableTalent.rank = starship.getRankForTalent(t);
            }

            if (talent.name === TALENT_NAME_MISSION_POD) {
                readableTalent.missionPod = starship.missionPodModel;
            }
            if (talent.specialRule) {
                specialRules.push(readableTalent);
            } else {
                result.push(readableTalent);
            }
        }
    }

    if (includeSpecialRules) {
        specialRules.forEach(t => result.push(t));
    }

    return result;
}