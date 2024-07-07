function createEvent(target = {}, update = {}, simple = false, output = {}) {
    Object.keys(update).forEach(key => {
        if (target[key] === update[key])
            return Array.isArray(output) ? output[key] = null : undefined;
        if (simple || !target[key] || typeof target[key] !== typeof target[key] || typeof update[key] !== 'object')
            return output[key] = (update[key] === undefined ? null : update[key]);
        if (!output[key])
            output[key] = Array.isArray(update[key]) ? [] : {};
        return createEvent(target[key], update[key], simple, output[key]);
    });
    return output;
}
function createReverseEvent(target = {}, update = {}, simple = false, output = {}) {
    Object.keys(update).forEach(key => {
        if (target[key] === update[key])
            return Array.isArray(output) ? output[key] = null : undefined;
        if (simple || !target[key] || typeof target[key] !== typeof target[key] || typeof update[key] !== 'object')
            return output[key] = (target[key] === undefined ? null : target[key]);
        if (!output[key])
            output[key] = Array.isArray(update[key]) ? [] : {};
        return createReverseEvent(target[key], update[key], simple, output[key]);
    });
    return output;
}
function merge(target = {}, events = [], simple = false) {
    if (simple)
        return Object.assign(target, ...events);
    events.forEach(event => Object.keys(event).forEach(key => {
        if (typeof event[key] !== 'object' || event[key] === null)
            return target[key] = event[key];
        if (!target[key])
            target[key] = Array.isArray(event[key]) ? [] : {};
        merge(target[key], [event[key]], simple);
    }));
    return target;
}
const a = {
    key1: 'value1',
    key2: 2,
    key3: true,
    key4: {
        key41: 'value41',
        key42: 'value42',
    },
    key5: [1, 2, 3]
};
const b = {
    key1: 'value12',
    key2: 23,
    key3: false,
    key4: {
        key41: 'value414',
        key42: 'value42',
    },
    key5: [5, 2, 31, 44]
};
console.log(createEvent(a, b));
console.log('Simple test', createEvent(a, b, true));
console.log(createReverseEvent(a, b));
console.log('Simple test', createReverseEvent(a, b, true));
console.log('Merge test', merge(a, [{
        key6: ['msi'],
    }, {
        key1: 'value13',
    }, {
        key4: {
            key43: 'value43',
            key41: 'value212',
        }
    }, {
        key4: {
            key42: null
        }
    }]));
