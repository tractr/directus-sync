import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const commands = [
  { command: '', filename: 'base.md' },
  { command: 'pull', filename: 'pull.md' },
  { command: 'push', filename: 'push.md' },
  { command: 'diff', filename: 'diff.md' },
  { command: 'seed push', filename: 'seed-push.md' },
  { command: 'seed diff', filename: 'seed-diff.md' },
  { command: 'helpers untrack', filename: 'helpers-untrack.md' },
  {
    command: 'helpers remove-permission-duplicates',
    filename: 'helpers-remove-permission-duplicates.md',
  },
  {
    command: 'helpers wait-server-ready',
    filename: 'helpers-wait-server-ready.md',
  },
];
const outputDir = path.join('docs/help-outputs');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

commands.forEach((cmd) => {
  try {
    const { command, filename } = cmd;

    // Execute the help command
    const output = execSync(`npx directus-sync ${command} --help`, {
      encoding: 'utf8',
    });

    // Extract content after "Options:"
    const optionsIndex = output.indexOf('Options:');
    if (optionsIndex === -1) {
      console.error(
        `Could not find "Options:" in output for command "${command}"`,
      );
      return;
    }

    const helpContent = output.slice(optionsIndex);
    const wrappedHelpContent = `\`\`\`text\n${helpContent.trim()}\n\`\`\``;

    // Create filename (replace space with hyphen for seed commands)
    const filePath = path.join(outputDir, filename);

    // Write to file
    fs.writeFileSync(filePath, wrappedHelpContent);
    console.log(`✓ Generated help output for "${command}" command`);
  } catch (error) {
    console.error(
      `✗ Error generating help output for "${command}" command:`,
      error.message,
    );
  }
});
