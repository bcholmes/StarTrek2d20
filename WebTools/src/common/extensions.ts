export function CopyObject(target: {}, ...sources: Array<{}>) {
    if (target === undefined || target === null) {
        throw new TypeError('CopyObject failed due to inconsistent cast.');
    }

    var to = Object(target);
    for (var i = 0; i < sources.length; i++) {
        var nextSource = sources[i];
        if (nextSource === undefined || nextSource === null) {
            continue;
        }
        nextSource = Object(nextSource);

        var keysArray = Object.keys(nextSource);
        for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
            var nextKey = keysArray[nextIndex];
            var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
            if (desc !== undefined && desc.enumerable) {
                to[nextKey] = nextSource[nextKey];
            }
        }
    }

    return to;
}