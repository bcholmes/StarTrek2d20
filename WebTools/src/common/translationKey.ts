export const makeKey = (prefix: string, key: string) => {
    let suffix = key.substring(0, 1).toLowerCase() + key.substring(1);
    if (key.toLocaleUpperCase() === key) {
        suffix = key.toLocaleLowerCase();
    }
    return prefix + suffix;
}