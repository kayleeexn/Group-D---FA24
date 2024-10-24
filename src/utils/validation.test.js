// src/utils/validation.test.js
import { validateEmail } from './validation';  

test('validates correct email format', () => {
  expect(validateEmail('test@example.com')).toBe(true);
  expect(validateEmail('user.name+alias@domain.com')).toBe(true);
  expect(validateEmail('TEST@EXAMPLE.COM')).toBe(true);
});

test('invalidates incorrect email format', () => {
  expect(validateEmail('test@.com')).toBe(false);
  expect(validateEmail('test@domain')).toBe(false);
  expect(validateEmail('username@domain@com')).toBe(false);
  expect(validateEmail('testexample.com')).toBe(false);
});
