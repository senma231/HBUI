#!/bin/bash

# Homebrew UI Release Script
# This script helps create and publish new releases

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if version is provided
if [ $# -eq 0 ]; then
    log_error "Please provide a version number (e.g., ./release.sh 1.0.0)"
    exit 1
fi

VERSION=$1
TAG="v$VERSION"

# Validate version format (semantic versioning)
if ! [[ $VERSION =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    log_error "Invalid version format. Please use semantic versioning (e.g., 1.0.0)"
    exit 1
fi

log_info "Preparing release for version $VERSION"

# Check if we're on main branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    log_warning "You are not on the main branch (current: $CURRENT_BRANCH)"
    read -p "Do you want to continue? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_info "Release cancelled"
        exit 0
    fi
fi

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
    log_error "You have uncommitted changes. Please commit or stash them first."
    exit 1
fi

# Update version in package.json
log_info "Updating version in package.json..."
if command -v jq &> /dev/null; then
    # Use jq if available
    jq ".version = \"$VERSION\"" package.json > package.json.tmp && mv package.json.tmp package.json
else
    # Fallback to sed
    sed -i.bak "s/\"version\": \".*\"/\"version\": \"$VERSION\"/" package.json && rm package.json.bak
fi

# Run tests
log_info "Running tests..."
npm test || {
    log_error "Tests failed. Please fix them before releasing."
    exit 1
}

# Build the application
log_info "Building application..."
npm run build || {
    log_error "Build failed. Please fix build errors before releasing."
    exit 1
}

# Commit version update
log_info "Committing version update..."
git add package.json
git commit -m "chore: bump version to $VERSION"

# Create and push tag
log_info "Creating and pushing tag $TAG..."
git tag -a "$TAG" -m "Release $VERSION"

# Push changes and tag
git push origin main
git push origin "$TAG"

log_success "Release $VERSION has been created and pushed!"
log_info "GitHub Actions will now build and publish the release automatically."
