type TSimple = string | number | boolean | null | TSimple[] | { [key: string]: TSimple };
type TJSON = { [key: string]: TSimple } | TSimple[];

interface IEmpty {
    $empty: boolean;
}

export function createEvent(target: TJSON = {}, update: TJSON = {}, simple: boolean = false, output: TJSON = {}): TJSON {
    Object.keys(update).forEach(key => {
        if (target[key] === update[key]) return Array.isArray(output) ? output[key] = new Empty() : undefined;
        if (simple || !target[key] || typeof target[key] !== typeof target[key] || typeof update[key] !== 'object') return output[key] = (update[key] === undefined ? null : update[key]);
        if (!output[key]) output[key] = Array.isArray(update[key]) ? [] : {};
        return createEvent(target[key], update[key], simple, output[key]);
    });

    return output;
}

export function merge(target: TJSON = {}, events: TJSON[] = [], simple: boolean = false, output: TJSON = {}): TJSON {
    target = deepCopy(target);
    events = events.map(event => deepCopy(event));
    Object.assign(output, target);
    if (simple) return Object.assign(output, ...events);

    main(target, events, simple, output);

    return output;

    function main(target: TJSON, events: TJSON[], simple: boolean, output: TJSON): void {
        events.forEach(event => Object.keys(event).forEach(key => {
            if (typeof event[key] !== 'object' || event[key] === null) return output[key] = event[key];

            if (Empty.is(event[key])) return output[key] = target[key];

            if (!output[key]) output[key] = Array.isArray(event[key]) ? [] : {};
            main(target[key], [event[key]], simple, output[key]);
        }));
    }
}

export function Empty(): void {
    if (!new.target) return new Empty();

    this.$empty = true;
}

Empty.is = function (target: IEmpty): boolean {
    return (target instanceof Empty) || target?.hasOwnProperty('$empty');
}

function deepCopy(target: TJSON, output: TJSON = {}): TJSON {
    Object.keys(target).forEach(key => {
        if (typeof target[key] !== 'object' || target[key] === null) return output[key] = target[key];

        if (Empty.is(target[key])) return output[key] = new Empty();

        if (!output[key]) output[key] = Array.isArray(target[key]) ? [] : {};
        deepCopy(target[key], output[key]);
    });

    return output;
}
