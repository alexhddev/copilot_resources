import { checkPassword } from './PasswordChecker.js';
import { describe, test } from 'node:test';
import * as assert from 'node:assert';

describe('checkPassword', () => {
    const sut = checkPassword;

    test('throws an error if password is not a string', () => {
        assert.throws(() => sut(123), Error);
    });

    test('throws an error if password is not a string and checks error message', () => {
        assert.throws(() => sut(123), { message: 'password must be a string' });
    });

    test('throws an error if password is less than 8 characters', () => {
        assert.throws(() => sut('abc'), {message: 'password must be at least 8 characters'});
    });

    test('throws an error if password is more than 20 characters', () => {
        assert.throws(() => sut('abcdefghijklmnopqrstuvwxyz'), {message: 'password must be less than 20 characters'});
    });

    test('throws an error if password does not contain a lowercase letter', () => {
        assert.throws(() => sut('ABC12345'), {message: 'password must contain a lowercase letter'});
    });

    test('throws an error if password does not contain an uppercase letter', () => {
        assert.throws(() => sut('abc12345'), {message: 'password must contain an uppercase letter'});
    });

    test('throws an error if password does not contain a number', () => {
        assert.throws(() => sut('abcABCabc'), {message: 'password must contain a number'});
    });

    test('throws an error if password does not contain a special character', () => {
        assert.throws(() => sut('abcABC123'), {message: 'password must contain a special character'});
    });

    test('throws an error if password contains the !', () => {
        assert.throws(() => sut('abcABC123!'), {message: 'password must contain a special character'});
    });

    test('does not throw an error if password meets all criteria', () => {
        assert.doesNotThrow(() => sut('abcABC123?'), Error);
    });

});
