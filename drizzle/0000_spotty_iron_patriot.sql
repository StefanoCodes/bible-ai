CREATE TABLE "generations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"data" jsonb NOT NULL,
	"user_id" uuid,
	"tool_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tools" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" varchar(255) NOT NULL,
	"systemPrompt" text NOT NULL,
	"requestSchema" jsonb NOT NULL,
	"intent" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"role" varchar,
	"user_id" uuid NOT NULL,
	"tokens" smallint DEFAULT 15,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "generations" ADD CONSTRAINT "generations_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "generations" ADD CONSTRAINT "generations_tool_id_tools_id_fk" FOREIGN KEY ("tool_id") REFERENCES "public"."tools"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "id_idx" ON "generations" USING btree ("id");--> statement-breakpoint
CREATE INDEX "generations_user_id_idx" ON "generations" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "generations_tool_id_idx" ON "generations" USING btree ("tool_id");--> statement-breakpoint
CREATE INDEX "tools_id_idx" ON "tools" USING btree ("id");--> statement-breakpoint
CREATE INDEX "tools_name_idx" ON "tools" USING btree ("name");--> statement-breakpoint
CREATE INDEX "user_id_idx" ON "users" USING btree ("id");--> statement-breakpoint
CREATE INDEX "user_name_idx" ON "users" USING btree ("name");