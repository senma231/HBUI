#!/bin/bash

# Homebrew UI Remote Agent Setup Script
# This script prepares the remote environment for Homebrew UI development

set -e  # Exit on any error

echo "🚀 Setting up Homebrew UI development environment..."

# 1. System Information
echo "📋 System Information:"
echo "OS: $(uname -s)"
echo "Architecture: $(uname -m)"
echo "User: $(whoami)"
echo "Working Directory: $(pwd)"

# 2. Check and Install Homebrew
echo "🍺 Checking Homebrew installation..."
if ! command -v brew &> /dev/null; then
    echo "Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    
    # Add Homebrew to PATH for different architectures
    if [[ $(uname -m) == "arm64" ]]; then
        echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zshrc
        eval "$(/opt/homebrew/bin/brew shellenv)"
    else
        echo 'eval "$(/usr/local/bin/brew shellenv)"' >> ~/.zshrc
        eval "$(/usr/local/bin/brew shellenv)"
    fi
else
    echo "✅ Homebrew already installed: $(brew --version | head -1)"
fi

# 3. Update Homebrew
echo "🔄 Updating Homebrew..."
brew update

# 4. Check and Install Node.js
echo "📦 Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "Installing Node.js via Homebrew..."
    brew install node
else
    echo "✅ Node.js already installed: $(node --version)"
fi

# 5. Install project dependencies
echo "📚 Installing project dependencies..."
if [ -f "package.json" ]; then
    npm install
    echo "✅ Dependencies installed successfully"
else
    echo "⚠️ No package.json found, skipping dependency installation"
fi

# 6. Install global development tools
echo "🛠️ Installing global development tools..."
npm install -g electron@latest typescript eslint

# 7. Test Homebrew functionality
echo "🧪 Testing Homebrew functionality..."
echo "Homebrew version: $(brew --version | head -1)"
echo "Installed packages count: $(brew list | wc -l)"

# 8. Run system health check
echo "🏥 Running system health check..."
brew doctor || echo "⚠️ Homebrew doctor found some issues, but continuing..."

echo "✅ Remote Agent environment is ready for Homebrew UI development!"
