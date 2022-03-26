import base64url from 'base64url';
import pako from 'pako';
import { Character, CharacterAttribute, CharacterSkill, Starship } from '../common/character';
import { CharacterType } from '../common/characterType';
import { Attribute } from './attributes';
import { MissionProfile } from './missionProfiles';
import { Skill } from './skills';
import { MissionPod, Spaceframe } from './spaceframes';
import { Species } from './species';
import { System } from './systems';

class Marshaller {

    encodeSupportingCharacter(character: Character) {
        let sheet = {
            "stereotype": "supportingCharacter",
            "type": CharacterType[character.type],
            "name": character.name,
            "pronouns": character.pronouns,
            "role": character.role,
            "rank": character.rank,
            "species": Species[character.species],
            "attributes": this.toAttributeObject(character.attributes),
            "disciplines": this.toSkillObject(character.skills),
            "traits": this.parseTraits(character.additionalTraits),
            "focuses": [...character.focuses]
        };
        console.log(JSON.stringify(sheet));
        return this.encode(sheet);
    }

    toAttributeObject(attributes: CharacterAttribute[]) {
        let result = {};
        attributes.forEach(a => { 
            console.log("attr: " + Attribute[a.attribute]);
            result[Attribute[a.attribute]] = a.value; });
        return result;
    }

    toSkillObject(skills: CharacterSkill[]) {
        let result = {};
        skills.forEach(a => result[Skill[a.skill]] = a.expertise);
        return result;
    }

    parseTraits(traits: string) {
        return traits ? traits.split(',').map(t => t.trim()).filter(t => t.length > 0) : [];
    }

    encodeStarship(starship: Starship) {
        let sheet = {
            "stereotype": "starship",
            "type": CharacterType[starship.type],
            "year": starship.serviceYear,
            "name": starship.name,
            "registry": starship.registry,
            "refits": [],
            "talents": [],
            "traits": this.parseTraits(starship.traits)
        };

        starship.additionalTalents.forEach(t =>  {
            sheet.talents.push({ "name": t.name });
        });
        if (starship.spaceframeModel) {
            sheet['spaceframe'] = {
                "name": Spaceframe[starship.spaceframeModel.id]
            }
        }
        if (starship.missionProfileModel) {
            let temp = {
                "name": MissionProfile[starship.missionProfileModel.id]
            }
            if (starship.profileTalent) {
                temp['talent'] = { "name": starship.profileTalent.name }
            }
            sheet['missionProfile'] = temp;
        }
        if (starship.missionPod) {
            sheet['missionPod'] = {
                "name": MissionPod[starship.missionPodModel.id]
            }
        }
        if (starship.refits != null) {
            starship.refits.forEach(s => sheet.refits.push(System[s]));
        }
        return this.encode(sheet);
    }

    encode(json: any) {
        let text = JSON.stringify(json);
        let encoded = pako.deflate(text);
        let result = base64url.encode(encoded);
        console.log(">>> " + text.length + " reduced to " +  result.length);
        return result;
    }

    decode(s: string) {
        if (s) {
            let encoded = base64url.toBuffer(s);
            let text = pako.inflate(encoded, {to: 'string'});
            return JSON.parse(text);
        } else {
            return undefined;
        }
    }
}

export const marshaller = new Marshaller();
