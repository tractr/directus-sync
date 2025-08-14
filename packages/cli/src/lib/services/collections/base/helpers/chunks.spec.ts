import { chunks } from './chunks';

describe('chunks', () => {
  it('should split an array into fixed-size chunks', () => {
    const result = Array.from(chunks([1, 2, 3, 4, 5], 2));
    expect(result).toEqual([[1, 2], [3, 4], [5]]);
  });

  it('should return an empty array of chunks for empty input', () => {
    const result = Array.from(chunks([], 3));
    expect(result).toEqual([]);
  });

  it('should handle chunk size larger than the array length', () => {
    const result = Array.from(chunks([1, 2], 10));
    expect(result).toEqual([[1, 2]]);
  });

  it('should throw on non-positive chunk size', () => {
    expect(() => Array.from(chunks([1], 0))).toThrow(
      'chunkSize must be a positive number',
    );
    expect(() => Array.from(chunks([1], -1))).toThrow(
      'chunkSize must be a positive number',
    );
  });
});
