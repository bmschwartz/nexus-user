DROP DATABASE IF EXISTS "nexus_users";
CREATE DATABASE "nexus_users";

CREATE TABLE "public"."User" (
  id SERIAL PRIMARY KEY NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(255) UNIQUE NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE "public"."Permission" (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) UNIQUE NOT NULL,
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
