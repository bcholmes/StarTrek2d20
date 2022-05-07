
// See https://github.com/Hopding/pdf-lib/discussions/1196

import { adjustDimsForRotation, AppearanceProviderFor, cmyk, Color, componentsToColor, drawTextField, findLastMatch, grayscale, layoutCombedText, layoutMultilineText, layoutSinglelineText, PDFFont, PDFTextField, reduceRotation, rgb, rotateInPlace, setFillingColor, setFontAndSize, TextPosition } from "pdf-lib";

const tfRegex = /\/([^\0\t\n\f\r\ ]+)[\0\t\n\f\r\ ]+(\d*\.\d+|\d+)[\0\t\n\f\r\ ]+Tf/;

const updateDefaultAppearance = (
        field: { setDefaultAppearance(appearance: string): void },
        color: Color,
        font?: PDFFont,
        fontSize: number = 0,
    ) => {
        const da = [
            setFillingColor(color).toString(),
            setFontAndSize(font?.name ?? 'dummy__noop', fontSize).toString(),
        ].join('\n');
        field.setDefaultAppearance(da);
};


const getDefaultFontSize = (field: {
        getDefaultAppearance(): string | undefined;
    }) => {
        const da = field.getDefaultAppearance() ?? '';
        const daMatch = findLastMatch(da, tfRegex).match ?? [];
        const defaultFontSize = Number(daMatch[2]);
        return isFinite(defaultFontSize) ? defaultFontSize : undefined;
    };
    
    // Examples:
    //     `0.3 g` -> ['0.3', 'g']
    //     `0.3 1 .3 rg` -> ['0.3', '1', '.3', 'rg']
    //     `0.3 1 .3 0 k` -> ['0.3', '1', '.3', '0', 'k']
    const colorRegex = /(\d*\.\d+|\d+)[\0\t\n\f\r\ ]*(\d*\.\d+|\d+)?[\0\t\n\f\r\ ]*(\d*\.\d+|\d+)?[\0\t\n\f\r\ ]*(\d*\.\d+|\d+)?[\0\t\n\f\r\ ]+(g|rg|k)/;
    
    const getDefaultColor = (field: {
        getDefaultAppearance(): string | undefined;
    }) => {
        const da = field.getDefaultAppearance() ?? '';
        const daMatch = findLastMatch(da, colorRegex).match;
    
        const [, c1, c2, c3, c4, colorSpace] = daMatch ?? [];
    
        if (colorSpace === 'g' && c1) {
            return grayscale(Number(c1));
        }
        if (colorSpace === 'rg' && c1 && c2 && c3) {
            return rgb(Number(c1), Number(c2), Number(c3));
        }
        if (colorSpace === 'k' && c1 && c2 && c3 && c4) {
            return cmyk(Number(c1), Number(c2), Number(c3), Number(c4));
        }
    
        return undefined;
    };

export const staTextFieldAppearanceProvider: AppearanceProviderFor<PDFTextField> = (
        textField,
        widget,
        font,
    ) => {
        // The `/DA` entry can be at the widget or field level - so we handle both
        const widgetColor = getDefaultColor(widget);
        const fieldColor = getDefaultColor(textField.acroField);
        const widgetFontSize = getDefaultFontSize(widget);
        const fieldFontSize = getDefaultFontSize(textField.acroField);
    
        const rectangle = widget.getRectangle();
        const ap = widget.getAppearanceCharacteristics();
        const bs = widget.getBorderStyle();
        const text = textField.getText() ?? '';
    
        const borderWidth = bs?.getWidth() ?? 0;
        const rotation = reduceRotation(ap?.getRotation());
        const { width, height } = adjustDimsForRotation(rectangle, rotation);
    
        const rotate = rotateInPlace({ ...rectangle, rotation });
    
        const black = rgb(0, 0, 0);
    
        const borderColor = componentsToColor(ap?.getBorderColor());
        const normalBackgroundColor = componentsToColor(ap?.getBackgroundColor());
    
        let textLines: TextPosition[];
        let fontSize: number;
    
        const padding = textField.isCombed() ? 0 : 1;
        const bounds = {
            x: borderWidth + padding,
            y: borderWidth + padding,
            width: width - (borderWidth + padding) * 2,
            height: height - (borderWidth + padding) * 2,
        };
        if (textField.isMultiline()) {
        
            if (textField.getText() == null || textField.getText().length === 0) {
                textLines = [];
                fontSize = 9;

            } else {
                const layout = layoutMultilineText(text, {
                    alignment: textField.getAlignment(),
                    fontSize: widgetFontSize ?? fieldFontSize,
                    font,
                    bounds,
                });
                textLines = layout.lines;
                fontSize = layout.fontSize;
            }
        } else if (textField.isCombed()) {
            const layout = layoutCombedText(text, {
                fontSize: widgetFontSize ?? fieldFontSize,
                font,
                bounds,
                cellCount: textField.getMaxLength() ?? 0,
            });
            textLines = layout.cells;
            fontSize = layout.fontSize;
        } else {
            const layout = layoutSinglelineText(text, {
                alignment: textField.getAlignment(),
                fontSize: widgetFontSize ?? fieldFontSize,
                font,
                bounds,
            });
            textLines = [layout.line];
            fontSize = layout.fontSize;
        }
    
        // Update font size and color
        const textColor = widgetColor ?? fieldColor ?? black;
        if (widgetColor || widgetFontSize !== undefined) {
            updateDefaultAppearance(widget, textColor, font, fontSize);
        } else {
            updateDefaultAppearance(textField.acroField, textColor, font, fontSize);
        }
    
        const options = {
            x: 0 + borderWidth / 2,
            y: 0 + borderWidth / 2,
            width: width - borderWidth,
            height: height - borderWidth,
            borderWidth: borderWidth ?? 0,
            borderColor,
            textColor,
            font: font.name,
            fontSize,
            color: normalBackgroundColor,
            textLines,
            padding,
        };
    
        return [...rotate, ...drawTextField(options)];
    };