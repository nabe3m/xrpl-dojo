# XRPL Dojo

<div align="center">
  <img src="./src/assets/images/logo-xrpl-dojo.webp" alt="XRPL Dojo Logo" width="200" height="200">
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-green.svg)](https://nodejs.org/)
  [![Built with Astro](https://img.shields.io/badge/built%20with-astro-ff5a5f.svg)](https://astro.build/)
</div>

## Overview

XRPL Dojo is a comprehensive learning platform for XRPL (XRP Ledger) development, offering structured tutorials and hands-on coding exercises. The platform provides step-by-step guidance for developers who want to build applications on the XRP Ledger, from basic concepts to advanced features like payment channels and DEX integration.

**🌐 Live Site**: [https://xrpldojo.dev](https://xrpldojo.dev)

## Features

### 📚 Structured Learning Path
- **Basics**: Getting started with XRPL development
- **Beginner (Level 1)**: Account management and basic transactions
- **Intermediate (Level 2)**: DEX operations and offers
- **Advanced (Level 3)**: Token issuance and cross-currency payments
- **Expert (Level 4)**: Payment channels and advanced features

### 🌍 Multi-language Support
- **Japanese**: Primary language with comprehensive content
- **English**: Full English translation available

### 💻 Interactive Code Examples
- JavaScript examples for all concepts
- Step-by-step tutorials with executable code
- Real-world use cases and best practices

### 🛠 Development Environment Setup
- Editor configuration guides
- Node.js setup instructions
- XRPL testnet integration

## Tech Stack

- **[Astro](https://astro.build/)** - Static site generator
- **[Starlight](https://starlight.astro.build/)** - Documentation framework
- **TypeScript** - Type-safe development
- **MDX** - Markdown with JSX components
- **Cookie Consent** - Privacy compliance

## Getting Started

### Prerequisites

- Node.js 20.0.0 or higher
- npm package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/xrpldojo.git
cd xrpldojo
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:4321`

### Available Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
npm run astro     # Run Astro CLI commands
```

## Project Structure

```
xrpldojo/
├── src/
│   ├── assets/           # Images and static assets
│   ├── components/       # Astro components
│   └── content/
│       └── docs/         # Documentation content
│           ├── basics/   # Basic tutorials
│           ├── beginners/# Level 1 content
│           ├── 2nd/      # Level 2 content
│           ├── 3rd/      # Level 3 content
│           ├── 4th/      # Level 4 content
│           └── en/       # English translations
├── public/               # Static files
└── astro.config.mjs     # Astro configuration
```

## Content Organization

### Learning Levels

1. **Basics** (`/basics/`)
   - XRPL connection setup
   - Wallet creation and management
   - Basic XRP transactions

2. **Level 1** (`/beginners/`)
   - Account information queries
   - Trust lines and tokens
   - Payment transactions

3. **Level 2** (`/2nd/`)
   - Decentralized Exchange (DEX)
   - Order creation and management
   - Market making

4. **Level 3** (`/3rd/`)
   - Token issuance
   - Cross-currency payments
   - Path finding

5. **Level 4** (`/4th/`)
   - Payment channels
   - Off-ledger transactions
   - Advanced channel operations

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Content Guidelines

- Follow the existing structure and formatting
- Provide both Japanese and English versions for new content (a draft or provisional Japanese version is acceptable)
- You are also welcome to propose new content ideas.
- Include working code examples
- Test all code snippets before submission
- Use clear, beginner-friendly explanations

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### ⚠️ Important Notice - Content Usage

While the code for this project is open source under the MIT License, **the educational content and tutorials are proprietary and protected by copyright**. 

Please note:
- ✅ **Allowed**: Fork this repository, modify the code, contribute improvements, and use it as a reference for your own projects
- ❌ **Not Allowed**: Copy, republish, or redistribute the educational content (tutorials, guides, documentation) without explicit permission
- ❌ **Not Allowed**: Create derivative works that substantially reproduce our content structure and materials

If you're interested in translating the content to other languages or creating similar educational materials, please contact us first to discuss collaboration opportunities.

**Educational content includes but is not limited to:**
- Tutorial text and explanations
- Step-by-step guides
- Code examples with explanatory comments
- Learning path structure and organization
- Educational images and diagrams

For questions about content usage or collaboration, please [open an issue](https://github.com/yourusername/xrpldojo/issues) or contact the maintainers.

## Acknowledgments

- [XRPL Foundation](https://xrpl.org/) for the amazing XRP Ledger technology
- [Astro](https://astro.build/) and [Starlight](https://starlight.astro.build/) teams for excellent documentation tools
- The XRPL developer community for inspiration and feedback

## Support

- [X - @nabe3_m](https://x.com/nabe3_m)
- [GitHub - @nabe3m](https://github.com/nabe3m)

---

<div align="center">
  Made with ❤️ for the XRPL developer community
</div>
