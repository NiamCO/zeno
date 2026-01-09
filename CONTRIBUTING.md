# Contributing to Zeno

Thank you for your interest in contributing to Zeno! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone.

## How Can I Contribute?

### Reporting Bugs
Before creating a bug report, please check if the issue has already been reported.

**How to submit a good bug report:**
1. Use a clear and descriptive title
2. Describe the exact steps to reproduce the problem
3. Provide specific examples (code snippets, screenshots)
4. Describe the expected behavior
5. Include your environment details:
   - Browser and version
   - Operating system
   - Zeno version (if applicable)

### Suggesting Enhancements
We welcome suggestions for new features or improvements.

**How to submit an enhancement suggestion:**
1. Use a clear and descriptive title
2. Provide a detailed description of the proposed feature
3. Explain why this enhancement would be useful
4. Include mockups or examples if applicable

### Pull Requests
1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## Development Setup

### Prerequisites
- GitHub account
- GitHub Codespaces access (recommended) OR
- Modern web browser

### Using GitHub Codespaces (Recommended)
1. Navigate to the Zeno repository
2. Click the "Code" button
3. Select "Codespaces" tab
4. Click "Create codespace on main"
5. Wait for the environment to initialize
6. Open `apps/home/index.html` in Live Server to preview

### Local Development (Alternative)
1. Clone the repository
2. Open the project folder in any code editor
3. Use a local server (like Live Server extension) to preview
4. No build process required - it's vanilla HTML/CSS/JS

## Project Structure
zeno/
├── apps/ # Individual applications
├── packages/ # Shared code and design system
├── public/ # Static assets
└── docs/ # Documentation


## Design Guidelines

### Colors
Use the design system variables from `packages/design-system/theme.css`:

```css
/* Good */
color: var(--zeno-text-primary);
background-color: var(--zeno-surface);

/* Bad */
color: #000000;
background-color: white;
