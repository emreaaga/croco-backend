CREATE TABLE "application" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "application_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"site_url" text,
	"email" varchar(255) NOT NULL,
	"phone_number" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "application_email_unique" UNIQUE("email")
);
