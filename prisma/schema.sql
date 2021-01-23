DROP DATABASE IF EXISTS "nexus_users";
CREATE DATABASE "nexus_users";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE "public"."User" (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(255) UNIQUE NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE "public"."Permission" (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) UNIQUE NOT NULL,
  description VARCHAR(255) NOT NULL
);

CREATE TABLE "public"."UserPermission" (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId" uuid NOT NULL,
  "permissionId" uuid NOT NULL,
  UNIQUE("userId", "permissionId"),
  FOREIGN KEY ("userId") REFERENCES "public"."User"(id),
  FOREIGN KEY ("permissionId") REFERENCES "public"."Permission"(id)
);
