# HBUI - Modern Homebrew GUI Client

<div align="center">

![HBUI Logo](https://img.shields.io/badge/HBUI-Homebrew%20GUI-blue?style=for-the-badge)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Electron](https://img.shields.io/badge/Electron-191970?style=for-the-badge&logo=Electron&logoColor=white)](https://www.electronjs.org/)

**A modern, cross-platform GUI for Homebrew package manager built with Electron, React, and TypeScript.**

*Inspired by Cork, designed for everyone.*

</div>

## ✨ Features

### 🔍 **Advanced Package Management**
- **Smart Search**: Search with type filtering (Formulae/Casks) and search history
- **Package Details**: Comprehensive package information with dependency graphs
- **Batch Operations**: Multi-select packages for bulk install/uninstall/tagging
- **Real-time Status**: Live package status updates and installation progress

### 🏷️ **Package Organization**
- **Custom Tags**: Create and manage custom package tags with colors
- **Smart Categorization**: Organize packages with personalized tagging system
- **Tag-based Filtering**: Quickly find packages by tags
- **Bulk Tagging**: Apply tags to multiple packages simultaneously

### ⚙️ **System Management**
- **Service Control**: Start, stop, and restart Homebrew services
- **Cache Management**: Visualize and clean download/build caches
- **System Maintenance**: Integrated brew update, upgrade, and doctor
- **Health Monitoring**: Real-time system status and diagnostics

### 🌍 **Cross-Platform Excellence**
- **Universal Compatibility**: macOS, Windows, Linux support
- **Web Demo**: Browser-based demonstration version
- **Responsive Design**: Optimized for desktop and mobile interfaces
- **Native Performance**: Electron-powered native app experience

### 🎨 **Modern User Experience**
- **Intuitive Interface**: Clean, modern design with smooth animations
- **Multi-language Support**: English, Simplified Chinese, Traditional Chinese
- **Dark/Light Themes**: Adaptive interface themes (coming soon)
- **Accessibility**: Screen reader and keyboard navigation support

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Homebrew (for package management functionality)

### Installation & Development

```bash
# Clone the repository
git clone https://github.com/senma231/HBUI.git
cd HBUI

# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Package the application
npm run package
```

### Web Demo
Experience HBUI in your browser: [Demo Link](https://your-demo-link.com) *(Coming Soon)*

## 📊 Comparison with Cork

| Feature | Cork (SwiftUI) | HBUI (Electron+React) | Advantage |
|---------|----------------|------------------------|-----------|
| **Platform Support** | macOS only | macOS, Windows, Linux | ✅ True cross-platform |
| **Package Tagging** | ✅ Original feature | ✅ Enhanced implementation | ✅ Better UX |
| **Batch Operations** | ❌ Not supported | ✅ Full support | ✅ Unique feature |
| **Service Management** | ✅ Basic | ✅ Visual interface | ✅ Better visualization |
| **Cache Management** | ✅ Basic | ✅ Categorized management | ✅ More intuitive |
| **Web Demo** | ❌ Not possible | ✅ Available | ✅ Unique capability |
| **Multi-language** | ✅ Basic | ✅ Comprehensive | ✅ More complete |

## 🛠️ Tech Stack

<div align="center">

| Frontend | Desktop | Build Tools | Styling | i18n |
|----------|---------|-------------|---------|------|
| React 18 | Electron | Webpack | CSS Modules | react-i18next |
| TypeScript | Node.js | Electron Forge | Responsive Design | 3 Languages |

</div>

### Architecture Highlights
- **Component-based**: 18+ modular React components
- **Type-safe**: 100% TypeScript coverage
- **State Management**: React Hooks + Context API
- **IPC Communication**: Secure main-renderer process communication
- **Data Persistence**: Local JSON storage for user preferences

## 🎯 Roadmap

### ✅ Completed (Phase 1 & 2)
- [x] Core package management functionality
- [x] Advanced search with filtering
- [x] Package details and dependency visualization
- [x] Custom tagging system
- [x] Batch operations
- [x] Service management
- [x] Cache management
- [x] Multi-language support
- [x] Responsive design

### 🔄 In Progress (Phase 3)
- [ ] Performance optimizations
- [ ] Auto-update mechanism
- [ ] Enhanced error handling
- [ ] User documentation

### 🔮 Future Plans
- [ ] Plugin system
- [ ] Cloud synchronization
- [ ] AI-powered package recommendations
- [ ] Multi-package manager support (apt, yum, etc.)
- [ ] Enterprise features

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Maintain component modularity
- Add appropriate tests
- Update documentation
- Ensure multi-language support

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Cork Project**: Inspiration for the excellent package tagging concept
- **Homebrew Team**: For the amazing package manager
- **React Community**: For the robust ecosystem
- **Electron Team**: For enabling cross-platform desktop apps
- **Contributors**: Everyone who helps improve HBUI

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/senma231/HBUI/issues)
- **Discussions**: [GitHub Discussions](https://github.com/senma231/HBUI/discussions)
- **Documentation**: [Project Wiki](https://github.com/senma231/HBUI/wiki)

---

<div align="center">

**Made with ❤️ for the Homebrew community**

[⭐ Star this project](https://github.com/senma231/HBUI) if you find it useful!

</div>
