import { Base64 } from 'js-base64';
import pako from 'pako';
import { Table, TableCollection, TableRow, ValueResult } from "./table";

class TableMarshaller {

    private static _instance: TableMarshaller;

    static get instance() {
        if (TableMarshaller._instance == null) {
            TableMarshaller._instance = new TableMarshaller();
        }
        return TableMarshaller._instance;
    }

    marshall(tableCollection: TableCollection) {
        let json = { mainTable: this.marshallTable(tableCollection.mainTable) }
        if (tableCollection.category) {
            json["category"] = tableCollection.category;
        }
        if (tableCollection.description) {
            json["description"] = tableCollection.description;
        }
        return this.encode(json);
    }

    unmarshall(encodedCollection: string) {
        let json = this.decode(encodedCollection);

        if (json["mainTable"]) {
            const mainTable = this.unmarshallTable(json["mainTable"]);

            const description = json["description"];
            const category = json["category"];

            return new TableCollection(mainTable, description, category);
        } else {
            return undefined;
        }
    }

    private unmarshallTable(json: any) {
        const name = json["name"];
        let rows = [];
        if (json["rows"]) {
            json.rows?.map(r => {
                let result = null;
                if (r["result"]) {
                    result = new ValueResult(r["result"]["name"], r["result"]["description"]);
                }
                return new TableRow(
                    result, r["from"], r["to"]
                )
            }).forEach(r => rows.push(r));
        }
        return new Table(name, rows);
    }

    decode(s: string) {
        if (s) {
            try {
                let encoded = Base64.toUint8Array(s);
                let text = new TextDecoder().decode(pako.inflate(encoded));
                return JSON.parse(text);
            } catch (e) {
                return undefined;
            }
        } else {
            return undefined;
        }
    }

    private marshallTable(table: Table) {
        let json = {};
        if (table.name) {
            json["name"] = table.name;
        }
        json["rows"] = table.rows?.map(r => { return {
            result: {
                "type": "value",
                "name": r.result?.name,
                "description": r.result?.description
            },
            from: r.from,
            to: r.to
        }});

        return json;
    }

    private encode(json: any) {
        let text = JSON.stringify(json);
        let encoded = pako.deflate(new TextEncoder().encode(text));
        let result = Base64.fromUint8Array(encoded, true);
        return result;
    }
}


export default TableMarshaller;