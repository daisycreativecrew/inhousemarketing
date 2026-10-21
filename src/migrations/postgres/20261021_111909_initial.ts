import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'publisher', 'editor');
  CREATE TYPE "public"."enum_media_approval" AS ENUM('pending', 'approved', 'rejected');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_products_slug" AS ENUM('start', 'build', 'custom');
  CREATE TYPE "public"."enum_products_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__products_v_version_slug" AS ENUM('start', 'build', 'custom');
  CREATE TYPE "public"."enum__products_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_cases_approval" AS ENUM('pending', 'approved', 'rejected');
  CREATE TYPE "public"."enum_cases_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__cases_v_version_approval" AS ENUM('pending', 'approved', 'rejected');
  CREATE TYPE "public"."enum__cases_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_evidence_kind" AS ENUM('inline', 'before-after', 'case-preview', 'testimonial', 'gallery', 'workflow', 'expert-insight', 'quote', 'video', 'timeline', 'capability', 'case-cta');
  CREATE TYPE "public"."enum_evidence_approval" AS ENUM('pending', 'approved', 'rejected');
  CREATE TYPE "public"."enum_evidence_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__evidence_v_version_kind" AS ENUM('inline', 'before-after', 'case-preview', 'testimonial', 'gallery', 'workflow', 'expert-insight', 'quote', 'video', 'timeline', 'capability', 'case-cta');
  CREATE TYPE "public"."enum__evidence_v_version_approval" AS ENUM('pending', 'approved', 'rejected');
  CREATE TYPE "public"."enum__evidence_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_articles_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__articles_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_experts_approval" AS ENUM('pending', 'approved', 'rejected');
  CREATE TYPE "public"."enum_experts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__experts_v_version_approval" AS ENUM('pending', 'approved', 'rejected');
  CREATE TYPE "public"."enum__experts_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_leads_intent" AS ENUM('build', 'custom', 'start', 'contact', 'audit-result');
  CREATE TYPE "public"."enum_leads_status" AS ENUM('new', 'qualified', 'contacted', 'won', 'closed');
  CREATE TYPE "public"."enum_leads_delivery" AS ENUM('local', 'delivered', 'failed');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" "enum_users_role" DEFAULT 'editor' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"caption" varchar,
  	"source" varchar NOT NULL,
  	"approval" "enum_media_approval" DEFAULT 'pending' NOT NULL,
  	"usage_rights_confirmed" boolean DEFAULT false,
  	"approved_by" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_wide_url" varchar,
  	"sizes_wide_width" numeric,
  	"sizes_wide_height" numeric,
  	"sizes_wide_mime_type" varchar,
  	"sizes_wide_filesize" numeric,
  	"sizes_wide_filename" varchar
  );
  
  CREATE TABLE "pages_blocks_story_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"body" varchar,
  	"href" varchar,
  	"evidence_id" integer
  );
  
  CREATE TABLE "pages_blocks_story" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"case_study_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_problems_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"body" varchar,
  	"href" varchar,
  	"evidence_id" integer
  );
  
  CREATE TABLE "pages_blocks_problems" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"case_study_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_system_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"body" varchar,
  	"href" varchar,
  	"evidence_id" integer
  );
  
  CREATE TABLE "pages_blocks_system" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"case_study_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_products_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"body" varchar,
  	"href" varchar,
  	"evidence_id" integer
  );
  
  CREATE TABLE "pages_blocks_products" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"case_study_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_selector_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"body" varchar,
  	"href" varchar,
  	"evidence_id" integer
  );
  
  CREATE TABLE "pages_blocks_selector" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"case_study_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_preview_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"body" varchar,
  	"href" varchar,
  	"evidence_id" integer
  );
  
  CREATE TABLE "pages_blocks_preview" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"case_study_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_experts_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"body" varchar,
  	"href" varchar,
  	"evidence_id" integer
  );
  
  CREATE TABLE "pages_blocks_experts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"case_study_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"body" varchar,
  	"href" varchar,
  	"evidence_id" integer
  );
  
  CREATE TABLE "pages_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"case_study_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_editorial_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"body" varchar,
  	"href" varchar,
  	"evidence_id" integer
  );
  
  CREATE TABLE "pages_blocks_editorial" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"case_study_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_cta_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"body" varchar,
  	"href" varchar,
  	"evidence_id" integer
  );
  
  CREATE TABLE "pages_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"case_study_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"path" varchar,
  	"eyebrow" varchar,
  	"title" varchar,
  	"accent" varchar,
  	"intro" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"secondary_label" varchar,
  	"secondary_href" varchar,
  	"legal_approved" boolean DEFAULT false,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_image_id" integer,
  	"seo_noindex" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "pages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"experts_id" integer
  );
  
  CREATE TABLE "_pages_v_blocks_story_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"body" varchar,
  	"href" varchar,
  	"evidence_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_story" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"case_study_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_problems_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"body" varchar,
  	"href" varchar,
  	"evidence_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_problems" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"case_study_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_system_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"body" varchar,
  	"href" varchar,
  	"evidence_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_system" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"case_study_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_products_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"body" varchar,
  	"href" varchar,
  	"evidence_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_products" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"case_study_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_selector_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"body" varchar,
  	"href" varchar,
  	"evidence_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_selector" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"case_study_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_preview_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"body" varchar,
  	"href" varchar,
  	"evidence_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_preview" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"case_study_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_experts_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"body" varchar,
  	"href" varchar,
  	"evidence_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_experts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"case_study_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"body" varchar,
  	"href" varchar,
  	"evidence_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"case_study_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_editorial_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"body" varchar,
  	"href" varchar,
  	"evidence_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_editorial" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"case_study_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cta_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"body" varchar,
  	"href" varchar,
  	"evidence_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"case_study_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_path" varchar,
  	"version_eyebrow" varchar,
  	"version_title" varchar,
  	"version_accent" varchar,
  	"version_intro" varchar,
  	"version_cta_label" varchar,
  	"version_cta_href" varchar,
  	"version_secondary_label" varchar,
  	"version_secondary_href" varchar,
  	"version_legal_approved" boolean DEFAULT false,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_seo_image_id" integer,
  	"version_seo_noindex" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_pages_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"experts_id" integer
  );
  
  CREATE TABLE "products_includes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" varchar
  );
  
  CREATE TABLE "products_excludes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" varchar
  );
  
  CREATE TABLE "products_blocks_story_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"body" varchar,
  	"href" varchar,
  	"evidence_id" integer
  );
  
  CREATE TABLE "products_blocks_story" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"case_study_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "products_blocks_problems_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"body" varchar,
  	"href" varchar,
  	"evidence_id" integer
  );
  
  CREATE TABLE "products_blocks_problems" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"case_study_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "products_blocks_system_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"body" varchar,
  	"href" varchar,
  	"evidence_id" integer
  );
  
  CREATE TABLE "products_blocks_system" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"case_study_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "products_blocks_products_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"body" varchar,
  	"href" varchar,
  	"evidence_id" integer
  );
  
  CREATE TABLE "products_blocks_products" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"case_study_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "products_blocks_selector_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"body" varchar,
  	"href" varchar,
  	"evidence_id" integer
  );
  
  CREATE TABLE "products_blocks_selector" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"case_study_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "products_blocks_preview_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"body" varchar,
  	"href" varchar,
  	"evidence_id" integer
  );
  
  CREATE TABLE "products_blocks_preview" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"case_study_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "products_blocks_experts_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"body" varchar,
  	"href" varchar,
  	"evidence_id" integer
  );
  
  CREATE TABLE "products_blocks_experts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"case_study_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "products_blocks_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"body" varchar,
  	"href" varchar,
  	"evidence_id" integer
  );
  
  CREATE TABLE "products_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"case_study_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "products_blocks_editorial_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"body" varchar,
  	"href" varchar,
  	"evidence_id" integer
  );
  
  CREATE TABLE "products_blocks_editorial" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"case_study_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "products_blocks_cta_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"body" varchar,
  	"href" varchar,
  	"evidence_id" integer
  );
  
  CREATE TABLE "products_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"case_study_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "products" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" "enum_products_slug",
  	"name" varchar,
  	"eyebrow" varchar,
  	"title" varchar,
  	"intro" varchar,
  	"responsibility" varchar,
  	"delivery" varchar,
  	"price_label" varchar,
  	"price_huf" numeric,
  	"vat_percent" numeric,
  	"business_approved" boolean DEFAULT false,
  	"access_duration" varchar,
  	"review_rounds" numeric,
  	"implementation_days" numeric,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_image_id" integer,
  	"seo_noindex" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_products_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "products_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"experts_id" integer
  );
  
  CREATE TABLE "_products_v_version_includes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v_version_excludes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v_blocks_story_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"body" varchar,
  	"href" varchar,
  	"evidence_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v_blocks_story" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"case_study_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_products_v_blocks_problems_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"body" varchar,
  	"href" varchar,
  	"evidence_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v_blocks_problems" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"case_study_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_products_v_blocks_system_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"body" varchar,
  	"href" varchar,
  	"evidence_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v_blocks_system" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"case_study_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_products_v_blocks_products_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"body" varchar,
  	"href" varchar,
  	"evidence_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v_blocks_products" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"case_study_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_products_v_blocks_selector_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"body" varchar,
  	"href" varchar,
  	"evidence_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v_blocks_selector" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"case_study_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_products_v_blocks_preview_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"body" varchar,
  	"href" varchar,
  	"evidence_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v_blocks_preview" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"case_study_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_products_v_blocks_experts_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"body" varchar,
  	"href" varchar,
  	"evidence_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v_blocks_experts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"case_study_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_products_v_blocks_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"body" varchar,
  	"href" varchar,
  	"evidence_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"case_study_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_products_v_blocks_editorial_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"body" varchar,
  	"href" varchar,
  	"evidence_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v_blocks_editorial" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"case_study_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_products_v_blocks_cta_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"body" varchar,
  	"href" varchar,
  	"evidence_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"case_study_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_products_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" "enum__products_v_version_slug",
  	"version_name" varchar,
  	"version_eyebrow" varchar,
  	"version_title" varchar,
  	"version_intro" varchar,
  	"version_responsibility" varchar,
  	"version_delivery" varchar,
  	"version_price_label" varchar,
  	"version_price_huf" numeric,
  	"version_vat_percent" numeric,
  	"version_business_approved" boolean DEFAULT false,
  	"version_access_duration" varchar,
  	"version_review_rounds" numeric,
  	"version_implementation_days" numeric,
  	"version_cta_label" varchar,
  	"version_cta_href" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_seo_image_id" integer,
  	"version_seo_noindex" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__products_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_products_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"experts_id" integer
  );
  
  CREATE TABLE "cases_chapters" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"body" varchar,
  	"media_id" integer
  );
  
  CREATE TABLE "cases_capabilities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"tasks" varchar
  );
  
  CREATE TABLE "cases" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"client" varchar,
  	"industry" varchar,
  	"title" varchar,
  	"intro" varchar,
  	"context" varchar,
  	"source" varchar,
  	"approval" "enum_cases_approval" DEFAULT 'pending',
  	"approved_by" varchar,
  	"approved_at" timestamp(3) with time zone,
  	"logo_id" integer,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_image_id" integer,
  	"seo_noindex" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_cases_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "cases_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"evidence_id" integer
  );
  
  CREATE TABLE "_cases_v_version_chapters" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"body" varchar,
  	"media_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_cases_v_version_capabilities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"tasks" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_cases_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_client" varchar,
  	"version_industry" varchar,
  	"version_title" varchar,
  	"version_intro" varchar,
  	"version_context" varchar,
  	"version_source" varchar,
  	"version_approval" "enum__cases_v_version_approval" DEFAULT 'pending',
  	"version_approved_by" varchar,
  	"version_approved_at" timestamp(3) with time zone,
  	"version_logo_id" integer,
  	"version_cta_label" varchar,
  	"version_cta_href" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_seo_image_id" integer,
  	"version_seo_noindex" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__cases_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_cases_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"evidence_id" integer
  );
  
  CREATE TABLE "evidence" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"kind" "enum_evidence_kind",
  	"body" varchar,
  	"source" varchar,
  	"approval" "enum_evidence_approval" DEFAULT 'pending',
  	"approved_by" varchar,
  	"approved_at" timestamp(3) with time zone,
  	"case_study_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_evidence_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "evidence_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "_evidence_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_kind" "enum__evidence_v_version_kind",
  	"version_body" varchar,
  	"version_source" varchar,
  	"version_approval" "enum__evidence_v_version_approval" DEFAULT 'pending',
  	"version_approved_by" varchar,
  	"version_approved_at" timestamp(3) with time zone,
  	"version_case_study_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__evidence_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_evidence_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "articles_blocks_story_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"body" varchar,
  	"href" varchar,
  	"evidence_id" integer
  );
  
  CREATE TABLE "articles_blocks_story" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"case_study_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "articles_blocks_problems_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"body" varchar,
  	"href" varchar,
  	"evidence_id" integer
  );
  
  CREATE TABLE "articles_blocks_problems" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"case_study_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "articles_blocks_system_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"body" varchar,
  	"href" varchar,
  	"evidence_id" integer
  );
  
  CREATE TABLE "articles_blocks_system" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"case_study_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "articles_blocks_products_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"body" varchar,
  	"href" varchar,
  	"evidence_id" integer
  );
  
  CREATE TABLE "articles_blocks_products" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"case_study_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "articles_blocks_selector_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"body" varchar,
  	"href" varchar,
  	"evidence_id" integer
  );
  
  CREATE TABLE "articles_blocks_selector" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"case_study_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "articles_blocks_preview_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"body" varchar,
  	"href" varchar,
  	"evidence_id" integer
  );
  
  CREATE TABLE "articles_blocks_preview" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"case_study_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "articles_blocks_experts_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"body" varchar,
  	"href" varchar,
  	"evidence_id" integer
  );
  
  CREATE TABLE "articles_blocks_experts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"case_study_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "articles_blocks_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"body" varchar,
  	"href" varchar,
  	"evidence_id" integer
  );
  
  CREATE TABLE "articles_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"case_study_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "articles_blocks_editorial_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"body" varchar,
  	"href" varchar,
  	"evidence_id" integer
  );
  
  CREATE TABLE "articles_blocks_editorial" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"case_study_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "articles_blocks_cta_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"body" varchar,
  	"href" varchar,
  	"evidence_id" integer
  );
  
  CREATE TABLE "articles_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"case_study_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "articles" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"title" varchar,
  	"category" varchar,
  	"intro" varchar,
  	"published_at" timestamp(3) with time zone,
  	"author_id" integer,
  	"cover_id" integer,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_image_id" integer,
  	"seo_noindex" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_articles_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "articles_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"experts_id" integer
  );
  
  CREATE TABLE "_articles_v_blocks_story_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"body" varchar,
  	"href" varchar,
  	"evidence_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_articles_v_blocks_story" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"case_study_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_articles_v_blocks_problems_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"body" varchar,
  	"href" varchar,
  	"evidence_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_articles_v_blocks_problems" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"case_study_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_articles_v_blocks_system_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"body" varchar,
  	"href" varchar,
  	"evidence_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_articles_v_blocks_system" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"case_study_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_articles_v_blocks_products_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"body" varchar,
  	"href" varchar,
  	"evidence_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_articles_v_blocks_products" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"case_study_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_articles_v_blocks_selector_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"body" varchar,
  	"href" varchar,
  	"evidence_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_articles_v_blocks_selector" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"case_study_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_articles_v_blocks_preview_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"body" varchar,
  	"href" varchar,
  	"evidence_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_articles_v_blocks_preview" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"case_study_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_articles_v_blocks_experts_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"body" varchar,
  	"href" varchar,
  	"evidence_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_articles_v_blocks_experts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"case_study_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_articles_v_blocks_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"body" varchar,
  	"href" varchar,
  	"evidence_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_articles_v_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"case_study_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_articles_v_blocks_editorial_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"body" varchar,
  	"href" varchar,
  	"evidence_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_articles_v_blocks_editorial" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"case_study_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_articles_v_blocks_cta_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"body" varchar,
  	"href" varchar,
  	"evidence_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_articles_v_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"case_study_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_articles_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_title" varchar,
  	"version_category" varchar,
  	"version_intro" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_author_id" integer,
  	"version_cover_id" integer,
  	"version_cta_label" varchar,
  	"version_cta_href" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_seo_image_id" integer,
  	"version_seo_noindex" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__articles_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_articles_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"experts_id" integer
  );
  
  CREATE TABLE "experts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" varchar,
  	"bio" varchar,
  	"credentials" varchar,
  	"portrait_id" integer,
  	"approval" "enum_experts_approval" DEFAULT 'pending',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_experts_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_experts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_role" varchar,
  	"version_bio" varchar,
  	"version_credentials" varchar,
  	"version_portrait_id" integer,
  	"version_approval" "enum__experts_v_version_approval" DEFAULT 'pending',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__experts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "leads" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"intent" "enum_leads_intent" NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"company" varchar,
  	"message" varchar,
  	"team" varchar,
  	"timing" varchar,
  	"capacity" varchar,
  	"platforms" varchar,
  	"decision_makers" varchar,
  	"consent_at" timestamp(3) with time zone NOT NULL,
  	"privacy_version" varchar NOT NULL,
  	"status" "enum_leads_status" DEFAULT 'new',
  	"delivery" "enum_leads_delivery" DEFAULT 'local',
  	"request_key" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "activity" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"actor" varchar NOT NULL,
  	"action" varchar NOT NULL,
  	"document" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"pages_id" integer,
  	"products_id" integer,
  	"cases_id" integer,
  	"evidence_id" integer,
  	"articles_id" integer,
  	"experts_id" integer,
  	"leads_id" integer,
  	"activity_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_navigation" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "site_footer_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "site_social" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "site" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"tagline" varchar NOT NULL,
  	"logo_id" integer,
  	"footer_title" varchar NOT NULL,
  	"footer_body" varchar NOT NULL,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"contact_email" varchar,
  	"company_name" varchar,
  	"company_address" varchar,
  	"tax_number" varchar,
  	"default_seo_title" varchar NOT NULL,
  	"default_seo_description" varchar NOT NULL,
  	"social_image_id" integer,
  	"privacy_version" varchar NOT NULL,
  	"privacy_approved" boolean DEFAULT false,
  	"form_copy_name_label" varchar,
  	"form_copy_email_label" varchar,
  	"form_copy_company_label" varchar,
  	"form_copy_team_label" varchar,
  	"form_copy_timing_label" varchar,
  	"form_copy_capacity_label" varchar,
  	"form_copy_platforms_label" varchar,
  	"form_copy_decision_makers_label" varchar,
  	"form_copy_message_label" varchar,
  	"form_copy_privacy_label" varchar,
  	"form_copy_submit_label" varchar,
  	"form_copy_download_label" varchar,
  	"form_copy_fallback_notice" varchar,
  	"form_copy_success_message" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "audit_questions_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"reason" varchar NOT NULL,
  	"start" numeric DEFAULT 0 NOT NULL,
  	"build" numeric DEFAULT 0 NOT NULL,
  	"custom" numeric DEFAULT 0 NOT NULL
  );
  
  CREATE TABLE "audit_questions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"hint" varchar
  );
  
  CREATE TABLE "audit" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"intro" varchar NOT NULL,
  	"start_title" varchar NOT NULL,
  	"start_body" varchar NOT NULL,
  	"build_title" varchar NOT NULL,
  	"build_body" varchar NOT NULL,
  	"custom_title" varchar NOT NULL,
  	"custom_body" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_story_items" ADD CONSTRAINT "pages_blocks_story_items_evidence_id_evidence_id_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."evidence"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_story_items" ADD CONSTRAINT "pages_blocks_story_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_story"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_story" ADD CONSTRAINT "pages_blocks_story_case_study_id_cases_id_fk" FOREIGN KEY ("case_study_id") REFERENCES "public"."cases"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_story" ADD CONSTRAINT "pages_blocks_story_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_problems_items" ADD CONSTRAINT "pages_blocks_problems_items_evidence_id_evidence_id_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."evidence"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_problems_items" ADD CONSTRAINT "pages_blocks_problems_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_problems"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_problems" ADD CONSTRAINT "pages_blocks_problems_case_study_id_cases_id_fk" FOREIGN KEY ("case_study_id") REFERENCES "public"."cases"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_problems" ADD CONSTRAINT "pages_blocks_problems_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_system_items" ADD CONSTRAINT "pages_blocks_system_items_evidence_id_evidence_id_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."evidence"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_system_items" ADD CONSTRAINT "pages_blocks_system_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_system"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_system" ADD CONSTRAINT "pages_blocks_system_case_study_id_cases_id_fk" FOREIGN KEY ("case_study_id") REFERENCES "public"."cases"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_system" ADD CONSTRAINT "pages_blocks_system_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_products_items" ADD CONSTRAINT "pages_blocks_products_items_evidence_id_evidence_id_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."evidence"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_products_items" ADD CONSTRAINT "pages_blocks_products_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_products" ADD CONSTRAINT "pages_blocks_products_case_study_id_cases_id_fk" FOREIGN KEY ("case_study_id") REFERENCES "public"."cases"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_products" ADD CONSTRAINT "pages_blocks_products_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_selector_items" ADD CONSTRAINT "pages_blocks_selector_items_evidence_id_evidence_id_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."evidence"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_selector_items" ADD CONSTRAINT "pages_blocks_selector_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_selector"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_selector" ADD CONSTRAINT "pages_blocks_selector_case_study_id_cases_id_fk" FOREIGN KEY ("case_study_id") REFERENCES "public"."cases"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_selector" ADD CONSTRAINT "pages_blocks_selector_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_preview_items" ADD CONSTRAINT "pages_blocks_preview_items_evidence_id_evidence_id_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."evidence"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_preview_items" ADD CONSTRAINT "pages_blocks_preview_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_preview"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_preview" ADD CONSTRAINT "pages_blocks_preview_case_study_id_cases_id_fk" FOREIGN KEY ("case_study_id") REFERENCES "public"."cases"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_preview" ADD CONSTRAINT "pages_blocks_preview_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_experts_items" ADD CONSTRAINT "pages_blocks_experts_items_evidence_id_evidence_id_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."evidence"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_experts_items" ADD CONSTRAINT "pages_blocks_experts_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_experts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_experts" ADD CONSTRAINT "pages_blocks_experts_case_study_id_cases_id_fk" FOREIGN KEY ("case_study_id") REFERENCES "public"."cases"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_experts" ADD CONSTRAINT "pages_blocks_experts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_items" ADD CONSTRAINT "pages_blocks_faq_items_evidence_id_evidence_id_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."evidence"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_items" ADD CONSTRAINT "pages_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq" ADD CONSTRAINT "pages_blocks_faq_case_study_id_cases_id_fk" FOREIGN KEY ("case_study_id") REFERENCES "public"."cases"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq" ADD CONSTRAINT "pages_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_editorial_items" ADD CONSTRAINT "pages_blocks_editorial_items_evidence_id_evidence_id_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."evidence"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_editorial_items" ADD CONSTRAINT "pages_blocks_editorial_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_editorial"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_editorial" ADD CONSTRAINT "pages_blocks_editorial_case_study_id_cases_id_fk" FOREIGN KEY ("case_study_id") REFERENCES "public"."cases"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_editorial" ADD CONSTRAINT "pages_blocks_editorial_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_items" ADD CONSTRAINT "pages_blocks_cta_items_evidence_id_evidence_id_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."evidence"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_items" ADD CONSTRAINT "pages_blocks_cta_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta" ADD CONSTRAINT "pages_blocks_cta_case_study_id_cases_id_fk" FOREIGN KEY ("case_study_id") REFERENCES "public"."cases"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta" ADD CONSTRAINT "pages_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_experts_fk" FOREIGN KEY ("experts_id") REFERENCES "public"."experts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_story_items" ADD CONSTRAINT "_pages_v_blocks_story_items_evidence_id_evidence_id_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."evidence"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_story_items" ADD CONSTRAINT "_pages_v_blocks_story_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_story"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_story" ADD CONSTRAINT "_pages_v_blocks_story_case_study_id_cases_id_fk" FOREIGN KEY ("case_study_id") REFERENCES "public"."cases"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_story" ADD CONSTRAINT "_pages_v_blocks_story_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_problems_items" ADD CONSTRAINT "_pages_v_blocks_problems_items_evidence_id_evidence_id_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."evidence"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_problems_items" ADD CONSTRAINT "_pages_v_blocks_problems_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_problems"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_problems" ADD CONSTRAINT "_pages_v_blocks_problems_case_study_id_cases_id_fk" FOREIGN KEY ("case_study_id") REFERENCES "public"."cases"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_problems" ADD CONSTRAINT "_pages_v_blocks_problems_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_system_items" ADD CONSTRAINT "_pages_v_blocks_system_items_evidence_id_evidence_id_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."evidence"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_system_items" ADD CONSTRAINT "_pages_v_blocks_system_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_system"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_system" ADD CONSTRAINT "_pages_v_blocks_system_case_study_id_cases_id_fk" FOREIGN KEY ("case_study_id") REFERENCES "public"."cases"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_system" ADD CONSTRAINT "_pages_v_blocks_system_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_products_items" ADD CONSTRAINT "_pages_v_blocks_products_items_evidence_id_evidence_id_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."evidence"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_products_items" ADD CONSTRAINT "_pages_v_blocks_products_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_products" ADD CONSTRAINT "_pages_v_blocks_products_case_study_id_cases_id_fk" FOREIGN KEY ("case_study_id") REFERENCES "public"."cases"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_products" ADD CONSTRAINT "_pages_v_blocks_products_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_selector_items" ADD CONSTRAINT "_pages_v_blocks_selector_items_evidence_id_evidence_id_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."evidence"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_selector_items" ADD CONSTRAINT "_pages_v_blocks_selector_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_selector"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_selector" ADD CONSTRAINT "_pages_v_blocks_selector_case_study_id_cases_id_fk" FOREIGN KEY ("case_study_id") REFERENCES "public"."cases"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_selector" ADD CONSTRAINT "_pages_v_blocks_selector_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_preview_items" ADD CONSTRAINT "_pages_v_blocks_preview_items_evidence_id_evidence_id_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."evidence"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_preview_items" ADD CONSTRAINT "_pages_v_blocks_preview_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_preview"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_preview" ADD CONSTRAINT "_pages_v_blocks_preview_case_study_id_cases_id_fk" FOREIGN KEY ("case_study_id") REFERENCES "public"."cases"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_preview" ADD CONSTRAINT "_pages_v_blocks_preview_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_experts_items" ADD CONSTRAINT "_pages_v_blocks_experts_items_evidence_id_evidence_id_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."evidence"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_experts_items" ADD CONSTRAINT "_pages_v_blocks_experts_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_experts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_experts" ADD CONSTRAINT "_pages_v_blocks_experts_case_study_id_cases_id_fk" FOREIGN KEY ("case_study_id") REFERENCES "public"."cases"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_experts" ADD CONSTRAINT "_pages_v_blocks_experts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq_items" ADD CONSTRAINT "_pages_v_blocks_faq_items_evidence_id_evidence_id_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."evidence"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq_items" ADD CONSTRAINT "_pages_v_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq" ADD CONSTRAINT "_pages_v_blocks_faq_case_study_id_cases_id_fk" FOREIGN KEY ("case_study_id") REFERENCES "public"."cases"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq" ADD CONSTRAINT "_pages_v_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_editorial_items" ADD CONSTRAINT "_pages_v_blocks_editorial_items_evidence_id_evidence_id_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."evidence"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_editorial_items" ADD CONSTRAINT "_pages_v_blocks_editorial_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_editorial"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_editorial" ADD CONSTRAINT "_pages_v_blocks_editorial_case_study_id_cases_id_fk" FOREIGN KEY ("case_study_id") REFERENCES "public"."cases"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_editorial" ADD CONSTRAINT "_pages_v_blocks_editorial_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_items" ADD CONSTRAINT "_pages_v_blocks_cta_items_evidence_id_evidence_id_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."evidence"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_items" ADD CONSTRAINT "_pages_v_blocks_cta_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta" ADD CONSTRAINT "_pages_v_blocks_cta_case_study_id_cases_id_fk" FOREIGN KEY ("case_study_id") REFERENCES "public"."cases"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta" ADD CONSTRAINT "_pages_v_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_experts_fk" FOREIGN KEY ("experts_id") REFERENCES "public"."experts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_includes" ADD CONSTRAINT "products_includes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_excludes" ADD CONSTRAINT "products_excludes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_story_items" ADD CONSTRAINT "products_blocks_story_items_evidence_id_evidence_id_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."evidence"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_blocks_story_items" ADD CONSTRAINT "products_blocks_story_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_blocks_story"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_story" ADD CONSTRAINT "products_blocks_story_case_study_id_cases_id_fk" FOREIGN KEY ("case_study_id") REFERENCES "public"."cases"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_blocks_story" ADD CONSTRAINT "products_blocks_story_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_problems_items" ADD CONSTRAINT "products_blocks_problems_items_evidence_id_evidence_id_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."evidence"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_blocks_problems_items" ADD CONSTRAINT "products_blocks_problems_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_blocks_problems"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_problems" ADD CONSTRAINT "products_blocks_problems_case_study_id_cases_id_fk" FOREIGN KEY ("case_study_id") REFERENCES "public"."cases"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_blocks_problems" ADD CONSTRAINT "products_blocks_problems_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_system_items" ADD CONSTRAINT "products_blocks_system_items_evidence_id_evidence_id_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."evidence"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_blocks_system_items" ADD CONSTRAINT "products_blocks_system_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_blocks_system"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_system" ADD CONSTRAINT "products_blocks_system_case_study_id_cases_id_fk" FOREIGN KEY ("case_study_id") REFERENCES "public"."cases"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_blocks_system" ADD CONSTRAINT "products_blocks_system_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_products_items" ADD CONSTRAINT "products_blocks_products_items_evidence_id_evidence_id_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."evidence"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_blocks_products_items" ADD CONSTRAINT "products_blocks_products_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_blocks_products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_products" ADD CONSTRAINT "products_blocks_products_case_study_id_cases_id_fk" FOREIGN KEY ("case_study_id") REFERENCES "public"."cases"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_blocks_products" ADD CONSTRAINT "products_blocks_products_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_selector_items" ADD CONSTRAINT "products_blocks_selector_items_evidence_id_evidence_id_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."evidence"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_blocks_selector_items" ADD CONSTRAINT "products_blocks_selector_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_blocks_selector"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_selector" ADD CONSTRAINT "products_blocks_selector_case_study_id_cases_id_fk" FOREIGN KEY ("case_study_id") REFERENCES "public"."cases"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_blocks_selector" ADD CONSTRAINT "products_blocks_selector_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_preview_items" ADD CONSTRAINT "products_blocks_preview_items_evidence_id_evidence_id_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."evidence"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_blocks_preview_items" ADD CONSTRAINT "products_blocks_preview_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_blocks_preview"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_preview" ADD CONSTRAINT "products_blocks_preview_case_study_id_cases_id_fk" FOREIGN KEY ("case_study_id") REFERENCES "public"."cases"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_blocks_preview" ADD CONSTRAINT "products_blocks_preview_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_experts_items" ADD CONSTRAINT "products_blocks_experts_items_evidence_id_evidence_id_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."evidence"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_blocks_experts_items" ADD CONSTRAINT "products_blocks_experts_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_blocks_experts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_experts" ADD CONSTRAINT "products_blocks_experts_case_study_id_cases_id_fk" FOREIGN KEY ("case_study_id") REFERENCES "public"."cases"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_blocks_experts" ADD CONSTRAINT "products_blocks_experts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_faq_items" ADD CONSTRAINT "products_blocks_faq_items_evidence_id_evidence_id_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."evidence"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_blocks_faq_items" ADD CONSTRAINT "products_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_faq" ADD CONSTRAINT "products_blocks_faq_case_study_id_cases_id_fk" FOREIGN KEY ("case_study_id") REFERENCES "public"."cases"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_blocks_faq" ADD CONSTRAINT "products_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_editorial_items" ADD CONSTRAINT "products_blocks_editorial_items_evidence_id_evidence_id_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."evidence"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_blocks_editorial_items" ADD CONSTRAINT "products_blocks_editorial_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_blocks_editorial"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_editorial" ADD CONSTRAINT "products_blocks_editorial_case_study_id_cases_id_fk" FOREIGN KEY ("case_study_id") REFERENCES "public"."cases"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_blocks_editorial" ADD CONSTRAINT "products_blocks_editorial_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_cta_items" ADD CONSTRAINT "products_blocks_cta_items_evidence_id_evidence_id_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."evidence"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_blocks_cta_items" ADD CONSTRAINT "products_blocks_cta_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_cta" ADD CONSTRAINT "products_blocks_cta_case_study_id_cases_id_fk" FOREIGN KEY ("case_study_id") REFERENCES "public"."cases"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_blocks_cta" ADD CONSTRAINT "products_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_experts_fk" FOREIGN KEY ("experts_id") REFERENCES "public"."experts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_includes" ADD CONSTRAINT "_products_v_version_includes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_excludes" ADD CONSTRAINT "_products_v_version_excludes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_story_items" ADD CONSTRAINT "_products_v_blocks_story_items_evidence_id_evidence_id_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."evidence"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_story_items" ADD CONSTRAINT "_products_v_blocks_story_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_blocks_story"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_story" ADD CONSTRAINT "_products_v_blocks_story_case_study_id_cases_id_fk" FOREIGN KEY ("case_study_id") REFERENCES "public"."cases"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_story" ADD CONSTRAINT "_products_v_blocks_story_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_problems_items" ADD CONSTRAINT "_products_v_blocks_problems_items_evidence_id_evidence_id_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."evidence"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_problems_items" ADD CONSTRAINT "_products_v_blocks_problems_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_blocks_problems"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_problems" ADD CONSTRAINT "_products_v_blocks_problems_case_study_id_cases_id_fk" FOREIGN KEY ("case_study_id") REFERENCES "public"."cases"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_problems" ADD CONSTRAINT "_products_v_blocks_problems_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_system_items" ADD CONSTRAINT "_products_v_blocks_system_items_evidence_id_evidence_id_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."evidence"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_system_items" ADD CONSTRAINT "_products_v_blocks_system_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_blocks_system"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_system" ADD CONSTRAINT "_products_v_blocks_system_case_study_id_cases_id_fk" FOREIGN KEY ("case_study_id") REFERENCES "public"."cases"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_system" ADD CONSTRAINT "_products_v_blocks_system_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_products_items" ADD CONSTRAINT "_products_v_blocks_products_items_evidence_id_evidence_id_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."evidence"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_products_items" ADD CONSTRAINT "_products_v_blocks_products_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_blocks_products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_products" ADD CONSTRAINT "_products_v_blocks_products_case_study_id_cases_id_fk" FOREIGN KEY ("case_study_id") REFERENCES "public"."cases"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_products" ADD CONSTRAINT "_products_v_blocks_products_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_selector_items" ADD CONSTRAINT "_products_v_blocks_selector_items_evidence_id_evidence_id_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."evidence"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_selector_items" ADD CONSTRAINT "_products_v_blocks_selector_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_blocks_selector"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_selector" ADD CONSTRAINT "_products_v_blocks_selector_case_study_id_cases_id_fk" FOREIGN KEY ("case_study_id") REFERENCES "public"."cases"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_selector" ADD CONSTRAINT "_products_v_blocks_selector_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_preview_items" ADD CONSTRAINT "_products_v_blocks_preview_items_evidence_id_evidence_id_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."evidence"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_preview_items" ADD CONSTRAINT "_products_v_blocks_preview_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_blocks_preview"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_preview" ADD CONSTRAINT "_products_v_blocks_preview_case_study_id_cases_id_fk" FOREIGN KEY ("case_study_id") REFERENCES "public"."cases"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_preview" ADD CONSTRAINT "_products_v_blocks_preview_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_experts_items" ADD CONSTRAINT "_products_v_blocks_experts_items_evidence_id_evidence_id_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."evidence"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_experts_items" ADD CONSTRAINT "_products_v_blocks_experts_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_blocks_experts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_experts" ADD CONSTRAINT "_products_v_blocks_experts_case_study_id_cases_id_fk" FOREIGN KEY ("case_study_id") REFERENCES "public"."cases"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_experts" ADD CONSTRAINT "_products_v_blocks_experts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_faq_items" ADD CONSTRAINT "_products_v_blocks_faq_items_evidence_id_evidence_id_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."evidence"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_faq_items" ADD CONSTRAINT "_products_v_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_faq" ADD CONSTRAINT "_products_v_blocks_faq_case_study_id_cases_id_fk" FOREIGN KEY ("case_study_id") REFERENCES "public"."cases"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_faq" ADD CONSTRAINT "_products_v_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_editorial_items" ADD CONSTRAINT "_products_v_blocks_editorial_items_evidence_id_evidence_id_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."evidence"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_editorial_items" ADD CONSTRAINT "_products_v_blocks_editorial_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_blocks_editorial"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_editorial" ADD CONSTRAINT "_products_v_blocks_editorial_case_study_id_cases_id_fk" FOREIGN KEY ("case_study_id") REFERENCES "public"."cases"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_editorial" ADD CONSTRAINT "_products_v_blocks_editorial_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_cta_items" ADD CONSTRAINT "_products_v_blocks_cta_items_evidence_id_evidence_id_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."evidence"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_cta_items" ADD CONSTRAINT "_products_v_blocks_cta_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_cta" ADD CONSTRAINT "_products_v_blocks_cta_case_study_id_cases_id_fk" FOREIGN KEY ("case_study_id") REFERENCES "public"."cases"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_cta" ADD CONSTRAINT "_products_v_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_parent_id_products_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_experts_fk" FOREIGN KEY ("experts_id") REFERENCES "public"."experts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cases_chapters" ADD CONSTRAINT "cases_chapters_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cases_chapters" ADD CONSTRAINT "cases_chapters_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cases_capabilities" ADD CONSTRAINT "cases_capabilities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cases" ADD CONSTRAINT "cases_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cases" ADD CONSTRAINT "cases_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cases_rels" ADD CONSTRAINT "cases_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."cases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cases_rels" ADD CONSTRAINT "cases_rels_evidence_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."evidence"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_cases_v_version_chapters" ADD CONSTRAINT "_cases_v_version_chapters_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_cases_v_version_chapters" ADD CONSTRAINT "_cases_v_version_chapters_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_cases_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_cases_v_version_capabilities" ADD CONSTRAINT "_cases_v_version_capabilities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_cases_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_cases_v" ADD CONSTRAINT "_cases_v_parent_id_cases_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."cases"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_cases_v" ADD CONSTRAINT "_cases_v_version_logo_id_media_id_fk" FOREIGN KEY ("version_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_cases_v" ADD CONSTRAINT "_cases_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_cases_v_rels" ADD CONSTRAINT "_cases_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_cases_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_cases_v_rels" ADD CONSTRAINT "_cases_v_rels_evidence_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."evidence"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "evidence" ADD CONSTRAINT "evidence_case_study_id_cases_id_fk" FOREIGN KEY ("case_study_id") REFERENCES "public"."cases"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "evidence_rels" ADD CONSTRAINT "evidence_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."evidence"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "evidence_rels" ADD CONSTRAINT "evidence_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_evidence_v" ADD CONSTRAINT "_evidence_v_parent_id_evidence_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."evidence"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_evidence_v" ADD CONSTRAINT "_evidence_v_version_case_study_id_cases_id_fk" FOREIGN KEY ("version_case_study_id") REFERENCES "public"."cases"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_evidence_v_rels" ADD CONSTRAINT "_evidence_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_evidence_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_evidence_v_rels" ADD CONSTRAINT "_evidence_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_blocks_story_items" ADD CONSTRAINT "articles_blocks_story_items_evidence_id_evidence_id_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."evidence"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles_blocks_story_items" ADD CONSTRAINT "articles_blocks_story_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles_blocks_story"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_blocks_story" ADD CONSTRAINT "articles_blocks_story_case_study_id_cases_id_fk" FOREIGN KEY ("case_study_id") REFERENCES "public"."cases"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles_blocks_story" ADD CONSTRAINT "articles_blocks_story_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_blocks_problems_items" ADD CONSTRAINT "articles_blocks_problems_items_evidence_id_evidence_id_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."evidence"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles_blocks_problems_items" ADD CONSTRAINT "articles_blocks_problems_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles_blocks_problems"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_blocks_problems" ADD CONSTRAINT "articles_blocks_problems_case_study_id_cases_id_fk" FOREIGN KEY ("case_study_id") REFERENCES "public"."cases"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles_blocks_problems" ADD CONSTRAINT "articles_blocks_problems_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_blocks_system_items" ADD CONSTRAINT "articles_blocks_system_items_evidence_id_evidence_id_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."evidence"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles_blocks_system_items" ADD CONSTRAINT "articles_blocks_system_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles_blocks_system"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_blocks_system" ADD CONSTRAINT "articles_blocks_system_case_study_id_cases_id_fk" FOREIGN KEY ("case_study_id") REFERENCES "public"."cases"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles_blocks_system" ADD CONSTRAINT "articles_blocks_system_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_blocks_products_items" ADD CONSTRAINT "articles_blocks_products_items_evidence_id_evidence_id_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."evidence"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles_blocks_products_items" ADD CONSTRAINT "articles_blocks_products_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles_blocks_products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_blocks_products" ADD CONSTRAINT "articles_blocks_products_case_study_id_cases_id_fk" FOREIGN KEY ("case_study_id") REFERENCES "public"."cases"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles_blocks_products" ADD CONSTRAINT "articles_blocks_products_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_blocks_selector_items" ADD CONSTRAINT "articles_blocks_selector_items_evidence_id_evidence_id_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."evidence"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles_blocks_selector_items" ADD CONSTRAINT "articles_blocks_selector_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles_blocks_selector"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_blocks_selector" ADD CONSTRAINT "articles_blocks_selector_case_study_id_cases_id_fk" FOREIGN KEY ("case_study_id") REFERENCES "public"."cases"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles_blocks_selector" ADD CONSTRAINT "articles_blocks_selector_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_blocks_preview_items" ADD CONSTRAINT "articles_blocks_preview_items_evidence_id_evidence_id_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."evidence"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles_blocks_preview_items" ADD CONSTRAINT "articles_blocks_preview_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles_blocks_preview"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_blocks_preview" ADD CONSTRAINT "articles_blocks_preview_case_study_id_cases_id_fk" FOREIGN KEY ("case_study_id") REFERENCES "public"."cases"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles_blocks_preview" ADD CONSTRAINT "articles_blocks_preview_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_blocks_experts_items" ADD CONSTRAINT "articles_blocks_experts_items_evidence_id_evidence_id_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."evidence"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles_blocks_experts_items" ADD CONSTRAINT "articles_blocks_experts_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles_blocks_experts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_blocks_experts" ADD CONSTRAINT "articles_blocks_experts_case_study_id_cases_id_fk" FOREIGN KEY ("case_study_id") REFERENCES "public"."cases"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles_blocks_experts" ADD CONSTRAINT "articles_blocks_experts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_blocks_faq_items" ADD CONSTRAINT "articles_blocks_faq_items_evidence_id_evidence_id_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."evidence"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles_blocks_faq_items" ADD CONSTRAINT "articles_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_blocks_faq" ADD CONSTRAINT "articles_blocks_faq_case_study_id_cases_id_fk" FOREIGN KEY ("case_study_id") REFERENCES "public"."cases"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles_blocks_faq" ADD CONSTRAINT "articles_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_blocks_editorial_items" ADD CONSTRAINT "articles_blocks_editorial_items_evidence_id_evidence_id_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."evidence"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles_blocks_editorial_items" ADD CONSTRAINT "articles_blocks_editorial_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles_blocks_editorial"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_blocks_editorial" ADD CONSTRAINT "articles_blocks_editorial_case_study_id_cases_id_fk" FOREIGN KEY ("case_study_id") REFERENCES "public"."cases"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles_blocks_editorial" ADD CONSTRAINT "articles_blocks_editorial_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_blocks_cta_items" ADD CONSTRAINT "articles_blocks_cta_items_evidence_id_evidence_id_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."evidence"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles_blocks_cta_items" ADD CONSTRAINT "articles_blocks_cta_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_blocks_cta" ADD CONSTRAINT "articles_blocks_cta_case_study_id_cases_id_fk" FOREIGN KEY ("case_study_id") REFERENCES "public"."cases"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles_blocks_cta" ADD CONSTRAINT "articles_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_author_id_experts_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."experts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles_rels" ADD CONSTRAINT "articles_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_rels" ADD CONSTRAINT "articles_rels_experts_fk" FOREIGN KEY ("experts_id") REFERENCES "public"."experts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_blocks_story_items" ADD CONSTRAINT "_articles_v_blocks_story_items_evidence_id_evidence_id_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."evidence"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v_blocks_story_items" ADD CONSTRAINT "_articles_v_blocks_story_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_articles_v_blocks_story"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_blocks_story" ADD CONSTRAINT "_articles_v_blocks_story_case_study_id_cases_id_fk" FOREIGN KEY ("case_study_id") REFERENCES "public"."cases"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v_blocks_story" ADD CONSTRAINT "_articles_v_blocks_story_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_articles_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_blocks_problems_items" ADD CONSTRAINT "_articles_v_blocks_problems_items_evidence_id_evidence_id_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."evidence"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v_blocks_problems_items" ADD CONSTRAINT "_articles_v_blocks_problems_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_articles_v_blocks_problems"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_blocks_problems" ADD CONSTRAINT "_articles_v_blocks_problems_case_study_id_cases_id_fk" FOREIGN KEY ("case_study_id") REFERENCES "public"."cases"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v_blocks_problems" ADD CONSTRAINT "_articles_v_blocks_problems_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_articles_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_blocks_system_items" ADD CONSTRAINT "_articles_v_blocks_system_items_evidence_id_evidence_id_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."evidence"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v_blocks_system_items" ADD CONSTRAINT "_articles_v_blocks_system_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_articles_v_blocks_system"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_blocks_system" ADD CONSTRAINT "_articles_v_blocks_system_case_study_id_cases_id_fk" FOREIGN KEY ("case_study_id") REFERENCES "public"."cases"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v_blocks_system" ADD CONSTRAINT "_articles_v_blocks_system_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_articles_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_blocks_products_items" ADD CONSTRAINT "_articles_v_blocks_products_items_evidence_id_evidence_id_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."evidence"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v_blocks_products_items" ADD CONSTRAINT "_articles_v_blocks_products_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_articles_v_blocks_products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_blocks_products" ADD CONSTRAINT "_articles_v_blocks_products_case_study_id_cases_id_fk" FOREIGN KEY ("case_study_id") REFERENCES "public"."cases"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v_blocks_products" ADD CONSTRAINT "_articles_v_blocks_products_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_articles_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_blocks_selector_items" ADD CONSTRAINT "_articles_v_blocks_selector_items_evidence_id_evidence_id_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."evidence"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v_blocks_selector_items" ADD CONSTRAINT "_articles_v_blocks_selector_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_articles_v_blocks_selector"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_blocks_selector" ADD CONSTRAINT "_articles_v_blocks_selector_case_study_id_cases_id_fk" FOREIGN KEY ("case_study_id") REFERENCES "public"."cases"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v_blocks_selector" ADD CONSTRAINT "_articles_v_blocks_selector_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_articles_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_blocks_preview_items" ADD CONSTRAINT "_articles_v_blocks_preview_items_evidence_id_evidence_id_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."evidence"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v_blocks_preview_items" ADD CONSTRAINT "_articles_v_blocks_preview_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_articles_v_blocks_preview"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_blocks_preview" ADD CONSTRAINT "_articles_v_blocks_preview_case_study_id_cases_id_fk" FOREIGN KEY ("case_study_id") REFERENCES "public"."cases"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v_blocks_preview" ADD CONSTRAINT "_articles_v_blocks_preview_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_articles_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_blocks_experts_items" ADD CONSTRAINT "_articles_v_blocks_experts_items_evidence_id_evidence_id_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."evidence"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v_blocks_experts_items" ADD CONSTRAINT "_articles_v_blocks_experts_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_articles_v_blocks_experts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_blocks_experts" ADD CONSTRAINT "_articles_v_blocks_experts_case_study_id_cases_id_fk" FOREIGN KEY ("case_study_id") REFERENCES "public"."cases"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v_blocks_experts" ADD CONSTRAINT "_articles_v_blocks_experts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_articles_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_blocks_faq_items" ADD CONSTRAINT "_articles_v_blocks_faq_items_evidence_id_evidence_id_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."evidence"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v_blocks_faq_items" ADD CONSTRAINT "_articles_v_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_articles_v_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_blocks_faq" ADD CONSTRAINT "_articles_v_blocks_faq_case_study_id_cases_id_fk" FOREIGN KEY ("case_study_id") REFERENCES "public"."cases"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v_blocks_faq" ADD CONSTRAINT "_articles_v_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_articles_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_blocks_editorial_items" ADD CONSTRAINT "_articles_v_blocks_editorial_items_evidence_id_evidence_id_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."evidence"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v_blocks_editorial_items" ADD CONSTRAINT "_articles_v_blocks_editorial_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_articles_v_blocks_editorial"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_blocks_editorial" ADD CONSTRAINT "_articles_v_blocks_editorial_case_study_id_cases_id_fk" FOREIGN KEY ("case_study_id") REFERENCES "public"."cases"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v_blocks_editorial" ADD CONSTRAINT "_articles_v_blocks_editorial_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_articles_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_blocks_cta_items" ADD CONSTRAINT "_articles_v_blocks_cta_items_evidence_id_evidence_id_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."evidence"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v_blocks_cta_items" ADD CONSTRAINT "_articles_v_blocks_cta_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_articles_v_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_blocks_cta" ADD CONSTRAINT "_articles_v_blocks_cta_case_study_id_cases_id_fk" FOREIGN KEY ("case_study_id") REFERENCES "public"."cases"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v_blocks_cta" ADD CONSTRAINT "_articles_v_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_articles_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_parent_id_articles_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."articles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_version_author_id_experts_id_fk" FOREIGN KEY ("version_author_id") REFERENCES "public"."experts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v_rels" ADD CONSTRAINT "_articles_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_articles_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_rels" ADD CONSTRAINT "_articles_v_rels_experts_fk" FOREIGN KEY ("experts_id") REFERENCES "public"."experts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "experts" ADD CONSTRAINT "experts_portrait_id_media_id_fk" FOREIGN KEY ("portrait_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_experts_v" ADD CONSTRAINT "_experts_v_parent_id_experts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."experts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_experts_v" ADD CONSTRAINT "_experts_v_version_portrait_id_media_id_fk" FOREIGN KEY ("version_portrait_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_cases_fk" FOREIGN KEY ("cases_id") REFERENCES "public"."cases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_evidence_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."evidence"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_experts_fk" FOREIGN KEY ("experts_id") REFERENCES "public"."experts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_leads_fk" FOREIGN KEY ("leads_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_activity_fk" FOREIGN KEY ("activity_id") REFERENCES "public"."activity"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_navigation" ADD CONSTRAINT "site_navigation_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_footer_links" ADD CONSTRAINT "site_footer_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_social" ADD CONSTRAINT "site_social_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site" ADD CONSTRAINT "site_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site" ADD CONSTRAINT "site_social_image_id_media_id_fk" FOREIGN KEY ("social_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "audit_questions_options" ADD CONSTRAINT "audit_questions_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."audit_questions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "audit_questions" ADD CONSTRAINT "audit_questions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."audit"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_wide_sizes_wide_filename_idx" ON "media" USING btree ("sizes_wide_filename");
  CREATE INDEX "pages_blocks_story_items_order_idx" ON "pages_blocks_story_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_story_items_parent_id_idx" ON "pages_blocks_story_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_story_items_evidence_idx" ON "pages_blocks_story_items" USING btree ("evidence_id");
  CREATE INDEX "pages_blocks_story_order_idx" ON "pages_blocks_story" USING btree ("_order");
  CREATE INDEX "pages_blocks_story_parent_id_idx" ON "pages_blocks_story" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_story_path_idx" ON "pages_blocks_story" USING btree ("_path");
  CREATE INDEX "pages_blocks_story_case_study_idx" ON "pages_blocks_story" USING btree ("case_study_id");
  CREATE INDEX "pages_blocks_problems_items_order_idx" ON "pages_blocks_problems_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_problems_items_parent_id_idx" ON "pages_blocks_problems_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_problems_items_evidence_idx" ON "pages_blocks_problems_items" USING btree ("evidence_id");
  CREATE INDEX "pages_blocks_problems_order_idx" ON "pages_blocks_problems" USING btree ("_order");
  CREATE INDEX "pages_blocks_problems_parent_id_idx" ON "pages_blocks_problems" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_problems_path_idx" ON "pages_blocks_problems" USING btree ("_path");
  CREATE INDEX "pages_blocks_problems_case_study_idx" ON "pages_blocks_problems" USING btree ("case_study_id");
  CREATE INDEX "pages_blocks_system_items_order_idx" ON "pages_blocks_system_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_system_items_parent_id_idx" ON "pages_blocks_system_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_system_items_evidence_idx" ON "pages_blocks_system_items" USING btree ("evidence_id");
  CREATE INDEX "pages_blocks_system_order_idx" ON "pages_blocks_system" USING btree ("_order");
  CREATE INDEX "pages_blocks_system_parent_id_idx" ON "pages_blocks_system" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_system_path_idx" ON "pages_blocks_system" USING btree ("_path");
  CREATE INDEX "pages_blocks_system_case_study_idx" ON "pages_blocks_system" USING btree ("case_study_id");
  CREATE INDEX "pages_blocks_products_items_order_idx" ON "pages_blocks_products_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_products_items_parent_id_idx" ON "pages_blocks_products_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_products_items_evidence_idx" ON "pages_blocks_products_items" USING btree ("evidence_id");
  CREATE INDEX "pages_blocks_products_order_idx" ON "pages_blocks_products" USING btree ("_order");
  CREATE INDEX "pages_blocks_products_parent_id_idx" ON "pages_blocks_products" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_products_path_idx" ON "pages_blocks_products" USING btree ("_path");
  CREATE INDEX "pages_blocks_products_case_study_idx" ON "pages_blocks_products" USING btree ("case_study_id");
  CREATE INDEX "pages_blocks_selector_items_order_idx" ON "pages_blocks_selector_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_selector_items_parent_id_idx" ON "pages_blocks_selector_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_selector_items_evidence_idx" ON "pages_blocks_selector_items" USING btree ("evidence_id");
  CREATE INDEX "pages_blocks_selector_order_idx" ON "pages_blocks_selector" USING btree ("_order");
  CREATE INDEX "pages_blocks_selector_parent_id_idx" ON "pages_blocks_selector" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_selector_path_idx" ON "pages_blocks_selector" USING btree ("_path");
  CREATE INDEX "pages_blocks_selector_case_study_idx" ON "pages_blocks_selector" USING btree ("case_study_id");
  CREATE INDEX "pages_blocks_preview_items_order_idx" ON "pages_blocks_preview_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_preview_items_parent_id_idx" ON "pages_blocks_preview_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_preview_items_evidence_idx" ON "pages_blocks_preview_items" USING btree ("evidence_id");
  CREATE INDEX "pages_blocks_preview_order_idx" ON "pages_blocks_preview" USING btree ("_order");
  CREATE INDEX "pages_blocks_preview_parent_id_idx" ON "pages_blocks_preview" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_preview_path_idx" ON "pages_blocks_preview" USING btree ("_path");
  CREATE INDEX "pages_blocks_preview_case_study_idx" ON "pages_blocks_preview" USING btree ("case_study_id");
  CREATE INDEX "pages_blocks_experts_items_order_idx" ON "pages_blocks_experts_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_experts_items_parent_id_idx" ON "pages_blocks_experts_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_experts_items_evidence_idx" ON "pages_blocks_experts_items" USING btree ("evidence_id");
  CREATE INDEX "pages_blocks_experts_order_idx" ON "pages_blocks_experts" USING btree ("_order");
  CREATE INDEX "pages_blocks_experts_parent_id_idx" ON "pages_blocks_experts" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_experts_path_idx" ON "pages_blocks_experts" USING btree ("_path");
  CREATE INDEX "pages_blocks_experts_case_study_idx" ON "pages_blocks_experts" USING btree ("case_study_id");
  CREATE INDEX "pages_blocks_faq_items_order_idx" ON "pages_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_items_parent_id_idx" ON "pages_blocks_faq_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_items_evidence_idx" ON "pages_blocks_faq_items" USING btree ("evidence_id");
  CREATE INDEX "pages_blocks_faq_order_idx" ON "pages_blocks_faq" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_parent_id_idx" ON "pages_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_path_idx" ON "pages_blocks_faq" USING btree ("_path");
  CREATE INDEX "pages_blocks_faq_case_study_idx" ON "pages_blocks_faq" USING btree ("case_study_id");
  CREATE INDEX "pages_blocks_editorial_items_order_idx" ON "pages_blocks_editorial_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_editorial_items_parent_id_idx" ON "pages_blocks_editorial_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_editorial_items_evidence_idx" ON "pages_blocks_editorial_items" USING btree ("evidence_id");
  CREATE INDEX "pages_blocks_editorial_order_idx" ON "pages_blocks_editorial" USING btree ("_order");
  CREATE INDEX "pages_blocks_editorial_parent_id_idx" ON "pages_blocks_editorial" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_editorial_path_idx" ON "pages_blocks_editorial" USING btree ("_path");
  CREATE INDEX "pages_blocks_editorial_case_study_idx" ON "pages_blocks_editorial" USING btree ("case_study_id");
  CREATE INDEX "pages_blocks_cta_items_order_idx" ON "pages_blocks_cta_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_items_parent_id_idx" ON "pages_blocks_cta_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_items_evidence_idx" ON "pages_blocks_cta_items" USING btree ("evidence_id");
  CREATE INDEX "pages_blocks_cta_order_idx" ON "pages_blocks_cta" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_parent_id_idx" ON "pages_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_path_idx" ON "pages_blocks_cta" USING btree ("_path");
  CREATE INDEX "pages_blocks_cta_case_study_idx" ON "pages_blocks_cta" USING btree ("case_study_id");
  CREATE UNIQUE INDEX "pages_path_idx" ON "pages" USING btree ("path");
  CREATE INDEX "pages_seo_seo_image_idx" ON "pages" USING btree ("seo_image_id");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE INDEX "pages_rels_order_idx" ON "pages_rels" USING btree ("order");
  CREATE INDEX "pages_rels_parent_idx" ON "pages_rels" USING btree ("parent_id");
  CREATE INDEX "pages_rels_path_idx" ON "pages_rels" USING btree ("path");
  CREATE INDEX "pages_rels_experts_id_idx" ON "pages_rels" USING btree ("experts_id");
  CREATE INDEX "_pages_v_blocks_story_items_order_idx" ON "_pages_v_blocks_story_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_story_items_parent_id_idx" ON "_pages_v_blocks_story_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_story_items_evidence_idx" ON "_pages_v_blocks_story_items" USING btree ("evidence_id");
  CREATE INDEX "_pages_v_blocks_story_order_idx" ON "_pages_v_blocks_story" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_story_parent_id_idx" ON "_pages_v_blocks_story" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_story_path_idx" ON "_pages_v_blocks_story" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_story_case_study_idx" ON "_pages_v_blocks_story" USING btree ("case_study_id");
  CREATE INDEX "_pages_v_blocks_problems_items_order_idx" ON "_pages_v_blocks_problems_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_problems_items_parent_id_idx" ON "_pages_v_blocks_problems_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_problems_items_evidence_idx" ON "_pages_v_blocks_problems_items" USING btree ("evidence_id");
  CREATE INDEX "_pages_v_blocks_problems_order_idx" ON "_pages_v_blocks_problems" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_problems_parent_id_idx" ON "_pages_v_blocks_problems" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_problems_path_idx" ON "_pages_v_blocks_problems" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_problems_case_study_idx" ON "_pages_v_blocks_problems" USING btree ("case_study_id");
  CREATE INDEX "_pages_v_blocks_system_items_order_idx" ON "_pages_v_blocks_system_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_system_items_parent_id_idx" ON "_pages_v_blocks_system_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_system_items_evidence_idx" ON "_pages_v_blocks_system_items" USING btree ("evidence_id");
  CREATE INDEX "_pages_v_blocks_system_order_idx" ON "_pages_v_blocks_system" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_system_parent_id_idx" ON "_pages_v_blocks_system" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_system_path_idx" ON "_pages_v_blocks_system" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_system_case_study_idx" ON "_pages_v_blocks_system" USING btree ("case_study_id");
  CREATE INDEX "_pages_v_blocks_products_items_order_idx" ON "_pages_v_blocks_products_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_products_items_parent_id_idx" ON "_pages_v_blocks_products_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_products_items_evidence_idx" ON "_pages_v_blocks_products_items" USING btree ("evidence_id");
  CREATE INDEX "_pages_v_blocks_products_order_idx" ON "_pages_v_blocks_products" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_products_parent_id_idx" ON "_pages_v_blocks_products" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_products_path_idx" ON "_pages_v_blocks_products" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_products_case_study_idx" ON "_pages_v_blocks_products" USING btree ("case_study_id");
  CREATE INDEX "_pages_v_blocks_selector_items_order_idx" ON "_pages_v_blocks_selector_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_selector_items_parent_id_idx" ON "_pages_v_blocks_selector_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_selector_items_evidence_idx" ON "_pages_v_blocks_selector_items" USING btree ("evidence_id");
  CREATE INDEX "_pages_v_blocks_selector_order_idx" ON "_pages_v_blocks_selector" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_selector_parent_id_idx" ON "_pages_v_blocks_selector" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_selector_path_idx" ON "_pages_v_blocks_selector" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_selector_case_study_idx" ON "_pages_v_blocks_selector" USING btree ("case_study_id");
  CREATE INDEX "_pages_v_blocks_preview_items_order_idx" ON "_pages_v_blocks_preview_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_preview_items_parent_id_idx" ON "_pages_v_blocks_preview_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_preview_items_evidence_idx" ON "_pages_v_blocks_preview_items" USING btree ("evidence_id");
  CREATE INDEX "_pages_v_blocks_preview_order_idx" ON "_pages_v_blocks_preview" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_preview_parent_id_idx" ON "_pages_v_blocks_preview" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_preview_path_idx" ON "_pages_v_blocks_preview" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_preview_case_study_idx" ON "_pages_v_blocks_preview" USING btree ("case_study_id");
  CREATE INDEX "_pages_v_blocks_experts_items_order_idx" ON "_pages_v_blocks_experts_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_experts_items_parent_id_idx" ON "_pages_v_blocks_experts_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_experts_items_evidence_idx" ON "_pages_v_blocks_experts_items" USING btree ("evidence_id");
  CREATE INDEX "_pages_v_blocks_experts_order_idx" ON "_pages_v_blocks_experts" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_experts_parent_id_idx" ON "_pages_v_blocks_experts" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_experts_path_idx" ON "_pages_v_blocks_experts" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_experts_case_study_idx" ON "_pages_v_blocks_experts" USING btree ("case_study_id");
  CREATE INDEX "_pages_v_blocks_faq_items_order_idx" ON "_pages_v_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_items_parent_id_idx" ON "_pages_v_blocks_faq_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_items_evidence_idx" ON "_pages_v_blocks_faq_items" USING btree ("evidence_id");
  CREATE INDEX "_pages_v_blocks_faq_order_idx" ON "_pages_v_blocks_faq" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_parent_id_idx" ON "_pages_v_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_path_idx" ON "_pages_v_blocks_faq" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_faq_case_study_idx" ON "_pages_v_blocks_faq" USING btree ("case_study_id");
  CREATE INDEX "_pages_v_blocks_editorial_items_order_idx" ON "_pages_v_blocks_editorial_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_editorial_items_parent_id_idx" ON "_pages_v_blocks_editorial_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_editorial_items_evidence_idx" ON "_pages_v_blocks_editorial_items" USING btree ("evidence_id");
  CREATE INDEX "_pages_v_blocks_editorial_order_idx" ON "_pages_v_blocks_editorial" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_editorial_parent_id_idx" ON "_pages_v_blocks_editorial" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_editorial_path_idx" ON "_pages_v_blocks_editorial" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_editorial_case_study_idx" ON "_pages_v_blocks_editorial" USING btree ("case_study_id");
  CREATE INDEX "_pages_v_blocks_cta_items_order_idx" ON "_pages_v_blocks_cta_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_items_parent_id_idx" ON "_pages_v_blocks_cta_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_items_evidence_idx" ON "_pages_v_blocks_cta_items" USING btree ("evidence_id");
  CREATE INDEX "_pages_v_blocks_cta_order_idx" ON "_pages_v_blocks_cta" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_parent_id_idx" ON "_pages_v_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_path_idx" ON "_pages_v_blocks_cta" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_cta_case_study_idx" ON "_pages_v_blocks_cta" USING btree ("case_study_id");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_version_path_idx" ON "_pages_v" USING btree ("version_path");
  CREATE INDEX "_pages_v_version_seo_version_seo_image_idx" ON "_pages_v" USING btree ("version_seo_image_id");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE INDEX "_pages_v_autosave_idx" ON "_pages_v" USING btree ("autosave");
  CREATE INDEX "_pages_v_rels_order_idx" ON "_pages_v_rels" USING btree ("order");
  CREATE INDEX "_pages_v_rels_parent_idx" ON "_pages_v_rels" USING btree ("parent_id");
  CREATE INDEX "_pages_v_rels_path_idx" ON "_pages_v_rels" USING btree ("path");
  CREATE INDEX "_pages_v_rels_experts_id_idx" ON "_pages_v_rels" USING btree ("experts_id");
  CREATE INDEX "products_includes_order_idx" ON "products_includes" USING btree ("_order");
  CREATE INDEX "products_includes_parent_id_idx" ON "products_includes" USING btree ("_parent_id");
  CREATE INDEX "products_excludes_order_idx" ON "products_excludes" USING btree ("_order");
  CREATE INDEX "products_excludes_parent_id_idx" ON "products_excludes" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_story_items_order_idx" ON "products_blocks_story_items" USING btree ("_order");
  CREATE INDEX "products_blocks_story_items_parent_id_idx" ON "products_blocks_story_items" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_story_items_evidence_idx" ON "products_blocks_story_items" USING btree ("evidence_id");
  CREATE INDEX "products_blocks_story_order_idx" ON "products_blocks_story" USING btree ("_order");
  CREATE INDEX "products_blocks_story_parent_id_idx" ON "products_blocks_story" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_story_path_idx" ON "products_blocks_story" USING btree ("_path");
  CREATE INDEX "products_blocks_story_case_study_idx" ON "products_blocks_story" USING btree ("case_study_id");
  CREATE INDEX "products_blocks_problems_items_order_idx" ON "products_blocks_problems_items" USING btree ("_order");
  CREATE INDEX "products_blocks_problems_items_parent_id_idx" ON "products_blocks_problems_items" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_problems_items_evidence_idx" ON "products_blocks_problems_items" USING btree ("evidence_id");
  CREATE INDEX "products_blocks_problems_order_idx" ON "products_blocks_problems" USING btree ("_order");
  CREATE INDEX "products_blocks_problems_parent_id_idx" ON "products_blocks_problems" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_problems_path_idx" ON "products_blocks_problems" USING btree ("_path");
  CREATE INDEX "products_blocks_problems_case_study_idx" ON "products_blocks_problems" USING btree ("case_study_id");
  CREATE INDEX "products_blocks_system_items_order_idx" ON "products_blocks_system_items" USING btree ("_order");
  CREATE INDEX "products_blocks_system_items_parent_id_idx" ON "products_blocks_system_items" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_system_items_evidence_idx" ON "products_blocks_system_items" USING btree ("evidence_id");
  CREATE INDEX "products_blocks_system_order_idx" ON "products_blocks_system" USING btree ("_order");
  CREATE INDEX "products_blocks_system_parent_id_idx" ON "products_blocks_system" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_system_path_idx" ON "products_blocks_system" USING btree ("_path");
  CREATE INDEX "products_blocks_system_case_study_idx" ON "products_blocks_system" USING btree ("case_study_id");
  CREATE INDEX "products_blocks_products_items_order_idx" ON "products_blocks_products_items" USING btree ("_order");
  CREATE INDEX "products_blocks_products_items_parent_id_idx" ON "products_blocks_products_items" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_products_items_evidence_idx" ON "products_blocks_products_items" USING btree ("evidence_id");
  CREATE INDEX "products_blocks_products_order_idx" ON "products_blocks_products" USING btree ("_order");
  CREATE INDEX "products_blocks_products_parent_id_idx" ON "products_blocks_products" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_products_path_idx" ON "products_blocks_products" USING btree ("_path");
  CREATE INDEX "products_blocks_products_case_study_idx" ON "products_blocks_products" USING btree ("case_study_id");
  CREATE INDEX "products_blocks_selector_items_order_idx" ON "products_blocks_selector_items" USING btree ("_order");
  CREATE INDEX "products_blocks_selector_items_parent_id_idx" ON "products_blocks_selector_items" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_selector_items_evidence_idx" ON "products_blocks_selector_items" USING btree ("evidence_id");
  CREATE INDEX "products_blocks_selector_order_idx" ON "products_blocks_selector" USING btree ("_order");
  CREATE INDEX "products_blocks_selector_parent_id_idx" ON "products_blocks_selector" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_selector_path_idx" ON "products_blocks_selector" USING btree ("_path");
  CREATE INDEX "products_blocks_selector_case_study_idx" ON "products_blocks_selector" USING btree ("case_study_id");
  CREATE INDEX "products_blocks_preview_items_order_idx" ON "products_blocks_preview_items" USING btree ("_order");
  CREATE INDEX "products_blocks_preview_items_parent_id_idx" ON "products_blocks_preview_items" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_preview_items_evidence_idx" ON "products_blocks_preview_items" USING btree ("evidence_id");
  CREATE INDEX "products_blocks_preview_order_idx" ON "products_blocks_preview" USING btree ("_order");
  CREATE INDEX "products_blocks_preview_parent_id_idx" ON "products_blocks_preview" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_preview_path_idx" ON "products_blocks_preview" USING btree ("_path");
  CREATE INDEX "products_blocks_preview_case_study_idx" ON "products_blocks_preview" USING btree ("case_study_id");
  CREATE INDEX "products_blocks_experts_items_order_idx" ON "products_blocks_experts_items" USING btree ("_order");
  CREATE INDEX "products_blocks_experts_items_parent_id_idx" ON "products_blocks_experts_items" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_experts_items_evidence_idx" ON "products_blocks_experts_items" USING btree ("evidence_id");
  CREATE INDEX "products_blocks_experts_order_idx" ON "products_blocks_experts" USING btree ("_order");
  CREATE INDEX "products_blocks_experts_parent_id_idx" ON "products_blocks_experts" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_experts_path_idx" ON "products_blocks_experts" USING btree ("_path");
  CREATE INDEX "products_blocks_experts_case_study_idx" ON "products_blocks_experts" USING btree ("case_study_id");
  CREATE INDEX "products_blocks_faq_items_order_idx" ON "products_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "products_blocks_faq_items_parent_id_idx" ON "products_blocks_faq_items" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_faq_items_evidence_idx" ON "products_blocks_faq_items" USING btree ("evidence_id");
  CREATE INDEX "products_blocks_faq_order_idx" ON "products_blocks_faq" USING btree ("_order");
  CREATE INDEX "products_blocks_faq_parent_id_idx" ON "products_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_faq_path_idx" ON "products_blocks_faq" USING btree ("_path");
  CREATE INDEX "products_blocks_faq_case_study_idx" ON "products_blocks_faq" USING btree ("case_study_id");
  CREATE INDEX "products_blocks_editorial_items_order_idx" ON "products_blocks_editorial_items" USING btree ("_order");
  CREATE INDEX "products_blocks_editorial_items_parent_id_idx" ON "products_blocks_editorial_items" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_editorial_items_evidence_idx" ON "products_blocks_editorial_items" USING btree ("evidence_id");
  CREATE INDEX "products_blocks_editorial_order_idx" ON "products_blocks_editorial" USING btree ("_order");
  CREATE INDEX "products_blocks_editorial_parent_id_idx" ON "products_blocks_editorial" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_editorial_path_idx" ON "products_blocks_editorial" USING btree ("_path");
  CREATE INDEX "products_blocks_editorial_case_study_idx" ON "products_blocks_editorial" USING btree ("case_study_id");
  CREATE INDEX "products_blocks_cta_items_order_idx" ON "products_blocks_cta_items" USING btree ("_order");
  CREATE INDEX "products_blocks_cta_items_parent_id_idx" ON "products_blocks_cta_items" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_cta_items_evidence_idx" ON "products_blocks_cta_items" USING btree ("evidence_id");
  CREATE INDEX "products_blocks_cta_order_idx" ON "products_blocks_cta" USING btree ("_order");
  CREATE INDEX "products_blocks_cta_parent_id_idx" ON "products_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_cta_path_idx" ON "products_blocks_cta" USING btree ("_path");
  CREATE INDEX "products_blocks_cta_case_study_idx" ON "products_blocks_cta" USING btree ("case_study_id");
  CREATE UNIQUE INDEX "products_slug_idx" ON "products" USING btree ("slug");
  CREATE INDEX "products_seo_seo_image_idx" ON "products" USING btree ("seo_image_id");
  CREATE INDEX "products_updated_at_idx" ON "products" USING btree ("updated_at");
  CREATE INDEX "products_created_at_idx" ON "products" USING btree ("created_at");
  CREATE INDEX "products__status_idx" ON "products" USING btree ("_status");
  CREATE INDEX "products_rels_order_idx" ON "products_rels" USING btree ("order");
  CREATE INDEX "products_rels_parent_idx" ON "products_rels" USING btree ("parent_id");
  CREATE INDEX "products_rels_path_idx" ON "products_rels" USING btree ("path");
  CREATE INDEX "products_rels_experts_id_idx" ON "products_rels" USING btree ("experts_id");
  CREATE INDEX "_products_v_version_includes_order_idx" ON "_products_v_version_includes" USING btree ("_order");
  CREATE INDEX "_products_v_version_includes_parent_id_idx" ON "_products_v_version_includes" USING btree ("_parent_id");
  CREATE INDEX "_products_v_version_excludes_order_idx" ON "_products_v_version_excludes" USING btree ("_order");
  CREATE INDEX "_products_v_version_excludes_parent_id_idx" ON "_products_v_version_excludes" USING btree ("_parent_id");
  CREATE INDEX "_products_v_blocks_story_items_order_idx" ON "_products_v_blocks_story_items" USING btree ("_order");
  CREATE INDEX "_products_v_blocks_story_items_parent_id_idx" ON "_products_v_blocks_story_items" USING btree ("_parent_id");
  CREATE INDEX "_products_v_blocks_story_items_evidence_idx" ON "_products_v_blocks_story_items" USING btree ("evidence_id");
  CREATE INDEX "_products_v_blocks_story_order_idx" ON "_products_v_blocks_story" USING btree ("_order");
  CREATE INDEX "_products_v_blocks_story_parent_id_idx" ON "_products_v_blocks_story" USING btree ("_parent_id");
  CREATE INDEX "_products_v_blocks_story_path_idx" ON "_products_v_blocks_story" USING btree ("_path");
  CREATE INDEX "_products_v_blocks_story_case_study_idx" ON "_products_v_blocks_story" USING btree ("case_study_id");
  CREATE INDEX "_products_v_blocks_problems_items_order_idx" ON "_products_v_blocks_problems_items" USING btree ("_order");
  CREATE INDEX "_products_v_blocks_problems_items_parent_id_idx" ON "_products_v_blocks_problems_items" USING btree ("_parent_id");
  CREATE INDEX "_products_v_blocks_problems_items_evidence_idx" ON "_products_v_blocks_problems_items" USING btree ("evidence_id");
  CREATE INDEX "_products_v_blocks_problems_order_idx" ON "_products_v_blocks_problems" USING btree ("_order");
  CREATE INDEX "_products_v_blocks_problems_parent_id_idx" ON "_products_v_blocks_problems" USING btree ("_parent_id");
  CREATE INDEX "_products_v_blocks_problems_path_idx" ON "_products_v_blocks_problems" USING btree ("_path");
  CREATE INDEX "_products_v_blocks_problems_case_study_idx" ON "_products_v_blocks_problems" USING btree ("case_study_id");
  CREATE INDEX "_products_v_blocks_system_items_order_idx" ON "_products_v_blocks_system_items" USING btree ("_order");
  CREATE INDEX "_products_v_blocks_system_items_parent_id_idx" ON "_products_v_blocks_system_items" USING btree ("_parent_id");
  CREATE INDEX "_products_v_blocks_system_items_evidence_idx" ON "_products_v_blocks_system_items" USING btree ("evidence_id");
  CREATE INDEX "_products_v_blocks_system_order_idx" ON "_products_v_blocks_system" USING btree ("_order");
  CREATE INDEX "_products_v_blocks_system_parent_id_idx" ON "_products_v_blocks_system" USING btree ("_parent_id");
  CREATE INDEX "_products_v_blocks_system_path_idx" ON "_products_v_blocks_system" USING btree ("_path");
  CREATE INDEX "_products_v_blocks_system_case_study_idx" ON "_products_v_blocks_system" USING btree ("case_study_id");
  CREATE INDEX "_products_v_blocks_products_items_order_idx" ON "_products_v_blocks_products_items" USING btree ("_order");
  CREATE INDEX "_products_v_blocks_products_items_parent_id_idx" ON "_products_v_blocks_products_items" USING btree ("_parent_id");
  CREATE INDEX "_products_v_blocks_products_items_evidence_idx" ON "_products_v_blocks_products_items" USING btree ("evidence_id");
  CREATE INDEX "_products_v_blocks_products_order_idx" ON "_products_v_blocks_products" USING btree ("_order");
  CREATE INDEX "_products_v_blocks_products_parent_id_idx" ON "_products_v_blocks_products" USING btree ("_parent_id");
  CREATE INDEX "_products_v_blocks_products_path_idx" ON "_products_v_blocks_products" USING btree ("_path");
  CREATE INDEX "_products_v_blocks_products_case_study_idx" ON "_products_v_blocks_products" USING btree ("case_study_id");
  CREATE INDEX "_products_v_blocks_selector_items_order_idx" ON "_products_v_blocks_selector_items" USING btree ("_order");
  CREATE INDEX "_products_v_blocks_selector_items_parent_id_idx" ON "_products_v_blocks_selector_items" USING btree ("_parent_id");
  CREATE INDEX "_products_v_blocks_selector_items_evidence_idx" ON "_products_v_blocks_selector_items" USING btree ("evidence_id");
  CREATE INDEX "_products_v_blocks_selector_order_idx" ON "_products_v_blocks_selector" USING btree ("_order");
  CREATE INDEX "_products_v_blocks_selector_parent_id_idx" ON "_products_v_blocks_selector" USING btree ("_parent_id");
  CREATE INDEX "_products_v_blocks_selector_path_idx" ON "_products_v_blocks_selector" USING btree ("_path");
  CREATE INDEX "_products_v_blocks_selector_case_study_idx" ON "_products_v_blocks_selector" USING btree ("case_study_id");
  CREATE INDEX "_products_v_blocks_preview_items_order_idx" ON "_products_v_blocks_preview_items" USING btree ("_order");
  CREATE INDEX "_products_v_blocks_preview_items_parent_id_idx" ON "_products_v_blocks_preview_items" USING btree ("_parent_id");
  CREATE INDEX "_products_v_blocks_preview_items_evidence_idx" ON "_products_v_blocks_preview_items" USING btree ("evidence_id");
  CREATE INDEX "_products_v_blocks_preview_order_idx" ON "_products_v_blocks_preview" USING btree ("_order");
  CREATE INDEX "_products_v_blocks_preview_parent_id_idx" ON "_products_v_blocks_preview" USING btree ("_parent_id");
  CREATE INDEX "_products_v_blocks_preview_path_idx" ON "_products_v_blocks_preview" USING btree ("_path");
  CREATE INDEX "_products_v_blocks_preview_case_study_idx" ON "_products_v_blocks_preview" USING btree ("case_study_id");
  CREATE INDEX "_products_v_blocks_experts_items_order_idx" ON "_products_v_blocks_experts_items" USING btree ("_order");
  CREATE INDEX "_products_v_blocks_experts_items_parent_id_idx" ON "_products_v_blocks_experts_items" USING btree ("_parent_id");
  CREATE INDEX "_products_v_blocks_experts_items_evidence_idx" ON "_products_v_blocks_experts_items" USING btree ("evidence_id");
  CREATE INDEX "_products_v_blocks_experts_order_idx" ON "_products_v_blocks_experts" USING btree ("_order");
  CREATE INDEX "_products_v_blocks_experts_parent_id_idx" ON "_products_v_blocks_experts" USING btree ("_parent_id");
  CREATE INDEX "_products_v_blocks_experts_path_idx" ON "_products_v_blocks_experts" USING btree ("_path");
  CREATE INDEX "_products_v_blocks_experts_case_study_idx" ON "_products_v_blocks_experts" USING btree ("case_study_id");
  CREATE INDEX "_products_v_blocks_faq_items_order_idx" ON "_products_v_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "_products_v_blocks_faq_items_parent_id_idx" ON "_products_v_blocks_faq_items" USING btree ("_parent_id");
  CREATE INDEX "_products_v_blocks_faq_items_evidence_idx" ON "_products_v_blocks_faq_items" USING btree ("evidence_id");
  CREATE INDEX "_products_v_blocks_faq_order_idx" ON "_products_v_blocks_faq" USING btree ("_order");
  CREATE INDEX "_products_v_blocks_faq_parent_id_idx" ON "_products_v_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "_products_v_blocks_faq_path_idx" ON "_products_v_blocks_faq" USING btree ("_path");
  CREATE INDEX "_products_v_blocks_faq_case_study_idx" ON "_products_v_blocks_faq" USING btree ("case_study_id");
  CREATE INDEX "_products_v_blocks_editorial_items_order_idx" ON "_products_v_blocks_editorial_items" USING btree ("_order");
  CREATE INDEX "_products_v_blocks_editorial_items_parent_id_idx" ON "_products_v_blocks_editorial_items" USING btree ("_parent_id");
  CREATE INDEX "_products_v_blocks_editorial_items_evidence_idx" ON "_products_v_blocks_editorial_items" USING btree ("evidence_id");
  CREATE INDEX "_products_v_blocks_editorial_order_idx" ON "_products_v_blocks_editorial" USING btree ("_order");
  CREATE INDEX "_products_v_blocks_editorial_parent_id_idx" ON "_products_v_blocks_editorial" USING btree ("_parent_id");
  CREATE INDEX "_products_v_blocks_editorial_path_idx" ON "_products_v_blocks_editorial" USING btree ("_path");
  CREATE INDEX "_products_v_blocks_editorial_case_study_idx" ON "_products_v_blocks_editorial" USING btree ("case_study_id");
  CREATE INDEX "_products_v_blocks_cta_items_order_idx" ON "_products_v_blocks_cta_items" USING btree ("_order");
  CREATE INDEX "_products_v_blocks_cta_items_parent_id_idx" ON "_products_v_blocks_cta_items" USING btree ("_parent_id");
  CREATE INDEX "_products_v_blocks_cta_items_evidence_idx" ON "_products_v_blocks_cta_items" USING btree ("evidence_id");
  CREATE INDEX "_products_v_blocks_cta_order_idx" ON "_products_v_blocks_cta" USING btree ("_order");
  CREATE INDEX "_products_v_blocks_cta_parent_id_idx" ON "_products_v_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "_products_v_blocks_cta_path_idx" ON "_products_v_blocks_cta" USING btree ("_path");
  CREATE INDEX "_products_v_blocks_cta_case_study_idx" ON "_products_v_blocks_cta" USING btree ("case_study_id");
  CREATE INDEX "_products_v_parent_idx" ON "_products_v" USING btree ("parent_id");
  CREATE INDEX "_products_v_version_version_slug_idx" ON "_products_v" USING btree ("version_slug");
  CREATE INDEX "_products_v_version_seo_version_seo_image_idx" ON "_products_v" USING btree ("version_seo_image_id");
  CREATE INDEX "_products_v_version_version_updated_at_idx" ON "_products_v" USING btree ("version_updated_at");
  CREATE INDEX "_products_v_version_version_created_at_idx" ON "_products_v" USING btree ("version_created_at");
  CREATE INDEX "_products_v_version_version__status_idx" ON "_products_v" USING btree ("version__status");
  CREATE INDEX "_products_v_created_at_idx" ON "_products_v" USING btree ("created_at");
  CREATE INDEX "_products_v_updated_at_idx" ON "_products_v" USING btree ("updated_at");
  CREATE INDEX "_products_v_latest_idx" ON "_products_v" USING btree ("latest");
  CREATE INDEX "_products_v_autosave_idx" ON "_products_v" USING btree ("autosave");
  CREATE INDEX "_products_v_rels_order_idx" ON "_products_v_rels" USING btree ("order");
  CREATE INDEX "_products_v_rels_parent_idx" ON "_products_v_rels" USING btree ("parent_id");
  CREATE INDEX "_products_v_rels_path_idx" ON "_products_v_rels" USING btree ("path");
  CREATE INDEX "_products_v_rels_experts_id_idx" ON "_products_v_rels" USING btree ("experts_id");
  CREATE INDEX "cases_chapters_order_idx" ON "cases_chapters" USING btree ("_order");
  CREATE INDEX "cases_chapters_parent_id_idx" ON "cases_chapters" USING btree ("_parent_id");
  CREATE INDEX "cases_chapters_media_idx" ON "cases_chapters" USING btree ("media_id");
  CREATE INDEX "cases_capabilities_order_idx" ON "cases_capabilities" USING btree ("_order");
  CREATE INDEX "cases_capabilities_parent_id_idx" ON "cases_capabilities" USING btree ("_parent_id");
  CREATE INDEX "cases_logo_idx" ON "cases" USING btree ("logo_id");
  CREATE INDEX "cases_seo_seo_image_idx" ON "cases" USING btree ("seo_image_id");
  CREATE INDEX "cases_updated_at_idx" ON "cases" USING btree ("updated_at");
  CREATE INDEX "cases_created_at_idx" ON "cases" USING btree ("created_at");
  CREATE INDEX "cases__status_idx" ON "cases" USING btree ("_status");
  CREATE INDEX "cases_rels_order_idx" ON "cases_rels" USING btree ("order");
  CREATE INDEX "cases_rels_parent_idx" ON "cases_rels" USING btree ("parent_id");
  CREATE INDEX "cases_rels_path_idx" ON "cases_rels" USING btree ("path");
  CREATE INDEX "cases_rels_evidence_id_idx" ON "cases_rels" USING btree ("evidence_id");
  CREATE INDEX "_cases_v_version_chapters_order_idx" ON "_cases_v_version_chapters" USING btree ("_order");
  CREATE INDEX "_cases_v_version_chapters_parent_id_idx" ON "_cases_v_version_chapters" USING btree ("_parent_id");
  CREATE INDEX "_cases_v_version_chapters_media_idx" ON "_cases_v_version_chapters" USING btree ("media_id");
  CREATE INDEX "_cases_v_version_capabilities_order_idx" ON "_cases_v_version_capabilities" USING btree ("_order");
  CREATE INDEX "_cases_v_version_capabilities_parent_id_idx" ON "_cases_v_version_capabilities" USING btree ("_parent_id");
  CREATE INDEX "_cases_v_parent_idx" ON "_cases_v" USING btree ("parent_id");
  CREATE INDEX "_cases_v_version_version_logo_idx" ON "_cases_v" USING btree ("version_logo_id");
  CREATE INDEX "_cases_v_version_seo_version_seo_image_idx" ON "_cases_v" USING btree ("version_seo_image_id");
  CREATE INDEX "_cases_v_version_version_updated_at_idx" ON "_cases_v" USING btree ("version_updated_at");
  CREATE INDEX "_cases_v_version_version_created_at_idx" ON "_cases_v" USING btree ("version_created_at");
  CREATE INDEX "_cases_v_version_version__status_idx" ON "_cases_v" USING btree ("version__status");
  CREATE INDEX "_cases_v_created_at_idx" ON "_cases_v" USING btree ("created_at");
  CREATE INDEX "_cases_v_updated_at_idx" ON "_cases_v" USING btree ("updated_at");
  CREATE INDEX "_cases_v_latest_idx" ON "_cases_v" USING btree ("latest");
  CREATE INDEX "_cases_v_autosave_idx" ON "_cases_v" USING btree ("autosave");
  CREATE INDEX "_cases_v_rels_order_idx" ON "_cases_v_rels" USING btree ("order");
  CREATE INDEX "_cases_v_rels_parent_idx" ON "_cases_v_rels" USING btree ("parent_id");
  CREATE INDEX "_cases_v_rels_path_idx" ON "_cases_v_rels" USING btree ("path");
  CREATE INDEX "_cases_v_rels_evidence_id_idx" ON "_cases_v_rels" USING btree ("evidence_id");
  CREATE INDEX "evidence_case_study_idx" ON "evidence" USING btree ("case_study_id");
  CREATE INDEX "evidence_updated_at_idx" ON "evidence" USING btree ("updated_at");
  CREATE INDEX "evidence_created_at_idx" ON "evidence" USING btree ("created_at");
  CREATE INDEX "evidence__status_idx" ON "evidence" USING btree ("_status");
  CREATE INDEX "evidence_rels_order_idx" ON "evidence_rels" USING btree ("order");
  CREATE INDEX "evidence_rels_parent_idx" ON "evidence_rels" USING btree ("parent_id");
  CREATE INDEX "evidence_rels_path_idx" ON "evidence_rels" USING btree ("path");
  CREATE INDEX "evidence_rels_media_id_idx" ON "evidence_rels" USING btree ("media_id");
  CREATE INDEX "_evidence_v_parent_idx" ON "_evidence_v" USING btree ("parent_id");
  CREATE INDEX "_evidence_v_version_version_case_study_idx" ON "_evidence_v" USING btree ("version_case_study_id");
  CREATE INDEX "_evidence_v_version_version_updated_at_idx" ON "_evidence_v" USING btree ("version_updated_at");
  CREATE INDEX "_evidence_v_version_version_created_at_idx" ON "_evidence_v" USING btree ("version_created_at");
  CREATE INDEX "_evidence_v_version_version__status_idx" ON "_evidence_v" USING btree ("version__status");
  CREATE INDEX "_evidence_v_created_at_idx" ON "_evidence_v" USING btree ("created_at");
  CREATE INDEX "_evidence_v_updated_at_idx" ON "_evidence_v" USING btree ("updated_at");
  CREATE INDEX "_evidence_v_latest_idx" ON "_evidence_v" USING btree ("latest");
  CREATE INDEX "_evidence_v_autosave_idx" ON "_evidence_v" USING btree ("autosave");
  CREATE INDEX "_evidence_v_rels_order_idx" ON "_evidence_v_rels" USING btree ("order");
  CREATE INDEX "_evidence_v_rels_parent_idx" ON "_evidence_v_rels" USING btree ("parent_id");
  CREATE INDEX "_evidence_v_rels_path_idx" ON "_evidence_v_rels" USING btree ("path");
  CREATE INDEX "_evidence_v_rels_media_id_idx" ON "_evidence_v_rels" USING btree ("media_id");
  CREATE INDEX "articles_blocks_story_items_order_idx" ON "articles_blocks_story_items" USING btree ("_order");
  CREATE INDEX "articles_blocks_story_items_parent_id_idx" ON "articles_blocks_story_items" USING btree ("_parent_id");
  CREATE INDEX "articles_blocks_story_items_evidence_idx" ON "articles_blocks_story_items" USING btree ("evidence_id");
  CREATE INDEX "articles_blocks_story_order_idx" ON "articles_blocks_story" USING btree ("_order");
  CREATE INDEX "articles_blocks_story_parent_id_idx" ON "articles_blocks_story" USING btree ("_parent_id");
  CREATE INDEX "articles_blocks_story_path_idx" ON "articles_blocks_story" USING btree ("_path");
  CREATE INDEX "articles_blocks_story_case_study_idx" ON "articles_blocks_story" USING btree ("case_study_id");
  CREATE INDEX "articles_blocks_problems_items_order_idx" ON "articles_blocks_problems_items" USING btree ("_order");
  CREATE INDEX "articles_blocks_problems_items_parent_id_idx" ON "articles_blocks_problems_items" USING btree ("_parent_id");
  CREATE INDEX "articles_blocks_problems_items_evidence_idx" ON "articles_blocks_problems_items" USING btree ("evidence_id");
  CREATE INDEX "articles_blocks_problems_order_idx" ON "articles_blocks_problems" USING btree ("_order");
  CREATE INDEX "articles_blocks_problems_parent_id_idx" ON "articles_blocks_problems" USING btree ("_parent_id");
  CREATE INDEX "articles_blocks_problems_path_idx" ON "articles_blocks_problems" USING btree ("_path");
  CREATE INDEX "articles_blocks_problems_case_study_idx" ON "articles_blocks_problems" USING btree ("case_study_id");
  CREATE INDEX "articles_blocks_system_items_order_idx" ON "articles_blocks_system_items" USING btree ("_order");
  CREATE INDEX "articles_blocks_system_items_parent_id_idx" ON "articles_blocks_system_items" USING btree ("_parent_id");
  CREATE INDEX "articles_blocks_system_items_evidence_idx" ON "articles_blocks_system_items" USING btree ("evidence_id");
  CREATE INDEX "articles_blocks_system_order_idx" ON "articles_blocks_system" USING btree ("_order");
  CREATE INDEX "articles_blocks_system_parent_id_idx" ON "articles_blocks_system" USING btree ("_parent_id");
  CREATE INDEX "articles_blocks_system_path_idx" ON "articles_blocks_system" USING btree ("_path");
  CREATE INDEX "articles_blocks_system_case_study_idx" ON "articles_blocks_system" USING btree ("case_study_id");
  CREATE INDEX "articles_blocks_products_items_order_idx" ON "articles_blocks_products_items" USING btree ("_order");
  CREATE INDEX "articles_blocks_products_items_parent_id_idx" ON "articles_blocks_products_items" USING btree ("_parent_id");
  CREATE INDEX "articles_blocks_products_items_evidence_idx" ON "articles_blocks_products_items" USING btree ("evidence_id");
  CREATE INDEX "articles_blocks_products_order_idx" ON "articles_blocks_products" USING btree ("_order");
  CREATE INDEX "articles_blocks_products_parent_id_idx" ON "articles_blocks_products" USING btree ("_parent_id");
  CREATE INDEX "articles_blocks_products_path_idx" ON "articles_blocks_products" USING btree ("_path");
  CREATE INDEX "articles_blocks_products_case_study_idx" ON "articles_blocks_products" USING btree ("case_study_id");
  CREATE INDEX "articles_blocks_selector_items_order_idx" ON "articles_blocks_selector_items" USING btree ("_order");
  CREATE INDEX "articles_blocks_selector_items_parent_id_idx" ON "articles_blocks_selector_items" USING btree ("_parent_id");
  CREATE INDEX "articles_blocks_selector_items_evidence_idx" ON "articles_blocks_selector_items" USING btree ("evidence_id");
  CREATE INDEX "articles_blocks_selector_order_idx" ON "articles_blocks_selector" USING btree ("_order");
  CREATE INDEX "articles_blocks_selector_parent_id_idx" ON "articles_blocks_selector" USING btree ("_parent_id");
  CREATE INDEX "articles_blocks_selector_path_idx" ON "articles_blocks_selector" USING btree ("_path");
  CREATE INDEX "articles_blocks_selector_case_study_idx" ON "articles_blocks_selector" USING btree ("case_study_id");
  CREATE INDEX "articles_blocks_preview_items_order_idx" ON "articles_blocks_preview_items" USING btree ("_order");
  CREATE INDEX "articles_blocks_preview_items_parent_id_idx" ON "articles_blocks_preview_items" USING btree ("_parent_id");
  CREATE INDEX "articles_blocks_preview_items_evidence_idx" ON "articles_blocks_preview_items" USING btree ("evidence_id");
  CREATE INDEX "articles_blocks_preview_order_idx" ON "articles_blocks_preview" USING btree ("_order");
  CREATE INDEX "articles_blocks_preview_parent_id_idx" ON "articles_blocks_preview" USING btree ("_parent_id");
  CREATE INDEX "articles_blocks_preview_path_idx" ON "articles_blocks_preview" USING btree ("_path");
  CREATE INDEX "articles_blocks_preview_case_study_idx" ON "articles_blocks_preview" USING btree ("case_study_id");
  CREATE INDEX "articles_blocks_experts_items_order_idx" ON "articles_blocks_experts_items" USING btree ("_order");
  CREATE INDEX "articles_blocks_experts_items_parent_id_idx" ON "articles_blocks_experts_items" USING btree ("_parent_id");
  CREATE INDEX "articles_blocks_experts_items_evidence_idx" ON "articles_blocks_experts_items" USING btree ("evidence_id");
  CREATE INDEX "articles_blocks_experts_order_idx" ON "articles_blocks_experts" USING btree ("_order");
  CREATE INDEX "articles_blocks_experts_parent_id_idx" ON "articles_blocks_experts" USING btree ("_parent_id");
  CREATE INDEX "articles_blocks_experts_path_idx" ON "articles_blocks_experts" USING btree ("_path");
  CREATE INDEX "articles_blocks_experts_case_study_idx" ON "articles_blocks_experts" USING btree ("case_study_id");
  CREATE INDEX "articles_blocks_faq_items_order_idx" ON "articles_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "articles_blocks_faq_items_parent_id_idx" ON "articles_blocks_faq_items" USING btree ("_parent_id");
  CREATE INDEX "articles_blocks_faq_items_evidence_idx" ON "articles_blocks_faq_items" USING btree ("evidence_id");
  CREATE INDEX "articles_blocks_faq_order_idx" ON "articles_blocks_faq" USING btree ("_order");
  CREATE INDEX "articles_blocks_faq_parent_id_idx" ON "articles_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "articles_blocks_faq_path_idx" ON "articles_blocks_faq" USING btree ("_path");
  CREATE INDEX "articles_blocks_faq_case_study_idx" ON "articles_blocks_faq" USING btree ("case_study_id");
  CREATE INDEX "articles_blocks_editorial_items_order_idx" ON "articles_blocks_editorial_items" USING btree ("_order");
  CREATE INDEX "articles_blocks_editorial_items_parent_id_idx" ON "articles_blocks_editorial_items" USING btree ("_parent_id");
  CREATE INDEX "articles_blocks_editorial_items_evidence_idx" ON "articles_blocks_editorial_items" USING btree ("evidence_id");
  CREATE INDEX "articles_blocks_editorial_order_idx" ON "articles_blocks_editorial" USING btree ("_order");
  CREATE INDEX "articles_blocks_editorial_parent_id_idx" ON "articles_blocks_editorial" USING btree ("_parent_id");
  CREATE INDEX "articles_blocks_editorial_path_idx" ON "articles_blocks_editorial" USING btree ("_path");
  CREATE INDEX "articles_blocks_editorial_case_study_idx" ON "articles_blocks_editorial" USING btree ("case_study_id");
  CREATE INDEX "articles_blocks_cta_items_order_idx" ON "articles_blocks_cta_items" USING btree ("_order");
  CREATE INDEX "articles_blocks_cta_items_parent_id_idx" ON "articles_blocks_cta_items" USING btree ("_parent_id");
  CREATE INDEX "articles_blocks_cta_items_evidence_idx" ON "articles_blocks_cta_items" USING btree ("evidence_id");
  CREATE INDEX "articles_blocks_cta_order_idx" ON "articles_blocks_cta" USING btree ("_order");
  CREATE INDEX "articles_blocks_cta_parent_id_idx" ON "articles_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "articles_blocks_cta_path_idx" ON "articles_blocks_cta" USING btree ("_path");
  CREATE INDEX "articles_blocks_cta_case_study_idx" ON "articles_blocks_cta" USING btree ("case_study_id");
  CREATE INDEX "articles_author_idx" ON "articles" USING btree ("author_id");
  CREATE INDEX "articles_cover_idx" ON "articles" USING btree ("cover_id");
  CREATE INDEX "articles_seo_seo_image_idx" ON "articles" USING btree ("seo_image_id");
  CREATE INDEX "articles_updated_at_idx" ON "articles" USING btree ("updated_at");
  CREATE INDEX "articles_created_at_idx" ON "articles" USING btree ("created_at");
  CREATE INDEX "articles__status_idx" ON "articles" USING btree ("_status");
  CREATE INDEX "articles_rels_order_idx" ON "articles_rels" USING btree ("order");
  CREATE INDEX "articles_rels_parent_idx" ON "articles_rels" USING btree ("parent_id");
  CREATE INDEX "articles_rels_path_idx" ON "articles_rels" USING btree ("path");
  CREATE INDEX "articles_rels_experts_id_idx" ON "articles_rels" USING btree ("experts_id");
  CREATE INDEX "_articles_v_blocks_story_items_order_idx" ON "_articles_v_blocks_story_items" USING btree ("_order");
  CREATE INDEX "_articles_v_blocks_story_items_parent_id_idx" ON "_articles_v_blocks_story_items" USING btree ("_parent_id");
  CREATE INDEX "_articles_v_blocks_story_items_evidence_idx" ON "_articles_v_blocks_story_items" USING btree ("evidence_id");
  CREATE INDEX "_articles_v_blocks_story_order_idx" ON "_articles_v_blocks_story" USING btree ("_order");
  CREATE INDEX "_articles_v_blocks_story_parent_id_idx" ON "_articles_v_blocks_story" USING btree ("_parent_id");
  CREATE INDEX "_articles_v_blocks_story_path_idx" ON "_articles_v_blocks_story" USING btree ("_path");
  CREATE INDEX "_articles_v_blocks_story_case_study_idx" ON "_articles_v_blocks_story" USING btree ("case_study_id");
  CREATE INDEX "_articles_v_blocks_problems_items_order_idx" ON "_articles_v_blocks_problems_items" USING btree ("_order");
  CREATE INDEX "_articles_v_blocks_problems_items_parent_id_idx" ON "_articles_v_blocks_problems_items" USING btree ("_parent_id");
  CREATE INDEX "_articles_v_blocks_problems_items_evidence_idx" ON "_articles_v_blocks_problems_items" USING btree ("evidence_id");
  CREATE INDEX "_articles_v_blocks_problems_order_idx" ON "_articles_v_blocks_problems" USING btree ("_order");
  CREATE INDEX "_articles_v_blocks_problems_parent_id_idx" ON "_articles_v_blocks_problems" USING btree ("_parent_id");
  CREATE INDEX "_articles_v_blocks_problems_path_idx" ON "_articles_v_blocks_problems" USING btree ("_path");
  CREATE INDEX "_articles_v_blocks_problems_case_study_idx" ON "_articles_v_blocks_problems" USING btree ("case_study_id");
  CREATE INDEX "_articles_v_blocks_system_items_order_idx" ON "_articles_v_blocks_system_items" USING btree ("_order");
  CREATE INDEX "_articles_v_blocks_system_items_parent_id_idx" ON "_articles_v_blocks_system_items" USING btree ("_parent_id");
  CREATE INDEX "_articles_v_blocks_system_items_evidence_idx" ON "_articles_v_blocks_system_items" USING btree ("evidence_id");
  CREATE INDEX "_articles_v_blocks_system_order_idx" ON "_articles_v_blocks_system" USING btree ("_order");
  CREATE INDEX "_articles_v_blocks_system_parent_id_idx" ON "_articles_v_blocks_system" USING btree ("_parent_id");
  CREATE INDEX "_articles_v_blocks_system_path_idx" ON "_articles_v_blocks_system" USING btree ("_path");
  CREATE INDEX "_articles_v_blocks_system_case_study_idx" ON "_articles_v_blocks_system" USING btree ("case_study_id");
  CREATE INDEX "_articles_v_blocks_products_items_order_idx" ON "_articles_v_blocks_products_items" USING btree ("_order");
  CREATE INDEX "_articles_v_blocks_products_items_parent_id_idx" ON "_articles_v_blocks_products_items" USING btree ("_parent_id");
  CREATE INDEX "_articles_v_blocks_products_items_evidence_idx" ON "_articles_v_blocks_products_items" USING btree ("evidence_id");
  CREATE INDEX "_articles_v_blocks_products_order_idx" ON "_articles_v_blocks_products" USING btree ("_order");
  CREATE INDEX "_articles_v_blocks_products_parent_id_idx" ON "_articles_v_blocks_products" USING btree ("_parent_id");
  CREATE INDEX "_articles_v_blocks_products_path_idx" ON "_articles_v_blocks_products" USING btree ("_path");
  CREATE INDEX "_articles_v_blocks_products_case_study_idx" ON "_articles_v_blocks_products" USING btree ("case_study_id");
  CREATE INDEX "_articles_v_blocks_selector_items_order_idx" ON "_articles_v_blocks_selector_items" USING btree ("_order");
  CREATE INDEX "_articles_v_blocks_selector_items_parent_id_idx" ON "_articles_v_blocks_selector_items" USING btree ("_parent_id");
  CREATE INDEX "_articles_v_blocks_selector_items_evidence_idx" ON "_articles_v_blocks_selector_items" USING btree ("evidence_id");
  CREATE INDEX "_articles_v_blocks_selector_order_idx" ON "_articles_v_blocks_selector" USING btree ("_order");
  CREATE INDEX "_articles_v_blocks_selector_parent_id_idx" ON "_articles_v_blocks_selector" USING btree ("_parent_id");
  CREATE INDEX "_articles_v_blocks_selector_path_idx" ON "_articles_v_blocks_selector" USING btree ("_path");
  CREATE INDEX "_articles_v_blocks_selector_case_study_idx" ON "_articles_v_blocks_selector" USING btree ("case_study_id");
  CREATE INDEX "_articles_v_blocks_preview_items_order_idx" ON "_articles_v_blocks_preview_items" USING btree ("_order");
  CREATE INDEX "_articles_v_blocks_preview_items_parent_id_idx" ON "_articles_v_blocks_preview_items" USING btree ("_parent_id");
  CREATE INDEX "_articles_v_blocks_preview_items_evidence_idx" ON "_articles_v_blocks_preview_items" USING btree ("evidence_id");
  CREATE INDEX "_articles_v_blocks_preview_order_idx" ON "_articles_v_blocks_preview" USING btree ("_order");
  CREATE INDEX "_articles_v_blocks_preview_parent_id_idx" ON "_articles_v_blocks_preview" USING btree ("_parent_id");
  CREATE INDEX "_articles_v_blocks_preview_path_idx" ON "_articles_v_blocks_preview" USING btree ("_path");
  CREATE INDEX "_articles_v_blocks_preview_case_study_idx" ON "_articles_v_blocks_preview" USING btree ("case_study_id");
  CREATE INDEX "_articles_v_blocks_experts_items_order_idx" ON "_articles_v_blocks_experts_items" USING btree ("_order");
  CREATE INDEX "_articles_v_blocks_experts_items_parent_id_idx" ON "_articles_v_blocks_experts_items" USING btree ("_parent_id");
  CREATE INDEX "_articles_v_blocks_experts_items_evidence_idx" ON "_articles_v_blocks_experts_items" USING btree ("evidence_id");
  CREATE INDEX "_articles_v_blocks_experts_order_idx" ON "_articles_v_blocks_experts" USING btree ("_order");
  CREATE INDEX "_articles_v_blocks_experts_parent_id_idx" ON "_articles_v_blocks_experts" USING btree ("_parent_id");
  CREATE INDEX "_articles_v_blocks_experts_path_idx" ON "_articles_v_blocks_experts" USING btree ("_path");
  CREATE INDEX "_articles_v_blocks_experts_case_study_idx" ON "_articles_v_blocks_experts" USING btree ("case_study_id");
  CREATE INDEX "_articles_v_blocks_faq_items_order_idx" ON "_articles_v_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "_articles_v_blocks_faq_items_parent_id_idx" ON "_articles_v_blocks_faq_items" USING btree ("_parent_id");
  CREATE INDEX "_articles_v_blocks_faq_items_evidence_idx" ON "_articles_v_blocks_faq_items" USING btree ("evidence_id");
  CREATE INDEX "_articles_v_blocks_faq_order_idx" ON "_articles_v_blocks_faq" USING btree ("_order");
  CREATE INDEX "_articles_v_blocks_faq_parent_id_idx" ON "_articles_v_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "_articles_v_blocks_faq_path_idx" ON "_articles_v_blocks_faq" USING btree ("_path");
  CREATE INDEX "_articles_v_blocks_faq_case_study_idx" ON "_articles_v_blocks_faq" USING btree ("case_study_id");
  CREATE INDEX "_articles_v_blocks_editorial_items_order_idx" ON "_articles_v_blocks_editorial_items" USING btree ("_order");
  CREATE INDEX "_articles_v_blocks_editorial_items_parent_id_idx" ON "_articles_v_blocks_editorial_items" USING btree ("_parent_id");
  CREATE INDEX "_articles_v_blocks_editorial_items_evidence_idx" ON "_articles_v_blocks_editorial_items" USING btree ("evidence_id");
  CREATE INDEX "_articles_v_blocks_editorial_order_idx" ON "_articles_v_blocks_editorial" USING btree ("_order");
  CREATE INDEX "_articles_v_blocks_editorial_parent_id_idx" ON "_articles_v_blocks_editorial" USING btree ("_parent_id");
  CREATE INDEX "_articles_v_blocks_editorial_path_idx" ON "_articles_v_blocks_editorial" USING btree ("_path");
  CREATE INDEX "_articles_v_blocks_editorial_case_study_idx" ON "_articles_v_blocks_editorial" USING btree ("case_study_id");
  CREATE INDEX "_articles_v_blocks_cta_items_order_idx" ON "_articles_v_blocks_cta_items" USING btree ("_order");
  CREATE INDEX "_articles_v_blocks_cta_items_parent_id_idx" ON "_articles_v_blocks_cta_items" USING btree ("_parent_id");
  CREATE INDEX "_articles_v_blocks_cta_items_evidence_idx" ON "_articles_v_blocks_cta_items" USING btree ("evidence_id");
  CREATE INDEX "_articles_v_blocks_cta_order_idx" ON "_articles_v_blocks_cta" USING btree ("_order");
  CREATE INDEX "_articles_v_blocks_cta_parent_id_idx" ON "_articles_v_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "_articles_v_blocks_cta_path_idx" ON "_articles_v_blocks_cta" USING btree ("_path");
  CREATE INDEX "_articles_v_blocks_cta_case_study_idx" ON "_articles_v_blocks_cta" USING btree ("case_study_id");
  CREATE INDEX "_articles_v_parent_idx" ON "_articles_v" USING btree ("parent_id");
  CREATE INDEX "_articles_v_version_version_author_idx" ON "_articles_v" USING btree ("version_author_id");
  CREATE INDEX "_articles_v_version_version_cover_idx" ON "_articles_v" USING btree ("version_cover_id");
  CREATE INDEX "_articles_v_version_seo_version_seo_image_idx" ON "_articles_v" USING btree ("version_seo_image_id");
  CREATE INDEX "_articles_v_version_version_updated_at_idx" ON "_articles_v" USING btree ("version_updated_at");
  CREATE INDEX "_articles_v_version_version_created_at_idx" ON "_articles_v" USING btree ("version_created_at");
  CREATE INDEX "_articles_v_version_version__status_idx" ON "_articles_v" USING btree ("version__status");
  CREATE INDEX "_articles_v_created_at_idx" ON "_articles_v" USING btree ("created_at");
  CREATE INDEX "_articles_v_updated_at_idx" ON "_articles_v" USING btree ("updated_at");
  CREATE INDEX "_articles_v_latest_idx" ON "_articles_v" USING btree ("latest");
  CREATE INDEX "_articles_v_autosave_idx" ON "_articles_v" USING btree ("autosave");
  CREATE INDEX "_articles_v_rels_order_idx" ON "_articles_v_rels" USING btree ("order");
  CREATE INDEX "_articles_v_rels_parent_idx" ON "_articles_v_rels" USING btree ("parent_id");
  CREATE INDEX "_articles_v_rels_path_idx" ON "_articles_v_rels" USING btree ("path");
  CREATE INDEX "_articles_v_rels_experts_id_idx" ON "_articles_v_rels" USING btree ("experts_id");
  CREATE INDEX "experts_portrait_idx" ON "experts" USING btree ("portrait_id");
  CREATE INDEX "experts_updated_at_idx" ON "experts" USING btree ("updated_at");
  CREATE INDEX "experts_created_at_idx" ON "experts" USING btree ("created_at");
  CREATE INDEX "experts__status_idx" ON "experts" USING btree ("_status");
  CREATE INDEX "_experts_v_parent_idx" ON "_experts_v" USING btree ("parent_id");
  CREATE INDEX "_experts_v_version_version_portrait_idx" ON "_experts_v" USING btree ("version_portrait_id");
  CREATE INDEX "_experts_v_version_version_updated_at_idx" ON "_experts_v" USING btree ("version_updated_at");
  CREATE INDEX "_experts_v_version_version_created_at_idx" ON "_experts_v" USING btree ("version_created_at");
  CREATE INDEX "_experts_v_version_version__status_idx" ON "_experts_v" USING btree ("version__status");
  CREATE INDEX "_experts_v_created_at_idx" ON "_experts_v" USING btree ("created_at");
  CREATE INDEX "_experts_v_updated_at_idx" ON "_experts_v" USING btree ("updated_at");
  CREATE INDEX "_experts_v_latest_idx" ON "_experts_v" USING btree ("latest");
  CREATE INDEX "_experts_v_autosave_idx" ON "_experts_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "leads_request_key_idx" ON "leads" USING btree ("request_key");
  CREATE INDEX "leads_updated_at_idx" ON "leads" USING btree ("updated_at");
  CREATE INDEX "leads_created_at_idx" ON "leads" USING btree ("created_at");
  CREATE INDEX "activity_updated_at_idx" ON "activity" USING btree ("updated_at");
  CREATE INDEX "activity_created_at_idx" ON "activity" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_products_id_idx" ON "payload_locked_documents_rels" USING btree ("products_id");
  CREATE INDEX "payload_locked_documents_rels_cases_id_idx" ON "payload_locked_documents_rels" USING btree ("cases_id");
  CREATE INDEX "payload_locked_documents_rels_evidence_id_idx" ON "payload_locked_documents_rels" USING btree ("evidence_id");
  CREATE INDEX "payload_locked_documents_rels_articles_id_idx" ON "payload_locked_documents_rels" USING btree ("articles_id");
  CREATE INDEX "payload_locked_documents_rels_experts_id_idx" ON "payload_locked_documents_rels" USING btree ("experts_id");
  CREATE INDEX "payload_locked_documents_rels_leads_id_idx" ON "payload_locked_documents_rels" USING btree ("leads_id");
  CREATE INDEX "payload_locked_documents_rels_activity_id_idx" ON "payload_locked_documents_rels" USING btree ("activity_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_navigation_order_idx" ON "site_navigation" USING btree ("_order");
  CREATE INDEX "site_navigation_parent_id_idx" ON "site_navigation" USING btree ("_parent_id");
  CREATE INDEX "site_footer_links_order_idx" ON "site_footer_links" USING btree ("_order");
  CREATE INDEX "site_footer_links_parent_id_idx" ON "site_footer_links" USING btree ("_parent_id");
  CREATE INDEX "site_social_order_idx" ON "site_social" USING btree ("_order");
  CREATE INDEX "site_social_parent_id_idx" ON "site_social" USING btree ("_parent_id");
  CREATE INDEX "site_logo_idx" ON "site" USING btree ("logo_id");
  CREATE INDEX "site_social_image_idx" ON "site" USING btree ("social_image_id");
  CREATE INDEX "audit_questions_options_order_idx" ON "audit_questions_options" USING btree ("_order");
  CREATE INDEX "audit_questions_options_parent_id_idx" ON "audit_questions_options" USING btree ("_parent_id");
  CREATE INDEX "audit_questions_order_idx" ON "audit_questions" USING btree ("_order");
  CREATE INDEX "audit_questions_parent_id_idx" ON "audit_questions" USING btree ("_parent_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "pages_blocks_story_items" CASCADE;
  DROP TABLE "pages_blocks_story" CASCADE;
  DROP TABLE "pages_blocks_problems_items" CASCADE;
  DROP TABLE "pages_blocks_problems" CASCADE;
  DROP TABLE "pages_blocks_system_items" CASCADE;
  DROP TABLE "pages_blocks_system" CASCADE;
  DROP TABLE "pages_blocks_products_items" CASCADE;
  DROP TABLE "pages_blocks_products" CASCADE;
  DROP TABLE "pages_blocks_selector_items" CASCADE;
  DROP TABLE "pages_blocks_selector" CASCADE;
  DROP TABLE "pages_blocks_preview_items" CASCADE;
  DROP TABLE "pages_blocks_preview" CASCADE;
  DROP TABLE "pages_blocks_experts_items" CASCADE;
  DROP TABLE "pages_blocks_experts" CASCADE;
  DROP TABLE "pages_blocks_faq_items" CASCADE;
  DROP TABLE "pages_blocks_faq" CASCADE;
  DROP TABLE "pages_blocks_editorial_items" CASCADE;
  DROP TABLE "pages_blocks_editorial" CASCADE;
  DROP TABLE "pages_blocks_cta_items" CASCADE;
  DROP TABLE "pages_blocks_cta" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "pages_rels" CASCADE;
  DROP TABLE "_pages_v_blocks_story_items" CASCADE;
  DROP TABLE "_pages_v_blocks_story" CASCADE;
  DROP TABLE "_pages_v_blocks_problems_items" CASCADE;
  DROP TABLE "_pages_v_blocks_problems" CASCADE;
  DROP TABLE "_pages_v_blocks_system_items" CASCADE;
  DROP TABLE "_pages_v_blocks_system" CASCADE;
  DROP TABLE "_pages_v_blocks_products_items" CASCADE;
  DROP TABLE "_pages_v_blocks_products" CASCADE;
  DROP TABLE "_pages_v_blocks_selector_items" CASCADE;
  DROP TABLE "_pages_v_blocks_selector" CASCADE;
  DROP TABLE "_pages_v_blocks_preview_items" CASCADE;
  DROP TABLE "_pages_v_blocks_preview" CASCADE;
  DROP TABLE "_pages_v_blocks_experts_items" CASCADE;
  DROP TABLE "_pages_v_blocks_experts" CASCADE;
  DROP TABLE "_pages_v_blocks_faq_items" CASCADE;
  DROP TABLE "_pages_v_blocks_faq" CASCADE;
  DROP TABLE "_pages_v_blocks_editorial_items" CASCADE;
  DROP TABLE "_pages_v_blocks_editorial" CASCADE;
  DROP TABLE "_pages_v_blocks_cta_items" CASCADE;
  DROP TABLE "_pages_v_blocks_cta" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "_pages_v_rels" CASCADE;
  DROP TABLE "products_includes" CASCADE;
  DROP TABLE "products_excludes" CASCADE;
  DROP TABLE "products_blocks_story_items" CASCADE;
  DROP TABLE "products_blocks_story" CASCADE;
  DROP TABLE "products_blocks_problems_items" CASCADE;
  DROP TABLE "products_blocks_problems" CASCADE;
  DROP TABLE "products_blocks_system_items" CASCADE;
  DROP TABLE "products_blocks_system" CASCADE;
  DROP TABLE "products_blocks_products_items" CASCADE;
  DROP TABLE "products_blocks_products" CASCADE;
  DROP TABLE "products_blocks_selector_items" CASCADE;
  DROP TABLE "products_blocks_selector" CASCADE;
  DROP TABLE "products_blocks_preview_items" CASCADE;
  DROP TABLE "products_blocks_preview" CASCADE;
  DROP TABLE "products_blocks_experts_items" CASCADE;
  DROP TABLE "products_blocks_experts" CASCADE;
  DROP TABLE "products_blocks_faq_items" CASCADE;
  DROP TABLE "products_blocks_faq" CASCADE;
  DROP TABLE "products_blocks_editorial_items" CASCADE;
  DROP TABLE "products_blocks_editorial" CASCADE;
  DROP TABLE "products_blocks_cta_items" CASCADE;
  DROP TABLE "products_blocks_cta" CASCADE;
  DROP TABLE "products" CASCADE;
  DROP TABLE "products_rels" CASCADE;
  DROP TABLE "_products_v_version_includes" CASCADE;
  DROP TABLE "_products_v_version_excludes" CASCADE;
  DROP TABLE "_products_v_blocks_story_items" CASCADE;
  DROP TABLE "_products_v_blocks_story" CASCADE;
  DROP TABLE "_products_v_blocks_problems_items" CASCADE;
  DROP TABLE "_products_v_blocks_problems" CASCADE;
  DROP TABLE "_products_v_blocks_system_items" CASCADE;
  DROP TABLE "_products_v_blocks_system" CASCADE;
  DROP TABLE "_products_v_blocks_products_items" CASCADE;
  DROP TABLE "_products_v_blocks_products" CASCADE;
  DROP TABLE "_products_v_blocks_selector_items" CASCADE;
  DROP TABLE "_products_v_blocks_selector" CASCADE;
  DROP TABLE "_products_v_blocks_preview_items" CASCADE;
  DROP TABLE "_products_v_blocks_preview" CASCADE;
  DROP TABLE "_products_v_blocks_experts_items" CASCADE;
  DROP TABLE "_products_v_blocks_experts" CASCADE;
  DROP TABLE "_products_v_blocks_faq_items" CASCADE;
  DROP TABLE "_products_v_blocks_faq" CASCADE;
  DROP TABLE "_products_v_blocks_editorial_items" CASCADE;
  DROP TABLE "_products_v_blocks_editorial" CASCADE;
  DROP TABLE "_products_v_blocks_cta_items" CASCADE;
  DROP TABLE "_products_v_blocks_cta" CASCADE;
  DROP TABLE "_products_v" CASCADE;
  DROP TABLE "_products_v_rels" CASCADE;
  DROP TABLE "cases_chapters" CASCADE;
  DROP TABLE "cases_capabilities" CASCADE;
  DROP TABLE "cases" CASCADE;
  DROP TABLE "cases_rels" CASCADE;
  DROP TABLE "_cases_v_version_chapters" CASCADE;
  DROP TABLE "_cases_v_version_capabilities" CASCADE;
  DROP TABLE "_cases_v" CASCADE;
  DROP TABLE "_cases_v_rels" CASCADE;
  DROP TABLE "evidence" CASCADE;
  DROP TABLE "evidence_rels" CASCADE;
  DROP TABLE "_evidence_v" CASCADE;
  DROP TABLE "_evidence_v_rels" CASCADE;
  DROP TABLE "articles_blocks_story_items" CASCADE;
  DROP TABLE "articles_blocks_story" CASCADE;
  DROP TABLE "articles_blocks_problems_items" CASCADE;
  DROP TABLE "articles_blocks_problems" CASCADE;
  DROP TABLE "articles_blocks_system_items" CASCADE;
  DROP TABLE "articles_blocks_system" CASCADE;
  DROP TABLE "articles_blocks_products_items" CASCADE;
  DROP TABLE "articles_blocks_products" CASCADE;
  DROP TABLE "articles_blocks_selector_items" CASCADE;
  DROP TABLE "articles_blocks_selector" CASCADE;
  DROP TABLE "articles_blocks_preview_items" CASCADE;
  DROP TABLE "articles_blocks_preview" CASCADE;
  DROP TABLE "articles_blocks_experts_items" CASCADE;
  DROP TABLE "articles_blocks_experts" CASCADE;
  DROP TABLE "articles_blocks_faq_items" CASCADE;
  DROP TABLE "articles_blocks_faq" CASCADE;
  DROP TABLE "articles_blocks_editorial_items" CASCADE;
  DROP TABLE "articles_blocks_editorial" CASCADE;
  DROP TABLE "articles_blocks_cta_items" CASCADE;
  DROP TABLE "articles_blocks_cta" CASCADE;
  DROP TABLE "articles" CASCADE;
  DROP TABLE "articles_rels" CASCADE;
  DROP TABLE "_articles_v_blocks_story_items" CASCADE;
  DROP TABLE "_articles_v_blocks_story" CASCADE;
  DROP TABLE "_articles_v_blocks_problems_items" CASCADE;
  DROP TABLE "_articles_v_blocks_problems" CASCADE;
  DROP TABLE "_articles_v_blocks_system_items" CASCADE;
  DROP TABLE "_articles_v_blocks_system" CASCADE;
  DROP TABLE "_articles_v_blocks_products_items" CASCADE;
  DROP TABLE "_articles_v_blocks_products" CASCADE;
  DROP TABLE "_articles_v_blocks_selector_items" CASCADE;
  DROP TABLE "_articles_v_blocks_selector" CASCADE;
  DROP TABLE "_articles_v_blocks_preview_items" CASCADE;
  DROP TABLE "_articles_v_blocks_preview" CASCADE;
  DROP TABLE "_articles_v_blocks_experts_items" CASCADE;
  DROP TABLE "_articles_v_blocks_experts" CASCADE;
  DROP TABLE "_articles_v_blocks_faq_items" CASCADE;
  DROP TABLE "_articles_v_blocks_faq" CASCADE;
  DROP TABLE "_articles_v_blocks_editorial_items" CASCADE;
  DROP TABLE "_articles_v_blocks_editorial" CASCADE;
  DROP TABLE "_articles_v_blocks_cta_items" CASCADE;
  DROP TABLE "_articles_v_blocks_cta" CASCADE;
  DROP TABLE "_articles_v" CASCADE;
  DROP TABLE "_articles_v_rels" CASCADE;
  DROP TABLE "experts" CASCADE;
  DROP TABLE "_experts_v" CASCADE;
  DROP TABLE "leads" CASCADE;
  DROP TABLE "activity" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_navigation" CASCADE;
  DROP TABLE "site_footer_links" CASCADE;
  DROP TABLE "site_social" CASCADE;
  DROP TABLE "site" CASCADE;
  DROP TABLE "audit_questions_options" CASCADE;
  DROP TABLE "audit_questions" CASCADE;
  DROP TABLE "audit" CASCADE;
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_media_approval";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum_products_slug";
  DROP TYPE "public"."enum_products_status";
  DROP TYPE "public"."enum__products_v_version_slug";
  DROP TYPE "public"."enum__products_v_version_status";
  DROP TYPE "public"."enum_cases_approval";
  DROP TYPE "public"."enum_cases_status";
  DROP TYPE "public"."enum__cases_v_version_approval";
  DROP TYPE "public"."enum__cases_v_version_status";
  DROP TYPE "public"."enum_evidence_kind";
  DROP TYPE "public"."enum_evidence_approval";
  DROP TYPE "public"."enum_evidence_status";
  DROP TYPE "public"."enum__evidence_v_version_kind";
  DROP TYPE "public"."enum__evidence_v_version_approval";
  DROP TYPE "public"."enum__evidence_v_version_status";
  DROP TYPE "public"."enum_articles_status";
  DROP TYPE "public"."enum__articles_v_version_status";
  DROP TYPE "public"."enum_experts_approval";
  DROP TYPE "public"."enum_experts_status";
  DROP TYPE "public"."enum__experts_v_version_approval";
  DROP TYPE "public"."enum__experts_v_version_status";
  DROP TYPE "public"."enum_leads_intent";
  DROP TYPE "public"."enum_leads_status";
  DROP TYPE "public"."enum_leads_delivery";`)
}
