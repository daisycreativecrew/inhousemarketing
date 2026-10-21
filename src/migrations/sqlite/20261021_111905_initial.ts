import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`users_sessions\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`created_at\` text,
  	\`expires_at\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`users_sessions_order_idx\` ON \`users_sessions\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`users_sessions_parent_id_idx\` ON \`users_sessions\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`users\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`role\` text DEFAULT 'editor' NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`email\` text NOT NULL,
  	\`reset_password_token\` text,
  	\`reset_password_expiration\` text,
  	\`salt\` text,
  	\`hash\` text,
  	\`reset_password_requested_at\` text,
  	\`login_attempts\` numeric DEFAULT 0,
  	\`lock_until\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`users_updated_at_idx\` ON \`users\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`users_created_at_idx\` ON \`users\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`users_email_idx\` ON \`users\` (\`email\`);`)
  await db.run(sql`CREATE TABLE \`media\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`alt\` text NOT NULL,
  	\`caption\` text,
  	\`source\` text NOT NULL,
  	\`approval\` text DEFAULT 'pending' NOT NULL,
  	\`usage_rights_confirmed\` integer DEFAULT false,
  	\`approved_by\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`url\` text,
  	\`thumbnail_u_r_l\` text,
  	\`filename\` text,
  	\`mime_type\` text,
  	\`filesize\` numeric,
  	\`width\` numeric,
  	\`height\` numeric,
  	\`focal_x\` numeric,
  	\`focal_y\` numeric,
  	\`sizes_card_url\` text,
  	\`sizes_card_width\` numeric,
  	\`sizes_card_height\` numeric,
  	\`sizes_card_mime_type\` text,
  	\`sizes_card_filesize\` numeric,
  	\`sizes_card_filename\` text,
  	\`sizes_wide_url\` text,
  	\`sizes_wide_width\` numeric,
  	\`sizes_wide_height\` numeric,
  	\`sizes_wide_mime_type\` text,
  	\`sizes_wide_filesize\` numeric,
  	\`sizes_wide_filename\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`media_updated_at_idx\` ON \`media\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`media_created_at_idx\` ON \`media\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`media_filename_idx\` ON \`media\` (\`filename\`);`)
  await db.run(sql`CREATE INDEX \`media_sizes_card_sizes_card_filename_idx\` ON \`media\` (\`sizes_card_filename\`);`)
  await db.run(sql`CREATE INDEX \`media_sizes_wide_sizes_wide_filename_idx\` ON \`media\` (\`sizes_wide_filename\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_story_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`kicker\` text,
  	\`title\` text,
  	\`body\` text,
  	\`href\` text,
  	\`evidence_id\` integer,
  	FOREIGN KEY (\`evidence_id\`) REFERENCES \`evidence\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_story\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_story_items_order_idx\` ON \`pages_blocks_story_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_story_items_parent_id_idx\` ON \`pages_blocks_story_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_story_items_evidence_idx\` ON \`pages_blocks_story_items\` (\`evidence_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_story\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`title\` text,
  	\`body\` text,
  	\`cta_label\` text,
  	\`cta_href\` text,
  	\`case_study_id\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`case_study_id\`) REFERENCES \`cases\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_story_order_idx\` ON \`pages_blocks_story\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_story_parent_id_idx\` ON \`pages_blocks_story\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_story_path_idx\` ON \`pages_blocks_story\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_story_case_study_idx\` ON \`pages_blocks_story\` (\`case_study_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_problems_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`kicker\` text,
  	\`title\` text,
  	\`body\` text,
  	\`href\` text,
  	\`evidence_id\` integer,
  	FOREIGN KEY (\`evidence_id\`) REFERENCES \`evidence\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_problems\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_problems_items_order_idx\` ON \`pages_blocks_problems_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_problems_items_parent_id_idx\` ON \`pages_blocks_problems_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_problems_items_evidence_idx\` ON \`pages_blocks_problems_items\` (\`evidence_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_problems\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`title\` text,
  	\`body\` text,
  	\`cta_label\` text,
  	\`cta_href\` text,
  	\`case_study_id\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`case_study_id\`) REFERENCES \`cases\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_problems_order_idx\` ON \`pages_blocks_problems\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_problems_parent_id_idx\` ON \`pages_blocks_problems\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_problems_path_idx\` ON \`pages_blocks_problems\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_problems_case_study_idx\` ON \`pages_blocks_problems\` (\`case_study_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_system_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`kicker\` text,
  	\`title\` text,
  	\`body\` text,
  	\`href\` text,
  	\`evidence_id\` integer,
  	FOREIGN KEY (\`evidence_id\`) REFERENCES \`evidence\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_system\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_system_items_order_idx\` ON \`pages_blocks_system_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_system_items_parent_id_idx\` ON \`pages_blocks_system_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_system_items_evidence_idx\` ON \`pages_blocks_system_items\` (\`evidence_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_system\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`title\` text,
  	\`body\` text,
  	\`cta_label\` text,
  	\`cta_href\` text,
  	\`case_study_id\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`case_study_id\`) REFERENCES \`cases\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_system_order_idx\` ON \`pages_blocks_system\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_system_parent_id_idx\` ON \`pages_blocks_system\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_system_path_idx\` ON \`pages_blocks_system\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_system_case_study_idx\` ON \`pages_blocks_system\` (\`case_study_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_products_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`kicker\` text,
  	\`title\` text,
  	\`body\` text,
  	\`href\` text,
  	\`evidence_id\` integer,
  	FOREIGN KEY (\`evidence_id\`) REFERENCES \`evidence\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_products\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_products_items_order_idx\` ON \`pages_blocks_products_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_products_items_parent_id_idx\` ON \`pages_blocks_products_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_products_items_evidence_idx\` ON \`pages_blocks_products_items\` (\`evidence_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_products\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`title\` text,
  	\`body\` text,
  	\`cta_label\` text,
  	\`cta_href\` text,
  	\`case_study_id\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`case_study_id\`) REFERENCES \`cases\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_products_order_idx\` ON \`pages_blocks_products\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_products_parent_id_idx\` ON \`pages_blocks_products\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_products_path_idx\` ON \`pages_blocks_products\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_products_case_study_idx\` ON \`pages_blocks_products\` (\`case_study_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_selector_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`kicker\` text,
  	\`title\` text,
  	\`body\` text,
  	\`href\` text,
  	\`evidence_id\` integer,
  	FOREIGN KEY (\`evidence_id\`) REFERENCES \`evidence\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_selector\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_selector_items_order_idx\` ON \`pages_blocks_selector_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_selector_items_parent_id_idx\` ON \`pages_blocks_selector_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_selector_items_evidence_idx\` ON \`pages_blocks_selector_items\` (\`evidence_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_selector\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`title\` text,
  	\`body\` text,
  	\`cta_label\` text,
  	\`cta_href\` text,
  	\`case_study_id\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`case_study_id\`) REFERENCES \`cases\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_selector_order_idx\` ON \`pages_blocks_selector\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_selector_parent_id_idx\` ON \`pages_blocks_selector\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_selector_path_idx\` ON \`pages_blocks_selector\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_selector_case_study_idx\` ON \`pages_blocks_selector\` (\`case_study_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_preview_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`kicker\` text,
  	\`title\` text,
  	\`body\` text,
  	\`href\` text,
  	\`evidence_id\` integer,
  	FOREIGN KEY (\`evidence_id\`) REFERENCES \`evidence\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_preview\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_preview_items_order_idx\` ON \`pages_blocks_preview_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_preview_items_parent_id_idx\` ON \`pages_blocks_preview_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_preview_items_evidence_idx\` ON \`pages_blocks_preview_items\` (\`evidence_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_preview\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`title\` text,
  	\`body\` text,
  	\`cta_label\` text,
  	\`cta_href\` text,
  	\`case_study_id\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`case_study_id\`) REFERENCES \`cases\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_preview_order_idx\` ON \`pages_blocks_preview\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_preview_parent_id_idx\` ON \`pages_blocks_preview\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_preview_path_idx\` ON \`pages_blocks_preview\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_preview_case_study_idx\` ON \`pages_blocks_preview\` (\`case_study_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_experts_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`kicker\` text,
  	\`title\` text,
  	\`body\` text,
  	\`href\` text,
  	\`evidence_id\` integer,
  	FOREIGN KEY (\`evidence_id\`) REFERENCES \`evidence\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_experts\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_experts_items_order_idx\` ON \`pages_blocks_experts_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_experts_items_parent_id_idx\` ON \`pages_blocks_experts_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_experts_items_evidence_idx\` ON \`pages_blocks_experts_items\` (\`evidence_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_experts\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`title\` text,
  	\`body\` text,
  	\`cta_label\` text,
  	\`cta_href\` text,
  	\`case_study_id\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`case_study_id\`) REFERENCES \`cases\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_experts_order_idx\` ON \`pages_blocks_experts\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_experts_parent_id_idx\` ON \`pages_blocks_experts\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_experts_path_idx\` ON \`pages_blocks_experts\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_experts_case_study_idx\` ON \`pages_blocks_experts\` (\`case_study_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_faq_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`kicker\` text,
  	\`title\` text,
  	\`body\` text,
  	\`href\` text,
  	\`evidence_id\` integer,
  	FOREIGN KEY (\`evidence_id\`) REFERENCES \`evidence\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_faq\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_faq_items_order_idx\` ON \`pages_blocks_faq_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_faq_items_parent_id_idx\` ON \`pages_blocks_faq_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_faq_items_evidence_idx\` ON \`pages_blocks_faq_items\` (\`evidence_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_faq\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`title\` text,
  	\`body\` text,
  	\`cta_label\` text,
  	\`cta_href\` text,
  	\`case_study_id\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`case_study_id\`) REFERENCES \`cases\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_faq_order_idx\` ON \`pages_blocks_faq\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_faq_parent_id_idx\` ON \`pages_blocks_faq\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_faq_path_idx\` ON \`pages_blocks_faq\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_faq_case_study_idx\` ON \`pages_blocks_faq\` (\`case_study_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_editorial_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`kicker\` text,
  	\`title\` text,
  	\`body\` text,
  	\`href\` text,
  	\`evidence_id\` integer,
  	FOREIGN KEY (\`evidence_id\`) REFERENCES \`evidence\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_editorial\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_editorial_items_order_idx\` ON \`pages_blocks_editorial_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_editorial_items_parent_id_idx\` ON \`pages_blocks_editorial_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_editorial_items_evidence_idx\` ON \`pages_blocks_editorial_items\` (\`evidence_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_editorial\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`title\` text,
  	\`body\` text,
  	\`cta_label\` text,
  	\`cta_href\` text,
  	\`case_study_id\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`case_study_id\`) REFERENCES \`cases\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_editorial_order_idx\` ON \`pages_blocks_editorial\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_editorial_parent_id_idx\` ON \`pages_blocks_editorial\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_editorial_path_idx\` ON \`pages_blocks_editorial\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_editorial_case_study_idx\` ON \`pages_blocks_editorial\` (\`case_study_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_cta_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`kicker\` text,
  	\`title\` text,
  	\`body\` text,
  	\`href\` text,
  	\`evidence_id\` integer,
  	FOREIGN KEY (\`evidence_id\`) REFERENCES \`evidence\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_cta\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_cta_items_order_idx\` ON \`pages_blocks_cta_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_cta_items_parent_id_idx\` ON \`pages_blocks_cta_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_cta_items_evidence_idx\` ON \`pages_blocks_cta_items\` (\`evidence_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_cta\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`title\` text,
  	\`body\` text,
  	\`cta_label\` text,
  	\`cta_href\` text,
  	\`case_study_id\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`case_study_id\`) REFERENCES \`cases\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_cta_order_idx\` ON \`pages_blocks_cta\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_cta_parent_id_idx\` ON \`pages_blocks_cta\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_cta_path_idx\` ON \`pages_blocks_cta\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_cta_case_study_idx\` ON \`pages_blocks_cta\` (\`case_study_id\`);`)
  await db.run(sql`CREATE TABLE \`pages\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`path\` text,
  	\`eyebrow\` text,
  	\`title\` text,
  	\`accent\` text,
  	\`intro\` text,
  	\`cta_label\` text,
  	\`cta_href\` text,
  	\`secondary_label\` text,
  	\`secondary_href\` text,
  	\`legal_approved\` integer DEFAULT false,
  	\`seo_title\` text,
  	\`seo_description\` text,
  	\`seo_image_id\` integer,
  	\`seo_noindex\` integer DEFAULT false,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`seo_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_path_idx\` ON \`pages\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`pages_seo_seo_image_idx\` ON \`pages\` (\`seo_image_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_updated_at_idx\` ON \`pages\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`pages_created_at_idx\` ON \`pages\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`pages__status_idx\` ON \`pages\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`pages_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`experts_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`experts_id\`) REFERENCES \`experts\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_rels_order_idx\` ON \`pages_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`pages_rels_parent_idx\` ON \`pages_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_rels_path_idx\` ON \`pages_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`pages_rels_experts_id_idx\` ON \`pages_rels\` (\`experts_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_story_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`kicker\` text,
  	\`title\` text,
  	\`body\` text,
  	\`href\` text,
  	\`evidence_id\` integer,
  	\`_uuid\` text,
  	FOREIGN KEY (\`evidence_id\`) REFERENCES \`evidence\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_story\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_story_items_order_idx\` ON \`_pages_v_blocks_story_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_story_items_parent_id_idx\` ON \`_pages_v_blocks_story_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_story_items_evidence_idx\` ON \`_pages_v_blocks_story_items\` (\`evidence_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_story\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`title\` text,
  	\`body\` text,
  	\`cta_label\` text,
  	\`cta_href\` text,
  	\`case_study_id\` integer,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`case_study_id\`) REFERENCES \`cases\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_story_order_idx\` ON \`_pages_v_blocks_story\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_story_parent_id_idx\` ON \`_pages_v_blocks_story\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_story_path_idx\` ON \`_pages_v_blocks_story\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_story_case_study_idx\` ON \`_pages_v_blocks_story\` (\`case_study_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_problems_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`kicker\` text,
  	\`title\` text,
  	\`body\` text,
  	\`href\` text,
  	\`evidence_id\` integer,
  	\`_uuid\` text,
  	FOREIGN KEY (\`evidence_id\`) REFERENCES \`evidence\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_problems\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_problems_items_order_idx\` ON \`_pages_v_blocks_problems_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_problems_items_parent_id_idx\` ON \`_pages_v_blocks_problems_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_problems_items_evidence_idx\` ON \`_pages_v_blocks_problems_items\` (\`evidence_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_problems\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`title\` text,
  	\`body\` text,
  	\`cta_label\` text,
  	\`cta_href\` text,
  	\`case_study_id\` integer,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`case_study_id\`) REFERENCES \`cases\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_problems_order_idx\` ON \`_pages_v_blocks_problems\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_problems_parent_id_idx\` ON \`_pages_v_blocks_problems\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_problems_path_idx\` ON \`_pages_v_blocks_problems\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_problems_case_study_idx\` ON \`_pages_v_blocks_problems\` (\`case_study_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_system_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`kicker\` text,
  	\`title\` text,
  	\`body\` text,
  	\`href\` text,
  	\`evidence_id\` integer,
  	\`_uuid\` text,
  	FOREIGN KEY (\`evidence_id\`) REFERENCES \`evidence\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_system\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_system_items_order_idx\` ON \`_pages_v_blocks_system_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_system_items_parent_id_idx\` ON \`_pages_v_blocks_system_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_system_items_evidence_idx\` ON \`_pages_v_blocks_system_items\` (\`evidence_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_system\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`title\` text,
  	\`body\` text,
  	\`cta_label\` text,
  	\`cta_href\` text,
  	\`case_study_id\` integer,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`case_study_id\`) REFERENCES \`cases\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_system_order_idx\` ON \`_pages_v_blocks_system\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_system_parent_id_idx\` ON \`_pages_v_blocks_system\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_system_path_idx\` ON \`_pages_v_blocks_system\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_system_case_study_idx\` ON \`_pages_v_blocks_system\` (\`case_study_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_products_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`kicker\` text,
  	\`title\` text,
  	\`body\` text,
  	\`href\` text,
  	\`evidence_id\` integer,
  	\`_uuid\` text,
  	FOREIGN KEY (\`evidence_id\`) REFERENCES \`evidence\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_products\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_products_items_order_idx\` ON \`_pages_v_blocks_products_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_products_items_parent_id_idx\` ON \`_pages_v_blocks_products_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_products_items_evidence_idx\` ON \`_pages_v_blocks_products_items\` (\`evidence_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_products\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`title\` text,
  	\`body\` text,
  	\`cta_label\` text,
  	\`cta_href\` text,
  	\`case_study_id\` integer,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`case_study_id\`) REFERENCES \`cases\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_products_order_idx\` ON \`_pages_v_blocks_products\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_products_parent_id_idx\` ON \`_pages_v_blocks_products\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_products_path_idx\` ON \`_pages_v_blocks_products\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_products_case_study_idx\` ON \`_pages_v_blocks_products\` (\`case_study_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_selector_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`kicker\` text,
  	\`title\` text,
  	\`body\` text,
  	\`href\` text,
  	\`evidence_id\` integer,
  	\`_uuid\` text,
  	FOREIGN KEY (\`evidence_id\`) REFERENCES \`evidence\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_selector\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_selector_items_order_idx\` ON \`_pages_v_blocks_selector_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_selector_items_parent_id_idx\` ON \`_pages_v_blocks_selector_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_selector_items_evidence_idx\` ON \`_pages_v_blocks_selector_items\` (\`evidence_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_selector\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`title\` text,
  	\`body\` text,
  	\`cta_label\` text,
  	\`cta_href\` text,
  	\`case_study_id\` integer,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`case_study_id\`) REFERENCES \`cases\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_selector_order_idx\` ON \`_pages_v_blocks_selector\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_selector_parent_id_idx\` ON \`_pages_v_blocks_selector\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_selector_path_idx\` ON \`_pages_v_blocks_selector\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_selector_case_study_idx\` ON \`_pages_v_blocks_selector\` (\`case_study_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_preview_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`kicker\` text,
  	\`title\` text,
  	\`body\` text,
  	\`href\` text,
  	\`evidence_id\` integer,
  	\`_uuid\` text,
  	FOREIGN KEY (\`evidence_id\`) REFERENCES \`evidence\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_preview\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_preview_items_order_idx\` ON \`_pages_v_blocks_preview_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_preview_items_parent_id_idx\` ON \`_pages_v_blocks_preview_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_preview_items_evidence_idx\` ON \`_pages_v_blocks_preview_items\` (\`evidence_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_preview\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`title\` text,
  	\`body\` text,
  	\`cta_label\` text,
  	\`cta_href\` text,
  	\`case_study_id\` integer,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`case_study_id\`) REFERENCES \`cases\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_preview_order_idx\` ON \`_pages_v_blocks_preview\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_preview_parent_id_idx\` ON \`_pages_v_blocks_preview\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_preview_path_idx\` ON \`_pages_v_blocks_preview\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_preview_case_study_idx\` ON \`_pages_v_blocks_preview\` (\`case_study_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_experts_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`kicker\` text,
  	\`title\` text,
  	\`body\` text,
  	\`href\` text,
  	\`evidence_id\` integer,
  	\`_uuid\` text,
  	FOREIGN KEY (\`evidence_id\`) REFERENCES \`evidence\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_experts\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_experts_items_order_idx\` ON \`_pages_v_blocks_experts_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_experts_items_parent_id_idx\` ON \`_pages_v_blocks_experts_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_experts_items_evidence_idx\` ON \`_pages_v_blocks_experts_items\` (\`evidence_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_experts\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`title\` text,
  	\`body\` text,
  	\`cta_label\` text,
  	\`cta_href\` text,
  	\`case_study_id\` integer,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`case_study_id\`) REFERENCES \`cases\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_experts_order_idx\` ON \`_pages_v_blocks_experts\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_experts_parent_id_idx\` ON \`_pages_v_blocks_experts\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_experts_path_idx\` ON \`_pages_v_blocks_experts\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_experts_case_study_idx\` ON \`_pages_v_blocks_experts\` (\`case_study_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_faq_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`kicker\` text,
  	\`title\` text,
  	\`body\` text,
  	\`href\` text,
  	\`evidence_id\` integer,
  	\`_uuid\` text,
  	FOREIGN KEY (\`evidence_id\`) REFERENCES \`evidence\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_faq\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_faq_items_order_idx\` ON \`_pages_v_blocks_faq_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_faq_items_parent_id_idx\` ON \`_pages_v_blocks_faq_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_faq_items_evidence_idx\` ON \`_pages_v_blocks_faq_items\` (\`evidence_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_faq\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`title\` text,
  	\`body\` text,
  	\`cta_label\` text,
  	\`cta_href\` text,
  	\`case_study_id\` integer,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`case_study_id\`) REFERENCES \`cases\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_faq_order_idx\` ON \`_pages_v_blocks_faq\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_faq_parent_id_idx\` ON \`_pages_v_blocks_faq\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_faq_path_idx\` ON \`_pages_v_blocks_faq\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_faq_case_study_idx\` ON \`_pages_v_blocks_faq\` (\`case_study_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_editorial_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`kicker\` text,
  	\`title\` text,
  	\`body\` text,
  	\`href\` text,
  	\`evidence_id\` integer,
  	\`_uuid\` text,
  	FOREIGN KEY (\`evidence_id\`) REFERENCES \`evidence\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_editorial\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_editorial_items_order_idx\` ON \`_pages_v_blocks_editorial_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_editorial_items_parent_id_idx\` ON \`_pages_v_blocks_editorial_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_editorial_items_evidence_idx\` ON \`_pages_v_blocks_editorial_items\` (\`evidence_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_editorial\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`title\` text,
  	\`body\` text,
  	\`cta_label\` text,
  	\`cta_href\` text,
  	\`case_study_id\` integer,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`case_study_id\`) REFERENCES \`cases\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_editorial_order_idx\` ON \`_pages_v_blocks_editorial\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_editorial_parent_id_idx\` ON \`_pages_v_blocks_editorial\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_editorial_path_idx\` ON \`_pages_v_blocks_editorial\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_editorial_case_study_idx\` ON \`_pages_v_blocks_editorial\` (\`case_study_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_cta_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`kicker\` text,
  	\`title\` text,
  	\`body\` text,
  	\`href\` text,
  	\`evidence_id\` integer,
  	\`_uuid\` text,
  	FOREIGN KEY (\`evidence_id\`) REFERENCES \`evidence\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_cta\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cta_items_order_idx\` ON \`_pages_v_blocks_cta_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cta_items_parent_id_idx\` ON \`_pages_v_blocks_cta_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cta_items_evidence_idx\` ON \`_pages_v_blocks_cta_items\` (\`evidence_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_cta\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`title\` text,
  	\`body\` text,
  	\`cta_label\` text,
  	\`cta_href\` text,
  	\`case_study_id\` integer,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`case_study_id\`) REFERENCES \`cases\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cta_order_idx\` ON \`_pages_v_blocks_cta\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cta_parent_id_idx\` ON \`_pages_v_blocks_cta\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cta_path_idx\` ON \`_pages_v_blocks_cta\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cta_case_study_idx\` ON \`_pages_v_blocks_cta\` (\`case_study_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_path\` text,
  	\`version_eyebrow\` text,
  	\`version_title\` text,
  	\`version_accent\` text,
  	\`version_intro\` text,
  	\`version_cta_label\` text,
  	\`version_cta_href\` text,
  	\`version_secondary_label\` text,
  	\`version_secondary_href\` text,
  	\`version_legal_approved\` integer DEFAULT false,
  	\`version_seo_title\` text,
  	\`version_seo_description\` text,
  	\`version_seo_image_id\` integer,
  	\`version_seo_noindex\` integer DEFAULT false,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_seo_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_parent_idx\` ON \`_pages_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_version_path_idx\` ON \`_pages_v\` (\`version_path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_seo_version_seo_image_idx\` ON \`_pages_v\` (\`version_seo_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_version_updated_at_idx\` ON \`_pages_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_version_created_at_idx\` ON \`_pages_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_version__status_idx\` ON \`_pages_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_created_at_idx\` ON \`_pages_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_updated_at_idx\` ON \`_pages_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_latest_idx\` ON \`_pages_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_autosave_idx\` ON \`_pages_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`experts_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`experts_id\`) REFERENCES \`experts\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_rels_order_idx\` ON \`_pages_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_rels_parent_idx\` ON \`_pages_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_rels_path_idx\` ON \`_pages_v_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_rels_experts_id_idx\` ON \`_pages_v_rels\` (\`experts_id\`);`)
  await db.run(sql`CREATE TABLE \`products_includes\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`body\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`products_includes_order_idx\` ON \`products_includes\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`products_includes_parent_id_idx\` ON \`products_includes\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`products_excludes\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`body\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`products_excludes_order_idx\` ON \`products_excludes\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`products_excludes_parent_id_idx\` ON \`products_excludes\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`products_blocks_story_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`kicker\` text,
  	\`title\` text,
  	\`body\` text,
  	\`href\` text,
  	\`evidence_id\` integer,
  	FOREIGN KEY (\`evidence_id\`) REFERENCES \`evidence\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`products_blocks_story\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`products_blocks_story_items_order_idx\` ON \`products_blocks_story_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`products_blocks_story_items_parent_id_idx\` ON \`products_blocks_story_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`products_blocks_story_items_evidence_idx\` ON \`products_blocks_story_items\` (\`evidence_id\`);`)
  await db.run(sql`CREATE TABLE \`products_blocks_story\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`title\` text,
  	\`body\` text,
  	\`cta_label\` text,
  	\`cta_href\` text,
  	\`case_study_id\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`case_study_id\`) REFERENCES \`cases\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`products_blocks_story_order_idx\` ON \`products_blocks_story\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`products_blocks_story_parent_id_idx\` ON \`products_blocks_story\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`products_blocks_story_path_idx\` ON \`products_blocks_story\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`products_blocks_story_case_study_idx\` ON \`products_blocks_story\` (\`case_study_id\`);`)
  await db.run(sql`CREATE TABLE \`products_blocks_problems_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`kicker\` text,
  	\`title\` text,
  	\`body\` text,
  	\`href\` text,
  	\`evidence_id\` integer,
  	FOREIGN KEY (\`evidence_id\`) REFERENCES \`evidence\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`products_blocks_problems\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`products_blocks_problems_items_order_idx\` ON \`products_blocks_problems_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`products_blocks_problems_items_parent_id_idx\` ON \`products_blocks_problems_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`products_blocks_problems_items_evidence_idx\` ON \`products_blocks_problems_items\` (\`evidence_id\`);`)
  await db.run(sql`CREATE TABLE \`products_blocks_problems\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`title\` text,
  	\`body\` text,
  	\`cta_label\` text,
  	\`cta_href\` text,
  	\`case_study_id\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`case_study_id\`) REFERENCES \`cases\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`products_blocks_problems_order_idx\` ON \`products_blocks_problems\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`products_blocks_problems_parent_id_idx\` ON \`products_blocks_problems\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`products_blocks_problems_path_idx\` ON \`products_blocks_problems\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`products_blocks_problems_case_study_idx\` ON \`products_blocks_problems\` (\`case_study_id\`);`)
  await db.run(sql`CREATE TABLE \`products_blocks_system_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`kicker\` text,
  	\`title\` text,
  	\`body\` text,
  	\`href\` text,
  	\`evidence_id\` integer,
  	FOREIGN KEY (\`evidence_id\`) REFERENCES \`evidence\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`products_blocks_system\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`products_blocks_system_items_order_idx\` ON \`products_blocks_system_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`products_blocks_system_items_parent_id_idx\` ON \`products_blocks_system_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`products_blocks_system_items_evidence_idx\` ON \`products_blocks_system_items\` (\`evidence_id\`);`)
  await db.run(sql`CREATE TABLE \`products_blocks_system\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`title\` text,
  	\`body\` text,
  	\`cta_label\` text,
  	\`cta_href\` text,
  	\`case_study_id\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`case_study_id\`) REFERENCES \`cases\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`products_blocks_system_order_idx\` ON \`products_blocks_system\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`products_blocks_system_parent_id_idx\` ON \`products_blocks_system\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`products_blocks_system_path_idx\` ON \`products_blocks_system\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`products_blocks_system_case_study_idx\` ON \`products_blocks_system\` (\`case_study_id\`);`)
  await db.run(sql`CREATE TABLE \`products_blocks_products_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`kicker\` text,
  	\`title\` text,
  	\`body\` text,
  	\`href\` text,
  	\`evidence_id\` integer,
  	FOREIGN KEY (\`evidence_id\`) REFERENCES \`evidence\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`products_blocks_products\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`products_blocks_products_items_order_idx\` ON \`products_blocks_products_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`products_blocks_products_items_parent_id_idx\` ON \`products_blocks_products_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`products_blocks_products_items_evidence_idx\` ON \`products_blocks_products_items\` (\`evidence_id\`);`)
  await db.run(sql`CREATE TABLE \`products_blocks_products\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`title\` text,
  	\`body\` text,
  	\`cta_label\` text,
  	\`cta_href\` text,
  	\`case_study_id\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`case_study_id\`) REFERENCES \`cases\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`products_blocks_products_order_idx\` ON \`products_blocks_products\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`products_blocks_products_parent_id_idx\` ON \`products_blocks_products\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`products_blocks_products_path_idx\` ON \`products_blocks_products\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`products_blocks_products_case_study_idx\` ON \`products_blocks_products\` (\`case_study_id\`);`)
  await db.run(sql`CREATE TABLE \`products_blocks_selector_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`kicker\` text,
  	\`title\` text,
  	\`body\` text,
  	\`href\` text,
  	\`evidence_id\` integer,
  	FOREIGN KEY (\`evidence_id\`) REFERENCES \`evidence\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`products_blocks_selector\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`products_blocks_selector_items_order_idx\` ON \`products_blocks_selector_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`products_blocks_selector_items_parent_id_idx\` ON \`products_blocks_selector_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`products_blocks_selector_items_evidence_idx\` ON \`products_blocks_selector_items\` (\`evidence_id\`);`)
  await db.run(sql`CREATE TABLE \`products_blocks_selector\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`title\` text,
  	\`body\` text,
  	\`cta_label\` text,
  	\`cta_href\` text,
  	\`case_study_id\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`case_study_id\`) REFERENCES \`cases\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`products_blocks_selector_order_idx\` ON \`products_blocks_selector\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`products_blocks_selector_parent_id_idx\` ON \`products_blocks_selector\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`products_blocks_selector_path_idx\` ON \`products_blocks_selector\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`products_blocks_selector_case_study_idx\` ON \`products_blocks_selector\` (\`case_study_id\`);`)
  await db.run(sql`CREATE TABLE \`products_blocks_preview_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`kicker\` text,
  	\`title\` text,
  	\`body\` text,
  	\`href\` text,
  	\`evidence_id\` integer,
  	FOREIGN KEY (\`evidence_id\`) REFERENCES \`evidence\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`products_blocks_preview\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`products_blocks_preview_items_order_idx\` ON \`products_blocks_preview_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`products_blocks_preview_items_parent_id_idx\` ON \`products_blocks_preview_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`products_blocks_preview_items_evidence_idx\` ON \`products_blocks_preview_items\` (\`evidence_id\`);`)
  await db.run(sql`CREATE TABLE \`products_blocks_preview\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`title\` text,
  	\`body\` text,
  	\`cta_label\` text,
  	\`cta_href\` text,
  	\`case_study_id\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`case_study_id\`) REFERENCES \`cases\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`products_blocks_preview_order_idx\` ON \`products_blocks_preview\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`products_blocks_preview_parent_id_idx\` ON \`products_blocks_preview\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`products_blocks_preview_path_idx\` ON \`products_blocks_preview\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`products_blocks_preview_case_study_idx\` ON \`products_blocks_preview\` (\`case_study_id\`);`)
  await db.run(sql`CREATE TABLE \`products_blocks_experts_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`kicker\` text,
  	\`title\` text,
  	\`body\` text,
  	\`href\` text,
  	\`evidence_id\` integer,
  	FOREIGN KEY (\`evidence_id\`) REFERENCES \`evidence\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`products_blocks_experts\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`products_blocks_experts_items_order_idx\` ON \`products_blocks_experts_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`products_blocks_experts_items_parent_id_idx\` ON \`products_blocks_experts_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`products_blocks_experts_items_evidence_idx\` ON \`products_blocks_experts_items\` (\`evidence_id\`);`)
  await db.run(sql`CREATE TABLE \`products_blocks_experts\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`title\` text,
  	\`body\` text,
  	\`cta_label\` text,
  	\`cta_href\` text,
  	\`case_study_id\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`case_study_id\`) REFERENCES \`cases\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`products_blocks_experts_order_idx\` ON \`products_blocks_experts\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`products_blocks_experts_parent_id_idx\` ON \`products_blocks_experts\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`products_blocks_experts_path_idx\` ON \`products_blocks_experts\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`products_blocks_experts_case_study_idx\` ON \`products_blocks_experts\` (\`case_study_id\`);`)
  await db.run(sql`CREATE TABLE \`products_blocks_faq_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`kicker\` text,
  	\`title\` text,
  	\`body\` text,
  	\`href\` text,
  	\`evidence_id\` integer,
  	FOREIGN KEY (\`evidence_id\`) REFERENCES \`evidence\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`products_blocks_faq\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`products_blocks_faq_items_order_idx\` ON \`products_blocks_faq_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`products_blocks_faq_items_parent_id_idx\` ON \`products_blocks_faq_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`products_blocks_faq_items_evidence_idx\` ON \`products_blocks_faq_items\` (\`evidence_id\`);`)
  await db.run(sql`CREATE TABLE \`products_blocks_faq\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`title\` text,
  	\`body\` text,
  	\`cta_label\` text,
  	\`cta_href\` text,
  	\`case_study_id\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`case_study_id\`) REFERENCES \`cases\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`products_blocks_faq_order_idx\` ON \`products_blocks_faq\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`products_blocks_faq_parent_id_idx\` ON \`products_blocks_faq\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`products_blocks_faq_path_idx\` ON \`products_blocks_faq\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`products_blocks_faq_case_study_idx\` ON \`products_blocks_faq\` (\`case_study_id\`);`)
  await db.run(sql`CREATE TABLE \`products_blocks_editorial_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`kicker\` text,
  	\`title\` text,
  	\`body\` text,
  	\`href\` text,
  	\`evidence_id\` integer,
  	FOREIGN KEY (\`evidence_id\`) REFERENCES \`evidence\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`products_blocks_editorial\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`products_blocks_editorial_items_order_idx\` ON \`products_blocks_editorial_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`products_blocks_editorial_items_parent_id_idx\` ON \`products_blocks_editorial_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`products_blocks_editorial_items_evidence_idx\` ON \`products_blocks_editorial_items\` (\`evidence_id\`);`)
  await db.run(sql`CREATE TABLE \`products_blocks_editorial\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`title\` text,
  	\`body\` text,
  	\`cta_label\` text,
  	\`cta_href\` text,
  	\`case_study_id\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`case_study_id\`) REFERENCES \`cases\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`products_blocks_editorial_order_idx\` ON \`products_blocks_editorial\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`products_blocks_editorial_parent_id_idx\` ON \`products_blocks_editorial\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`products_blocks_editorial_path_idx\` ON \`products_blocks_editorial\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`products_blocks_editorial_case_study_idx\` ON \`products_blocks_editorial\` (\`case_study_id\`);`)
  await db.run(sql`CREATE TABLE \`products_blocks_cta_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`kicker\` text,
  	\`title\` text,
  	\`body\` text,
  	\`href\` text,
  	\`evidence_id\` integer,
  	FOREIGN KEY (\`evidence_id\`) REFERENCES \`evidence\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`products_blocks_cta\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`products_blocks_cta_items_order_idx\` ON \`products_blocks_cta_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`products_blocks_cta_items_parent_id_idx\` ON \`products_blocks_cta_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`products_blocks_cta_items_evidence_idx\` ON \`products_blocks_cta_items\` (\`evidence_id\`);`)
  await db.run(sql`CREATE TABLE \`products_blocks_cta\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`title\` text,
  	\`body\` text,
  	\`cta_label\` text,
  	\`cta_href\` text,
  	\`case_study_id\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`case_study_id\`) REFERENCES \`cases\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`products_blocks_cta_order_idx\` ON \`products_blocks_cta\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`products_blocks_cta_parent_id_idx\` ON \`products_blocks_cta\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`products_blocks_cta_path_idx\` ON \`products_blocks_cta\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`products_blocks_cta_case_study_idx\` ON \`products_blocks_cta\` (\`case_study_id\`);`)
  await db.run(sql`CREATE TABLE \`products\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`slug\` text,
  	\`name\` text,
  	\`eyebrow\` text,
  	\`title\` text,
  	\`intro\` text,
  	\`responsibility\` text,
  	\`delivery\` text,
  	\`price_label\` text,
  	\`price_huf\` numeric,
  	\`vat_percent\` numeric,
  	\`business_approved\` integer DEFAULT false,
  	\`access_duration\` text,
  	\`review_rounds\` numeric,
  	\`implementation_days\` numeric,
  	\`cta_label\` text,
  	\`cta_href\` text,
  	\`seo_title\` text,
  	\`seo_description\` text,
  	\`seo_image_id\` integer,
  	\`seo_noindex\` integer DEFAULT false,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`seo_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`products_slug_idx\` ON \`products\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`products_seo_seo_image_idx\` ON \`products\` (\`seo_image_id\`);`)
  await db.run(sql`CREATE INDEX \`products_updated_at_idx\` ON \`products\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`products_created_at_idx\` ON \`products\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`products__status_idx\` ON \`products\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`products_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`experts_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`experts_id\`) REFERENCES \`experts\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`products_rels_order_idx\` ON \`products_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`products_rels_parent_idx\` ON \`products_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`products_rels_path_idx\` ON \`products_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`products_rels_experts_id_idx\` ON \`products_rels\` (\`experts_id\`);`)
  await db.run(sql`CREATE TABLE \`_products_v_version_includes\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`body\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_products_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_products_v_version_includes_order_idx\` ON \`_products_v_version_includes\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_version_includes_parent_id_idx\` ON \`_products_v_version_includes\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_products_v_version_excludes\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`body\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_products_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_products_v_version_excludes_order_idx\` ON \`_products_v_version_excludes\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_version_excludes_parent_id_idx\` ON \`_products_v_version_excludes\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_products_v_blocks_story_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`kicker\` text,
  	\`title\` text,
  	\`body\` text,
  	\`href\` text,
  	\`evidence_id\` integer,
  	\`_uuid\` text,
  	FOREIGN KEY (\`evidence_id\`) REFERENCES \`evidence\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_products_v_blocks_story\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_story_items_order_idx\` ON \`_products_v_blocks_story_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_story_items_parent_id_idx\` ON \`_products_v_blocks_story_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_story_items_evidence_idx\` ON \`_products_v_blocks_story_items\` (\`evidence_id\`);`)
  await db.run(sql`CREATE TABLE \`_products_v_blocks_story\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`title\` text,
  	\`body\` text,
  	\`cta_label\` text,
  	\`cta_href\` text,
  	\`case_study_id\` integer,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`case_study_id\`) REFERENCES \`cases\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_products_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_story_order_idx\` ON \`_products_v_blocks_story\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_story_parent_id_idx\` ON \`_products_v_blocks_story\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_story_path_idx\` ON \`_products_v_blocks_story\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_story_case_study_idx\` ON \`_products_v_blocks_story\` (\`case_study_id\`);`)
  await db.run(sql`CREATE TABLE \`_products_v_blocks_problems_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`kicker\` text,
  	\`title\` text,
  	\`body\` text,
  	\`href\` text,
  	\`evidence_id\` integer,
  	\`_uuid\` text,
  	FOREIGN KEY (\`evidence_id\`) REFERENCES \`evidence\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_products_v_blocks_problems\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_problems_items_order_idx\` ON \`_products_v_blocks_problems_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_problems_items_parent_id_idx\` ON \`_products_v_blocks_problems_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_problems_items_evidence_idx\` ON \`_products_v_blocks_problems_items\` (\`evidence_id\`);`)
  await db.run(sql`CREATE TABLE \`_products_v_blocks_problems\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`title\` text,
  	\`body\` text,
  	\`cta_label\` text,
  	\`cta_href\` text,
  	\`case_study_id\` integer,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`case_study_id\`) REFERENCES \`cases\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_products_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_problems_order_idx\` ON \`_products_v_blocks_problems\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_problems_parent_id_idx\` ON \`_products_v_blocks_problems\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_problems_path_idx\` ON \`_products_v_blocks_problems\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_problems_case_study_idx\` ON \`_products_v_blocks_problems\` (\`case_study_id\`);`)
  await db.run(sql`CREATE TABLE \`_products_v_blocks_system_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`kicker\` text,
  	\`title\` text,
  	\`body\` text,
  	\`href\` text,
  	\`evidence_id\` integer,
  	\`_uuid\` text,
  	FOREIGN KEY (\`evidence_id\`) REFERENCES \`evidence\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_products_v_blocks_system\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_system_items_order_idx\` ON \`_products_v_blocks_system_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_system_items_parent_id_idx\` ON \`_products_v_blocks_system_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_system_items_evidence_idx\` ON \`_products_v_blocks_system_items\` (\`evidence_id\`);`)
  await db.run(sql`CREATE TABLE \`_products_v_blocks_system\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`title\` text,
  	\`body\` text,
  	\`cta_label\` text,
  	\`cta_href\` text,
  	\`case_study_id\` integer,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`case_study_id\`) REFERENCES \`cases\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_products_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_system_order_idx\` ON \`_products_v_blocks_system\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_system_parent_id_idx\` ON \`_products_v_blocks_system\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_system_path_idx\` ON \`_products_v_blocks_system\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_system_case_study_idx\` ON \`_products_v_blocks_system\` (\`case_study_id\`);`)
  await db.run(sql`CREATE TABLE \`_products_v_blocks_products_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`kicker\` text,
  	\`title\` text,
  	\`body\` text,
  	\`href\` text,
  	\`evidence_id\` integer,
  	\`_uuid\` text,
  	FOREIGN KEY (\`evidence_id\`) REFERENCES \`evidence\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_products_v_blocks_products\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_products_items_order_idx\` ON \`_products_v_blocks_products_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_products_items_parent_id_idx\` ON \`_products_v_blocks_products_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_products_items_evidence_idx\` ON \`_products_v_blocks_products_items\` (\`evidence_id\`);`)
  await db.run(sql`CREATE TABLE \`_products_v_blocks_products\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`title\` text,
  	\`body\` text,
  	\`cta_label\` text,
  	\`cta_href\` text,
  	\`case_study_id\` integer,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`case_study_id\`) REFERENCES \`cases\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_products_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_products_order_idx\` ON \`_products_v_blocks_products\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_products_parent_id_idx\` ON \`_products_v_blocks_products\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_products_path_idx\` ON \`_products_v_blocks_products\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_products_case_study_idx\` ON \`_products_v_blocks_products\` (\`case_study_id\`);`)
  await db.run(sql`CREATE TABLE \`_products_v_blocks_selector_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`kicker\` text,
  	\`title\` text,
  	\`body\` text,
  	\`href\` text,
  	\`evidence_id\` integer,
  	\`_uuid\` text,
  	FOREIGN KEY (\`evidence_id\`) REFERENCES \`evidence\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_products_v_blocks_selector\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_selector_items_order_idx\` ON \`_products_v_blocks_selector_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_selector_items_parent_id_idx\` ON \`_products_v_blocks_selector_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_selector_items_evidence_idx\` ON \`_products_v_blocks_selector_items\` (\`evidence_id\`);`)
  await db.run(sql`CREATE TABLE \`_products_v_blocks_selector\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`title\` text,
  	\`body\` text,
  	\`cta_label\` text,
  	\`cta_href\` text,
  	\`case_study_id\` integer,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`case_study_id\`) REFERENCES \`cases\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_products_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_selector_order_idx\` ON \`_products_v_blocks_selector\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_selector_parent_id_idx\` ON \`_products_v_blocks_selector\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_selector_path_idx\` ON \`_products_v_blocks_selector\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_selector_case_study_idx\` ON \`_products_v_blocks_selector\` (\`case_study_id\`);`)
  await db.run(sql`CREATE TABLE \`_products_v_blocks_preview_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`kicker\` text,
  	\`title\` text,
  	\`body\` text,
  	\`href\` text,
  	\`evidence_id\` integer,
  	\`_uuid\` text,
  	FOREIGN KEY (\`evidence_id\`) REFERENCES \`evidence\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_products_v_blocks_preview\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_preview_items_order_idx\` ON \`_products_v_blocks_preview_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_preview_items_parent_id_idx\` ON \`_products_v_blocks_preview_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_preview_items_evidence_idx\` ON \`_products_v_blocks_preview_items\` (\`evidence_id\`);`)
  await db.run(sql`CREATE TABLE \`_products_v_blocks_preview\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`title\` text,
  	\`body\` text,
  	\`cta_label\` text,
  	\`cta_href\` text,
  	\`case_study_id\` integer,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`case_study_id\`) REFERENCES \`cases\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_products_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_preview_order_idx\` ON \`_products_v_blocks_preview\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_preview_parent_id_idx\` ON \`_products_v_blocks_preview\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_preview_path_idx\` ON \`_products_v_blocks_preview\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_preview_case_study_idx\` ON \`_products_v_blocks_preview\` (\`case_study_id\`);`)
  await db.run(sql`CREATE TABLE \`_products_v_blocks_experts_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`kicker\` text,
  	\`title\` text,
  	\`body\` text,
  	\`href\` text,
  	\`evidence_id\` integer,
  	\`_uuid\` text,
  	FOREIGN KEY (\`evidence_id\`) REFERENCES \`evidence\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_products_v_blocks_experts\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_experts_items_order_idx\` ON \`_products_v_blocks_experts_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_experts_items_parent_id_idx\` ON \`_products_v_blocks_experts_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_experts_items_evidence_idx\` ON \`_products_v_blocks_experts_items\` (\`evidence_id\`);`)
  await db.run(sql`CREATE TABLE \`_products_v_blocks_experts\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`title\` text,
  	\`body\` text,
  	\`cta_label\` text,
  	\`cta_href\` text,
  	\`case_study_id\` integer,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`case_study_id\`) REFERENCES \`cases\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_products_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_experts_order_idx\` ON \`_products_v_blocks_experts\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_experts_parent_id_idx\` ON \`_products_v_blocks_experts\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_experts_path_idx\` ON \`_products_v_blocks_experts\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_experts_case_study_idx\` ON \`_products_v_blocks_experts\` (\`case_study_id\`);`)
  await db.run(sql`CREATE TABLE \`_products_v_blocks_faq_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`kicker\` text,
  	\`title\` text,
  	\`body\` text,
  	\`href\` text,
  	\`evidence_id\` integer,
  	\`_uuid\` text,
  	FOREIGN KEY (\`evidence_id\`) REFERENCES \`evidence\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_products_v_blocks_faq\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_faq_items_order_idx\` ON \`_products_v_blocks_faq_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_faq_items_parent_id_idx\` ON \`_products_v_blocks_faq_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_faq_items_evidence_idx\` ON \`_products_v_blocks_faq_items\` (\`evidence_id\`);`)
  await db.run(sql`CREATE TABLE \`_products_v_blocks_faq\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`title\` text,
  	\`body\` text,
  	\`cta_label\` text,
  	\`cta_href\` text,
  	\`case_study_id\` integer,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`case_study_id\`) REFERENCES \`cases\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_products_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_faq_order_idx\` ON \`_products_v_blocks_faq\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_faq_parent_id_idx\` ON \`_products_v_blocks_faq\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_faq_path_idx\` ON \`_products_v_blocks_faq\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_faq_case_study_idx\` ON \`_products_v_blocks_faq\` (\`case_study_id\`);`)
  await db.run(sql`CREATE TABLE \`_products_v_blocks_editorial_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`kicker\` text,
  	\`title\` text,
  	\`body\` text,
  	\`href\` text,
  	\`evidence_id\` integer,
  	\`_uuid\` text,
  	FOREIGN KEY (\`evidence_id\`) REFERENCES \`evidence\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_products_v_blocks_editorial\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_editorial_items_order_idx\` ON \`_products_v_blocks_editorial_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_editorial_items_parent_id_idx\` ON \`_products_v_blocks_editorial_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_editorial_items_evidence_idx\` ON \`_products_v_blocks_editorial_items\` (\`evidence_id\`);`)
  await db.run(sql`CREATE TABLE \`_products_v_blocks_editorial\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`title\` text,
  	\`body\` text,
  	\`cta_label\` text,
  	\`cta_href\` text,
  	\`case_study_id\` integer,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`case_study_id\`) REFERENCES \`cases\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_products_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_editorial_order_idx\` ON \`_products_v_blocks_editorial\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_editorial_parent_id_idx\` ON \`_products_v_blocks_editorial\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_editorial_path_idx\` ON \`_products_v_blocks_editorial\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_editorial_case_study_idx\` ON \`_products_v_blocks_editorial\` (\`case_study_id\`);`)
  await db.run(sql`CREATE TABLE \`_products_v_blocks_cta_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`kicker\` text,
  	\`title\` text,
  	\`body\` text,
  	\`href\` text,
  	\`evidence_id\` integer,
  	\`_uuid\` text,
  	FOREIGN KEY (\`evidence_id\`) REFERENCES \`evidence\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_products_v_blocks_cta\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_cta_items_order_idx\` ON \`_products_v_blocks_cta_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_cta_items_parent_id_idx\` ON \`_products_v_blocks_cta_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_cta_items_evidence_idx\` ON \`_products_v_blocks_cta_items\` (\`evidence_id\`);`)
  await db.run(sql`CREATE TABLE \`_products_v_blocks_cta\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`title\` text,
  	\`body\` text,
  	\`cta_label\` text,
  	\`cta_href\` text,
  	\`case_study_id\` integer,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`case_study_id\`) REFERENCES \`cases\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_products_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_cta_order_idx\` ON \`_products_v_blocks_cta\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_cta_parent_id_idx\` ON \`_products_v_blocks_cta\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_cta_path_idx\` ON \`_products_v_blocks_cta\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_cta_case_study_idx\` ON \`_products_v_blocks_cta\` (\`case_study_id\`);`)
  await db.run(sql`CREATE TABLE \`_products_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_slug\` text,
  	\`version_name\` text,
  	\`version_eyebrow\` text,
  	\`version_title\` text,
  	\`version_intro\` text,
  	\`version_responsibility\` text,
  	\`version_delivery\` text,
  	\`version_price_label\` text,
  	\`version_price_huf\` numeric,
  	\`version_vat_percent\` numeric,
  	\`version_business_approved\` integer DEFAULT false,
  	\`version_access_duration\` text,
  	\`version_review_rounds\` numeric,
  	\`version_implementation_days\` numeric,
  	\`version_cta_label\` text,
  	\`version_cta_href\` text,
  	\`version_seo_title\` text,
  	\`version_seo_description\` text,
  	\`version_seo_image_id\` integer,
  	\`version_seo_noindex\` integer DEFAULT false,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_seo_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_products_v_parent_idx\` ON \`_products_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_version_version_slug_idx\` ON \`_products_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_version_seo_version_seo_image_idx\` ON \`_products_v\` (\`version_seo_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_version_version_updated_at_idx\` ON \`_products_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_version_version_created_at_idx\` ON \`_products_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_version_version__status_idx\` ON \`_products_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_created_at_idx\` ON \`_products_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_updated_at_idx\` ON \`_products_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_latest_idx\` ON \`_products_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_autosave_idx\` ON \`_products_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`_products_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`experts_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_products_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`experts_id\`) REFERENCES \`experts\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_products_v_rels_order_idx\` ON \`_products_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_rels_parent_idx\` ON \`_products_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_rels_path_idx\` ON \`_products_v_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_rels_experts_id_idx\` ON \`_products_v_rels\` (\`experts_id\`);`)
  await db.run(sql`CREATE TABLE \`cases_chapters\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`kicker\` text,
  	\`title\` text,
  	\`body\` text,
  	\`media_id\` integer,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`cases\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`cases_chapters_order_idx\` ON \`cases_chapters\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`cases_chapters_parent_id_idx\` ON \`cases_chapters\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`cases_chapters_media_idx\` ON \`cases_chapters\` (\`media_id\`);`)
  await db.run(sql`CREATE TABLE \`cases_capabilities\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`tasks\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`cases\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`cases_capabilities_order_idx\` ON \`cases_capabilities\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`cases_capabilities_parent_id_idx\` ON \`cases_capabilities\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`cases\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`slug\` text,
  	\`client\` text,
  	\`industry\` text,
  	\`title\` text,
  	\`intro\` text,
  	\`context\` text,
  	\`source\` text,
  	\`approval\` text DEFAULT 'pending',
  	\`approved_by\` text,
  	\`approved_at\` text,
  	\`logo_id\` integer,
  	\`cta_label\` text,
  	\`cta_href\` text,
  	\`seo_title\` text,
  	\`seo_description\` text,
  	\`seo_image_id\` integer,
  	\`seo_noindex\` integer DEFAULT false,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`seo_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`cases_logo_idx\` ON \`cases\` (\`logo_id\`);`)
  await db.run(sql`CREATE INDEX \`cases_seo_seo_image_idx\` ON \`cases\` (\`seo_image_id\`);`)
  await db.run(sql`CREATE INDEX \`cases_updated_at_idx\` ON \`cases\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`cases_created_at_idx\` ON \`cases\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`cases__status_idx\` ON \`cases\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`cases_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`evidence_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`cases\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`evidence_id\`) REFERENCES \`evidence\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`cases_rels_order_idx\` ON \`cases_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`cases_rels_parent_idx\` ON \`cases_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`cases_rels_path_idx\` ON \`cases_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`cases_rels_evidence_id_idx\` ON \`cases_rels\` (\`evidence_id\`);`)
  await db.run(sql`CREATE TABLE \`_cases_v_version_chapters\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`kicker\` text,
  	\`title\` text,
  	\`body\` text,
  	\`media_id\` integer,
  	\`_uuid\` text,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_cases_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_cases_v_version_chapters_order_idx\` ON \`_cases_v_version_chapters\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_cases_v_version_chapters_parent_id_idx\` ON \`_cases_v_version_chapters\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_cases_v_version_chapters_media_idx\` ON \`_cases_v_version_chapters\` (\`media_id\`);`)
  await db.run(sql`CREATE TABLE \`_cases_v_version_capabilities\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`tasks\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_cases_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_cases_v_version_capabilities_order_idx\` ON \`_cases_v_version_capabilities\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_cases_v_version_capabilities_parent_id_idx\` ON \`_cases_v_version_capabilities\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_cases_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_slug\` text,
  	\`version_client\` text,
  	\`version_industry\` text,
  	\`version_title\` text,
  	\`version_intro\` text,
  	\`version_context\` text,
  	\`version_source\` text,
  	\`version_approval\` text DEFAULT 'pending',
  	\`version_approved_by\` text,
  	\`version_approved_at\` text,
  	\`version_logo_id\` integer,
  	\`version_cta_label\` text,
  	\`version_cta_href\` text,
  	\`version_seo_title\` text,
  	\`version_seo_description\` text,
  	\`version_seo_image_id\` integer,
  	\`version_seo_noindex\` integer DEFAULT false,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`cases\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_seo_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_cases_v_parent_idx\` ON \`_cases_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_cases_v_version_version_logo_idx\` ON \`_cases_v\` (\`version_logo_id\`);`)
  await db.run(sql`CREATE INDEX \`_cases_v_version_seo_version_seo_image_idx\` ON \`_cases_v\` (\`version_seo_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_cases_v_version_version_updated_at_idx\` ON \`_cases_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_cases_v_version_version_created_at_idx\` ON \`_cases_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_cases_v_version_version__status_idx\` ON \`_cases_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_cases_v_created_at_idx\` ON \`_cases_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_cases_v_updated_at_idx\` ON \`_cases_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_cases_v_latest_idx\` ON \`_cases_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_cases_v_autosave_idx\` ON \`_cases_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`_cases_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`evidence_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_cases_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`evidence_id\`) REFERENCES \`evidence\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_cases_v_rels_order_idx\` ON \`_cases_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_cases_v_rels_parent_idx\` ON \`_cases_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_cases_v_rels_path_idx\` ON \`_cases_v_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`_cases_v_rels_evidence_id_idx\` ON \`_cases_v_rels\` (\`evidence_id\`);`)
  await db.run(sql`CREATE TABLE \`evidence\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`kind\` text,
  	\`body\` text,
  	\`source\` text,
  	\`approval\` text DEFAULT 'pending',
  	\`approved_by\` text,
  	\`approved_at\` text,
  	\`case_study_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`case_study_id\`) REFERENCES \`cases\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`evidence_case_study_idx\` ON \`evidence\` (\`case_study_id\`);`)
  await db.run(sql`CREATE INDEX \`evidence_updated_at_idx\` ON \`evidence\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`evidence_created_at_idx\` ON \`evidence\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`evidence__status_idx\` ON \`evidence\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`evidence_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`media_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`evidence\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`evidence_rels_order_idx\` ON \`evidence_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`evidence_rels_parent_idx\` ON \`evidence_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`evidence_rels_path_idx\` ON \`evidence_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`evidence_rels_media_id_idx\` ON \`evidence_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE TABLE \`_evidence_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_title\` text,
  	\`version_kind\` text,
  	\`version_body\` text,
  	\`version_source\` text,
  	\`version_approval\` text DEFAULT 'pending',
  	\`version_approved_by\` text,
  	\`version_approved_at\` text,
  	\`version_case_study_id\` integer,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`evidence\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_case_study_id\`) REFERENCES \`cases\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_evidence_v_parent_idx\` ON \`_evidence_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_evidence_v_version_version_case_study_idx\` ON \`_evidence_v\` (\`version_case_study_id\`);`)
  await db.run(sql`CREATE INDEX \`_evidence_v_version_version_updated_at_idx\` ON \`_evidence_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_evidence_v_version_version_created_at_idx\` ON \`_evidence_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_evidence_v_version_version__status_idx\` ON \`_evidence_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_evidence_v_created_at_idx\` ON \`_evidence_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_evidence_v_updated_at_idx\` ON \`_evidence_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_evidence_v_latest_idx\` ON \`_evidence_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_evidence_v_autosave_idx\` ON \`_evidence_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`_evidence_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`media_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_evidence_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_evidence_v_rels_order_idx\` ON \`_evidence_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_evidence_v_rels_parent_idx\` ON \`_evidence_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_evidence_v_rels_path_idx\` ON \`_evidence_v_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`_evidence_v_rels_media_id_idx\` ON \`_evidence_v_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE TABLE \`articles_blocks_story_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`kicker\` text,
  	\`title\` text,
  	\`body\` text,
  	\`href\` text,
  	\`evidence_id\` integer,
  	FOREIGN KEY (\`evidence_id\`) REFERENCES \`evidence\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`articles_blocks_story\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`articles_blocks_story_items_order_idx\` ON \`articles_blocks_story_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_story_items_parent_id_idx\` ON \`articles_blocks_story_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_story_items_evidence_idx\` ON \`articles_blocks_story_items\` (\`evidence_id\`);`)
  await db.run(sql`CREATE TABLE \`articles_blocks_story\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`title\` text,
  	\`body\` text,
  	\`cta_label\` text,
  	\`cta_href\` text,
  	\`case_study_id\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`case_study_id\`) REFERENCES \`cases\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`articles\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`articles_blocks_story_order_idx\` ON \`articles_blocks_story\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_story_parent_id_idx\` ON \`articles_blocks_story\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_story_path_idx\` ON \`articles_blocks_story\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_story_case_study_idx\` ON \`articles_blocks_story\` (\`case_study_id\`);`)
  await db.run(sql`CREATE TABLE \`articles_blocks_problems_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`kicker\` text,
  	\`title\` text,
  	\`body\` text,
  	\`href\` text,
  	\`evidence_id\` integer,
  	FOREIGN KEY (\`evidence_id\`) REFERENCES \`evidence\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`articles_blocks_problems\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`articles_blocks_problems_items_order_idx\` ON \`articles_blocks_problems_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_problems_items_parent_id_idx\` ON \`articles_blocks_problems_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_problems_items_evidence_idx\` ON \`articles_blocks_problems_items\` (\`evidence_id\`);`)
  await db.run(sql`CREATE TABLE \`articles_blocks_problems\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`title\` text,
  	\`body\` text,
  	\`cta_label\` text,
  	\`cta_href\` text,
  	\`case_study_id\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`case_study_id\`) REFERENCES \`cases\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`articles\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`articles_blocks_problems_order_idx\` ON \`articles_blocks_problems\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_problems_parent_id_idx\` ON \`articles_blocks_problems\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_problems_path_idx\` ON \`articles_blocks_problems\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_problems_case_study_idx\` ON \`articles_blocks_problems\` (\`case_study_id\`);`)
  await db.run(sql`CREATE TABLE \`articles_blocks_system_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`kicker\` text,
  	\`title\` text,
  	\`body\` text,
  	\`href\` text,
  	\`evidence_id\` integer,
  	FOREIGN KEY (\`evidence_id\`) REFERENCES \`evidence\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`articles_blocks_system\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`articles_blocks_system_items_order_idx\` ON \`articles_blocks_system_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_system_items_parent_id_idx\` ON \`articles_blocks_system_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_system_items_evidence_idx\` ON \`articles_blocks_system_items\` (\`evidence_id\`);`)
  await db.run(sql`CREATE TABLE \`articles_blocks_system\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`title\` text,
  	\`body\` text,
  	\`cta_label\` text,
  	\`cta_href\` text,
  	\`case_study_id\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`case_study_id\`) REFERENCES \`cases\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`articles\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`articles_blocks_system_order_idx\` ON \`articles_blocks_system\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_system_parent_id_idx\` ON \`articles_blocks_system\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_system_path_idx\` ON \`articles_blocks_system\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_system_case_study_idx\` ON \`articles_blocks_system\` (\`case_study_id\`);`)
  await db.run(sql`CREATE TABLE \`articles_blocks_products_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`kicker\` text,
  	\`title\` text,
  	\`body\` text,
  	\`href\` text,
  	\`evidence_id\` integer,
  	FOREIGN KEY (\`evidence_id\`) REFERENCES \`evidence\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`articles_blocks_products\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`articles_blocks_products_items_order_idx\` ON \`articles_blocks_products_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_products_items_parent_id_idx\` ON \`articles_blocks_products_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_products_items_evidence_idx\` ON \`articles_blocks_products_items\` (\`evidence_id\`);`)
  await db.run(sql`CREATE TABLE \`articles_blocks_products\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`title\` text,
  	\`body\` text,
  	\`cta_label\` text,
  	\`cta_href\` text,
  	\`case_study_id\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`case_study_id\`) REFERENCES \`cases\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`articles\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`articles_blocks_products_order_idx\` ON \`articles_blocks_products\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_products_parent_id_idx\` ON \`articles_blocks_products\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_products_path_idx\` ON \`articles_blocks_products\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_products_case_study_idx\` ON \`articles_blocks_products\` (\`case_study_id\`);`)
  await db.run(sql`CREATE TABLE \`articles_blocks_selector_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`kicker\` text,
  	\`title\` text,
  	\`body\` text,
  	\`href\` text,
  	\`evidence_id\` integer,
  	FOREIGN KEY (\`evidence_id\`) REFERENCES \`evidence\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`articles_blocks_selector\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`articles_blocks_selector_items_order_idx\` ON \`articles_blocks_selector_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_selector_items_parent_id_idx\` ON \`articles_blocks_selector_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_selector_items_evidence_idx\` ON \`articles_blocks_selector_items\` (\`evidence_id\`);`)
  await db.run(sql`CREATE TABLE \`articles_blocks_selector\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`title\` text,
  	\`body\` text,
  	\`cta_label\` text,
  	\`cta_href\` text,
  	\`case_study_id\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`case_study_id\`) REFERENCES \`cases\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`articles\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`articles_blocks_selector_order_idx\` ON \`articles_blocks_selector\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_selector_parent_id_idx\` ON \`articles_blocks_selector\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_selector_path_idx\` ON \`articles_blocks_selector\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_selector_case_study_idx\` ON \`articles_blocks_selector\` (\`case_study_id\`);`)
  await db.run(sql`CREATE TABLE \`articles_blocks_preview_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`kicker\` text,
  	\`title\` text,
  	\`body\` text,
  	\`href\` text,
  	\`evidence_id\` integer,
  	FOREIGN KEY (\`evidence_id\`) REFERENCES \`evidence\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`articles_blocks_preview\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`articles_blocks_preview_items_order_idx\` ON \`articles_blocks_preview_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_preview_items_parent_id_idx\` ON \`articles_blocks_preview_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_preview_items_evidence_idx\` ON \`articles_blocks_preview_items\` (\`evidence_id\`);`)
  await db.run(sql`CREATE TABLE \`articles_blocks_preview\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`title\` text,
  	\`body\` text,
  	\`cta_label\` text,
  	\`cta_href\` text,
  	\`case_study_id\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`case_study_id\`) REFERENCES \`cases\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`articles\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`articles_blocks_preview_order_idx\` ON \`articles_blocks_preview\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_preview_parent_id_idx\` ON \`articles_blocks_preview\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_preview_path_idx\` ON \`articles_blocks_preview\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_preview_case_study_idx\` ON \`articles_blocks_preview\` (\`case_study_id\`);`)
  await db.run(sql`CREATE TABLE \`articles_blocks_experts_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`kicker\` text,
  	\`title\` text,
  	\`body\` text,
  	\`href\` text,
  	\`evidence_id\` integer,
  	FOREIGN KEY (\`evidence_id\`) REFERENCES \`evidence\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`articles_blocks_experts\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`articles_blocks_experts_items_order_idx\` ON \`articles_blocks_experts_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_experts_items_parent_id_idx\` ON \`articles_blocks_experts_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_experts_items_evidence_idx\` ON \`articles_blocks_experts_items\` (\`evidence_id\`);`)
  await db.run(sql`CREATE TABLE \`articles_blocks_experts\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`title\` text,
  	\`body\` text,
  	\`cta_label\` text,
  	\`cta_href\` text,
  	\`case_study_id\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`case_study_id\`) REFERENCES \`cases\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`articles\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`articles_blocks_experts_order_idx\` ON \`articles_blocks_experts\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_experts_parent_id_idx\` ON \`articles_blocks_experts\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_experts_path_idx\` ON \`articles_blocks_experts\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_experts_case_study_idx\` ON \`articles_blocks_experts\` (\`case_study_id\`);`)
  await db.run(sql`CREATE TABLE \`articles_blocks_faq_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`kicker\` text,
  	\`title\` text,
  	\`body\` text,
  	\`href\` text,
  	\`evidence_id\` integer,
  	FOREIGN KEY (\`evidence_id\`) REFERENCES \`evidence\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`articles_blocks_faq\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`articles_blocks_faq_items_order_idx\` ON \`articles_blocks_faq_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_faq_items_parent_id_idx\` ON \`articles_blocks_faq_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_faq_items_evidence_idx\` ON \`articles_blocks_faq_items\` (\`evidence_id\`);`)
  await db.run(sql`CREATE TABLE \`articles_blocks_faq\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`title\` text,
  	\`body\` text,
  	\`cta_label\` text,
  	\`cta_href\` text,
  	\`case_study_id\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`case_study_id\`) REFERENCES \`cases\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`articles\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`articles_blocks_faq_order_idx\` ON \`articles_blocks_faq\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_faq_parent_id_idx\` ON \`articles_blocks_faq\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_faq_path_idx\` ON \`articles_blocks_faq\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_faq_case_study_idx\` ON \`articles_blocks_faq\` (\`case_study_id\`);`)
  await db.run(sql`CREATE TABLE \`articles_blocks_editorial_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`kicker\` text,
  	\`title\` text,
  	\`body\` text,
  	\`href\` text,
  	\`evidence_id\` integer,
  	FOREIGN KEY (\`evidence_id\`) REFERENCES \`evidence\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`articles_blocks_editorial\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`articles_blocks_editorial_items_order_idx\` ON \`articles_blocks_editorial_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_editorial_items_parent_id_idx\` ON \`articles_blocks_editorial_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_editorial_items_evidence_idx\` ON \`articles_blocks_editorial_items\` (\`evidence_id\`);`)
  await db.run(sql`CREATE TABLE \`articles_blocks_editorial\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`title\` text,
  	\`body\` text,
  	\`cta_label\` text,
  	\`cta_href\` text,
  	\`case_study_id\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`case_study_id\`) REFERENCES \`cases\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`articles\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`articles_blocks_editorial_order_idx\` ON \`articles_blocks_editorial\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_editorial_parent_id_idx\` ON \`articles_blocks_editorial\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_editorial_path_idx\` ON \`articles_blocks_editorial\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_editorial_case_study_idx\` ON \`articles_blocks_editorial\` (\`case_study_id\`);`)
  await db.run(sql`CREATE TABLE \`articles_blocks_cta_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`kicker\` text,
  	\`title\` text,
  	\`body\` text,
  	\`href\` text,
  	\`evidence_id\` integer,
  	FOREIGN KEY (\`evidence_id\`) REFERENCES \`evidence\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`articles_blocks_cta\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`articles_blocks_cta_items_order_idx\` ON \`articles_blocks_cta_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_cta_items_parent_id_idx\` ON \`articles_blocks_cta_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_cta_items_evidence_idx\` ON \`articles_blocks_cta_items\` (\`evidence_id\`);`)
  await db.run(sql`CREATE TABLE \`articles_blocks_cta\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`title\` text,
  	\`body\` text,
  	\`cta_label\` text,
  	\`cta_href\` text,
  	\`case_study_id\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`case_study_id\`) REFERENCES \`cases\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`articles\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`articles_blocks_cta_order_idx\` ON \`articles_blocks_cta\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_cta_parent_id_idx\` ON \`articles_blocks_cta\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_cta_path_idx\` ON \`articles_blocks_cta\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_cta_case_study_idx\` ON \`articles_blocks_cta\` (\`case_study_id\`);`)
  await db.run(sql`CREATE TABLE \`articles\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`slug\` text,
  	\`title\` text,
  	\`category\` text,
  	\`intro\` text,
  	\`published_at\` text,
  	\`author_id\` integer,
  	\`cover_id\` integer,
  	\`cta_label\` text,
  	\`cta_href\` text,
  	\`seo_title\` text,
  	\`seo_description\` text,
  	\`seo_image_id\` integer,
  	\`seo_noindex\` integer DEFAULT false,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`author_id\`) REFERENCES \`experts\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`cover_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`seo_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`articles_author_idx\` ON \`articles\` (\`author_id\`);`)
  await db.run(sql`CREATE INDEX \`articles_cover_idx\` ON \`articles\` (\`cover_id\`);`)
  await db.run(sql`CREATE INDEX \`articles_seo_seo_image_idx\` ON \`articles\` (\`seo_image_id\`);`)
  await db.run(sql`CREATE INDEX \`articles_updated_at_idx\` ON \`articles\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`articles_created_at_idx\` ON \`articles\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`articles__status_idx\` ON \`articles\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`articles_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`experts_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`articles\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`experts_id\`) REFERENCES \`experts\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`articles_rels_order_idx\` ON \`articles_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`articles_rels_parent_idx\` ON \`articles_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`articles_rels_path_idx\` ON \`articles_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`articles_rels_experts_id_idx\` ON \`articles_rels\` (\`experts_id\`);`)
  await db.run(sql`CREATE TABLE \`_articles_v_blocks_story_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`kicker\` text,
  	\`title\` text,
  	\`body\` text,
  	\`href\` text,
  	\`evidence_id\` integer,
  	\`_uuid\` text,
  	FOREIGN KEY (\`evidence_id\`) REFERENCES \`evidence\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_articles_v_blocks_story\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_story_items_order_idx\` ON \`_articles_v_blocks_story_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_story_items_parent_id_idx\` ON \`_articles_v_blocks_story_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_story_items_evidence_idx\` ON \`_articles_v_blocks_story_items\` (\`evidence_id\`);`)
  await db.run(sql`CREATE TABLE \`_articles_v_blocks_story\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`title\` text,
  	\`body\` text,
  	\`cta_label\` text,
  	\`cta_href\` text,
  	\`case_study_id\` integer,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`case_study_id\`) REFERENCES \`cases\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_articles_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_story_order_idx\` ON \`_articles_v_blocks_story\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_story_parent_id_idx\` ON \`_articles_v_blocks_story\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_story_path_idx\` ON \`_articles_v_blocks_story\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_story_case_study_idx\` ON \`_articles_v_blocks_story\` (\`case_study_id\`);`)
  await db.run(sql`CREATE TABLE \`_articles_v_blocks_problems_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`kicker\` text,
  	\`title\` text,
  	\`body\` text,
  	\`href\` text,
  	\`evidence_id\` integer,
  	\`_uuid\` text,
  	FOREIGN KEY (\`evidence_id\`) REFERENCES \`evidence\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_articles_v_blocks_problems\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_problems_items_order_idx\` ON \`_articles_v_blocks_problems_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_problems_items_parent_id_idx\` ON \`_articles_v_blocks_problems_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_problems_items_evidence_idx\` ON \`_articles_v_blocks_problems_items\` (\`evidence_id\`);`)
  await db.run(sql`CREATE TABLE \`_articles_v_blocks_problems\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`title\` text,
  	\`body\` text,
  	\`cta_label\` text,
  	\`cta_href\` text,
  	\`case_study_id\` integer,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`case_study_id\`) REFERENCES \`cases\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_articles_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_problems_order_idx\` ON \`_articles_v_blocks_problems\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_problems_parent_id_idx\` ON \`_articles_v_blocks_problems\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_problems_path_idx\` ON \`_articles_v_blocks_problems\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_problems_case_study_idx\` ON \`_articles_v_blocks_problems\` (\`case_study_id\`);`)
  await db.run(sql`CREATE TABLE \`_articles_v_blocks_system_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`kicker\` text,
  	\`title\` text,
  	\`body\` text,
  	\`href\` text,
  	\`evidence_id\` integer,
  	\`_uuid\` text,
  	FOREIGN KEY (\`evidence_id\`) REFERENCES \`evidence\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_articles_v_blocks_system\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_system_items_order_idx\` ON \`_articles_v_blocks_system_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_system_items_parent_id_idx\` ON \`_articles_v_blocks_system_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_system_items_evidence_idx\` ON \`_articles_v_blocks_system_items\` (\`evidence_id\`);`)
  await db.run(sql`CREATE TABLE \`_articles_v_blocks_system\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`title\` text,
  	\`body\` text,
  	\`cta_label\` text,
  	\`cta_href\` text,
  	\`case_study_id\` integer,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`case_study_id\`) REFERENCES \`cases\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_articles_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_system_order_idx\` ON \`_articles_v_blocks_system\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_system_parent_id_idx\` ON \`_articles_v_blocks_system\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_system_path_idx\` ON \`_articles_v_blocks_system\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_system_case_study_idx\` ON \`_articles_v_blocks_system\` (\`case_study_id\`);`)
  await db.run(sql`CREATE TABLE \`_articles_v_blocks_products_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`kicker\` text,
  	\`title\` text,
  	\`body\` text,
  	\`href\` text,
  	\`evidence_id\` integer,
  	\`_uuid\` text,
  	FOREIGN KEY (\`evidence_id\`) REFERENCES \`evidence\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_articles_v_blocks_products\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_products_items_order_idx\` ON \`_articles_v_blocks_products_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_products_items_parent_id_idx\` ON \`_articles_v_blocks_products_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_products_items_evidence_idx\` ON \`_articles_v_blocks_products_items\` (\`evidence_id\`);`)
  await db.run(sql`CREATE TABLE \`_articles_v_blocks_products\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`title\` text,
  	\`body\` text,
  	\`cta_label\` text,
  	\`cta_href\` text,
  	\`case_study_id\` integer,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`case_study_id\`) REFERENCES \`cases\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_articles_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_products_order_idx\` ON \`_articles_v_blocks_products\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_products_parent_id_idx\` ON \`_articles_v_blocks_products\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_products_path_idx\` ON \`_articles_v_blocks_products\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_products_case_study_idx\` ON \`_articles_v_blocks_products\` (\`case_study_id\`);`)
  await db.run(sql`CREATE TABLE \`_articles_v_blocks_selector_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`kicker\` text,
  	\`title\` text,
  	\`body\` text,
  	\`href\` text,
  	\`evidence_id\` integer,
  	\`_uuid\` text,
  	FOREIGN KEY (\`evidence_id\`) REFERENCES \`evidence\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_articles_v_blocks_selector\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_selector_items_order_idx\` ON \`_articles_v_blocks_selector_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_selector_items_parent_id_idx\` ON \`_articles_v_blocks_selector_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_selector_items_evidence_idx\` ON \`_articles_v_blocks_selector_items\` (\`evidence_id\`);`)
  await db.run(sql`CREATE TABLE \`_articles_v_blocks_selector\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`title\` text,
  	\`body\` text,
  	\`cta_label\` text,
  	\`cta_href\` text,
  	\`case_study_id\` integer,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`case_study_id\`) REFERENCES \`cases\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_articles_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_selector_order_idx\` ON \`_articles_v_blocks_selector\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_selector_parent_id_idx\` ON \`_articles_v_blocks_selector\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_selector_path_idx\` ON \`_articles_v_blocks_selector\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_selector_case_study_idx\` ON \`_articles_v_blocks_selector\` (\`case_study_id\`);`)
  await db.run(sql`CREATE TABLE \`_articles_v_blocks_preview_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`kicker\` text,
  	\`title\` text,
  	\`body\` text,
  	\`href\` text,
  	\`evidence_id\` integer,
  	\`_uuid\` text,
  	FOREIGN KEY (\`evidence_id\`) REFERENCES \`evidence\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_articles_v_blocks_preview\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_preview_items_order_idx\` ON \`_articles_v_blocks_preview_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_preview_items_parent_id_idx\` ON \`_articles_v_blocks_preview_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_preview_items_evidence_idx\` ON \`_articles_v_blocks_preview_items\` (\`evidence_id\`);`)
  await db.run(sql`CREATE TABLE \`_articles_v_blocks_preview\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`title\` text,
  	\`body\` text,
  	\`cta_label\` text,
  	\`cta_href\` text,
  	\`case_study_id\` integer,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`case_study_id\`) REFERENCES \`cases\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_articles_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_preview_order_idx\` ON \`_articles_v_blocks_preview\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_preview_parent_id_idx\` ON \`_articles_v_blocks_preview\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_preview_path_idx\` ON \`_articles_v_blocks_preview\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_preview_case_study_idx\` ON \`_articles_v_blocks_preview\` (\`case_study_id\`);`)
  await db.run(sql`CREATE TABLE \`_articles_v_blocks_experts_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`kicker\` text,
  	\`title\` text,
  	\`body\` text,
  	\`href\` text,
  	\`evidence_id\` integer,
  	\`_uuid\` text,
  	FOREIGN KEY (\`evidence_id\`) REFERENCES \`evidence\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_articles_v_blocks_experts\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_experts_items_order_idx\` ON \`_articles_v_blocks_experts_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_experts_items_parent_id_idx\` ON \`_articles_v_blocks_experts_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_experts_items_evidence_idx\` ON \`_articles_v_blocks_experts_items\` (\`evidence_id\`);`)
  await db.run(sql`CREATE TABLE \`_articles_v_blocks_experts\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`title\` text,
  	\`body\` text,
  	\`cta_label\` text,
  	\`cta_href\` text,
  	\`case_study_id\` integer,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`case_study_id\`) REFERENCES \`cases\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_articles_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_experts_order_idx\` ON \`_articles_v_blocks_experts\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_experts_parent_id_idx\` ON \`_articles_v_blocks_experts\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_experts_path_idx\` ON \`_articles_v_blocks_experts\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_experts_case_study_idx\` ON \`_articles_v_blocks_experts\` (\`case_study_id\`);`)
  await db.run(sql`CREATE TABLE \`_articles_v_blocks_faq_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`kicker\` text,
  	\`title\` text,
  	\`body\` text,
  	\`href\` text,
  	\`evidence_id\` integer,
  	\`_uuid\` text,
  	FOREIGN KEY (\`evidence_id\`) REFERENCES \`evidence\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_articles_v_blocks_faq\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_faq_items_order_idx\` ON \`_articles_v_blocks_faq_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_faq_items_parent_id_idx\` ON \`_articles_v_blocks_faq_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_faq_items_evidence_idx\` ON \`_articles_v_blocks_faq_items\` (\`evidence_id\`);`)
  await db.run(sql`CREATE TABLE \`_articles_v_blocks_faq\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`title\` text,
  	\`body\` text,
  	\`cta_label\` text,
  	\`cta_href\` text,
  	\`case_study_id\` integer,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`case_study_id\`) REFERENCES \`cases\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_articles_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_faq_order_idx\` ON \`_articles_v_blocks_faq\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_faq_parent_id_idx\` ON \`_articles_v_blocks_faq\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_faq_path_idx\` ON \`_articles_v_blocks_faq\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_faq_case_study_idx\` ON \`_articles_v_blocks_faq\` (\`case_study_id\`);`)
  await db.run(sql`CREATE TABLE \`_articles_v_blocks_editorial_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`kicker\` text,
  	\`title\` text,
  	\`body\` text,
  	\`href\` text,
  	\`evidence_id\` integer,
  	\`_uuid\` text,
  	FOREIGN KEY (\`evidence_id\`) REFERENCES \`evidence\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_articles_v_blocks_editorial\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_editorial_items_order_idx\` ON \`_articles_v_blocks_editorial_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_editorial_items_parent_id_idx\` ON \`_articles_v_blocks_editorial_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_editorial_items_evidence_idx\` ON \`_articles_v_blocks_editorial_items\` (\`evidence_id\`);`)
  await db.run(sql`CREATE TABLE \`_articles_v_blocks_editorial\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`title\` text,
  	\`body\` text,
  	\`cta_label\` text,
  	\`cta_href\` text,
  	\`case_study_id\` integer,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`case_study_id\`) REFERENCES \`cases\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_articles_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_editorial_order_idx\` ON \`_articles_v_blocks_editorial\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_editorial_parent_id_idx\` ON \`_articles_v_blocks_editorial\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_editorial_path_idx\` ON \`_articles_v_blocks_editorial\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_editorial_case_study_idx\` ON \`_articles_v_blocks_editorial\` (\`case_study_id\`);`)
  await db.run(sql`CREATE TABLE \`_articles_v_blocks_cta_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`kicker\` text,
  	\`title\` text,
  	\`body\` text,
  	\`href\` text,
  	\`evidence_id\` integer,
  	\`_uuid\` text,
  	FOREIGN KEY (\`evidence_id\`) REFERENCES \`evidence\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_articles_v_blocks_cta\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_cta_items_order_idx\` ON \`_articles_v_blocks_cta_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_cta_items_parent_id_idx\` ON \`_articles_v_blocks_cta_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_cta_items_evidence_idx\` ON \`_articles_v_blocks_cta_items\` (\`evidence_id\`);`)
  await db.run(sql`CREATE TABLE \`_articles_v_blocks_cta\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`title\` text,
  	\`body\` text,
  	\`cta_label\` text,
  	\`cta_href\` text,
  	\`case_study_id\` integer,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`case_study_id\`) REFERENCES \`cases\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_articles_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_cta_order_idx\` ON \`_articles_v_blocks_cta\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_cta_parent_id_idx\` ON \`_articles_v_blocks_cta\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_cta_path_idx\` ON \`_articles_v_blocks_cta\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_cta_case_study_idx\` ON \`_articles_v_blocks_cta\` (\`case_study_id\`);`)
  await db.run(sql`CREATE TABLE \`_articles_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_slug\` text,
  	\`version_title\` text,
  	\`version_category\` text,
  	\`version_intro\` text,
  	\`version_published_at\` text,
  	\`version_author_id\` integer,
  	\`version_cover_id\` integer,
  	\`version_cta_label\` text,
  	\`version_cta_href\` text,
  	\`version_seo_title\` text,
  	\`version_seo_description\` text,
  	\`version_seo_image_id\` integer,
  	\`version_seo_noindex\` integer DEFAULT false,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`articles\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_author_id\`) REFERENCES \`experts\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_cover_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_seo_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_articles_v_parent_idx\` ON \`_articles_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_version_version_author_idx\` ON \`_articles_v\` (\`version_author_id\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_version_version_cover_idx\` ON \`_articles_v\` (\`version_cover_id\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_version_seo_version_seo_image_idx\` ON \`_articles_v\` (\`version_seo_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_version_version_updated_at_idx\` ON \`_articles_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_version_version_created_at_idx\` ON \`_articles_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_version_version__status_idx\` ON \`_articles_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_created_at_idx\` ON \`_articles_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_updated_at_idx\` ON \`_articles_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_latest_idx\` ON \`_articles_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_autosave_idx\` ON \`_articles_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`_articles_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`experts_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_articles_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`experts_id\`) REFERENCES \`experts\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_articles_v_rels_order_idx\` ON \`_articles_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_rels_parent_idx\` ON \`_articles_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_rels_path_idx\` ON \`_articles_v_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_rels_experts_id_idx\` ON \`_articles_v_rels\` (\`experts_id\`);`)
  await db.run(sql`CREATE TABLE \`experts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`role\` text,
  	\`bio\` text,
  	\`credentials\` text,
  	\`portrait_id\` integer,
  	\`approval\` text DEFAULT 'pending',
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`portrait_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`experts_portrait_idx\` ON \`experts\` (\`portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`experts_updated_at_idx\` ON \`experts\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`experts_created_at_idx\` ON \`experts\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`experts__status_idx\` ON \`experts\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_experts_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_name\` text,
  	\`version_role\` text,
  	\`version_bio\` text,
  	\`version_credentials\` text,
  	\`version_portrait_id\` integer,
  	\`version_approval\` text DEFAULT 'pending',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`experts\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_portrait_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_experts_v_parent_idx\` ON \`_experts_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_experts_v_version_version_portrait_idx\` ON \`_experts_v\` (\`version_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`_experts_v_version_version_updated_at_idx\` ON \`_experts_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_experts_v_version_version_created_at_idx\` ON \`_experts_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_experts_v_version_version__status_idx\` ON \`_experts_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_experts_v_created_at_idx\` ON \`_experts_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_experts_v_updated_at_idx\` ON \`_experts_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_experts_v_latest_idx\` ON \`_experts_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_experts_v_autosave_idx\` ON \`_experts_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`leads\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`intent\` text NOT NULL,
  	\`name\` text NOT NULL,
  	\`email\` text NOT NULL,
  	\`company\` text,
  	\`message\` text,
  	\`team\` text,
  	\`timing\` text,
  	\`capacity\` text,
  	\`platforms\` text,
  	\`decision_makers\` text,
  	\`consent_at\` text NOT NULL,
  	\`privacy_version\` text NOT NULL,
  	\`status\` text DEFAULT 'new',
  	\`delivery\` text DEFAULT 'local',
  	\`request_key\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`leads_request_key_idx\` ON \`leads\` (\`request_key\`);`)
  await db.run(sql`CREATE INDEX \`leads_updated_at_idx\` ON \`leads\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`leads_created_at_idx\` ON \`leads\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`activity\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`actor\` text NOT NULL,
  	\`action\` text NOT NULL,
  	\`document\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`activity_updated_at_idx\` ON \`activity\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`activity_created_at_idx\` ON \`activity\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_kv\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text NOT NULL,
  	\`data\` text NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`payload_kv_key_idx\` ON \`payload_kv\` (\`key\`);`)
  await db.run(sql`CREATE TABLE \`payload_locked_documents\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`global_slug\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_global_slug_idx\` ON \`payload_locked_documents\` (\`global_slug\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_updated_at_idx\` ON \`payload_locked_documents\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_created_at_idx\` ON \`payload_locked_documents\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	\`media_id\` integer,
  	\`pages_id\` integer,
  	\`products_id\` integer,
  	\`cases_id\` integer,
  	\`evidence_id\` integer,
  	\`articles_id\` integer,
  	\`experts_id\` integer,
  	\`leads_id\` integer,
  	\`activity_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`pages_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`products_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`cases_id\`) REFERENCES \`cases\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`evidence_id\`) REFERENCES \`evidence\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`articles_id\`) REFERENCES \`articles\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`experts_id\`) REFERENCES \`experts\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`leads_id\`) REFERENCES \`leads\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`activity_id\`) REFERENCES \`activity\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_pages_id_idx\` ON \`payload_locked_documents_rels\` (\`pages_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_products_id_idx\` ON \`payload_locked_documents_rels\` (\`products_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_cases_id_idx\` ON \`payload_locked_documents_rels\` (\`cases_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_evidence_id_idx\` ON \`payload_locked_documents_rels\` (\`evidence_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_articles_id_idx\` ON \`payload_locked_documents_rels\` (\`articles_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_experts_id_idx\` ON \`payload_locked_documents_rels\` (\`experts_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_leads_id_idx\` ON \`payload_locked_documents_rels\` (\`leads_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_activity_id_idx\` ON \`payload_locked_documents_rels\` (\`activity_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_preferences\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text,
  	\`value\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_preferences_key_idx\` ON \`payload_preferences\` (\`key\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_updated_at_idx\` ON \`payload_preferences\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_created_at_idx\` ON \`payload_preferences\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_preferences_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_preferences\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_order_idx\` ON \`payload_preferences_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_parent_idx\` ON \`payload_preferences_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_path_idx\` ON \`payload_preferences_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_users_id_idx\` ON \`payload_preferences_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_migrations\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`batch\` numeric,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_migrations_updated_at_idx\` ON \`payload_migrations\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_migrations_created_at_idx\` ON \`payload_migrations\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`site_navigation\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`href\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`site_navigation_order_idx\` ON \`site_navigation\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`site_navigation_parent_id_idx\` ON \`site_navigation\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`site_footer_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`href\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`site_footer_links_order_idx\` ON \`site_footer_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`site_footer_links_parent_id_idx\` ON \`site_footer_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`site_social\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`href\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`site_social_order_idx\` ON \`site_social\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`site_social_parent_id_idx\` ON \`site_social\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`site\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`tagline\` text NOT NULL,
  	\`logo_id\` integer,
  	\`footer_title\` text NOT NULL,
  	\`footer_body\` text NOT NULL,
  	\`cta_label\` text,
  	\`cta_href\` text,
  	\`contact_email\` text,
  	\`company_name\` text,
  	\`company_address\` text,
  	\`tax_number\` text,
  	\`default_seo_title\` text NOT NULL,
  	\`default_seo_description\` text NOT NULL,
  	\`social_image_id\` integer,
  	\`privacy_version\` text NOT NULL,
  	\`privacy_approved\` integer DEFAULT false,
  	\`form_copy_name_label\` text,
  	\`form_copy_email_label\` text,
  	\`form_copy_company_label\` text,
  	\`form_copy_team_label\` text,
  	\`form_copy_timing_label\` text,
  	\`form_copy_capacity_label\` text,
  	\`form_copy_platforms_label\` text,
  	\`form_copy_decision_makers_label\` text,
  	\`form_copy_message_label\` text,
  	\`form_copy_privacy_label\` text,
  	\`form_copy_submit_label\` text,
  	\`form_copy_download_label\` text,
  	\`form_copy_fallback_notice\` text,
  	\`form_copy_success_message\` text,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`social_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`site_logo_idx\` ON \`site\` (\`logo_id\`);`)
  await db.run(sql`CREATE INDEX \`site_social_image_idx\` ON \`site\` (\`social_image_id\`);`)
  await db.run(sql`CREATE TABLE \`audit_questions_options\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`reason\` text NOT NULL,
  	\`start\` numeric DEFAULT 0 NOT NULL,
  	\`build\` numeric DEFAULT 0 NOT NULL,
  	\`custom\` numeric DEFAULT 0 NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`audit_questions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`audit_questions_options_order_idx\` ON \`audit_questions_options\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`audit_questions_options_parent_id_idx\` ON \`audit_questions_options\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`audit_questions\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`key\` text NOT NULL,
  	\`title\` text NOT NULL,
  	\`hint\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`audit\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`audit_questions_order_idx\` ON \`audit_questions\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`audit_questions_parent_id_idx\` ON \`audit_questions\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`audit\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`intro\` text NOT NULL,
  	\`start_title\` text NOT NULL,
  	\`start_body\` text NOT NULL,
  	\`build_title\` text NOT NULL,
  	\`build_body\` text NOT NULL,
  	\`custom_title\` text NOT NULL,
  	\`custom_body\` text NOT NULL,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`users_sessions\`;`)
  await db.run(sql`DROP TABLE \`users\`;`)
  await db.run(sql`DROP TABLE \`media\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_story_items\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_story\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_problems_items\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_problems\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_system_items\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_system\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_products_items\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_products\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_selector_items\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_selector\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_preview_items\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_preview\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_experts_items\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_experts\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_faq_items\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_faq\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_editorial_items\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_editorial\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_cta_items\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_cta\`;`)
  await db.run(sql`DROP TABLE \`pages\`;`)
  await db.run(sql`DROP TABLE \`pages_rels\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_story_items\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_story\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_problems_items\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_problems\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_system_items\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_system\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_products_items\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_products\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_selector_items\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_selector\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_preview_items\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_preview\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_experts_items\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_experts\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_faq_items\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_faq\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_editorial_items\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_editorial\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_cta_items\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_cta\`;`)
  await db.run(sql`DROP TABLE \`_pages_v\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_rels\`;`)
  await db.run(sql`DROP TABLE \`products_includes\`;`)
  await db.run(sql`DROP TABLE \`products_excludes\`;`)
  await db.run(sql`DROP TABLE \`products_blocks_story_items\`;`)
  await db.run(sql`DROP TABLE \`products_blocks_story\`;`)
  await db.run(sql`DROP TABLE \`products_blocks_problems_items\`;`)
  await db.run(sql`DROP TABLE \`products_blocks_problems\`;`)
  await db.run(sql`DROP TABLE \`products_blocks_system_items\`;`)
  await db.run(sql`DROP TABLE \`products_blocks_system\`;`)
  await db.run(sql`DROP TABLE \`products_blocks_products_items\`;`)
  await db.run(sql`DROP TABLE \`products_blocks_products\`;`)
  await db.run(sql`DROP TABLE \`products_blocks_selector_items\`;`)
  await db.run(sql`DROP TABLE \`products_blocks_selector\`;`)
  await db.run(sql`DROP TABLE \`products_blocks_preview_items\`;`)
  await db.run(sql`DROP TABLE \`products_blocks_preview\`;`)
  await db.run(sql`DROP TABLE \`products_blocks_experts_items\`;`)
  await db.run(sql`DROP TABLE \`products_blocks_experts\`;`)
  await db.run(sql`DROP TABLE \`products_blocks_faq_items\`;`)
  await db.run(sql`DROP TABLE \`products_blocks_faq\`;`)
  await db.run(sql`DROP TABLE \`products_blocks_editorial_items\`;`)
  await db.run(sql`DROP TABLE \`products_blocks_editorial\`;`)
  await db.run(sql`DROP TABLE \`products_blocks_cta_items\`;`)
  await db.run(sql`DROP TABLE \`products_blocks_cta\`;`)
  await db.run(sql`DROP TABLE \`products\`;`)
  await db.run(sql`DROP TABLE \`products_rels\`;`)
  await db.run(sql`DROP TABLE \`_products_v_version_includes\`;`)
  await db.run(sql`DROP TABLE \`_products_v_version_excludes\`;`)
  await db.run(sql`DROP TABLE \`_products_v_blocks_story_items\`;`)
  await db.run(sql`DROP TABLE \`_products_v_blocks_story\`;`)
  await db.run(sql`DROP TABLE \`_products_v_blocks_problems_items\`;`)
  await db.run(sql`DROP TABLE \`_products_v_blocks_problems\`;`)
  await db.run(sql`DROP TABLE \`_products_v_blocks_system_items\`;`)
  await db.run(sql`DROP TABLE \`_products_v_blocks_system\`;`)
  await db.run(sql`DROP TABLE \`_products_v_blocks_products_items\`;`)
  await db.run(sql`DROP TABLE \`_products_v_blocks_products\`;`)
  await db.run(sql`DROP TABLE \`_products_v_blocks_selector_items\`;`)
  await db.run(sql`DROP TABLE \`_products_v_blocks_selector\`;`)
  await db.run(sql`DROP TABLE \`_products_v_blocks_preview_items\`;`)
  await db.run(sql`DROP TABLE \`_products_v_blocks_preview\`;`)
  await db.run(sql`DROP TABLE \`_products_v_blocks_experts_items\`;`)
  await db.run(sql`DROP TABLE \`_products_v_blocks_experts\`;`)
  await db.run(sql`DROP TABLE \`_products_v_blocks_faq_items\`;`)
  await db.run(sql`DROP TABLE \`_products_v_blocks_faq\`;`)
  await db.run(sql`DROP TABLE \`_products_v_blocks_editorial_items\`;`)
  await db.run(sql`DROP TABLE \`_products_v_blocks_editorial\`;`)
  await db.run(sql`DROP TABLE \`_products_v_blocks_cta_items\`;`)
  await db.run(sql`DROP TABLE \`_products_v_blocks_cta\`;`)
  await db.run(sql`DROP TABLE \`_products_v\`;`)
  await db.run(sql`DROP TABLE \`_products_v_rels\`;`)
  await db.run(sql`DROP TABLE \`cases_chapters\`;`)
  await db.run(sql`DROP TABLE \`cases_capabilities\`;`)
  await db.run(sql`DROP TABLE \`cases\`;`)
  await db.run(sql`DROP TABLE \`cases_rels\`;`)
  await db.run(sql`DROP TABLE \`_cases_v_version_chapters\`;`)
  await db.run(sql`DROP TABLE \`_cases_v_version_capabilities\`;`)
  await db.run(sql`DROP TABLE \`_cases_v\`;`)
  await db.run(sql`DROP TABLE \`_cases_v_rels\`;`)
  await db.run(sql`DROP TABLE \`evidence\`;`)
  await db.run(sql`DROP TABLE \`evidence_rels\`;`)
  await db.run(sql`DROP TABLE \`_evidence_v\`;`)
  await db.run(sql`DROP TABLE \`_evidence_v_rels\`;`)
  await db.run(sql`DROP TABLE \`articles_blocks_story_items\`;`)
  await db.run(sql`DROP TABLE \`articles_blocks_story\`;`)
  await db.run(sql`DROP TABLE \`articles_blocks_problems_items\`;`)
  await db.run(sql`DROP TABLE \`articles_blocks_problems\`;`)
  await db.run(sql`DROP TABLE \`articles_blocks_system_items\`;`)
  await db.run(sql`DROP TABLE \`articles_blocks_system\`;`)
  await db.run(sql`DROP TABLE \`articles_blocks_products_items\`;`)
  await db.run(sql`DROP TABLE \`articles_blocks_products\`;`)
  await db.run(sql`DROP TABLE \`articles_blocks_selector_items\`;`)
  await db.run(sql`DROP TABLE \`articles_blocks_selector\`;`)
  await db.run(sql`DROP TABLE \`articles_blocks_preview_items\`;`)
  await db.run(sql`DROP TABLE \`articles_blocks_preview\`;`)
  await db.run(sql`DROP TABLE \`articles_blocks_experts_items\`;`)
  await db.run(sql`DROP TABLE \`articles_blocks_experts\`;`)
  await db.run(sql`DROP TABLE \`articles_blocks_faq_items\`;`)
  await db.run(sql`DROP TABLE \`articles_blocks_faq\`;`)
  await db.run(sql`DROP TABLE \`articles_blocks_editorial_items\`;`)
  await db.run(sql`DROP TABLE \`articles_blocks_editorial\`;`)
  await db.run(sql`DROP TABLE \`articles_blocks_cta_items\`;`)
  await db.run(sql`DROP TABLE \`articles_blocks_cta\`;`)
  await db.run(sql`DROP TABLE \`articles\`;`)
  await db.run(sql`DROP TABLE \`articles_rels\`;`)
  await db.run(sql`DROP TABLE \`_articles_v_blocks_story_items\`;`)
  await db.run(sql`DROP TABLE \`_articles_v_blocks_story\`;`)
  await db.run(sql`DROP TABLE \`_articles_v_blocks_problems_items\`;`)
  await db.run(sql`DROP TABLE \`_articles_v_blocks_problems\`;`)
  await db.run(sql`DROP TABLE \`_articles_v_blocks_system_items\`;`)
  await db.run(sql`DROP TABLE \`_articles_v_blocks_system\`;`)
  await db.run(sql`DROP TABLE \`_articles_v_blocks_products_items\`;`)
  await db.run(sql`DROP TABLE \`_articles_v_blocks_products\`;`)
  await db.run(sql`DROP TABLE \`_articles_v_blocks_selector_items\`;`)
  await db.run(sql`DROP TABLE \`_articles_v_blocks_selector\`;`)
  await db.run(sql`DROP TABLE \`_articles_v_blocks_preview_items\`;`)
  await db.run(sql`DROP TABLE \`_articles_v_blocks_preview\`;`)
  await db.run(sql`DROP TABLE \`_articles_v_blocks_experts_items\`;`)
  await db.run(sql`DROP TABLE \`_articles_v_blocks_experts\`;`)
  await db.run(sql`DROP TABLE \`_articles_v_blocks_faq_items\`;`)
  await db.run(sql`DROP TABLE \`_articles_v_blocks_faq\`;`)
  await db.run(sql`DROP TABLE \`_articles_v_blocks_editorial_items\`;`)
  await db.run(sql`DROP TABLE \`_articles_v_blocks_editorial\`;`)
  await db.run(sql`DROP TABLE \`_articles_v_blocks_cta_items\`;`)
  await db.run(sql`DROP TABLE \`_articles_v_blocks_cta\`;`)
  await db.run(sql`DROP TABLE \`_articles_v\`;`)
  await db.run(sql`DROP TABLE \`_articles_v_rels\`;`)
  await db.run(sql`DROP TABLE \`experts\`;`)
  await db.run(sql`DROP TABLE \`_experts_v\`;`)
  await db.run(sql`DROP TABLE \`leads\`;`)
  await db.run(sql`DROP TABLE \`activity\`;`)
  await db.run(sql`DROP TABLE \`payload_kv\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_migrations\`;`)
  await db.run(sql`DROP TABLE \`site_navigation\`;`)
  await db.run(sql`DROP TABLE \`site_footer_links\`;`)
  await db.run(sql`DROP TABLE \`site_social\`;`)
  await db.run(sql`DROP TABLE \`site\`;`)
  await db.run(sql`DROP TABLE \`audit_questions_options\`;`)
  await db.run(sql`DROP TABLE \`audit_questions\`;`)
  await db.run(sql`DROP TABLE \`audit\`;`)
}
