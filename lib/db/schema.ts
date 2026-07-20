import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const files = pgTable("files", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: text("name").notNull(),
  path: text("path").notNull(), 
  size: integer("size").notNull(), 
  type: text("type").notNull(), 

  fileUrl: text("file_url").notNull(), 
  thumbnailUrl: text("thumbnail_url"), 

  userId: text("user_id").notNull(),
  parentId: uuid("parent_id"), 


  isFolder: boolean("is_folder").default(false).notNull(),
  isStarred: boolean("is_starred").default(false).notNull(),
  isTrash: boolean("is_trash").default(false).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const share_links = pgTable("share_links", {
  id: uuid("id").defaultRandom().primaryKey(),
  
  // The file or folder being shared
  fileId: uuid("file_id").notNull().references(() => files.id, { onDelete: "cascade" }),
  
  // Unique share token (used in the URL)
  token: text("token").notNull().unique(),
  
  // Permission level: 'view' or 'edit'
  permission: text("permission").notNull().default('view'),
  
  // Optional password protection
  password: text("password"),
  
  // Expiration date (optional)
  expiresAt: timestamp("expires_at"),
  
  // Number of times the link can be accessed (optional)
  maxViews: integer("max_views"),
  
  // Current view count
  viewCount: integer("view_count").default(0).notNull(),
  
  // Whether the link is active
  isActive: boolean("is_active").default(true).notNull(),
  
  // Created by (user who created the share link)
  createdBy: text("created_by").notNull(),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const shareLinksRelations = relations(share_links, ({ one }) => ({
  file: one(files, {
    fields: [share_links.fileId],
    references: [files.id],
  }),
}));

export const filesRelations = relations(files, ({ one, many }) => ({
  parent: one(files, {
    fields: [files.parentId], 
    references: [files.id],
  }),

  children: many(files),
  
  share_links: many(share_links),
}));

export type File = typeof files.$inferSelect;
export type NewFile = typeof files.$inferInsert;
export type ShareLink = typeof share_links.$inferSelect;
export type NewShareLink = typeof share_links.$inferInsert;