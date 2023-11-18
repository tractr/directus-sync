import {env} from './helpers';

describe('env', () => {
  let originalEnv: NodeJS.ProcessEnv;
  beforeEach(() => {
    originalEnv = process.env;
    process.env = {};
  });
  afterEach(() => {
    process.env = originalEnv;
  });
  it('should return the environment variable', () => {
    process.env['TEST'] = 'test';
    expect(env('TEST')).toEqual('test');
  });
  it('should return the default value', () => {
    expect(env('TEST', 'test')).toEqual('test');
  });
  it('should throw an error if the environment variable is not defined', () => {
    expect(() => env('TEST')).toThrow(
      'Environment variable TEST is not defined',
    );
  });
});
