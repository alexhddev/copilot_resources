import { checkPassword } from './PasswordChecker.js'
import {describe, test} from 'node:test'
import * as assert from 'node:assert'

describe('checkPassword test suite', () => {
    test('should throw an error if the password is not a string', () => {
        assert.throws(() => checkPassword(123), Error('Password must be a string'))
    });
    test('should throw an error if the password is less than 8 characters long', () => {
        assert.throws(() => checkPassword('abc'), Error('Password must be at least 8 characters long'))
    });
    test('should throw an error if the password is more than 20 characters long', () => {
        assert.throws(() => checkPassword('abcdefghijabcdefghijabcdefghij'), Error
        ('Password must be at most 20 characters long'))
    });
    test('should throw an error if the password does not contain at least one lowercase letter', () => {
        assert.throws(() => checkPassword('ABC12345'), Error('Password must contain at least one lowercase letter'))
    });
    test('should throw an error if the password does not contain at least one uppercase letter', () => {
        assert.throws(() => checkPassword('abc12345'), Error('Password must contain at least one uppercase letter'))
    });
    test('should throw an error if the password does not contain at least one digit', () => {
        assert.throws(() => checkPassword('Abcdefgh'), Error('Password must contain at least one digit'))
    });
    test('should throw an error if the password does not contain at least one special character', () => {
        assert.throws(() => checkPassword('Abcdefgh1'), Error('Password must contain at least one special character'))
    });

    test('should throw error if the password contains the ! character', ()=>{

        assert.throws(() => checkPassword('Abcdefgh1!'), Error('Password must contain at least one special character'))
    })

    test('should not throw an error if the password meets all the criteria', () => {
        assert.doesNotThrow(() => checkPassword('Abcdefgh1?'))
    });


})