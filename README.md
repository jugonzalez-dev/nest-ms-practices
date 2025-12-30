# NestJS Microservice with Hexagonal Architecture

Microservice developed with NestJS following Hexagonal Architecture (Ports and Adapters) principles.

<img width="1511" height="785" alt="image" src="https://github.com/user-attachments/assets/76571c9c-dbf3-42bc-ab5a-3320db76a9c4" />
<img width="1512" height="804" alt="Screenshot 2025-12-30 at 5 13 09 PM" src="https://github.com/user-attachments/assets/ca54c379-e2ed-4bd0-bc25-50895813faa0" />
<img width="1511" height="341" alt="Screenshot 2025-12-30 at 5 13 23 PM" src="https://github.com/user-attachments/assets/5c0c5c0a-c344-417d-ad58-21a7b824a840" />


## 🏗️ Architecture

This project implements a hexagonal architecture that separates code into three main layers:

### Core (Domain)
- **`domain/entities`**: Domain entities with business logic
- **`ports/`**: Interfaces (ports) that define contracts
  - `repositories/`: Repository interfaces
  - `services/`: External service interfaces (e.g., SSO)

### Application
- **`use-cases/`**: Use cases that orchestrate business logic

### Infrastructure
- **`persistence/`**: Repository adapters (concrete implementations)
- **`auth/`**: Authentication adapters (SSO, JWT, etc.)

## 📦 Modules

### 1. Auth Module (100% implemented)
Authentication module with SSO support:
- **Port**: `AuthProviderPort` - Interface for SSO providers
- **Adapter**: `SsoProviderAdapter` - OAuth2/OpenID Connect implementation
- **Guards**: `JwtAuthGuard` - Route protection
- **Decorators**: `@Public()`, `@CurrentUser()`

**Endpoints:**
- `GET /auth/login` - Initiates OAuth2 flow
- `GET /auth/callback` - OAuth2 callback
- `GET /auth/me` - Gets authenticated user
- `POST /auth/validate` - Validates token

### 2. Users Module (100% implemented)
Complete user management module with hexagonal architecture:
- **Entity**: `User` - Domain entity
- **Port**: `UserRepositoryPort` - Repository interface
- **Adapter**: `UserRepositoryAdapter` - Implementation (in-memory)
- **Use Cases**: CreateUser, GetUser, ListUsers

**Endpoints:**
- `POST /users` - Create user
- `GET /users` - List users (with filter `?activeOnly=true`)
- `GET /users/:id` - Get user by ID

### 3. Products Module (50% implemented)
Products module with base structure:
- **Entity**: `Product` - Domain entity (base structure)
- **Port**: `ProductRepositoryPort` - Repository interface
- **Adapter**: `ProductRepositoryAdapter` - Base implementation
- **Use Cases**: CreateProduct, GetProduct (partial)

**Endpoints:**
- `POST /products` - Create product ✅
- `GET /products/:id` - Get product by ID ✅
- `GET /products` - List products (pending)

**TODOs:**
- Implement domain methods in `Product`
- Add business validations in use cases
- Implement `ListProductsUseCase`
- Add PUT and DELETE endpoints
- Implement repository-specific methods

## 🚀 Installation

```bash
# Install dependencies
npm install

# Copy configuration file
cp .env.example .env

# Edit .env with your SSO credentials
```

## 🏃 Running

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## 🔐 SSO Configuration

Edit the `.env` file with your SSO credentials:

```env
# Server Configuration
PORT=3000
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
# Auth0 SSO Configuration
SSO_DOMAIN=your-domain.auth0.com
SSO_CLIENT_ID=your-auth0-client-id
SSO_CLIENT_SECRET=your-auth0-client-secret
SSO_AUDIENCE=your-api-identifier
SSO_REDIRECT_URI=http://localhost:3000/auth/callback
```

## 📝 Authentication Usage

### Protect routes
```typescript
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@infrastructure/auth/jwt-auth.guard';

@Controller('example')
@UseGuards(JwtAuthGuard)
export class ExampleController {
  // Protected routes
}
```

### Mark public routes
```typescript
import { Public } from '@infrastructure/auth/decorators/public.decorator';

@Public()
@Get('public')
publicEndpoint() {
  // Public route
}
```

### Get current user
```typescript
import { CurrentUser } from '@infrastructure/auth/decorators/current-user.decorator';
import { UserInfo } from '@core/ports/services/auth-provider.port';

@Get('profile')
getProfile(@CurrentUser() user: UserInfo) {
  return user;
}
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📚 Project Structure

```
src/
├── core/                    # Domain (hexagonal core)
│   ├── domain/
│   │   └── entities/        # Domain entities
│   └── ports/               # Interfaces (ports)
│       ├── repositories/    # Repository interfaces
│       └── services/        # External service interfaces
│
├── application/             # Use cases
│   └── use-cases/
│       ├── users/
│       └── products/
│
├── infrastructure/          # Adapters
│   ├── persistence/         # Repository implementations
│   └── auth/                # SSO adapter
│
└── modules/                  # NestJS modules
    ├── auth/
    ├── users/
    └── products/
```

## 🎯 Hexagonal Architecture Principles

1. **Separation of concerns**: Domain does not depend on infrastructure
2. **Dependency inversion**: External layers depend on interfaces (ports)
3. **Testability**: Easy to test thanks to dependency injection
4. **Flexibility**: Change implementations (DB, SSO) without affecting the domain

## 📄 License

MIT
