
export const toCamelCase = (phrase: string) => {
    let result = "";
    let upperCase = false;
    for (let i = 0; i < phrase.length; i++) {
        const c = phrase.charAt(i);
        if ("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(c) >= 0) {
            if (upperCase) {
                result = c.toLocaleUpperCase();
                upperCase = false;
            } else {
                result = c.toLocaleLowerCase();
            }
            result += c;
        } else if (" " === c || "-" === c) {
            upperCase = true;
        }
    }
    return result.length > 0 ? result.substring(0, 1).toLocaleLowerCase() + result.substring(1) : result;
}