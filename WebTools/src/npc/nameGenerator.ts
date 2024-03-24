import { D20 } from "../common/die";
import { ISpecies } from "../helpers/species";
import { Species } from "../helpers/speciesEnum";

const names = [
    {
        "species": "Bynar",
        "names": require('./names-bynar.json')
    },
    {
        "species": "Human",
        "names": require('./names-human.json')
    },
    {
        "species": "Ferengi",
        "names": require('./names-ferengi.json')
    },
    {
        "species": "Hupyrian",
        "names": require('./names-hupyrian.json')
    },
    {
        "species": "Klingon",
        "names": require('./names-klingon.json')
    },
    {
        "species": "Nausicaan",
        "names": require('./names-nausicaan.json')
    },
    {
        "species": "Orion",
        "names": require('./names-orion.json')
    },
    {
        "species": "Pakled",
        "names": require('./names-pakled.json')
    },
    {
        "species": "Reman",
        "names": require('./names-reman.json')
    },
    {
        "species": "Talarian",
        "names": require('./names-talarian.json')
    },
    {
        "species": "Tellarite",
        "names": require('./names-tellarite.json')
    },
    {
        "species": "Tzenkethi",
        "names": require('./names-tzenkethi.json')
    },
    {
        "species": "Vulcan",
        "names": require('./names-vulcan.json')
    },
    {
        "species": "Yridian",
        "names": require('./names-yridian.json')
    },

];

export class NameGenerator {

    private static _instance: NameGenerator;

    static get instance() {
        if (NameGenerator._instance == null) {
            NameGenerator._instance = new NameGenerator();
        }
        return NameGenerator._instance;
    }

    createName(species: ISpecies, gender: "Male"|"Female"|"Unisex" = undefined) {

        let result = { name: "", pronouns: "" };
        let found = false;
        for (let name of names) {
            if (name.species === species.name) {

                let lastNames = name.names
                    .filter(n => n.type === 'LastName')
                    .filter(n => gender == null || gender === n.gender || n.gender === 'Unisex');
                let lastName = null;
                if (lastNames.length > 0) {
                    let r = Math.floor(Math.random() * lastNames.length);
                    lastName = lastNames[r];
                }
                let firstNames = name.names
                    .filter(n => n.type === 'FirstName')
                    .filter(n => gender == null || gender === n.gender)
                    .filter(n => {
                        if (lastName == null) {
                            return true;
                        } else {
                            let ok = (n.gender === lastName.gender || n.gender === 'Unisex' || lastName.gender === 'Unisex');
                            if (ok) {
                                let found = (n.tags.indexOf("Common") >= 0);
                                for (let tag of lastName.tags) {
                                    if (n.tags.indexOf(tag) >= 0) {
                                        found = true;
                                        break;
                                    }
                                }
                                return found;
                            } else {
                                return ok;
                            }
                        }
                    });
                let firstName = null;
                if (firstNames.length > 0) {
                    let r = Math.floor(Math.random() * firstNames.length);
                    firstName = firstNames[r];
                }

                let firstNameString = null;
                if (firstName != null) {
                    firstNameString = firstName.name;
                    if (firstName.variants && D20.roll() <= 10) {
                        firstNameString = firstName.variants[Math.floor(Math.random() * firstName.variants.length)];
                    }
                }
                let pronouns = this.derivePronouns(firstName.gender, gender != null);
                result = {
                    name: this.combineParts(firstNameString, lastName?.name, species, pronouns, name.names),
                    pronouns: pronouns
                }
                found = true;
                break;
            }
        }

        if (!found) {
            let names = species.nameSuggestions;

            let lastName = null;
            let lastNames = names.filter(n => n.type === "Family" || n.type === "Family Name" || n.type === "Surnames" || n.type === "Clan Names");
            if (lastNames.length > 0) {
                let parts = lastNames[0].suggestions.split(',');
                lastName = parts[Math.floor(Math.random() * parts.length)].trim();
            }

            let firstName = null;
            let gender = "Unisex";
            let firstNames = names.filter(n => n.type !== "Family" && n.type !== "Family Name" && n.type !== "Surnames" && n.type !== "Clan Names");
            if (firstNames.length > 0) {
                let nameModel = firstNames[Math.floor(Math.random() * firstNames.length)];
                gender = nameModel.type;
                let parts = nameModel.suggestions.split(',');
                firstName = parts[Math.floor(Math.random() * parts.length)].trim();
            }

            let pronouns = this.derivePronouns(gender, gender != null);
            result = {
                name: this.combineParts(firstName, lastName, species, pronouns),
                pronouns: pronouns
            }
        }

        return result;
    }

    private combineParts(firstName: string, lastName: string, species: ISpecies, pronouns: string, names: [] = []) {
        let parts = []

        if (species.id === Species.Bajoran) {
            if (lastName) {
                parts.push(lastName);
            }
            if (firstName) {
                parts.push(firstName);
            }
        } else if (species.id === Species.Andorian) {
            let clanNamePrefix = this.determineAndorianPrefix(pronouns);

            if (firstName) {
                parts.push(firstName);
            }

            if (lastName) {
                if (clanNamePrefix) {
                    parts.push(clanNamePrefix + lastName);
                } else {
                    parts.push(lastName);
                }
            }
        } else if (species.id === Species.Tellarite && D20.roll() <= 5) {
            let interstitials = names.filter(n => n['type'] === 'Interstitial');
            let interstitial = interstitials[Math.floor(Math.random() * interstitials.length)];

            if (firstName) {
                parts.push(firstName);
            }
            if (interstitial) {
                parts.push(interstitial["name"]);
            }
            if (lastName) {
                parts.push(lastName);
            }

        } else {
            if (firstName) {
                parts.push(firstName);
            }

            if (lastName) {
                parts.push(lastName);
            }
        }
        return parts.join(" ");
    }

    private determineAndorianPrefix(pronouns: string) {
        if (pronouns === "he/him") {
            return D20.roll() > 10 ? "th'" : "ch'";
        } else if (pronouns === "she/her") {
            return D20.roll() > 10 ? "sh'" : "zh'";
        } else if (pronouns === "they/them") {
            return D20.roll() > 10 ? "zh'" : "ch'";
        }
    }

    private derivePronouns(gender: string, preventNonbinary: boolean) {
        if (gender === "Male") {
            return (!preventNonbinary && D20.roll() === 20) ? "they/them" : "he/him";
        } else if (gender === "Female") {
            return (!preventNonbinary && D20.roll() === 20) ? "they/them" : "she/her";
        } else {
            return (!preventNonbinary && D20.roll() >= 18) ? "they/them" : (D20.roll() <= 10 ? "he/him" : "she/her");
        }
    }
}
