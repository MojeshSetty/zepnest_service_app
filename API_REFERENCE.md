# Zepnest RESTful API Reference

## Base URL
All API requests should be prefixed with the local server address during development:
`http://127.0.0.1:8000`

## Authentication
This API uses **JSON Web Tokens (JWT)** for securing endpoints. 
Most routes require an `Authorization` header with a valid Bearer token obtained from the `/token` endpoint.

**Header Format:**
{
  "Authorization": "Bearer <your_jwt_token_here>"
}

---

## 1. Authentication & Users

### Register a New User
* **Endpoint:** `POST /register`
* **Description:** Creates a new user account and hashes the password into the database.
* **Auth Required:** No

### User Login (Generate Token)
* **Endpoint:** `POST /token` 
* **Description:** Authenticates user credentials and returns a secure JWT access token. 
* **Auth Required:** No

---

## 2. Service Requests

### Get All User Requests
* **Endpoint:** `GET /requests`
* **Description:** Fetches all service requests belonging exclusively to the currently authenticated user.
* **Auth Required:** Yes

### Create a New Request
* **Endpoint:** `POST /requests`
* **Description:** Submits a new service request tied to the logged-in user's ID.
* **Auth Required:** Yes

### Delete a Request
* **Endpoint:** `DELETE /requests/{request_id}`
* **Description:** Permanently deletes a specific service request.
* **Auth Required:** Yes

---

## Standard Error Codes
* **`400 Bad Request`:** Missing or invalid fields.
* **`401 Unauthorized`:** Invalid credentials or missing JWT token.
* **`403 Forbidden`:** Attempting to access requests belonging to another user.
* **`404 Not Found`:** The requested endpoint or `request_id` does not exist.