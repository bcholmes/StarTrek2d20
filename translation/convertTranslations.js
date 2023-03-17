import fs from 'fs';
import { parse } from 'csv-parse';

import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const convertDataToTranslations = async (data) => {
    let languages = data[0].splice(1);
    let directory = __dirname.substring(0, __dirname.lastIndexOf('/'));

    for (let i = 0; i < languages.length; i++) {
        console.log(i + " " + languages[i]);

        let stream = await fs.createWriteStream(directory + '/WebTools/src/i18n/locales/' + languages[i] + '/translations.json');
        stream.write("{");

        let previousPrefix = null;

        for (let j = 1; j < data.length; j++) {
            const row = data[j];
            const key = row[0];
            const value = i+1 < row.length ? row[i+1] : null;

            if (value && value !== "(NOT YET TRANSLATED)") {
                let prefix = key.substring(0, key.lastIndexOf('.'));

                if (j > 1) {
                    stream.write(",");
                }
                if (previousPrefix !== null && previousPrefix !== prefix) {
                    stream.write("\n");
                }
                stream.write("\n    \"" + key + "\": \"" + value.replaceAll('\n', '\\n') + "\"");

                previousPrefix = prefix;
            }
        }

        stream.write("\n}\n");
        stream.end();
    }
}

const parser = parse({delimiter: ','}, function(err, data){
    convertDataToTranslations(data);
});

fs.createReadStream(__dirname+'/translations.csv').pipe(parser);