import { ConfigFileLoader } from './config-file-loader';
import Path from 'path';

describe('ConfigFileLoader', () => {
  it('should be created with a wrong file path', () => {
    const configFileLoader = new ConfigFileLoader('/wrong-path');
    expect(configFileLoader.get()).toBeUndefined();
  });

  it('should be created with a correct file path', () => {
    const configFileLoader = new ConfigFileLoader(
      Path.resolve('test/files/config-loader/basic/directus-sync.config.js'),
    );
    expect(configFileLoader.get()).toBeDefined();
  });
  it('should merge config recursively', () => {
    const configFileLoader = new ConfigFileLoader(
      Path.resolve('test/files/config-loader/basic/directus-sync.config.js'),
    );
    expect(configFileLoader.get()).toEqual({
      dumpPath: './dump',
      extends: [
        './directus-sync.config.base.base.js',
        './directus-sync.config.base.js',
      ],
      directusUrl: 'http://localhost:8055',
      directusToken: 'token',
      debug: true,
      split: true,
    });
  });
  it('should exclude extra properties', () => {
    const configFileLoader = new ConfigFileLoader(
      Path.resolve(
        'test/files/config-loader/with-extra/directus-sync.config.js',
      ),
    );
    expect(configFileLoader.get()).toEqual({
      debug: true,
      split: true,
    });
  });

  it('should deals with dependency loops', () => {
    const configFileLoader = new ConfigFileLoader(
      Path.resolve(
        'test/files/config-loader/dependency-loop/directus-sync.config.js',
      ),
    );
    expect(configFileLoader.get()).toEqual({
      extends: ['./directus-sync.config.js', './directus-sync.config.base.js'],
      debug: true,
      split: true,
    });
  });

  it('should deals with missing dependencies', () => {
    const configFileLoader = new ConfigFileLoader(
      Path.resolve(
        'test/files/config-loader/missing-dependency/directus-sync.config.js',
      ),
    );
    expect(configFileLoader.get()).toEqual({
      extends: ['./directus-sync.config.wrong.js'],
      debug: true,
      split: true,
    });
  });
});
