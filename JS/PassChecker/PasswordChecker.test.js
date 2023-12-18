import { checkPassword } from './PasswordChecker.js';
import { describe, test} from 'node:test';
import * as assert from 'node:assert';

describe('checkPassword', () => {
    const sut = checkPassword;

    test('throws an error if password is not a string', () => {
        assert.throws(() => sut(123), Error);
    });
});
