# API Contract: [Nama Fitur]

## Overview
Deskripsi singkat mengenai endpoint ini dan kegunaannya bagi sisi Front-End.

---

## 1. [Nama Endpoint Utama]

- **URL**: `/api/v1/[resource]`
- **Method**: `POST` / `GET` / `PUT` / `DELETE`
- **Auth Required**: Yes / No
- **Content-Type**: `application/json`

### Request Headers
| Key | Value | Description |
| :--- | :--- | :--- |
| Authorization | Bearer {token} | Wajib jika Auth Required |

### Request Body (Payload)
```json
{
  "field_name": "string (required)",
  "another_field": 123
}
```

### Response

#### Success (200 OK)
```json
{
  "meta": {
    "code": 200,
    "status": "success",
    "message": "Operation successful"
  },
  "data": {
    "id": "uuid-v4",
    "field_name": "string"
  }
}
```

#### Error (400 Bad Request)
```json
{
  "meta": {
    "code": 400,
    "status": "error",
    "message": "Validation failed"
  },
  "errors": [
    "field_name is required"
  ]
}
```

#### Error (401 Unauthorized)
```json
{
  "meta": {
    "code": 401,
    "status": "error",
    "message": "Invalid token"
  }
}
```
