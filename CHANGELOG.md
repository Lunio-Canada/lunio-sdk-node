# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] - 2026-05-08

### Added
- TypeScript declaration support (.d.ts files)
- Exported types for LunioConfig, response objects, and error shapes
- Typed config object with autocomplete
- Typed tax methods with parameter validation
- JSDoc comments for better IntelliSense and hover documentation
- Improved IDE autocomplete and editor integration

### Changed
- Enhanced README with TypeScript usage examples
- Updated examples for TypeScript and debug mode

## [0.2.0] - 2026-05-08

### Added
- Retry support with configurable maxRetries (default 2)
- Request ID support in API errors
- Improved timeout error messages
- Debug mode for logging requests
- Stronger input validation for finite numbers

### Changed
- Enhanced API error objects with requestId
- Improved README with configuration options

## [0.1.0] - 2026-05-08

### Added
- Initial release of the Lunio Node.js SDK
- Support for tax rates, calculate, and reverse calculate endpoints
- Bearer token authentication
- Custom error handling
- ESM module support