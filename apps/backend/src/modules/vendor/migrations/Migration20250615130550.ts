import { Migration } from '@mikro-orm/migrations';

export class Migration20250615130550 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "purchase_order" ("id" text not null, "display_id" integer null, "buyer_id" text not null, "seller_id" text not null, "status" text check ("status" in ('requested', 'confirmed', 'shipped', 'delivered', 'cancelled')) not null default 'requested', "items" jsonb not null, "shipping_info" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "purchase_order_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_purchase_order_deleted_at" ON "purchase_order" (deleted_at) WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "vendor_inventory" ("id" text not null, "variant_id" text not null, "seller_id" text not null, "quantity" integer not null default 0, "lead_time" integer null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "vendor_inventory_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_vendor_inventory_deleted_at" ON "vendor_inventory" (deleted_at) WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "vendor_price" ("id" text not null, "variant_id" text not null, "seller_id" text not null, "buyer_type" text check ("buyer_type" in ('admin', 'reseller', 'customer')) not null, "buyer_id" text null, "buyer_group_id" text null, "price" integer not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "vendor_price_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_vendor_price_deleted_at" ON "vendor_price" (deleted_at) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "purchase_order" cascade;`);

    this.addSql(`drop table if exists "vendor_inventory" cascade;`);

    this.addSql(`drop table if exists "vendor_price" cascade;`);
  }

}
