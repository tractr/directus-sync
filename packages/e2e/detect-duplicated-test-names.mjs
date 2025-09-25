#!/usr/bin/env node
import { readdir, readFile } from 'fs/promises';
import path from 'path';

async function* walkDirectory(directoryPath) {
  const dirents = await readdir(directoryPath, { withFileTypes: true });
  for (const dirent of dirents) {
    const fullPath = path.join(directoryPath, dirent.name);
    if (dirent.isDirectory()) {
      yield* walkDirectory(fullPath);
    } else if (dirent.isFile() && dirent.name.endsWith('.ts')) {
      yield fullPath;
    }
  }
}

function computeLineNumber(text, index) {
  // Count newlines before the index; lines are 1-based
  let line = 1;
  for (let i = 0; i < index; i += 1) {
    if (text.charCodeAt(i) === 10) line += 1; // '\n'
  }
  return line;
}

async function findDuplicatedTestNames(specRootDir) {
  const nameToLocations = new Map();

  // Matches: it('name', ...), it("name", ...), it.only('name', ...), it.skip("name", ...)
  // Capture group 2 is the test name.
  const itCallRegex = /\bit(?:\.\w+)?\s*\(\s*(["'`])([^"'`\\]*(?:\\.[^"'`\\]*)*)\1\s*,/g;

  for await (const filePath of walkDirectory(specRootDir)) {
    const content = await readFile(filePath, 'utf8');

    let match;
    while ((match = itCallRegex.exec(content)) !== null) {
      const testNameRaw = match[2];
      const testName = testNameRaw.trim();
      const line = computeLineNumber(content, match.index);

      const locations = nameToLocations.get(testName) || [];
      locations.push({ file: filePath, line });
      nameToLocations.set(testName, locations);
    }
  }

  const duplicates = Array.from(nameToLocations.entries()).filter(
    ([, locations]) => locations.length > 1,
  );

  return { duplicates, total: nameToLocations.size };
}

async function main() {
  // Default to ./spec relative to current working directory (packages/e2e)
  const defaultSpecDir = path.resolve('spec');
  const specRootDir = process.argv[2]
    ? path.resolve(process.argv[2])
    : defaultSpecDir;

  try {
    const { duplicates, total } = await findDuplicatedTestNames(specRootDir);

    if (duplicates.length === 0) {
      console.log(`No duplicated test names found in ${specRootDir} (scanned ${total} names).`);
      process.exit(0);
    }

    console.warn(`Found ${duplicates.length} duplicated test name(s) in ${specRootDir}:`);
    for (const [name, locations] of duplicates) {
      console.warn(`\n- "${name}" appears ${locations.length} times:`);
      for (const { file, line } of locations) {
        console.warn(`  ${file}:${line}`);
      }
    }

    // Exit with non-zero to make it usable in CI checks
    process.exit(1);
  } catch (error) {
    console.error('Error while detecting duplicated test names:', error);
    process.exit(2);
  }
}

await main();


