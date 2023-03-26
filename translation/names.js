import fs from 'fs';
import { parse } from 'csv-parse';

import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const tag = "Senegalese";

const convertDataToNames = async (data) => {
    let directory = __dirname.substring(0, __dirname.lastIndexOf('/'));

    let nameBuffer = fs.readFileSync(directory + "/WebTools/src/npc/names.json");
    let names = JSON.parse(nameBuffer.toString());

    for (let i = 0; i < data.length; i++) {

        const row = data[i];
        let name = row[0];
        if (name) {
            if (name.indexOf('(') >= 0) {
                name = name.substring(0, name.indexOf('(')).trim();
            }
            let gender = row[1];
            const type = "FirstName";

            if (gender.toLowerCase() === "girl") {
                gender = "Female";
            } else if (gender.toLowerCase() === "boy") {
                gender = "Male";
            } else if (gender.toLowerCase() === "unisex") {
                gender = "Unisex";
            }

            let existingNames = names[0].names.filter(n => n.name === name && n.gender === gender && n.type === type);
            if (existingNames.length > 0) {
                let existingName = existingNames[0];
                if (existingName.tags.indexOf(tag) < 0) {
                    existingName.tags.push(tag);
                }
            } else {
                names[0].names.push({
                    name: name,
                    gender: gender,
                    type: type,
                    tags: [ tag ]
                });
            }
        }

        names[0].names.sort((n1, n2) => {
            if (n1.name === n2.name) {
                return n1.type.localeCompare(n2.type);
            } else {
                return n1.name.localeCompare(n2.name);
            }
        });
    }
    fs.writeFileSync(directory + "/WebTools/src/npc/names.json", JSON.stringify(names, null, "    "));
}

const parser = parse({delimiter: ','}, function(err, data){
    convertDataToNames(data);
});

if (process.argv.length > 2) {
    console.log(process.argv[2]);
    fs.createReadStream(process.argv[2]).pipe(parser);
}