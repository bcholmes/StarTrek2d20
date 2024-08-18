
export const toCamelCase = (phrase: string) => {
    let result = "";
    let upperCase = false;
    for (let i = 0; i < phrase.length; i++) {
        let c = phrase.charAt(i);
        if ("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".indexOf(c) >= 0) {
            if (upperCase) {
                c = c.toLocaleUpperCase();
                upperCase = false;
            } else {
                c = c.toLocaleLowerCase();
            }
            result += c;
        } else if (" " === c || "-" === c) {
            upperCase = true;
        }
    }
    return result.length > 0 ? result.substring(0, 1).toLocaleLowerCase() + result.substring(1) : result;
}