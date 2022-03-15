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
    getAllAttributes() {
        return [Attribute.Control, Attribute.Daring, Attribute.Fitness, Attribute.Insight, Attribute.Presence, Attribute.Reason]
    }
}

export const AttributesHelper = new Attributes();