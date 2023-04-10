/**
 * Wants a valid html string
 * Returns a valid DOM Element Tree
 *
 * @param string
 * @returns {ChildNode}
 */
window.toDOM = string => new DOMParser().parseFromString(string, "text/html").documentElement.querySelector('body').firstChild;

/**
 * Wait for n milliseconds
 * Returns a promise
 *
 * @param ms
 * @returns {Promise<any>}
 */
window.wait = ms => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
};

window.randomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
};

window.ksortObjArray = (array, key) => {
    const compare = (a, b) => {
        let comparison = 0;
        if (a[key] > b[key]) {
            comparison = 1;
        } else if (a[key] < b[key]) {
            comparison = -1;
        }
        return comparison;
    };
    return array.sort(compare);
};
