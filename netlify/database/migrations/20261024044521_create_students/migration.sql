CREATE TABLE "students" (
	"id" serial PRIMARY KEY,
	"name" text NOT NULL,
	"index_number" text NOT NULL UNIQUE,
	"phone" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
