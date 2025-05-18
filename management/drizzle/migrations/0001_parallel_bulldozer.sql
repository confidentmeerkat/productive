CREATE TABLE "api_keys" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"label" varchar(255) NOT NULL,
	"api_key_hash" text NOT NULL,
	"api_key_prefix" varchar(8) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"last_used_at" timestamp,
	"expires_at" timestamp,
	"is_active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "api_keys_api_key_hash_unique" UNIQUE("api_key_hash"),
	CONSTRAINT "api_keys_api_key_prefix_unique" UNIQUE("api_key_prefix")
);
--> statement-breakpoint
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;