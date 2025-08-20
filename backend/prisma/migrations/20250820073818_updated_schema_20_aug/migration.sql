/*
  Warnings:

  - You are about to drop the column `payment_status` on the `appointments` table. All the data in the column will be lost.
  - You are about to drop the column `slot_id` on the `appointments` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `appointments` table. All the data in the column will be lost.
  - The primary key for the `categories` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `points` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `account_owner_id` on the `patients` table. All the data in the column will be lost.
  - You are about to drop the column `first_seen_at` on the `patients` table. All the data in the column will be lost.
  - You are about to drop the column `insurance_number` on the `patients` table. All the data in the column will be lost.
  - You are about to drop the column `insurance_provider` on the `patients` table. All the data in the column will be lost.
  - You are about to drop the column `insurance_valid_till` on the `patients` table. All the data in the column will be lost.
  - You are about to drop the column `last_visit_at` on the `patients` table. All the data in the column will be lost.
  - You are about to drop the column `medical_record_number` on the `patients` table. All the data in the column will be lost.
  - You are about to drop the column `source` on the `patients` table. All the data in the column will be lost.
  - The primary key for the `specialities` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `is_scrapped` on the `specialities` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[uuid]` on the table `appointments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[old_db_id]` on the table `appointments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[pmdc_number]` on the table `doctors` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `appointments` DROP FOREIGN KEY `appointments_doctor_practice_id_fkey`;

-- DropForeignKey
ALTER TABLE `appointments` DROP FOREIGN KEY `appointments_slot_id_fkey`;

-- DropForeignKey
ALTER TABLE `doctor_speciality` DROP FOREIGN KEY `doctor_speciality_speciality_id_fkey`;

-- DropForeignKey
ALTER TABLE `doctors` DROP FOREIGN KEY `doctors_category_id_fkey`;

-- DropForeignKey
ALTER TABLE `doctors` DROP FOREIGN KEY `doctors_main_speciality_id_fkey`;

-- DropForeignKey
ALTER TABLE `patients` DROP FOREIGN KEY `patients_account_owner_id_fkey`;

-- DropForeignKey
ALTER TABLE `specialities` DROP FOREIGN KEY `specialities_parent_id_fkey`;

-- DropIndex
DROP INDEX `appointments_slot_id_idx` ON `appointments`;

-- DropIndex
DROP INDEX `idx_apps_practice_status_created` ON `appointments`;

-- DropIndex
DROP INDEX `doctor_speciality_speciality_id_fkey` ON `doctor_speciality`;

-- DropIndex
DROP INDEX `doctors_category_id_fkey` ON `doctors`;

-- DropIndex
DROP INDEX `doctors_main_speciality_id_fkey` ON `doctors`;

-- DropIndex
DROP INDEX `patients_account_owner_id_idx` ON `patients`;

-- DropIndex
DROP INDEX `patients_medical_record_number_key` ON `patients`;

-- DropIndex
DROP INDEX `specialities_parent_id_fkey` ON `specialities`;

-- DropIndex
DROP INDEX `idx_users_username` ON `users`;

-- AlterTable
ALTER TABLE `appointments` DROP COLUMN `payment_status`,
    DROP COLUMN `slot_id`,
    DROP COLUMN `status`,
    ADD COLUMN `appointment_datetime` DATETIME(0) NULL,
    ADD COLUMN `appointment_status_id` INTEGER NULL DEFAULT 1,
    ADD COLUMN `appointment_type_id` INTEGER NULL DEFAULT 1,
    ADD COLUMN `old_db_id` BIGINT NULL,
    ADD COLUMN `payment_status_id` INTEGER NULL,
    ADD COLUMN `probability_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `categories` DROP PRIMARY KEY,
    DROP COLUMN `points`,
    MODIFY `id` BIGINT NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `doctor_practices` ADD COLUMN `allows_direct_booking` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `pa_number` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `doctor_speciality` MODIFY `speciality_id` BIGINT NOT NULL;

-- AlterTable
ALTER TABLE `doctors` MODIFY `main_speciality_id` BIGINT NOT NULL,
    MODIFY `category_id` BIGINT NULL;

-- AlterTable
ALTER TABLE `patients` DROP COLUMN `account_owner_id`,
    DROP COLUMN `first_seen_at`,
    DROP COLUMN `insurance_number`,
    DROP COLUMN `insurance_provider`,
    DROP COLUMN `insurance_valid_till`,
    DROP COLUMN `last_visit_at`,
    DROP COLUMN `medical_record_number`,
    DROP COLUMN `source`,
    ADD COLUMN `user_id` BIGINT NULL,
    ADD COLUMN `visitor_source` VARCHAR(128) NULL;

-- AlterTable
ALTER TABLE `specialities` DROP PRIMARY KEY,
    DROP COLUMN `is_scrapped`,
    MODIFY `id` BIGINT NOT NULL AUTO_INCREMENT,
    MODIFY `parent_id` BIGINT NULL,
    ADD PRIMARY KEY (`id`);

-- CreateTable
CREATE TABLE `payment_status` (
    `id` TINYINT NOT NULL,
    `title` VARCHAR(100) NOT NULL,
    `status_key` VARCHAR(50) NOT NULL,
    `description` TEXT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `payment_status_status_key_key`(`status_key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `appointment_types` (
    `id` TINYINT NOT NULL,
    `title` VARCHAR(100) NOT NULL,
    `status_key` VARCHAR(50) NOT NULL,
    `description` TEXT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `appointment_types_status_key_key`(`status_key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `appointment_probabilities` (
    `id` TINYINT NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `status_key` VARCHAR(50) NOT NULL,
    `description` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `appointment_probabilities_status_key_key`(`status_key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `message_logs` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `service_type` ENUM('PATIENT', 'DOCTOR', 'PHARMACY', 'HOSPITAL', 'LAB', 'APPOINTMENT', 'CORPORATE', 'OTHER') NOT NULL,
    `service_id` BIGINT NOT NULL,
    `appointment_id` BIGINT NULL,
    `user_id` BIGINT NULL,
    `channel` ENUM('SMS', 'WHATSAPP', 'EMAIL', 'PUSH', 'IN_APP', 'IVR', 'CALL', 'OTHER') NOT NULL,
    `direction` ENUM('INBOUND', 'OUTBOUND') NOT NULL,
    `to_address` VARCHAR(191) NULL,
    `from_address` VARCHAR(191) NULL,
    `body` TEXT NULL,
    `body_sha256` CHAR(64) NULL,
    `template_key` VARCHAR(100) NULL,
    `provider` VARCHAR(100) NULL,
    `provider_msg_id` VARCHAR(191) NULL,
    `correlation_id` VARCHAR(191) NULL,
    `status` ENUM('QUEUED', 'SENT', 'DELIVERED', 'READ', 'FAILED', 'BOUNCED', 'UNKNOWN') NOT NULL DEFAULT 'QUEUED',
    `queued_at` DATETIME(3) NULL,
    `sent_at` DATETIME(3) NULL,
    `delivered_at` DATETIME(3) NULL,
    `read_at` DATETIME(3) NULL,
    `failed_at` DATETIME(3) NULL,
    `error_code` VARCHAR(100) NULL,
    `error_message` VARCHAR(255) NULL,
    `meta` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    INDEX `idx_msg_service_time`(`service_type`, `service_id`, `created_at`),
    INDEX `idx_msg_appt_time`(`appointment_id`, `created_at`),
    INDEX `idx_msg_user_time`(`user_id`, `created_at`),
    INDEX `idx_msg_channel_dir_time`(`channel`, `direction`, `created_at`),
    INDEX `idx_msg_provider`(`provider`, `provider_msg_id`),
    INDEX `idx_msg_corr`(`correlation_id`),
    INDEX `idx_msg_to_addr`(`to_address`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `appointments_uuid_key` ON `appointments`(`uuid`);

-- CreateIndex
CREATE UNIQUE INDEX `appointments_old_db_id_key` ON `appointments`(`old_db_id`);

-- CreateIndex
CREATE INDEX `idx_apps_practice_status_created` ON `appointments`(`doctor_practice_id`, `appointment_status_id`, `created_at`);

-- CreateIndex
CREATE INDEX `idx_appt_datetime` ON `appointments`(`appointment_datetime`);

-- CreateIndex
CREATE INDEX `idx_appt_patient_time` ON `appointments`(`patient_id`, `appointment_datetime`);

-- CreateIndex
CREATE INDEX `idx_appt_doctor_time` ON `appointments`(`doctor_practice_id`, `appointment_datetime`);

-- CreateIndex
CREATE INDEX `idx_appt_status_time` ON `appointments`(`appointment_status_id`, `appointment_datetime`);

-- CreateIndex
CREATE UNIQUE INDEX `doctors_pmdc_number_key` ON `doctors`(`pmdc_number`);

-- CreateIndex
CREATE INDEX `patients_user_id_idx` ON `patients`(`user_id`);

-- AddForeignKey
ALTER TABLE `specialities` ADD CONSTRAINT `specialities_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `specialities`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `doctors` ADD CONSTRAINT `doctors_main_speciality_id_fkey` FOREIGN KEY (`main_speciality_id`) REFERENCES `specialities`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `doctors` ADD CONSTRAINT `doctors_main_speciality_id_fkey` FOREIGN KEY (`main_speciality_id`) REFERENCES `specialities`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `doctors` ADD CONSTRAINT `doctors_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `doctor_speciality` ADD CONSTRAINT `doctor_speciality_speciality_id_fkey` FOREIGN KEY (`speciality_id`) REFERENCES `specialities`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `appointments` ADD CONSTRAINT `appointments_appointment_status_id_fkey` FOREIGN KEY (`appointment_status_id`) REFERENCES `appointment_statuses`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `appointments` ADD CONSTRAINT `appointments_payment_status_id_fkey` FOREIGN KEY (`payment_status_id`) REFERENCES `payment_status`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `appointments` ADD CONSTRAINT `appointments_appointment_type_id_fkey` FOREIGN KEY (`appointment_type_id`) REFERENCES `appointment_types`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `appointments` ADD CONSTRAINT `appointments_probability_id_fkey` FOREIGN KEY (`probability_id`) REFERENCES `appointment_probabilities`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `patients` ADD CONSTRAINT `patients_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
