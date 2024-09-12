# End-to-End Tests

Run black-box tests on a running instance of Directus.

## Pre-requisites

The tests are running Directus instance in the host machine.
Therefore, you need to have a the dependencies installed in the host machine.

You must install the following libraries:

- `libvips`: `sudo apt install libvips` (https://libvips.github.io/libvips/install.html)

## Running the tests

First, you need to build the CLI and the extension. Go to the root of the repository and run:

```bash
npm run build
```

Then, you can run the tests:

```bash
npm run test
```

### Running a single test

By design, the tests are ran sequentially. This is done to avoid conflicts between Directus servers.

To run a single test, you need to edit the test file and change the `it` function to `fit`.
