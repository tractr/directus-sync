import { applyMappers, bindMappers, Id } from './apply-mapper';

describe('applyMappers', () => {
  it('should apply mappers to input data recursively', async () => {
    const input = {
      key1: 'value1',
      key2: 'value2',
      key3: {
        key4: 'value4',
        key5: ['value5-0', 'value5-1'],
        key6: {
          key7: 'value7',
          key8: 'value8',
        },
      },
      key9: [
        {
          key10: 'value10-0',
          key11: 'value11-0',
        },
        {
          key10: 'value10-1',
          key11: 'value11-1',
        },
      ],
    };

    const mapperFactory = (index: number) => async (value: Id) =>
      `${value} mapped [${index}]`;
    const mappers = {
      key1: mapperFactory(1),
      key3: {
        key4: mapperFactory(4),
        key5: mapperFactory(5),
        key6: {
          key7: mapperFactory(7),
        },
      },
      key9: {
        key10: mapperFactory(10),
      },
    };

    const output = await applyMappers(input, mappers);

    expect(output).toEqual({
      key1: 'value1 mapped [1]',
      key2: 'value2',
      key3: {
        key4: 'value4 mapped [4]',
        key5: ['value5-0 mapped [5]', 'value5-1 mapped [5]'],
        key6: {
          key7: 'value7 mapped [7]',
          key8: 'value8',
        },
      },
      key9: [
        {
          key10: 'value10-0 mapped [10]',
          key11: 'value11-0',
        },
        {
          key10: 'value10-1 mapped [10]',
          key11: 'value11-1',
        },
      ],
    });
  });

  it('should exclude null from array values and keep in values', async () => {
    const input = {
      key1: 'value1',
      key2: null,
      key3: {
        key4: null,
        key5: ['value5-0', null, undefined, 'value5-1'],
      },
    };

    const mapperFactory = (index: number) => async (value: Id) =>
      `${value} mapped [${index}]`;
    const mappers = {
      key1: mapperFactory(1),
      key2: mapperFactory(2),
      key3: {
        key4: mapperFactory(4),
        key5: mapperFactory(5),
      },
    };

    const output = await applyMappers(input, mappers);

    expect(output).toEqual({
      key1: 'value1 mapped [1]',
      key2: null,
      key3: {
        key4: null,
        key5: ['value5-0 mapped [5]', 'value5-1 mapped [5]'],
      },
    });
  });

  it('should throw an error if mapper does not match the value types', () => {
    const input = {
      key1: 'value1',
      key2: {
        key3: 'value3',
      },
    };

    const mapperFactory = (index: number) => async (value: Id) =>
      `${value} mapped [${index}]`;
    const mappers = {
      key1: mapperFactory(1),
      key2: mapperFactory(2),
    };

    expect(() => applyMappers(input, mappers)).rejects.toThrowError(
      'Could not apply mapper to nested object',
    );
  });

  it('should throw an error if value does not match the mapper types', () => {
    const input = {
      key1: 'value2',
    };

    const mapperFactory = (index: number) => async (value: Id) =>
      `${value} mapped [${index}]`;
    const mappers = {
      key1: {
        key2: mapperFactory(2),
      },
    };

    expect(() => applyMappers(input, mappers)).rejects.toThrowError(
      'Could not apply sub-mapper to non-object',
    );
  });

  it('should return undefined if mapper returns undefined', async () => {
    const input = {
      key1: 'value1',
      key2: 'value2',
      key3: 'value3',
    };

    const mapperFactory = (index: number) => async (value: Id) =>
      index === 3 ? undefined : `${value} mapped [${index}]`;
    const mappers = {
      key1: mapperFactory(1),
      key2: mapperFactory(2),
      key3: mapperFactory(3),
    };

    const output = await applyMappers(input, mappers);

    expect(output).toBeUndefined();
  });

  it('should return undefined if sub-mapper returns undefined', async () => {
    const input = {
      key1: 'value1',
      key2: {
        key3: 'value3',
      },
    };

    const mapperFactory = (index: number) => async (value: Id) =>
      index === 3 ? undefined : `${value} mapped [${index}]`;
    const mappers = {
      key1: mapperFactory(1),
      key2: {
        key3: mapperFactory(3),
      },
    };

    const output = await applyMappers(input, mappers);

    expect(output).toBeUndefined();
  });
});

describe('bindMappers', () => {
  it('should return a tree of function mapped to the same structure', () => {
    const tree = {
      key1: 'value1',
      key2: 'value2',
      key3: {
        key4: 'value4',
      },
    } as const;
    const callback = (value: string) => (id: Id) =>
      `${value}_${id}`.toUpperCase();
    const predicate = (value: unknown) => typeof value === 'object';
    const mappers = bindMappers(tree, callback, predicate) as any;

    expect(mappers.key1('id1')).toBe('VALUE1_ID1');
    expect(mappers.key2('id2')).toBe('VALUE2_ID2');
    expect(mappers.key3.key4('id3')).toBe('VALUE4_ID3');
  });

  it('should return a tree of function mapped to the same structure from a tree of instances', () => {
    const tree = {
      key1: new Map<string, string>([['key', 'value1']]),
      key2: new Map<string, string>([['key', 'value2']]),
      key3: {
        key4: new Map<string, string>([['key', 'value4']]),
      },
    } as const;
    const callback = (map: Map<string, string>) => (id: Id) =>
      `${map.get('key')}_${id}`.toUpperCase();
    const predicate = (value: unknown) =>
      typeof value === 'object' && !(value instanceof Map);
    const mappers = bindMappers(tree as any, callback, predicate) as any;

    expect(mappers.key1('id1')).toBe('VALUE1_ID1');
    expect(mappers.key2('id2')).toBe('VALUE2_ID2');
    expect(mappers.key3.key4('id3')).toBe('VALUE4_ID3');
  });
});
