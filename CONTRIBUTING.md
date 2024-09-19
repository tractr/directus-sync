# Contributing to Directus Sync

First off, thanks for taking the time to contribute! 🚀  
We appreciate your interest in improving **Directus Sync**, and we welcome contributions of all kinds.

## Table of Contents

- [How Can I Contribute?](#how-can-i-contribute)
    - [Reporting Bugs](#reporting-bugs)
    - [Feature Requests](#feature-requests)
    - [Code Contributions](#code-contributions)
- [Development Workflow](#development-workflow)
    - [Setting Up the Environment](#setting-up-the-environment)
    - [Submitting Changes](#submitting-changes)
- [Coding Guidelines](#coding-guidelines)
- [Style Guide](#style-guide)
- [Code of Conduct](#code-of-conduct)

---

## How Can I Contribute?

### Reporting Bugs

If you find a bug in **Directus Sync**, please create an issue on
the [issue tracker](https://github.com/tractr/directus-sync/issues). Ensure that your bug report contains the following
details:

- A clear and descriptive title.
- Steps to reproduce the issue.
- The expected and actual behavior.
- Any relevant logs or screenshots.

### Feature Requests

We're open to new ideas! If you have a feature request, please open an issue on GitHub using the `[Feature Request]`
tag. Provide a detailed explanation of the feature and its potential impact.

### Code Contributions

We welcome pull requests (PRs) for bug fixes, features, and documentation improvements.  
Before submitting a PR, please make sure it adheres to the guidelines mentioned below.

## Development Workflow

### Setting Up the Environment

1. **Clone the repository**:
   ```bash
   git clone https://github.com/tractr/directus-sync.git
   cd directus-sync
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Add a new feature or fix a bug**:
   Create a new branch for your changes.
   Make your changes and commit them.

4. **Build project**:
   Make sure that the project is building correctly.
   ```bash
   npm run build
   ```

5. **Run tests**:  
   Make sure to run tests before submitting a PR to ensure that your code doesn't break existing functionality.
   ```bash
   npm test
   ```

### Submitting Changes

- Fork the repository and create a new branch for your feature or fix.
- Write clear and descriptive commit messages.
- Make sure your code is properly tested.
- Open a pull request on the `main` branch with a description of your changes.
- Ensure your PR passes CI checks.

## Coding Guidelines

- **TypeScript**: Ensure your code is strongly typed.
- **Error Handling**: Handle errors gracefully and avoid crashing the CLI.
- **Logging**: Use consistent logging practices, providing useful output for debugging purposes.

## Style Guide

- Use [Prettier](https://prettier.io/) to format your code.
  ```bash
   npm run format
   ```
- Use [ESLint](https://eslint.org/) to lint your code.
  ```bash
   npm run lint
  ```
- Follow consistent naming conventions.
- Write meaningful comments, especially for complex logic.

## Code of Conduct

This project follows a [Code of Conduct](https://github.com/tractr/directus-sync/blob/main/CODE_OF_CONDUCT.md) to create
a welcoming environment for everyone. Please read it before contributing.

---

Thank you for contributing to **Directus Sync**! ✨
