# DocFlow AI - API Documentation for Postman

Base URL: `http://localhost:8080`

## 1. Authentication
All auth requests use `JSON` body.

### Register
- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login
- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Body**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
*Returns a `token` which should be used in the `Authorization` header for protected routes.*

---

## 2. AI Engine (Gemini Integration)
These requests use `multipart/form-data`.

### Generate Content (Summary/Quiz/Guide)
- **URL**: `/api/ai/generate`
- **Method**: `POST`
- **Body (form-data)**:
    - `file`: (Upload a PDF/DOC/TXT)
    - `email`: `john@example.com`
    - `mode`: `summary` | `quiz` | `guide`
    - `prompt`: "Your specific AI instruction here"

### Lecture Extraction
- **URL**: `/api/ai/lecture`
- **Method**: `POST`
- **Body (form-data)**:
    - `file`: (Upload an audio/video/document)
    - `email`: `john@example.com`
    - `template`: `structured` | `cornell` | `mindmap`

---

## 3. Notes Management
Requires `JSON` body.

### Get All Notes
- **URL**: `/api/notes?email=john@example.com`
- **Method**: `GET`

### Create Note
- **URL**: `/api/notes`
- **Method**: `POST`
- **Body**:
```json
{
  "label": "My New Note",
  "tag": "AI Insight",
  "summary": ["Key point 1", "Key point 2"],
  "content": "Full markdown content here...",
  "userEmail": "john@example.com"
}
```

### Update Note
- **URL**: `/api/notes/{id}`
- **Method**: `PUT`
- **Body**: Same as Create Note.

---

## 4. Workspace Stats
### Get Stats
- **URL**: `/api/workspace?email=john@example.com`
- **Method**: `GET`
