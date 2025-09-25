import { z } from 'zod';
import { sortObjectDeep, zodParse } from './helpers';

describe('zodParse', () => {
  it('should throw error if payload is invalid', () => {
    const payload = {
      name: 'John Doe',
      email: 'john@doe.com',
      validated: false,
      address: '123, Main Street, New York, NY',
    };

    const schema = z.object({
      name: z.string().min(3).max(50),
      email: z.email(),
      phone: z.string().min(10).max(10),
      address: z.string().min(10).max(100),
    });

    expect(() => zodParse(payload, schema, 'User details')).toThrowError(
      'User details: [phone] Invalid input: expected string, received undefined',
    );
    // With no error context
    expect(() => zodParse(payload, schema)).toThrowError('[phone] Invalid input: expected string, received undefined');
  });

  it('should return payload if payload is valid', () => {
    const payload = {
      name: 'John Doe',
      email: 'john@doe.com',
      address: '123, Main Street, New York, NY',
    };

    const schema = z.object({
      name: z.string().min(3).max(50),
      email: z.email(),
      address: z.string().min(10).max(100),
    });

    expect(zodParse(payload, schema)).toEqual(payload);
  });
});

describe('sortObjectDeep', () => {
  it('should sort object keys deeply', () => {
    const input = {
      b: 2,
      a: {
        d: 4,
        c: 3,
        e: [
          { z: 1, y: 2 },
          { b: 2, a: 1 },
        ],
      },
    };

    const result = sortObjectDeep(input);

    expect(Object.keys(result)).toEqual(['a', 'b']);
    const { a } = result;
    expect(Object.keys(a)).toEqual(['c', 'd', 'e']);
    expect(a.e[0]).toEqual({ y: 2, z: 1 });
    expect(a.e[1]).toEqual({ a: 1, b: 2 });
  });
});
