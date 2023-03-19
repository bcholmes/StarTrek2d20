export const makeKey = (prefix: string, key: string, suffix: string = "") => {
    let middle = key.substring(0, 1).toLowerCase() + key.substring(1);
    if (key.toLocaleUpperCase() === key) {
        middle = key.toLocaleLowerCase();
    }
    return prefix + middle + suffix;
}