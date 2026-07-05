import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateServiceRequests1783250200000
  implements MigrationInterface
{
  name = 'CreateServiceRequests1783250200000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."service_requests_status_enum" AS ENUM('PENDING', 'INSPECTING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')`,
    );
    await queryRunner.query(`
      CREATE TABLE "service_requests" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "vehicle_id" uuid NOT NULL,
        "advisor_id" uuid NOT NULL,
        "mechanic_id" uuid,
        "status" "public"."service_requests_status_enum" NOT NULL DEFAULT 'PENDING',
        "description" text NOT NULL,
        "remarks" text,
        "estimated_completion" TIMESTAMP WITH TIME ZONE,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_service_requests_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_service_requests_vehicle" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE RESTRICT,
        CONSTRAINT "FK_service_requests_advisor" FOREIGN KEY ("advisor_id") REFERENCES "users"("id") ON DELETE RESTRICT,
        CONSTRAINT "FK_service_requests_mechanic" FOREIGN KEY ("mechanic_id") REFERENCES "users"("id") ON DELETE SET NULL
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "service_request_timelines" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "service_request_id" uuid NOT NULL,
        "changed_by_id" uuid NOT NULL,
        "from_status" "public"."service_requests_status_enum",
        "to_status" "public"."service_requests_status_enum" NOT NULL,
        "note" text,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_service_request_timelines_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_service_request_timelines_request" FOREIGN KEY ("service_request_id") REFERENCES "service_requests"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_service_request_timelines_user" FOREIGN KEY ("changed_by_id") REFERENCES "users"("id") ON DELETE RESTRICT
      )
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "service_request_timelines"`);
    await queryRunner.query(`DROP TABLE "service_requests"`);
    await queryRunner.query(`DROP TYPE "public"."service_requests_status_enum"`);
  }
}
