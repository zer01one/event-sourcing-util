const EventSourcingUtil = require('../dist/_cjs/event-sourcing-util.js');

const objects = {
    a: {
        key1: 'value1',
        key2: 2,
        key3: true,
        key4: {
            key41: 'value41',
            key42: 'value42',
        },
        key5: [1, 2, 3]
    },
    b: {
        key1: 'value12',
        key2: 23,
        key3: false,
        key4: {
            key41: 'value414',
            key42: 'value42',
        },
        key5: [5, 2, 31, 44]
    },
    results: {
        'a+b': {
            key1: 'value12',
            key2: 23,
            key3: false,
            key4: {
                key41: 'value414',
            },
            key5: [5, { $empty: true }, 31, 44]
        },
        'b+a': {
            key1: 'value1',
            key2: 2,
            key3: true,
            key4: {
                key41: 'value41'
            },
            key5: [1, { $empty: true }, 3]
        },
        'a+b-s': {
            key1: 'value12',
            key2: 23,
            key3: false,
            key4: {
                key41: 'value414',
                key42: 'value42',
            },
            key5: [5, 2, 31, 44]
        },
        'b+a-s': {
            key1: 'value1',
            key2: 2,
            key3: true,
            key4: {
                key41: 'value41',
                key42: 'value42',
            },
            key5: [1, 2, 3]
        }
    }

}

describe('EventSourcingUtil: createEvent', () => {

    test('Success create event (no simple)', () => {
        expect(EventSourcingUtil.createEvent(objects.a, objects.b)).toEqual(objects.results['a+b']);

        expect(EventSourcingUtil.createEvent(objects.b, objects.a)).toEqual(objects.results['b+a']);
    });

    test('Success create event (simple)', () => {
        expect(EventSourcingUtil.createEvent(objects.a, objects.b, true)).toEqual(objects.results['a+b-s']);

        expect(EventSourcingUtil.createEvent(objects.b, objects.a, true)).toEqual(objects.results['b+a-s']);
    });

    test('Success merge (no simple)', () => {
        expect(EventSourcingUtil.merge(objects.a, [objects.results['a+b']])).toEqual(objects.b);

        expect(EventSourcingUtil.merge(objects.b, [objects.results['b+a']])).toEqual(Object.assign({}, objects.a, { key5: [1, 2, 3, 44] }));
    });

    test('Success merge (simple)', () => {
        expect(EventSourcingUtil.merge(objects.a, [objects.results['a+b']], true)).toEqual({
            key1: 'value12',
            key2: 23,
            key3: false,
            key4: {
                key41: 'value414',
            },
            key5: [5, { $empty: true }, 31, 44]
        });

        expect(EventSourcingUtil.merge(objects.b, [objects.results['b+a']], true)).toEqual({
            key1: 'value1',
            key2: 2,
            key3: true,
            key4: {
                key41: 'value41'
            },
            key5: [1, { $empty: true }, 3]
        });
    });


});