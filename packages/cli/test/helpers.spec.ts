import { z } from 'zod';
import { zodParse } from '../src/lib';

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
      email: z.string().email(),
      phone: z.string().min(10).max(10),
      address: z.string().min(10).max(100),
    });

    expect(() => zodParse(payload, schema, 'User details')).toThrowError(
      'User details: [phone] Required',
    );
    // With no error context
    expect(() => zodParse(payload, schema)).toThrowError('[phone] Required');
  });

  it('should return payload if payload is valid', () => {
    const payload = {
      name: 'John Doe',
      email: 'john@doe.com',
      address: '123, Main Street, New York, NY',
    };

    const schema = z.object({
      name: z.string().min(3).max(50),
      email: z.string().email(),
      address: z.string().min(10).max(100),
    });

    expect(zodParse(payload, schema)).toEqual(payload);
  });
});
