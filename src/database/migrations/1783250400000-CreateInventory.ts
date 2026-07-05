import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInventory1783250400000 implements MigrationInterface {
  name = 'CreateInventory1783250400000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "inventory_items" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "sku" character varying NOT NULL,
        "quantity" integer NOT NULL,
        "unit" character varying NOT NULL,
        "unit_price" numeric(10,2) NOT NULL,
        "low_stock_threshold" integer NOT NULL DEFAULT 5,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        CONSTRAINT "UQ_inventory_items_sku" UNIQUE ("sku"),
        CONSTRAINT "PK_inventory_items_id" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "service_request_parts" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "service_request_id" uuid NOT NULL,
        "inventory_item_id" uuid NOT NULL,
        "quantity_used" integer NOT NULL,
        "unit_price_at_use" numeric(10,2) NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_service_request_parts_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_service_request_parts_request" FOREIGN KEY ("service_request_id") REFERENCES "service_requests"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_service_request_parts_inventory" FOREIGN KEY ("inventory_item_id") REFERENCES "inventory_items"("id") ON DELETE RESTRICT
      )
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "service_request_parts"`);
    await queryRunner.query(`DROP TABLE "inventory_items"`);
  }
}
