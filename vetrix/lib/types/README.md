# Type System Documentation

This directory contains the complete type system for the Vetrix application. The types are organized into four main categories for clarity, reusability, and maintainability.

## 📁 File Structure

```
lib/types/
├── api.types.ts      # API-specific types (requests, responses, errors)
├── common.types.ts   # Cross-cutting domain types
├── form.types.ts     # Form state and validation types
├── utility.types.ts  # Generic utility types for type manipulation
└── index.ts          # Central export point
```

## 🎯 Type Categories

### 1. API Types (`api.types.ts`)

Types for consistent API communication and error handling.

**Key Types:**
- `ApiResponse<T>` - Generic wrapper for success/error responses
- `PaginatedResponse<T>` - Offset-based pagination
- `CursorPaginatedResponse<T>` - Cursor-based pagination for large datasets
- `ApiError` - Structured error objects with codes and details
- `HttpStatusCode` - Enum of standard HTTP status codes
- `ApiErrorCode` - Application-level error codes
- `BatchRequest/Response` - Batch operations support
- `FileUploadResponse` - File upload metadata
- `WebSocketMessage` - Real-time communication

**Usage Example:**
```typescript
import { ApiResponse, PaginatedResponse, ApiErrorCode } from '@/lib/types'

// API function that returns paginated owners
async function getOwners(page: number): Promise<ApiResponse<PaginatedResponse<Owner>>> {
  try {
    const data = await fetch(`/api/owners?page=${page}`)
    return {
      success: true,
      data: await data.json()
    }
  } catch (error) {
    return {
      success: false,
      error: {
        code: ApiErrorCode.INTERNAL_ERROR,
        message: 'Failed to fetch owners'
      }
    }
  }
}
```

### 2. Common Types (`common.types.ts`)

Cross-cutting domain types used throughout the application.

**Key Types:**
- `Sex`, `Gender` - Gender/sex classifications
- `AppointmentStatus`, `PaymentStatus`, `InvoiceStatus` - Status enums
- `ContactInfo`, `PhoneNumber`, `Email` - Contact information
- `Address`, `Coordinates` - Location data
- `Money`, `Price`, `CurrencyCode` - Financial types
- `AuditMetadata`, `ChangeLog` - Audit tracking
- `FileMetadata`, `ImageMetadata` - File/media types
- `Species`, `SizeCategory` - Veterinary-specific

**Usage Example:**
```typescript
import { ContactInfo, Address, Money } from '@/lib/types'

interface Owner {
  id: number
  name: string
  contact: ContactInfo
  address: Address
  creditLimit: Money
}
```

### 3. Form Types (`form.types.ts`)

Types for form state management and validation.

**Key Types:**
- `FormField<T>` - Individual field state with validation
- `FormSchema<T>` - Complete form field mapping
- `FormState<T>` - Form state including submission status
- `ValidationRule<T>` - Validation rule configuration
- `ValidationResult` - Validation outcome
- `FormWizardConfig` - Multi-step form support
- `FormArray<T>` - Dynamic field arrays

**Usage Example:**
```typescript
import { FormState, FormField, ValidationRule } from '@/lib/types'

interface LoginForm {
  email: string
  password: string
}

const loginState: FormState<LoginForm> = {
  fields: {
    email: {
      value: '',
      error: null,
      touched: false,
      valid: false,
      dirty: false,
      rules: [
        { type: 'required', validator: requiredValidator },
        { type: 'email', validator: emailValidator }
      ]
    },
    password: {
      value: '',
      error: null,
      touched: false,
      valid: false,
      dirty: false,
      rules: [{ type: 'required', validator: requiredValidator }]
    }
  },
  isValid: false,
  isSubmitted: false,
  isSubmitting: false,
  isTouched: false,
  isDirty: false,
  errors: [],
  submitCount: 0
}
```

### 4. Utility Types (`utility.types.ts`)

Generic utility types for type manipulation and common patterns.

**Key Types:**
- `Nullable<T>`, `Optional<T>` - Basic transformations
- `DeepPartial<T>`, `RecursivePartial<T>` - Deep transformations
- `Timestamped<T>`, `Auditable<T>` - Add metadata
- `NewEntity<T>`, `EntityUpdate<T>` - Database operations
- `QueryParams`, `FilterCondition`, `SortConfig` - Query building
- `Result<T>`, `AsyncResult<T>` - Error handling patterns
- `Brand<T, B>` - Type-safe primitives
- Various key manipulation utilities

**Usage Example:**
```typescript
import { Timestamped, NewEntity, EntityUpdate, Result } from '@/lib/types'

// Database entity with timestamps
type OwnerEntity = Timestamped<Owner>

// For creating new owners (no id/timestamps)
type NewOwner = NewEntity<OwnerEntity>

// For updating owners (partial, no id/timestamps)
type UpdateOwner = EntityUpdate<OwnerEntity>

// Function with Result type for error handling
function createOwner(data: NewOwner): Result<Owner> {
  try {
    const owner = db.insert(data)
    return { success: true, data: owner }
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: error.message
      }
    }
  }
}
```

## 🎨 Design Principles

### 1. Type vs Interface
- **`type`**: Used for unions, intersections, and mapped types
- **`interface`**: Used for object shapes with extensibility needs

### 2. Readonly by Default
- Use `readonly` for immutable data structures
- Properties that shouldn't change are marked readonly

### 3. Composition Over Duplication
- Reuse types across files
- Build complex types from simple building blocks

### 4. Generic Types
- Leverage generics for reusability
- Examples: `ApiResponse<T>`, `FormField<T>`, `PaginatedResponse<T>`

### 5. Documentation
- All exported types include JSDoc comments
- Complex types include usage examples

## 🔧 Usage Patterns

### Importing Types

```typescript
// Import specific types
import { ApiResponse, Owner, FormState } from '@/lib/types'

// Import from specific file
import { HttpStatusCode, ApiErrorCode } from '@/lib/types/api.types'

// Import all from a category
import * as FormTypes from '@/lib/types/form.types'
```

### Common Patterns

#### 1. API Response Handler
```typescript
import { ApiResponse, ApiErrorCode } from '@/lib/types'

function handleApiResponse<T>(response: ApiResponse<T>): T {
  if (response.success) {
    return response.data
  }
  throw new Error(response.error.message)
}
```

#### 2. Form Validation
```typescript
import { ValidationResult, FormField } from '@/lib/types'

function validateEmail(field: FormField<string>): ValidationResult {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const isValid = emailRegex.test(field.value)
  
  return {
    isValid,
    errors: isValid ? {} : { email: ['Invalid email format'] }
  }
}
```

#### 3. Paginated Queries
```typescript
import { PaginatedResponse, QueryParams } from '@/lib/types'

async function fetchPets(params: QueryParams<'name' | 'species'>): Promise<PaginatedResponse<Pet>> {
  // Implementation
}
```

#### 4. Branded IDs for Type Safety
```typescript
import { OwnerId, PetId } from '@/lib/types'

function getOwnerPets(ownerId: OwnerId): Pet[] {
  // TypeScript will prevent passing PetId here
  return db.pets.where({ ownerId })
}
```

## 🚀 Best Practices

1. **Always use types from this directory** instead of creating ad-hoc types
2. **Extend existing types** when adding new features
3. **Update documentation** when adding new types
4. **Use union types** instead of enums for string constants
5. **Make properties readonly** unless they need to be mutable
6. **Use generics** for reusable patterns
7. **Avoid `any`** - use `unknown` when type is truly unknown
8. **Use branded types** for type-safe primitive values (IDs, etc.)
9. **Leverage utility types** to reduce duplication
10. **Document complex types** with JSDoc and examples

## 📚 Additional Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)
- [Advanced TypeScript Patterns](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)

## 🔄 Maintenance

When updating types:
1. Ensure backward compatibility or document breaking changes
2. Update related types in other files
3. Add/update JSDoc comments
4. Update this README if adding new categories
5. Run TypeScript compiler to check for errors
6. Update consuming code if making breaking changes

## 📞 Questions?

For questions about the type system, please consult:
- This README
- Inline JSDoc comments
- Team lead or senior developer
