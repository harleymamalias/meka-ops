import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMaintenanceRecords1783250300000 implements MigrationInterface {
  name = 'CreateMaintenanceRecords1783250300000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "maintenance_records" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "service_request_id" uuid,
        "vehicle_id" uuid NOT NULL,
        "service_type" character varying NOT NULL,
        "description" text NOT NULL,
        "mileage_at_service" integer NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_maintenance_records_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_maintenance_records_service_request" UNIQUE ("service_request_id"),
        CONSTRAINT "FK_maintenance_records_request" FOREIGN KEY ("service_request_id") REFERENCES "service_requests"("id") ON DELETE SET NULL,
        CONSTRAINT "FK_maintenance_records_vehicle" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE RESTRICT
      )
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "maintenance_records"`);
  }
}
