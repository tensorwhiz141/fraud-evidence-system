# 🤝 Contributing to Fraud Evidence System

Thank you for your interest in contributing to the Fraud Evidence System! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contributing Guidelines](#contributing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)

## 📜 Code of Conduct

This project adheres to a code of conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to [conduct@fraudevidence.com](mailto:conduct@fraudevidence.com).

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+
- **MongoDB** 7.0+
- **Docker** & **Docker Compose**
- **Git**

### Fork and Clone

1. **Fork the repository** on GitHub
2. **Clone your fork**:
   ```bash
   git clone https://github.com/yourusername/fraud-evidence-system.git
   cd fraud-evidence-system
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/originalowner/fraud-evidence-system.git
   ```

## 🛠️ Development Setup

### 1. Environment Configuration

```bash
# Copy environment template
cp Backend/.env.example Backend/.env

# Edit with your configuration
nano Backend/.env
```

### 2. Install Dependencies

```bash
# Backend dependencies
cd Backend
npm install

# Frontend dependencies
cd ../Frontend
npm install
```

### 3. Start Development Environment

```bash
# Using Docker (recommended)
docker-compose -f docker-compose.production.yml up -d

# Or manual setup
# Backend
cd Backend && npm run dev

# Frontend (new terminal)
cd Frontend && npm start
```

### 4. Run Tests

```bash
# All tests
npm test

# Specific test suites
npm run test:unit
npm run test:integration
npm run test:rbac
npm run test:coverage
```

## 📝 Contributing Guidelines

### Types of Contributions

We welcome several types of contributions:

- 🐛 **Bug fixes**
- ✨ **New features**
- 📚 **Documentation improvements**
- 🧪 **Test coverage**
- 🔒 **Security enhancements**
- 🚀 **Performance optimizations**

### Before You Start

1. **Check existing issues** to avoid duplicates
2. **Create an issue** for significant changes
3. **Discuss major changes** in GitHub Discussions
4. **Read the documentation** thoroughly

## 🔄 Pull Request Process

### 1. Create a Branch

```bash
# Create and switch to feature branch
git checkout -b feature/amazing-feature

# Or for bug fixes
git checkout -b fix/bug-description
```

### 2. Make Changes

- Write clean, readable code
- Follow the coding standards
- Add tests for new functionality
- Update documentation as needed

### 3. Test Your Changes

```bash
# Run all tests
npm test

# Run specific tests
npm run test:unit
npm run test:integration

# Check code quality
npm run lint
```

### 4. Commit Changes

```bash
# Stage changes
git add .

# Commit with conventional commit message
git commit -m "feat: add amazing feature

- Add new RBAC permission for evidence export
- Update API documentation
- Add unit tests for new functionality

Closes #123"
```

### 5. Push and Create PR

```bash
# Push to your fork
git push origin feature/amazing-feature

# Create Pull Request on GitHub
```

### Pull Request Template

```markdown
## 📋 Description

Brief description of changes and motivation.

## 🔗 Related Issues

Closes #123
Fixes #456

## 🧪 Testing

- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed
- [ ] Documentation updated

## 📸 Screenshots (if applicable)

Add screenshots for UI changes.

## ✅ Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

## 🐛 Issue Guidelines

### Bug Reports

Use the bug report template:

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g. Windows 10]
- Browser: [e.g. Chrome 91]
- Version: [e.g. 1.0.0]

**Additional context**
Any other context about the problem.
```

### Feature Requests

Use the feature request template:

```markdown
**Is your feature request related to a problem?**
A clear description of what the problem is.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Alternative solutions or features you've considered.

**Additional context**
Any other context or screenshots about the feature request.
```

## 📏 Coding Standards

### JavaScript/Node.js

```javascript
// Use const/let, avoid var
const user = await User.findById(id);
let isActive = true;

// Use async/await over callbacks
async function getUserData(id) {
  try {
    const user = await User.findById(id);
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}

// Use meaningful variable names
const evidenceUploadPermission = 'evidence.upload';
const maxFileSize = 50 * 1024 * 1024; // 50MB

// Use JSDoc for functions
/**
 * Upload evidence file with RBAC validation
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
async function uploadEvidence(req, res) {
  // Implementation
}
```

### React/JSX

```jsx
// Use functional components with hooks
import React, { useState, useEffect } from 'react';

const EvidenceList = ({ evidence, onSelect }) => {
  const [filteredEvidence, setFilteredEvidence] = useState(evidence);

  useEffect(() => {
    // Filter logic
  }, [evidence]);

  return (
    <div className="evidence-list">
      {filteredEvidence.map(item => (
        <EvidenceItem 
          key={item.id} 
          evidence={item} 
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};

export default EvidenceList;
```

### File Naming

- **Components**: `PascalCase.jsx` (e.g., `EvidenceList.jsx`)
- **Utilities**: `camelCase.js` (e.g., `validateWallet.js`)
- **Constants**: `UPPER_SNAKE_CASE.js` (e.g., `API_ENDPOINTS.js`)
- **Tests**: `*.test.js` or `*.spec.js`

## 🧪 Testing

### Test Structure

```javascript
// tests/evidence.test.js
describe('Evidence API', () => {
  describe('GET /api/evidence', () => {
    it('should return evidence list for authenticated user', async () => {
      // Test implementation
    });

    it('should deny access without authentication', async () => {
      // Test implementation
    });
  });
});
```

### Test Coverage

- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test API endpoints and database interactions
- **E2E Tests**: Test complete user workflows
- **Security Tests**: Test RBAC and authentication

### Running Tests

```bash
# All tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# Specific test file
npm test -- tests/evidence.test.js
```

## 📚 Documentation

### Code Documentation

- **JSDoc** for functions and classes
- **README** files for major components
- **Inline comments** for complex logic
- **API documentation** with OpenAPI/Swagger

### Documentation Standards

```javascript
/**
 * Evidence service for managing fraud evidence
 * @class EvidenceService
 */
class EvidenceService {
  /**
   * Upload evidence file with validation
   * @param {Object} file - Uploaded file object
   * @param {string} caseId - Associated case ID
   * @param {string} userId - User ID of uploader
   * @returns {Promise<Object>} Upload result
   * @throws {ValidationError} When file validation fails
   * @throws {PermissionError} When user lacks upload permission
   */
  async uploadEvidence(file, caseId, userId) {
    // Implementation
  }
}
```

## 🔒 Security Guidelines

### Security Best Practices

- **Never commit secrets** (API keys, passwords, tokens)
- **Use environment variables** for configuration
- **Validate all inputs** on both client and server
- **Implement proper RBAC** for all endpoints
- **Log security events** for audit trails

### Security Testing

```bash
# Run security audit
npm audit

# Fix vulnerabilities
npm audit fix

# Run security tests
npm run test:security
```

## 🚀 Release Process

### Version Numbering

We use [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist

- [ ] All tests pass
- [ ] Documentation updated
- [ ] Security audit completed
- [ ] Performance testing done
- [ ] Breaking changes documented
- [ ] Release notes prepared

## 📞 Getting Help

### Communication Channels

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: Questions and community discussions
- **Email**: [contributors@fraudevidence.com](mailto:contributors@fraudevidence.com)

### Resources

- **[Production Ready Guide](Backend/PRODUCTION_READY_GUIDE.md)**
- **[API Documentation](Backend/API_ENDPOINTS_CONTRACT.md)**
- **[System Architecture](Documentation/COMPLETE_SYSTEM_GUIDE.md)**

## 🙏 Recognition

Contributors will be recognized in:

- **README.md** contributors section
- **Release notes** for significant contributions
- **GitHub contributors** page
- **Project documentation**

---

**Thank you for contributing to the Fraud Evidence System! Together, we're building a more secure digital world. 🚀**
