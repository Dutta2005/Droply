# 📄 Database Migration SQL for Sharing Feature

## 🎯 Overview

To use the sharing feature, you need to create the `share_links` table in your Neon database. You have **two options**:

---

## ✅ Option 1: Run SQL Directly in Neon Editor (Recommended)

Copy and paste this SQL into your Neon database SQL editor:

```sql
-- Create share_links table
CREATE TABLE "share_links" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "file_id" uuid NOT NULL,
  "token" text NOT NULL,
  "permission" text DEFAULT 'view' NOT NULL,
  "password" text,
  "expires_at" timestamp,
  "max_views" integer,
  "view_count" integer DEFAULT 0 NOT NULL,
  "is_active" boolean DEFAULT true NOT NULL,
  "created_by" text NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "share_links_token_unique" UNIQUE("token")
);

-- Add foreign key constraint to files table
ALTER TABLE "share_links" ADD CONSTRAINT "share_links_file_id_files_id_fk" 
  FOREIGN KEY ("file_id") REFERENCES "public"."files"("id") ON DELETE cascade;

-- Create index for faster lookups
CREATE INDEX "share_links_token_idx" ON "share_links"("token");
CREATE INDEX "share_links_file_id_idx" ON "share_links"("file_id");
CREATE INDEX "share_links_created_by_idx" ON "share_links"("created_by");
```

---

## ✅ Option 2: Use Drizzle Migration

If you have Drizzle configured, you can run:

```bash
# Generate the migration (already done)
npm run db:generate

# Push to database
npm run db:push
```

The migration file is already created at: `drizzle/0001_low_black_tom.sql`

---

## 📊 Table Structure

### share_links Table

| Column | Type | Description | Required | Default |
|--------|------|-------------|----------|---------|
| id | uuid | Primary key | ✅ | gen_random_uuid() |
| file_id | uuid | Foreign key to files | ✅ | - |
| token | text | Unique share token | ✅ | - |
| permission | text | 'view' or 'edit' | ✅ | 'view' |
| password | text | Hashed password (optional) | ❌ | null |
| expires_at | timestamp | Expiration date (optional) | ❌ | null |
| max_views | integer | Maximum views (optional) | ❌ | null |
| view_count | integer | Current view count | ✅ | 0 |
| is_active | boolean | Whether link is active | ✅ | true |
| created_by | text | User who created the link | ✅ | - |
| created_at | timestamp | Creation timestamp | ✅ | now() |
| updated_at | timestamp | Last update timestamp | ✅ | now() |

### Constraints
- `PRIMARY KEY (id)`
- `UNIQUE (token)` - Each share link has a unique token
- `FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE` - When a file is deleted, all its share links are deleted

### Indexes
- `share_links_token_idx` - Fast lookup by token
- `share_links_file_id_idx` - Fast lookup by file
- `share_links_created_by_idx` - Fast lookup by user

---

## 🔍 How to Run in Neon

1. Go to [Neon Dashboard](https://console.neon.tech/)
2. Select your database
3. Click on "SQL Editor" in the left sidebar
4. Copy the SQL from **Option 1** above
5. Paste it into the editor
6. Click "Run" button

That's it! The table will be created and ready to use.

---

## ✅ Verification

After running the SQL, you can verify the table was created:

```sql
SELECT * FROM information_schema.tables 
WHERE table_name = 'share_links';
```

Or check the structure:

```sql
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'share_links' 
ORDER BY ordinal_position;
```

---

## 🚀 After Migration

Once the table is created:

1. **Test the feature:**
   ```bash
   npm run dev
   ```

2. **Go to your dashboard** and try sharing a file

3. **Test the share link** in another browser

---

## 📝 Notes

- The `token` column uses a UNIQUE constraint to ensure each share link is unique
- The `file_id` foreign key has `ON DELETE CASCADE` so share links are automatically deleted when the file is deleted
- The `password` column stores hashed passwords (SHA-256) for security
- All timestamps use the database's current time

---

## 🎉 Done!

After running the SQL, your sharing feature will be fully functional! 🚀
