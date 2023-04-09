import { Character } from "../common/character";
import convert from "xml-js";
import { Attribute, AttributesHelper } from "../helpers/attributes";
import { Skill, SkillsHelper } from "../helpers/skills";

export class FantasyGroupsVttExporter {

    private static _instance: FantasyGroupsVttExporter;

    static get instance() {
        if (FantasyGroupsVttExporter._instance == null) {
            FantasyGroupsVttExporter._instance = new FantasyGroupsVttExporter();
        }
        return FantasyGroupsVttExporter._instance;
    }


    exportCharacter(character: Character) {

        let characterNode = {
            "type": "element",
            "name": "character",
            "elements": [
                this.convertAttributes(character),
                {
                    "name": "determination",
                    "attributes": {
                        "type": "number"
                    },
                    "type": "element",
                    "elements": [{
                        "type":"text",
                        "text": 0
                    }]
                },
                this.convertDisciplines(character),
                {
                    "name": "focuslist",
                    "type": "element",
                    "elements": [{
                        "type": "element",
                        "name": "id-00001",
                        "elements": [{
                            "type":"text",
                            "text": character.focuses?.join("\\n") ?? ""
                        }]
                    }]
                },
                {
                    "name": "hp",
                    "type": "element",
                    "elements": [{
                        "attributes": {
                            "type": "number"
                        },
                        "type": "element",
                        "name": "misc",
                        "elements": [{
                            "type":"text",
                            "text": 0
                        }]
                    },{
                        "attributes": {
                            "type": "number"
                        },
                        "type": "element",
                        "name": "total",
                        "elements": [{
                            "type":"text",
                            "text": character.stress
                        }]
                    },{
                        "name": "wounds",
                        "attributes": {
                            "type": "number"
                        },
                        "type": "element",
                        "elements": [{
                            "type":"text",
                            "text": 0
                        }]
                    }]
                },
                {
                    "name": "milestones",
                    "type": "element",
                    "elements": [{
                        "name": "arc",
                        "attributes": {
                            "type": "number"
                        },
                        "type": "element",
                        "elements": [{
                            "type":"text",
                            "text": 0
                        }]
                    },{
                        "name": "spotlight",
                        "attributes": {
                            "type": "number"
                        },
                        "type": "element",
                        "elements": [{
                            "type":"text",
                            "text": 0
                        }]
                    },{
                        "name": "standard",
                        "attributes": {
                            "type": "number"
                        },
                        "type": "element",
                        "elements": [{
                            "type":"text",
                            "text": 0
                        }]
                    }]
                },
                {
                    "name": "name",
                    "attributes": {
                        "type": "string"
                    },
                    "type": "element",
                    "elements": [{
                        "type":"text",
                        "text": character.name ?? ""
                    }]
                },
                {
                    "name": "notes",
                    "type": "element"
                },
                {
                    "name": "reputation",
                    "attributes": {
                        "type": "number"
                    },
                    "type": "element",
                    "elements": [{
                        "type":"text",
                        "text": character.reputation
                    }]
                },
                {
                    "name": "resistance",
                    "type": "element",
                    "elements": [{
                        "attributes": {
                            "type": "number"
                        },
                        "type": "element",
                        "name": "misc",
                        "elements": [{
                            "type":"text",
                            "text": 0
                        }]
                    },{
                        "attributes": {
                            "type": "number"
                        },
                        "type": "element",
                        "name": "total",
                        "elements": [{
                            "type":"text",
                            "text": character.resistance
                        }]
                    }]
                },
                {
                    "name": "species",
                    "attributes": {
                        "type": "string"
                    },
                    "type": "element",
                    "elements": [{
                        "type":"text",
                        "text": character.speciesName
                    }]
                }
            ]
        }


        let result = {
            "declaration":{"attributes":{"version":"1.0","encoding":"utf-8"}},
            "elements": [{
                "attributes": {
                    "version": "4.3",
                    "dataversion": "20230221",
                    "release": "2|CoreRPG:6"
                },
                "type": "element",
                "name": "root",
                "elements": [
                    characterNode
                ]
            }]
        };

        return convert.js2xml(result, { spaces: 2 });
    }

    convertDisciplines(character: Character) {
        let result = {
            "name": "disciplines",
            "type": "element",
            "elements": []
        };

        SkillsHelper.getSkills().forEach(s => {
            let name = Skill[s].toLowerCase();
            let discipline = {
                "name": name,
                "type": "element",
                "elements": [{
                    "name": "careerevent",
                    "attributes": {
                        "type": "number"
                    },
                    "type": "element",
                    "elements": [{
                        "type":"text",
                        "text": 0
                    }]
                },{
                    "name": "edit",
                    "attributes": {
                        "type": "number"
                    },
                    "type": "element",
                    "elements": [{
                        "type":"text",
                        "text": character.skills[s].expertise
                    }]
                },{
                    "name": "environment",
                    "attributes": {
                        "type": "number"
                    },
                    "type": "element",
                    "elements": [{
                        "type":"text",
                        "text": 0
                    }]
                },{
                    "name": "misc",
                    "attributes": {
                        "type": "number"
                    },
                    "type": "element",
                    "elements": [{
                        "type":"text",
                        "text": 0
                    }]
                },{
                    "name": "species",
                    "attributes": {
                        "type": "number"
                    },
                    "type": "element",
                    "elements": [{
                        "type":"text",
                        "text": 0
                    }]
                },{
                    "name": "total",
                    "attributes": {
                        "type": "number"
                    },
                    "type": "element",
                    "elements": [{
                        "type":"text",
                        "text": 0
                    }]
                },{
                    "name": "training",
                    "attributes": {
                        "type": "number"
                    },
                    "type": "element",
                    "elements": [{
                        "type":"text",
                        "text": character.skills[s].expertise
                    }]
                },{
                    "name": "upbringing",
                    "attributes": {
                        "type": "number"
                    },
                    "type": "element",
                    "elements": [{
                        "type":"text",
                        "text": 0
                    }]
                }]
            }
            result.elements.push(discipline);
        });

        return result;
    }

    convertAttributes(character: Character) {
        let result = {
            "name": "attributes",
            "type": "element",
            "elements": []
        };

        AttributesHelper.getAllAttributes().forEach(a => {
            let name = Attribute[a].toLowerCase();
            let attribute = {
                "name": name,
                "type": "element",
                "elements": [{
                    "name": "careerevent",
                    "attributes": {
                        "type": "number"
                    },
                    "type": "element",
                    "elements": [{
                        "type":"text",
                        "text": 0
                    }]
                },{
                    "name": "edit",
                    "attributes": {
                        "type": "number"
                    },
                    "type": "element",
                    "elements": [{
                        "type":"text",
                        "text": character.attributes[a].value
                    }]
                },{
                    "name": "environment",
                    "attributes": {
                        "type": "number"
                    },
                    "type": "element",
                    "elements": [{
                        "type":"text",
                        "text": 0
                    }]
                },{
                    "name": "misc",
                    "attributes": {
                        "type": "number"
                    },
                    "type": "element",
                    "elements": [{
                        "type":"text",
                        "text": 0
                    }]
                },{
                    "name": "species",
                    "attributes": {
                        "type": "number"
                    },
                    "type": "element",
                    "elements": [{
                        "type":"text",
                        "text": 0
                    }]
                },{
                    "name": "total",
                    "attributes": {
                        "type": "number"
                    },
                    "type": "element",
                    "elements": [{
                        "type":"text",
                        "text": 0
                    }]
                },{
                    "name": "training",
                    "attributes": {
                        "type": "number"
                    },
                    "type": "element",
                    "elements": [{
                        "type":"text",
                        "text": character.attributes[a].value
                    }]
                },{
                    "name": "upbringing",
                    "attributes": {
                        "type": "number"
                    },
                    "type": "element",
                    "elements": [{
                        "type":"text",
                        "text": 0
                    }]
                }]
            }
            result.elements.push(attribute);
        });

        return result;
    }
}