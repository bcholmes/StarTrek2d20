#!/usr/bin/node

const Groq = require('groq-sdk');
const fs = require('node:fs');

const getApiKey = () => {
    try {
        return fs.readFileSync('../../groq.ini', 'utf8');
    } catch (e) {
        return undefined;
    }
}

function describeSpecies(species) {

    if (species === "Denobulan") {
        return "Denobulans are human-like aliens with prominent facial ridges running down either size of the forehead to the cheeks, an enlarged brow ridge under a high receding hairling and a vertical crevice in the center of the forehead. "
    } else if (species === "Betazoid") {
        return "Betazoids appear human in almost every way except for their completely black irises. "
    } else if (species === "Bolian") {
        return "Bolians are bald, blue-skinned humanoids, with a bifurcating ridge running vertically along the center of the head and face. Some Bolians have darker blue stripes running from ear to ear across the top and back of the head. "
    } else if (species === "Ferengi") {
        return "Ferengi are short humanoids with orange-brown skin, enlarged skulls, wrinkled noses and sharp teeth. They are completely hairless. "
    } else if (species === "Hupyrian") {
        return "Hupyrians are taller than most humanoid species, and characterized by parallel skin creases around their eyes, mouth, and ears. ";
    } else if (species === "Yridian") {
        return "Yridians are humanoids, usually bald with heavily wrinkled skin and large rodent-like ears. Yridians have an indented ridge running across the full length of their heads and down their noses. "
    } else if (species === "Nausicaan") {
        return "Nausicaans have large and muscular physiques, generally surpassing two meterss in height and great physical strength. They have ashen-coloured faces with a prominent bone structure and sharp tusks protruding on either side of their mouths. "
    } else if (species === "Bynar") {
        return "The Bynars are short, genderless humanoids with lilac-coloured skin and enlarged skulls. Bynars are mostly bald but with a patch of dark purple hair on the sides of the neck. "
    } else if (species === "Pakled") {
        return "The Pakleds are a humanoid species with round, mostly bald heads and large brows covering much of their sloping foreheads. Their skin is pale greyish-white and their bodies are heavyset but muscular. Pakleds have low intelligence. "
    } else if (species === "Son’a") {
        return "The Son’a are a humanoid species obsessed with efforts to prolong their lives by any possible means, including genetic manipulation and surgical techniques. Almost all Son’a have stretched their skin across their faces in an attempt to look younger. ";
    } else if (species === "Talarian") {
        return "The Talarians are human-like aliens, notable for a distinctive hairless enlargement of the coronal area of the skull extending in two lobes to the back of the head. ";
    } else if (species === "Tholian") {
        return "The Tholians are a crystalline species, with hard, carapaces that are made of flame/orange-hued mineral/crystal. They have six legs that allow them to move very quickly. ";
    } else if (species === "Tzenkethi") {
        return "The Tzenkethi have hulking reptile-like anatomy with a large pair of arms extending from their shoulders and a smaller pair of arms used for finer manipulation. Their skin color ranges from purple to scarlet to emerald green. ";
    } else if (species === "Breen") {
        return "The Breen are a spacefaring humanoid species native to the planet Breen in the Alpha Quadrant. Notoriously reclusive and warlike, the Breen are a formidable power in their region of the galaxy. They almost always wear refrigeration suits that entirely conceal their bodies. The Breen are hairless, pale green humanoids with two distinct forms: a solid form, and a gelatinous form in which their tissues are translucent and flexible. Breen culture teaches that the gelatinous form is their true face, whereas the solid form represents a weak evolutionary throwback. ";
    } else if (species === "Borg") {
        return "The Borg were a pseudo-species of cybernetic humanoids, or cyborgs, from the Delta Quadrant known as drones, which formed the entire population of the Borg Collective. Their ultimate goal was the attainment of 'perfection' through the forcible assimilation of diverse sentient species, technologies, and knowledge.";
    } else {
        return "";
    }
}

function describeSpecialization(inputJson, pronoun) {

    let prompt = "";
    pronoun = pronoun.substring(0, 1).toLocaleUpperCase() + pronoun.substring(1);
    let pronounPhrase = pronoun + " is ";
    let serves = " serves ";
    if (pronoun === "They") {
        pronounPhrase = "They are "
        serves = " serve ";
    }

    if (inputJson.npcCharacterType === "Starfleet") {

        prompt += pronounPhrase + " a member of Starfleet at the rank of " + inputJson.rank + "; ";

        if (inputJson.specialization === "Admiral") {
            prompt += pronoun + serves + " as an admiral at Starfleet Command."
        } else if (inputJson.specialization === "Admin") {
            prompt += pronoun + serves + " as an administrator/yeoman on a Starfleet ship."
        } else if (inputJson.specialization === "Counselor") {
            prompt += pronoun + serves + " as a counselor/therapist for a ship's crew."
        } else if (inputJson.specialization === "FirstContactSpecialist") {
            prompt += pronoun + serves + " as a first contact specialist, studying and meeting new alien species."
        } else if (inputJson.specialization === "Jag") {
            prompt += pronoun + serves + " as a legal expert for Starfleet's Judge Advocate General's office."
        } else if (inputJson.specialization === "Security") {
            prompt += pronoun + serves + " in Starfleet's the security department."
        } else if (inputJson.specialization === "MedicalDoctor") {
            prompt += pronoun + serves + " as a medical doctor."
        } else if (inputJson.specialization === "Nurse") {
            prompt += pronoun + serves + " as a nurse, tending to the sick and wounded."
        } else if (inputJson.specialization === "HangarDeck") {
            prompt += pronoun + serves + " on the flight deck/hanger deck, keeping shuttles ready for use."
        } else if (inputJson.specialization === "Conn") {
            prompt += pronoun + serves + " as a pilot/helmsman."
        } else if (inputJson.specialization === "ScienceTech") {
            prompt += pronoun + serves + " as a lab technician in a science department."
        } else if (inputJson.specialization === "StarfleetScientist") {
            prompt += pronoun + serves + " as a science officer for Starfleet";
            if (inputJson.specialty?.length) {
                prompt += " specializing in " + inputJson.specialty + ".";
            } else {
                prompt += ".";
            }
        } else if (inputJson.specialization === "Engineer") {
            prompt += pronoun + serves + " in the engineering department."
        } else if (inputJson.specialization === "IntelligenceOfficer") {
            prompt += pronoun + serves + " in Starfleet Intelligence, as an intelligence officer."
        } else if (inputJson.specialization === "Captain") {
            prompt += pronoun + serves + " as the captain of a starship."
        } else if (inputJson.specialization === "StationCommander") {
            prompt += pronoun + serves + " as the commander of a Starfleet space station."
        }

    } else if (inputJson.npcCharacterType === "RomulanEmpire") {

        if (inputJson.specialization === "RomulanCenturion") {
            prompt += pronounPhrase + " a member of the military fleet of the Romulan Star Empire at the rank of " + inputJson.rank + ".";
        } else if (inputJson.specialization === "RomulanTalShiar") {
            prompt += pronounPhrase + " a member of the Tal Shi'ar, the intelligence service of the Romulan Star Empire.";
        } else if (inputJson.specialization === "RomulanSenator") {
            prompt += pronounPhrase + " a senator in the government of the Romulan Star Empire.";
        } else if (inputJson.specialization === "RomulanSenator") {
            prompt += pronounPhrase + " in the order of the Qowat Milat, an all-female Romulan order of sword-wielding ninja-like fighters.";
        }

    } else if (inputJson.npcCharacterType === "Ferengi") {

        if (inputJson.specialization === "FerengiMerchant") {
            prompt += pronounPhrase + " Ferengi merchant seeking fortune through the sale of goods.";
        } else if (inputJson.specialization === "FerengiDaiMon") {
            prompt += pronounPhrase + " an officer in the Ferengi mercantile fleet, with the rank of " + inputJson.rank + ".";
        } else if (inputJson.specialization === "FerengiLiquidator") {
            prompt += pronounPhrase + " an trade official/liquidator in the Ferengi Commerce Authority.";
        } else if (inputJson.specialization === "FerengiEliminator") {
            prompt += pronounPhrase + " an \"eliminator\" or mercenary free agent who is trained for dangerous clandestine missions.";
        } else if (inputJson.specialization === "FerengiBartender") {
            prompt += pronounPhrase + " a bartender, providing alcohol and gambling to a wide range of customers.";
        }

    } else if (inputJson.npcCharacterType === "KlingonDefenseForces") {

        if (inputJson.specialization === "KlingonDiplomat") {
            prompt += pronounPhrase + " a diplomat for the Klingon Empire.";
        } else if (inputJson.specialization === "KlingonShipCaptain") {
            prompt += pronounPhrase + " the captain of Klingon Defense Forces starship, with the rank of " + inputJson.rank + ".";
        } else if (inputJson.specialization === "KlingonWarrior") {
            prompt += pronounPhrase + " a warrior in the Klingon Defense Forces starship, with the rank of " + inputJson.rank + ".";
        } else if (inputJson.specialization === "KlingonWeaponsOfficer") {
            prompt += pronounPhrase + " a weapons officer in the Klingon Defense Forces starship, with the rank of " + inputJson.rank + ".";
        } else if (inputJson.specialization === "KlingonMedic") {
            prompt += pronounPhrase + " a medic in the Klingon Defense Forces starship, with the rank of " + inputJson.rank + ".";
        }

    } else if (inputJson.npcCharacterType === "Cardassian") {

        if (inputJson.specialization === "CardassianGul") {
            prompt += pronounPhrase + " a commanding officer in the military of the Cardassian Union, with the rank of " + inputJson.rank + "." ;
        } else if (inputJson.specialization === "CardassianSoldier") {
            prompt += pronounPhrase + " a member of the military forces for the Cardassian Union, with the rank of " + inputJson.rank + ".";
        }

    } else if (inputJson.npcCharacterType === "Civilian") {

        if (inputJson.specialization === "Scientist") {
            prompt += pronounPhrase + " a civilian Federation scientist";
            if (inputJson.specialty?.length) {
                prompt += " specializing in " + inputJson.specialty + ".";
            } else {
                prompt += ".";
            }
        } else if (inputJson.specialization === "Bureaucrat") {
            prompt += pronounPhrase + " a bureaucrat/government official for the Federation.";
        } else if (inputJson.specialization === "Colonist") {
            prompt += pronounPhrase + " a colonist on a relatively-new Federation colony world.";
        } else if (inputJson.specialization === "FederationAmbassador") {
            prompt += pronoun + serves + " as an Ambassador, working on behalf of the Federation.";
        } else if (inputJson.specialization === "IndependentTraderCaptain") {
            prompt += pronounPhrase + " a Federation citizen, and the captain of an independant trading vessel.";
        } else if (inputJson.specialization === "Child") {
            if (inputJson.extraDetails?.length) {
                prompt += pronounPhrase + " a " + inputJson.extraDetails + " living in the Federation.";
            } else {
                prompt += pronounPhrase + " a child living in the Federation.";
            }
        } else if (inputJson.specialization === "CivilianDoctor") {
            prompt += pronounPhrase + " a civilian medical doctor working for the Federation.";
        } else if (inputJson.specialization === "Journalist") {
            prompt += pronounPhrase + " a journalist working for a Federation news outlet.";
        }
    } else if (inputJson.npcCharacterType === "RogueRuffianMercenary") {

        if (inputJson.specialization === "Pirate") {
            prompt += pronounPhrase + " a pirate, operating outside of the law by seizing ships and stealing their goods." ;
        } else if (inputJson.specialization === "InformationBroker") {
            prompt += pronounPhrase + " an information broker, peddling data and insider-knowledge for money.";
        } else if (inputJson.specialization === "BruteForHire") {
            prompt += pronounPhrase + " a mercenary/brute-for-hire, paid to rough up the people that their employers dislike.";
        } else if (inputJson.specialization === "Bodyguard") {
            prompt += pronounPhrase + " a paid bodyguard, responsible for keeping an employer safe from harm.";
        } else if (inputJson.specialization === "Smuggler") {
            prompt += pronounPhrase + " a smuggler, who transports illegal goods across borders and checkzones.";
        } else if (inputJson.specialization === "SketchyTraderCaptain") {
            prompt += pronounPhrase + " a less-than-honest captain of an independant trading vessel.";
        } else if (inputJson.specialization === "Terrorist") {
            prompt += pronounPhrase + " a terrorist, committing acts of violence for political purposes.";
        }
    } else if (inputJson.npcCharacterType === "MinorPolity") {

        if (inputJson.specialization === "SonaCommandOfficer") {
            prompt += pronounPhrase + " an officer of Son'a Command military fleet with the rank of " + inputJson.rank + "." ;
        } else if (inputJson.specialization === "TalarianWarrior") {
            prompt += pronounPhrase + " a member of the Talarian military fleet, with the rank of " + inputJson.rank + ".";
        } else if (inputJson.specialization === "TalarianOfficer") {
            prompt += pronounPhrase + " an officer of the Talarian military fleet, with the rank of " + inputJson.rank + ".";
        } else if (inputJson.specialization === "TzenkethiSoldier") {
            prompt += pronounPhrase + " a soldier in the Tzenkethi military service, with the rank of " + inputJson.rank + ".";
        } else if (inputJson.specialization === "TholianWarrior") {
            prompt += pronounPhrase + " a member of the Tholian military service.";
        } else if (inputJson.specialization === "BreenThot") {
            prompt += pronounPhrase + " a senior military leader of the Breen military with the rank of Thot.";
        } else if (inputJson.specialization === "BreenWarrior" || inputJson.specialization === "BreenEliteGuard") {
            prompt += pronounPhrase + " a soldier in the Breen military with the rank of " + inputJson.rank + ".";
        }
    } else if (inputJson.npcCharacterType === "Borg") {
        prompt += pronounPhrase + " a cybernetic drone member of the collective, and as such has no real personality or personal interests. "
            + pronounPhrase + " exists only to serve the collective. ";
        if (inputJson.specialization === "BorgTacticalDrone") {
          prompt += pronounPhrase + " specialized in tactical assault and defense of the collective. ";
        } else if (inputJson.specialization === "BorgTechnicalDrone") {
          prompt += pronounPhrase + " specialized in technical/engineering activities. ";
        } else if (inputJson.specialization === "BorgMedicalDrone") {
          prompt += pronounPhrase + " specialized in medical activities, keeping the organic and cybernetic parts of drones operational. ";
        } else if (inputJson.specialization === "BorgAdjunctDrone") {
          prompt += pronounPhrase + " specialized in group leadership/planning and organization. ";
        }
    }

    return prompt + " ";
}

function speciesAndGender(inputJson, pronoun) {

    let prompt = "The character's name is " + inputJson.name;

    prompt += " and " + (pronoun === "they" ? "they are " : (pronoun + " is ") + "a ");
    let species = inputJson.species;
    if (species === "Trill" && inputJson.speciesDetails?.length) {
        if (inputJson.speciesDetails === "Joined") {
            species = "Joined Trill";
        } else {
            species = "Trill (not joined with a symbiont)";
        }
    } else if (species === "Cybernetically Enhanced") {
        if (inputJson.originalSpecies) {
            species += " " + inputJson.originalSpecies;
        } else {
            species += " Human";
        }
    }

    if (pronoun === "they") {
        prompt += "non-binary " + species;
    } else if (pronoun === "she") {
        prompt += species + " woman";
    } else if (pronoun === "he") {
        prompt += species + " male";
    } else {
        prompt += species;
    }

    if (inputJson.species === "Human" && inputJson.nameOrigin != null) {
        prompt += " of " + inputJson.nameOrigin + " descent";
    }

    prompt += ". ";
    prompt += describeSpecies(inputJson.species);
    if (inputJson.originalSpecies) {
        prompt += describeSpecies(inputJson.originalSpecies);
    }

    return prompt + " ";
}

async function main(key, inputData) {
    const groq = new Groq({
        "apiKey": key.trim()
    });

    let inputJson = JSON.parse(inputData);
    let prompt = "Give me " + (inputJson.npcType === "Major" ? "three" : "two")
        + " paragraphs describing an original character in the Star Trek universe. ";
    let subjectPronoun = inputJson.pronouns;
    if (subjectPronoun != null && subjectPronoun.indexOf('/') >= 0) {
        subjectPronoun = subjectPronoun.substring(0, subjectPronoun.indexOf('/'));
    }
    let possessivePronoun = "";
    let possessivePronounCapitalized = "";
    if (subjectPronoun === "she") {
        possessivePronoun = "her";
        possessivePronounCapitalized = "Her";
    } else if (subjectPronoun === "he") {
        possessivePronoun = "his";
        possessivePronounCapitalized = "His";
    } else if (subjectPronoun === "they") {
        possessivePronoun = "their";
        possessivePronounCapitalized = "Their";
    }

    prompt += speciesAndGender(inputJson, subjectPronoun);
    prompt += describeSpecialization(inputJson, subjectPronoun);

    if (inputJson.aspects?.length) {
        prompt += "Here are some phrases that additionally describe the character: "
            + inputJson.aspects.map(s => "\"" + s + "\"").join(", ");
        prompt += " ";
    }

    if (inputJson.focuses?.length) {
        prompt += possessivePronounCapitalized + " key job skills include: "
                + inputJson.focuses.map(f => "\"" + f + "\"").join(", ") + ". ";
    }

    prompt += "Include a description and personality.  Also include other interesting aspects of " + possessivePronoun + " character. ";
    prompt += "Use the metric system for any measurements, including character heights. "

    const chatCompletion = await groq.chat.completions.create({
        "messages": [{
            "role": "user",
            "content": prompt
        }],
        "model": "openai/gpt-oss-120b",
        "temperature": 1,
        "max_completion_tokens": 1024,
        "top_p": 1,
        "stream": true,
        "stop": null
    });

    let text = "";

    for await (const chunk of chatCompletion) {
        text += (chunk.choices[0]?.delta?.content || '');
    }

    const json = {
        description: text
    };
    process.stdout.write("Content-Type: application/json\n\n");
    process.stdout.write(JSON.stringify(json));
}

let inputData = fs.readFileSync(0, "utf-8");

const key = getApiKey();
if (key == null || inputData == null || inputData.length == 0) {
    process.stdout.write("Content-Type: text/plain\n\n");
    process.stdout.write("Server configuration error");
} else {
    main(key, inputData);
}
