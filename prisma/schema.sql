DROP DATABASE IF EXISTS "nexus_users";
CREATE DATABASE "nexus_users";

CREATE TABLE "public"."User" (
  id SERIAL PRIMARY KEY NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  username VARCHAR(255) UNIQUE NOT NULL,
  admin BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE "public"."Permission" (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  description VARCHAR(255) NOT NULL
);

CREATE TABLE "public"."UserPermission" (
  id SERIAL PRIMARY KEY NOT NULL,
  "userId" INTEGER NOT NULL,
  "permissionId" INTEGER NOT NULL,
  UNIQUE("userId", "permissionId"),
  FOREIGN KEY ("userId") REFERENCES "public"."User"(id),
  FOREIGN KEY ("permissionId") REFERENCES "public"."Permission"(id)
);

ALTER TABLE "public"."User"
  DROP COLUMN admin;

ALTER TABLE "public"."Permission"
    ADD CONSTRAINT Permission_name_key
    UNIQUE (name);

ALTER TABLE "public"."User"
  ADD CONSTRAINT User_email_key
  UNIQUE (email);

------- ADD DATE FIELDS -------
ALTER TABLE "public"."User"
  ADD COLUMN "updatedAt" TIMESTAMP NOT NULL DEFAULT now();