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
}

export const AttributesHelper = new Attributes();