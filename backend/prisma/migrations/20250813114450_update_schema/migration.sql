-- AlterTable
ALTER TABLE `doctors` ADD COLUMN `bio` TEXT NULL,
    ADD COLUMN `degree` VARCHAR(1000) NULL,
    ADD COLUMN `experiences` JSON NULL,
    ADD COLUMN `publications` JSON NULL,
    ADD COLUMN `qualifications` JSON NULL;
