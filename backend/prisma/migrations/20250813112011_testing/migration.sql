/*
  Warnings:

  - You are about to drop the column `degree` on the `doctors` table. All the data in the column will be lost.
  - You are about to drop the column `experiences` on the `doctors` table. All the data in the column will be lost.
  - You are about to drop the column `publications` on the `doctors` table. All the data in the column will be lost.
  - You are about to drop the column `qualifications` on the `doctors` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `doctors` DROP COLUMN `degree`,
    DROP COLUMN `experiences`,
    DROP COLUMN `publications`,
    DROP COLUMN `qualifications`;
