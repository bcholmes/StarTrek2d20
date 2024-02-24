import { D20 } from "../../common/die";
import { TableRoll } from "../../common/tableRoll";

export class TableRow {
    from: number;
    to?: number;
    result: ValueResult;

    constructor(result: ValueResult, from: number, to?: number) {
        this.result = result;
        this.to = to;
        this.from = from;
    }

    get range() {
        return (this.to == null || this.to === this.from) ? "" + this.from : ("" + this.from + "\u2013" + this.to);
    }
}

export class ValueResult {
    name: string;
    description?: string;

    constructor(name: string, description?: string) {
        this.name = name;
        this.description = description;
    }
}

export class Table {
    name: string;
    rows: TableRow[];

    constructor(name: string, rows: TableRow[]) {
        this.name = name;
        this.rows = rows;
    }

    public resolveRoll(roll: number) {
        let results = this.rows.filter(r => r.to == null ? r.from === roll : (r.from <= roll && roll <= r.to));
        return results.length > 0 ? results[0] : undefined;
    }
}

export class TableCollection {

    mainTable: Table;
    description: string;
    category: string;

    constructor(mainTable?: Table, description: string = "", category: string = "") {
        this.mainTable = mainTable;
        this.description = description;
        this.category = category;
    }

    get name() {
        return this.mainTable.name;
    }

    public roll:TableRoll<ValueResult[]> = () => {
        const dice = D20.roll();
        let row = this.mainTable.resolveRoll(dice);
        if (row != null) {
            return [ row.result ];
        } else {
            return [];
        }
    }
}
