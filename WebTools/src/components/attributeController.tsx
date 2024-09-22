import { Attribute } from "../helpers/attributes";

export interface IAttributeController {
    isShown(attribute: Attribute): boolean;
    isEditable(attribute: Attribute): boolean;
    getValue(attribute: Attribute): number;
    getDeltaValue(attribute: Attribute): number|undefined;
    canIncrease(attribute: Attribute): boolean;
    canDecrease(attribute: Attribute): boolean;
    onIncrease(attribute: Attribute): void;
    onDecrease(attribute: Attribute): void;
    get instructions(): string[];
}