import { describe, it, expect } from 'vitest';
import { validateOrderItems } from '../src/api/server';

describe('validateOrderItems', () => {
    it('returns null for valid items', () => {
        expect(validateOrderItems([
            { name: 'Margherita Pizza', quantity: 1 },
            { name: 'Pepperoni Pizza', quantity: 3 }
        ])).toBeNull();
    });

    it('returns null for an empty list', () => {
        expect(validateOrderItems([])).toBeNull();
    });

    it.each([
        ['null', null],
        ['a string', 'pizza'],
        ['a number', 5]
    ])('rejects an item that is %s', (_label, item) => {
        expect(validateOrderItems([item])).toBe('Each order item must be an object');
    });

    it.each([
        ['missing', undefined],
        ['empty', ''],
        ['whitespace only', '   '],
        ['not a string', 42]
    ])('rejects a name that is %s', (_label, name) => {
        expect(validateOrderItems([{ name, quantity: 1 }])).toBe('Each order item must have a valid name');
    });

    it.each([
        ['missing', undefined],
        ['zero', 0],
        ['negative', -1],
        ['a decimal', 1.5],
        ['a string', '2'],
        ['NaN', NaN]
    ])('rejects a quantity that is %s', (_label, quantity) => {
        expect(validateOrderItems([{ name: 'Margherita Pizza', quantity }]))
            .toBe('Each order item must have a valid quantity (positive integer)');
    });

    it('reports the first invalid item', () => {
        expect(validateOrderItems([
            { name: 'Margherita Pizza', quantity: 1 },
            { name: '', quantity: 1 },
            { name: 'Pepperoni Pizza', quantity: 0 }
        ])).toBe('Each order item must have a valid name');
    });
});
