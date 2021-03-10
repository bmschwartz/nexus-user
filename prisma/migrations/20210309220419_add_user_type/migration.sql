-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('OWNER', 'TRADER', 'MEMBER');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "userType" "UserType" NOT NULL DEFAULT E'MEMBER';
