ALTER TABLE "tools" ADD COLUMN "cost" smallint DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "tools" DROP COLUMN "requestSchema";