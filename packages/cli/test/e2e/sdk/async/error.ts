export type DirectusHttpError = {
  errors: [
    {
      message: string;
      extensions: {
        code: string;
      };
    },
  ];
  response: {};
};

export async function expectDirectusError(
  promise: Promise<unknown>,
  message: string,
): Promise<void> {
  let response;
  try {
    response = await promise;
  } catch (error) {
    if (isHttpError(error)) {
      expect(error.errors[0].message).toEqual(message);
      return;
    } else {
      throw new Error(
        `Should have failed with an error. Received : ${JSON.stringify(error)}`,
      );
    }
  }
  throw new Error('Should have failed. Received : ' + JSON.stringify(response));
}

export function isHttpError(error: unknown): error is DirectusHttpError {
  return !!(
    (error as DirectusHttpError).errors !== undefined &&
    (error as DirectusHttpError).errors.length > 0 &&
    (error as DirectusHttpError).errors[0].message
  );
}
