export const makeKey = (prefix: string, key: string) => {
    key = key.substring(0, 1).toLowerCase() + key.substring(1);
    return prefix + key;
}