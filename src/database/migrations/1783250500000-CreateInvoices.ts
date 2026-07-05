import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInvoices1783250500000 implements MigrationInterface {
  name = 'CreateInvoices1783250500000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."invoices_status_enum" AS ENUM('UNPAID', 'PAID', 'VOIDED')`,
    );
    await queryRunner.query(`
      CREATE TABLE "invoices" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "service_request_id" uuid NOT NULL,
        "labor_cost" numeric(10,2) NOT NULL,
        "parts_cost" numeric(10,2) NOT NULL,
        "total_amount" numeric(10,2) NOT NULL,
        "status" "public"."invoices_status_enum" NOT NULL DEFAULT 'UNPAID',
        "payment_proof_url" character varying,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_invoices_service_request" UNIQUE ("service_request_id"),
        CONSTRAINT "PK_invoices_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_invoices_service_request" FOREIGN KEY ("service_request_id") REFERENCES "service_requests"("id") ON DELETE RESTRICT
      )
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "invoices"`);
    await queryRunner.query(`DROP TYPE "public"."invoices_status_enum"`);
  }
}
