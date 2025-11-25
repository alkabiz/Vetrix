# Type System Quick Reference

## 🚀 Most Used Types

### API Types
```typescript
// Success response
ApiResponse<T>
ApiSuccessResponse<T>

// Error response
ApiErrorResponse
ApiError

// Pagination
PaginatedResponse<T>
CursorPaginatedResponse<T>

// Status codes
HttpStatusCode.OK              // 200
HttpStatusCode.Created         // 201
HttpStatusCode.BadRequest      // 400
HttpStatusCode.Unauthorized    // 401
HttpStatusCode.NotFound        // 404

// Error codes
ApiErrorCode.VALIDATION_ERROR
ApiErrorCode.UNAUTHORIZED
ApiErrorCode.RESOURCE_NOT_FOUND
```

### Form Types
```typescript
// Form state
FormState<T>
FormField<T>
FormSchema<T>

// Validation
ValidationRule<T>
ValidationResult
ValidatorFn<T>

// Form actions
FormAPI<T>        // State + Actions combined
FormActions<T>

// Multi-step
FormWizardConfig<T>
FormStep<T>
```

### Utility Types
```typescript
// Basic transformations
Nullable<T>       // All props nullable
Optional<T>       // All props optional
DeepPartial<T>    // Deep optional

// ID helpers
WithId<T>         // Add id property
Brand<T, B>       // Branded types

// Timestamps
Timestamped<T>    // Add createdAt/updatedAt
Auditable<T>      // Full audit metadata

// Database
NewEntity<T>      // Omit id + timestamps
EntityUpdate<T>   // Partial, no id/timestamps

// Results
Result<T>         // Success | Failure
AsyncResult<T>    // Promise<Result<T>>

// Query
QueryParams<T>
FilterCondition
SortConfig<T>
PaginationParams
```

### Common Types
```typescript
// Contact
ContactInfo
Email
PhoneNumber

// Location
Address
Coordinates

// Money
Money
Price
CurrencyCode

// Status types
UserStatus
AppointmentStatus
PaymentStatus
InvoiceStatus

// Audit
AuditMetadata
ChangeLog

// Files
FileMetadata
ImageMetadata
```

## 📝 Common Patterns

### 1. API Endpoint
```typescript
import { ApiResponse, PaginatedResponse } from '@/lib/types'

export async function GET(req: Request): Promise<Response> {
  try {
    const owners = await getOwners()
    const response: ApiResponse<PaginatedResponse<Owner>> = {
      success: true,
      data: {
        items: owners,
        pagination: {
          page: 1,
          pageSize: 20,
          totalPages: 5,
          totalItems: 100,
          hasNextPage: true,
          hasPreviousPage: false
        }
      }
    }
    return Response.json(response)
  } catch (error) {
    const errorResponse: ApiErrorResponse = {
      success: false,
      error: {
        code: ApiErrorCode.INTERNAL_ERROR,
        message: error.message
      }
    }
    return Response.json(errorResponse, { status: 500 })
  }
}
```

### 2. Form Setup
```typescript
import { FormState, FormField } from '@/lib/types'

interface LoginData {
  email: string
  password: string
}

const initialState: FormState<LoginData> = {
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
      rules: [
        { type: 'required', validator: requiredValidator },
        { type: 'minLength', validator: minLengthValidator(8) }
      ]
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

### 3. Repository Pattern
```typescript
import { NewEntity, EntityUpdate, Timestamped, Result } from '@/lib/types'

type OwnerEntity = Timestamped<Owner>
type NewOwner = NewEntity<OwnerEntity>
type UpdateOwner = EntityUpdate<OwnerEntity>

class OwnerRepository {
  create(data: NewOwner): Result<Owner> {
    try {
      const owner = db.insert({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      })
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

  update(id: number, data: UpdateOwner): Result<Owner> {
    // Implementation
  }
}
```

### 4. Type Guards
```typescript
import { ApiResponse, ApiSuccessResponse } from '@/lib/types'

function isSuccess<T>(
  response: ApiResponse<T>
): response is ApiSuccessResponse<T> {
  return response.success === true
}

// Usage
const response = await fetch('/api/owners')
const data = await response.json()

if (isSuccess(data)) {
  console.log(data.data) // TypeScript knows this is T
} else {
  console.error(data.error) // TypeScript knows this is ApiError
}
```

### 5. Branded IDs
```typescript
import { OwnerId, PetId } from '@/lib/types'

// Type-safe ID handling
function getOwnerPets(ownerId: OwnerId): Pet[] {
  return db.pets.where({ ownerId })
}

const owner = { id: 1 as OwnerId }
const pet = { id: 2 as PetId }

getOwnerPets(owner.id)  // ✅ OK
getOwnerPets(pet.id)    // ❌ Error: PetId not assignable to OwnerId
```

## 🎯 Type Selection Flowchart

```
Need a type?
    │
    ├─ API Communication?
    │  ├─ Response wrapper → ApiResponse<T>
    │  ├─ List with pages → PaginatedResponse<T>
    │  ├─ Error handling → ApiError, ApiErrorCode
    │  └─ Batch ops → BatchRequest/Response
    │
    ├─ Form Management?
    │  ├─ Field state → FormField<T>
    │  ├─ Complete form → FormState<T>
    │  ├─ Validation → ValidationRule, ValidationResult
    │  └─ Multi-step → FormWizardConfig
    │
    ├─ Database Operations?
    │  ├─ Create → NewEntity<T>
    │  ├─ Update → EntityUpdate<T>
    │  ├─ Read → Timestamped<T>
    │  ├─ Query → QueryParams, FilterCondition
    │  └─ Result → Result<T>
    │
    ├─ Type Transformation?
    │  ├─ Make nullable → Nullable<T>
    │  ├─ Make optional → Optional<T>, DeepPartial<T>
    │  ├─ Add ID → WithId<T>
    │  ├─ Add timestamps → Timestamped<T>
    │  └─ Type-safe ID → Brand<number, 'EntityName'>
    │
    └─ Domain Concept?
       ├─ Contact → ContactInfo, Email, PhoneNumber
       ├─ Location → Address, Coordinates
       ├─ Money → Money, Price
       ├─ Status → *Status types
       └─ Files → FileMetadata, ImageMetadata
```

## 💡 Pro Tips

### Tip 1: Type-Only Imports
```typescript
// Better performance
import type { ApiResponse, Owner } from '@/lib/types'
```

### Tip 2: Const Assertions
```typescript
const status = 'active' as const
// Type: 'active' (literal), not string
```

### Tip 3: Satisfies Operator
```typescript
const config = {
  timeout: 5000,
  retries: 3
} satisfies ApiRequestConfig
// Keeps literal types while ensuring type safety
```

### Tip 4: Generic Constraints
```typescript
function createEntity<T extends { id: number }>(
  data: NewEntity<T>
): T {
  // Implementation
}
```

### Tip 5: Utility Type Composition
```typescript
// Combine multiple utilities
type ReadonlyEntity<T> = Readonly<Timestamped<WithId<T>>>
type PartialUpdate<T> = DeepPartial<EntityUpdate<T>>
```

## 🔍 Quick Lookup Table

| Need | Import | Usage |
|------|--------|-------|
| API response | `ApiResponse<T>` | `ApiResponse<Owner>` |
| Pagination | `PaginatedResponse<T>` | `PaginatedResponse<Pet>` |
| Form state | `FormState<T>` | `FormState<LoginData>` |
| New record | `NewEntity<T>` | `NewEntity<Owner>` |
| Update record | `EntityUpdate<T>` | `EntityUpdate<Pet>` |
| Make optional | `Optional<T>` | `Optional<Owner>` |
| Make nullable | `Nullable<T>` | `Nullable<Address>` |
| Add timestamps | `Timestamped<T>` | `Timestamped<Owner>` |
| Type-safe ID | `Brand<T, B>` | `Brand<number, 'OwnerId'>` |
| Error handling | `Result<T>` | `Result<Owner>` |
| Query params | `QueryParams` | `QueryParams<'name'>` |
| Contact info | `ContactInfo` | Direct use |
| Address | `Address` | Direct use |
| Money | `Money` | Direct use |

## 📚 Example Combinations

```typescript
// Complete API endpoint response
type OwnerListResponse = ApiResponse<PaginatedResponse<Timestamped<Owner>>>

// Form with validation
type OwnerFormState = FormState<NewEntity<Owner>>

// Repository method
function create(data: NewEntity<Owner>): Promise<Result<Timestamped<Owner>>>

// Partial update with deep optional
type DeepUpdateOwner = RecursivePartial<EntityUpdate<Owner>>

// Branded ID for type safety
type OwnerId = Brand<number, 'OwnerId'>
function getOwner(id: OwnerId): Promise<ApiResponse<Owner>>
```

## 🚨 Common Mistakes to Avoid

```typescript
// ❌ Don't use any
const data: any = await fetch('/api')

// ✅ Use unknown or proper types
const data: unknown = await fetch('/api')
const typed = data as ApiResponse<Owner>

// ❌ Don't create ad-hoc response types
interface MyResponse {
  success: boolean
  data: Owner
}

// ✅ Use standard types
type OwnerResponse = ApiResponse<Owner>

// ❌ Don't mix up ID types
function getPet(ownerId: number): Pet

// ✅ Use branded types
function getPet(petId: PetId): Pet

// ❌ Don't ignore nullability
function getName(owner: Owner) {
  return owner.name.toUpperCase() // Might be null!
}

// ✅ Handle nullable properly
function getName(owner: Owner) {
  return owner.name?.toUpperCase() ?? 'Unknown'
}
```

---

*Keep this reference handy for quick type lookups during development!*
