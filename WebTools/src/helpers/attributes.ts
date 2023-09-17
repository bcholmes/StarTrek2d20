export enum Attribute {
    Control,
    Daring,
    Fitness,
    Insight,
    Presence,
    Reason
}

export class Attributes {
    getAttributeName(attr: Attribute) {
        return Attribute[attr];
    }
    getAttributeByName(attr: string) {
        let options = this.getAllAttributes().filter(a => this.getAttributeName(a) === attr);
        return options.length === 1 ? options[0] : undefined;
    }
    getAllAttributes() {
        return [Attribute.Control, Attribute.Daring, Attribute.Fitness, Attribute.Insight, Attribute.Presence, Attribute.Reason]
    }
}

export const AttributesHelper = new Attributes();