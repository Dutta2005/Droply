# Droply - Sharing Feature

## Overview

This document describes the sharing/authorization system implemented for Droply, similar to Google Drive and Dropbox. Users can now create shareable links for their files and folders with various permissions and security options.

## Features

### 1. Share Link Creation
- **Permission Levels**: 
  - `view` - Read-only access (default)
  - `edit` - Read and write access (for folders)

- **Security Options**:
  - Password protection
  - Expiration date
  - Maximum view count

### 2. Share Link Management
- View all active share links
- Copy share links to clipboard
- Revoke share links
- Track view counts

### 3. Public Access
- Share links are publicly accessible without authentication
- Password protection available for sensitive content
- Middleware allows public access to `/share/*` routes

## Database Schema

### `share_links` Table

```typescript
{
  id: uuid (primary key)
  fileId: uuid (foreign key to files table)
  token: text (unique share token)
  permission: text ('view' or 'edit')
  password: text (optional hashed password)
  expiresAt: timestamp (optional expiration)
  maxViews: integer (optional view limit)
  viewCount: integer (current view count)
  isActive: boolean (whether link is active)
  createdBy: text (user who created the link)
  createdAt: timestamp
  updatedAt: timestamp
}
```

## API Endpoints

### POST `/api/share/create`
Create a new share link for a file or folder.

**Request Body:**
```json
{
  "fileId": "uuid",
  "permission": "view" | "edit",
  "password": "string (optional)",
  "expiresAt": "ISO date string (optional)",
  "maxViews": number (optional)
}
```

**Response:**
```json
{
  "success": true,
  "shareLink": {
    "id": "uuid",
    "fileId": "uuid",
    "token": "string",
    "permission": "view" | "edit",
    "shareUrl": "https://your-app.com/share/token"
  }
}
```

### GET `/api/share/list`
List all share links created by the current user.

**Query Parameters:**
- `fileId` (optional): Filter by specific file

**Response:**
```json
{
  "success": true,
  "shareLinks": [
    {
      "id": "uuid",
      "fileId": "uuid",
      "token": "string",
      "permission": "view" | "edit",
      "hasPassword": boolean,
      "expiresAt": "ISO date string",
      "maxViews": number,
      "viewCount": number,
      "isActive": boolean,
      "createdAt": "ISO date string",
      "fileName": "string",
      "fileType": "string",
      "isFolder": boolean,
      "shareUrl": "https://your-app.com/share/token"
    }
  ]
}
```

### GET `/api/share/{token}`
Access a shared file or folder.

**Response:**
```json
{
  "success": true,
  "file": {
    "id": "uuid",
    "name": "string",
    "path": "string",
    "size": number,
    "type": "string",
    "fileUrl": "string",
    "thumbnailUrl": "string",
    "isFolder": boolean,
    "isStarred": boolean,
    "isTrash": boolean,
    "createdAt": "ISO date string",
    "updatedAt": "ISO date string"
  },
  "shareLink": {
    "id": "uuid",
    "permission": "view" | "edit",
    "createdAt": "ISO date string",
    "expiresAt": "ISO date string",
    "maxViews": number,
    "viewCount": number
  }
}
```

### POST `/api/share/{token}/verify`
Verify password for a protected share link.

**Request Body:**
```json
{
  "password": "string"
}
```

**Response:** Same as GET `/api/share/{token}`

### DELETE `/api/share/{token}`
Revoke a share link.

**Request Body:**
```json
{
  "userId": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Share link has been deactivated"
}
```

## UI Components

### ShareModal
A modal dialog for creating and managing share links with the following features:
- Permission selection (view/edit)
- Password protection toggle
- Expiration date picker
- Maximum views limit
- List of existing share links for the file
- Copy and revoke actions

### ShareButton
A simple button component that opens the ShareModal for a specific file.

### Share Links Page
A dedicated page at `/dashboard/share` for managing all share links:
- List all share links
- Filter by file/folder
- Copy links
- Revoke links
- View statistics (views, expiration, etc.)

## Public Share Page

### `/share/{token}`
A public page for accessing shared files and folders:
- Displays file/folder information
- Password protection form (if applicable)
- Download button for files
- Preview for images
- Folder information display

## Security Considerations

1. **Token Generation**: Share tokens are 32-character random alphanumeric strings
2. **Password Hashing**: Passwords are hashed using SHA-256 before storage
3. **Expiration**: Links can be set to expire automatically
4. **View Limits**: Links can be limited to a specific number of views
5. **User Verification**: Only file owners can create or revoke share links
6. **Middleware**: Public access is allowed only for share-related routes

## Usage Examples

### Creating a Share Link

```typescript
import axios from "axios";

const response = await axios.post("/api/share/create", {
  fileId: "your-file-id",
  permission: "view",
  password: "secret123",
  expiresAt: "2024-12-31T23:59:59Z",
  maxViews: 10
});

const shareUrl = response.data.shareLink.shareUrl;
// Share this URL with others
```

### Accessing a Shared File

Users can access shared files by visiting:
```
https://your-app.com/share/{token}
```

If the link is password-protected, they will be prompted to enter the password.

### Managing Share Links

```typescript
// List all share links
const response = await axios.get("/api/share/list");
const shareLinks = response.data.shareLinks;

// Revoke a share link
const response = await axios.delete(`/api/share/${token}`, {
  data: { userId: "current-user-id" }
});
```

## Configuration

Ensure the following environment variables are set:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

This is used to generate shareable URLs.

## Middleware Configuration

The middleware has been updated to allow public access to share-related routes:

```typescript
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/share/(.*)", // Public share links
  "/api/share/(.*)", // Public share API
]);
```

## Database Migration

Run the following commands to update your database:

```bash
npm run db:generate
npm run db:push
```

This will create the `share_links` table with all necessary columns and constraints.

## Future Enhancements

1. **Email Sharing**: Send share links directly to email addresses
2. **User-Specific Permissions**: Share with specific users instead of public links
3. **Audit Logs**: Track who accessed shared files and when
4. **Link Analytics**: Detailed statistics on share link usage
5. **Custom URL Slugs**: Allow users to create custom share link URLs
6. **Social Sharing**: Integration with social media platforms
7. **QR Codes**: Generate QR codes for share links
8. **Notifications**: Notify users when their files are accessed
