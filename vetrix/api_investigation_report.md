# API & Authentication Investigation Report

## 1. Current API Endpoints

Based on the codebase analysis, here are the available endpoints related to authentication and user management.

### **Authentication**

| Feature     | Method | Endpoint            | Description                                                                               |
| :---------- | :----- | :------------------ | :---------------------------------------------------------------------------------------- |
| **Login**   | `POST` | `/api/auth/login`   | Authenticates user, returns token, user info, and **permissions**. Sets HttpOnly cookies. |
| **Session** | `GET`  | `/api/auth/me`      | Validates token and returns current user info. **⚠️ MISSING PERMISSIONS in response.**    |
| **Logout**  | `POST` | `/api/auth/logout`  | Clears auth cookies.                                                                      |
| **Refresh** | `POST` | `/api/auth/refresh` | Refreshes access token (implied by directory structure).                                  |

### **Roles and Permissions**

> **⚠️ Critical Finding**: No dedicated endpoints were found to **list** all roles (`cat_roles`) or permissions (`cat_permissions`) in the API structure (`src/app/api`).
> Role assignment is handled via User updates.

| Feature         | Method | Endpoint               | Description                          |
| :-------------- | :----- | :--------------------- | :----------------------------------- |
| **Assign Role** | `PUT`  | `/api/users/:id`       | Update user's `roleId`.              |
| **Bulk Role**   | `POST` | `/api/users/bulk/role` | Bulk update role for multiple users. |

---

## 2. Sample Postman Calls

### **Login (Authenticate)**

_Returns initial permissions. If the frontend stores this state, it should work on first login._

**POST** `{{baseUrl}}/api/auth/login`
**Headers**: `Content-Type: application/json`
**Body**:

```json
{
  "login": "admin@vetrix.com",
  "password": "your_password"
}
```

**Response (Success)**:

```json
{
    "message": "Login successful",
    "token": "ey...",
    "user": { "id": 1, "username": "admin", ... },
    "permissions": ["users.view", "users.create", ...], // <--- VERIFY THIS ARRAY IS POPULATED
    "expiresAt": "2025-..."
}
```

### **Get Current User (Session Restore)**

\*Used by frontend on page reload. **Identified as the likely cause of the issue.\***

**GET** `{{baseUrl}}/api/auth/me`
**Headers**: `Authorization: Bearer {{token}}`
**Body**: _(None)_
**Actual Response (Current Code)**:

```json
{
    "user": { "id": 1, "username": "admin", "role": "ADMIN", ... }
    // ⚠️ "permissions" ARRAY IS MISSING HERE
}
```

### **Update User Role**

**PUT** `{{baseUrl}}/api/users/2`
**Headers**: `Authorization: Bearer {{token}}`
**Body**:

```json
{
  "roleId": 1
}
```

---

## 3. Recommended Validation Tests

To confirm the root cause, perform these specific tests:

1.  **Validate Database Permissions (SQL)**:
    Run this query to ensure the Administrator role actually has permissions linked in the database.

    ```sql
    SELECT r.name as Role, p.name as Permission
    FROM cat_roles r
    JOIN usr_role_permissions rp ON r.id = rp.role_id
    JOIN cat_permissions p ON rp.permission_id = p.id
    WHERE r.id = 1; -- Assuming Admin ID is 1
    ```

    - **Expected Result**: A list of 95+ rows.
    - **If Empty**: The DB migration failed to populate `usr_role_permissions`.

2.  **Validate Login Response (Postman)**:

    - Call **Login** endpoint.
    - Check if the `permissions` array in the JSON response contains the strings expected by the frontend (e.g., `users.view`).
    - **If Empty**: Issue is likely in the `getUserPermissions` SQL query or DB data.

3.  **Validate Session Restore (Postman)**:
    - Call **Get Current User** (`/api/auth/me`) endpoint.
    - **Observation**: You will likely see it returns `user` but **not** `permissions`.
    - **Frontend Impact**: When you refresh the page, the app calls this endpoint. if it doesn't get permissions back, it defaults to "no access", hiding all menus.

---

## 4. Diagnosis & Next Steps

### **The Problem is likely in the API / Frontend Integration:**

The application fails to display menus because the **Session/Me endpoint (`/api/auth/me`) does not return the user's permissions**.

- **Scenario 1 (Login works, refresh fails)**: If menus show up immediately after login but disappear after refresh, it's 100% the missing permissions in `/me`.
- **Scenario 2 (Never works)**: If menus never show up, check the `Login` response payload.

### **Validation Steps:**

1.  **Frontend**: Check `src/app/api/auth/me/route.ts` and ensure it calls `getUserPermissions(user.id)` and includes it in the response.
2.  **Database**: Verify `usr_role_permissions` is populated.
3.  **Logic**: Verify `cat_roles` and `cat_permissions` have `is_active = 1`.

### **Suggested Fix for `/api/auth/me` (Reference)**

The endpoint should look like this to fix the issue:

```typescript
// Inside GET function in src/app/api/auth/me/route.ts
const user = await findUserById(decoded.id);
const permissions = await getUserPermissions(decoded.id); // <--- Add this

return NextResponse.json({ user, permissions }); // <--- Return this
```
