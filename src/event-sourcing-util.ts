type TSimple = string | number | boolean | null | TSimple[] | { [key: string]: TSimple };
type TJSON = { [key: string]: TSimple } | TSimple[];

interface IEmpty {
    $empty: boolean;
}

/**
 * Метод для создания события изменения
 * 
 * @param {Object} [target] - Целевой объект, на который накладывается событие изменения
 * @param {Object} [update] - Событие изменения
 * @param {boolean} [simple] - Параметр отвечает за сложность output события (true - значения с типом объекта будут перезаписываться из значений c типом объекта из update, false - данные будут изменятся внутри объекта рекурсивно)
 * @param {Object} [output] - Объект с новыми значениями из update
 * @returns {Object}
 */

export function createEvent(target: TJSON = {}, update: TJSON = {}, simple: boolean = false, output: TJSON = {}, reverse: boolean = false): TJSON {
    const stack = Object.keys(update).map(key => Array(key));

    while (stack.length) {
        const path = stack.pop();
        const key = getKey(path);
        const currentTarget = byPath(path, target);
        const currentUpdate = byPath(path, update);
        const currentOutput = byPath(path, output);

        if (currentTarget[key] === currentUpdate[key]) {
            if (Array.isArray(currentOutput)) currentOutput[key] = new Empty();
            continue;
        }

        if (simple) {
            currentOutput[key] = !reverse ? currentUpdate[key] : currentTarget[key];
            continue;
        }

        if (typeof currentUpdate[key] === 'object') {
            if (!currentOutput[key]) currentOutput[key] = Array.isArray(currentUpdate[key]) ? [] : {};

            stack.push(
                ...Object.keys(currentUpdate[key]).map(key => {
                    const newpath = path.slice();
                    newpath.push(key);
                    return newpath;
                })
            );
        } else {
            if (reverse) {
                currentOutput[key] = currentTarget[key];
                continue;
            }

            currentOutput[key] = currentUpdate[key] !== undefined ? currentUpdate[key] : null;
        }
    }

    function byPath(path: any = [], target: TJSON = {}): TJSON {
        path = path.slice(0, -1);
        return path.length === 0 ? target : path.reduce((target: TJSON, key: string) => target?.[key], target);
    }

    function getKey(path: any = []): any {
        return path[path.length - 1];
    }

    return output;
}

/**
 * Метод для слияния событий
 * 
 * @param {Object} [target] - Целевой объект, на который накладываеются события
 * @param {Object[]} [events] - События изменений 
 * @param {boolean} [simple] - Параметр отвечает за сложность наложения (true - значения с типом объекта будут перезаписываться из значений c типом объекта из events, false - данные будут изменятся внутри объекта рекурсивно)
 * @param {Object} [output] - Объеденённый объект
 * @returns {Object}
 */
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

/**
 * Конструктор для создания пустых значений
 * 
 * @returns {Object}
 */
export function Empty(): void {
    if (!new.target) return new Empty();

    this.$empty = true;

    Object.freeze(this);
}

/**
 * Статический метод для определения экземпляра Empty.
 * 
 * @returns {boolean}
 */
Empty.is = function (target: IEmpty): boolean {
    return (target instanceof Empty) || target?.hasOwnProperty('$empty');
}

/**
 * Метод для глубого копирования объекта
 * 
 * @private
 * 
 * @param {Object} [target] - Копируемый объект
 * @param {Object} [output] - Скопированный объект
 * @returns {Object}
 */

function deepCopy(target: TJSON = {}, output: TJSON = {}): TJSON {
    Object.keys(target).forEach(key => {
        if (typeof target[key] !== 'object' || target[key] === null) return output[key] = target[key];

        if (Empty.is(target[key])) return output[key] = new Empty();

        if (!output[key]) output[key] = Array.isArray(target[key]) ? [] : {};
        deepCopy(target[key], output[key]);
    });

    return output;
}
