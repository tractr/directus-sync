import { applyMappers } from './apply-mapper';

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

    const mapperFactory = (index: number) => async (value: string) =>
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

  it('should throw an error if mapper does not match the value types', () => {
    const input = {
      key1: 'value1',
      key2: {
        key3: 'value3',
      },
    };

    const mapperFactory = (index: number) => async (value: string) =>
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

    const mapperFactory = (index: number) => async (value: string) =>
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
});
