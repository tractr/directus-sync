const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const commands = ['pull', 'push', 'diff', 'seed push', 'seed diff'];
const outputDir = path.join(__dirname, '../docs/features/help-outputs');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

commands.forEach((cmd) => {
  try {
    // Execute the help command
    const output = execSync(`npx directus-sync ${cmd} --help`, {
      encoding: 'utf8',
    });

    // Extract content after "Options:"
    const optionsIndex = output.indexOf('Options:');
    if (optionsIndex === -1) {
      console.error(`Could not find "Options:" in output for command "${cmd}"`);
      return;
    }

    const helpContent = output.slice(optionsIndex);
    const wrappedHelpContent = `\`\`\`text\n${helpContent.trim()}\n\`\`\``;

    // Create filename (replace space with hyphen for seed commands)
    const filename = `${cmd.replace(' ', '-')}.md`;
    const filePath = path.join(outputDir, filename);

    // Write to file
    fs.writeFileSync(filePath, wrappedHelpContent);
    console.log(`✓ Generated help output for "${cmd}" command`);
  } catch (error) {
    console.error(
      `✗ Error generating help output for "${cmd}" command:`,
      error.message,
    );
  }
});
