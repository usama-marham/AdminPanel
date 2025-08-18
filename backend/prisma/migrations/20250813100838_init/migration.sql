-- CreateTable
CREATE TABLE `appointment_statuses` (
    `id` TINYINT NOT NULL,
    `title` VARCHAR(100) NOT NULL,
    `status_key` VARCHAR(50) NOT NULL,
    `description` TEXT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `appointment_statuses_status_key_key`(`status_key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `points` TINYINT NOT NULL DEFAULT 0,
    `is_onboarding_payment_required` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `specialities` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) NOT NULL,
    `parent_id` INTEGER NULL,
    `position` INTEGER NULL DEFAULT 0,
    `is_scrapped` TINYINT NULL DEFAULT 0,
    `display_content` JSON NULL,
    `media` JSON NULL,
    `seo` JSON NULL,
    `faqs` JSON NULL,
    `actions` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `specialities_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `doctors` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(120) NULL,
    `pmdc_number` VARCHAR(50) NULL,
    `email` VARCHAR(255) NULL,
    `phone` VARCHAR(50) NULL,
    `bio` TEXT NULL,
    `profile_pic_url` VARCHAR(1024) NULL,
    `date_of_experience` DATE NULL,
    `main_speciality_id` INTEGER NOT NULL,
    `category_id` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    INDEX `doctors_name_idx`(`name`),
    INDEX `doctors_email_idx`(`email`),
    INDEX `doctors_phone_idx`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `doctor_speciality` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `doctor_id` BIGINT NOT NULL,
    `speciality_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `uniq_doctor_speciality`(`doctor_id`, `speciality_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hospitals` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(500) NULL,
    `city` VARCHAR(255) NULL,
    `address` TEXT NULL,
    `lat` DOUBLE NULL,
    `lng` DOUBLE NULL,
    `phone` TEXT NULL,
    `type` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    INDEX `hospitals_city_idx`(`city`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `doctor_practices` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `doctor_id` BIGINT NOT NULL,
    `hospital_id` BIGINT NULL,
    `practice_slug` VARCHAR(191) NULL,
    `profile_slug` VARCHAR(191) NULL,
    `consultation_fee` INTEGER NULL,
    `discount_fee` INTEGER NULL,
    `appointment_policy` JSON NULL,
    `patients_per_hour` INTEGER NULL,
    `avg_time_per_patient_minutes` INTEGER NULL,
    `on_panel` BOOLEAN NOT NULL DEFAULT false,
    `consultancy_referral_percent` INTEGER NULL DEFAULT 0,
    `active_from` DATE NULL,
    `active_to` DATE NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    INDEX `doctor_practices_doctor_id_idx`(`doctor_id`),
    INDEX `doctor_practices_hospital_id_idx`(`hospital_id`),
    INDEX `idx_doctor_practices_profile_slug`(`profile_slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `availabilities` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `doctor_practice_id` BIGINT NOT NULL,
    `weekday` INTEGER NOT NULL,
    `start_time` TIME(0) NULL,
    `end_time` TIME(0) NULL,
    `slot_duration_minutes` INTEGER NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    INDEX `availabilities_doctor_practice_id_weekday_idx`(`doctor_practice_id`, `weekday`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `appointment_slots` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `doctor_practice_id` BIGINT NOT NULL,
    `slot_date` DATE NOT NULL,
    `start_ts` DATETIME(3) NOT NULL,
    `end_ts` DATETIME(3) NOT NULL,
    `slot_status` INTEGER NOT NULL DEFAULT 0,
    `hold_until` DATETIME(3) NULL,
    `slot_version` INTEGER NOT NULL DEFAULT 1,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    INDEX `idx_slots_practice_date_status_start`(`doctor_practice_id`, `slot_date`, `slot_status`, `start_ts`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `appointments` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `uuid` CHAR(36) NOT NULL,
    `slot_id` BIGINT NULL,
    `doctor_practice_id` BIGINT NULL,
    `patient_id` BIGINT NULL,
    `user_id` BIGINT NULL,
    `status` INTEGER NOT NULL DEFAULT 0,
    `fee` INTEGER NULL,
    `discount` INTEGER NULL,
    `payment_status` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    INDEX `idx_apps_practice_status_created`(`doctor_practice_id`, `status`, `created_at`),
    INDEX `appointments_slot_id_idx`(`slot_id`),
    INDEX `appointments_patient_id_idx`(`patient_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reviews` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `service_id` BIGINT NOT NULL,
    `service_type` ENUM('doctor', 'hospital', 'lab', 'medicine', 'online_consultation', 'subscription') NOT NULL,
    `doctor_id` BIGINT NULL,
    `rating` TINYINT NOT NULL,
    `review_text` VARCHAR(191) NULL,
    `is_pinned` BOOLEAN NOT NULL DEFAULT false,
    `published_by` BIGINT NOT NULL,
    `published_at` DATETIME(3) NULL,
    `overall_experience` ENUM('positive', 'negative', 'neutral') NULL,
    `is_published` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    INDEX `idx_service`(`service_id`, `service_type`),
    INDEX `idx_doctor`(`doctor_id`),
    INDEX `idx_published`(`published_by`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(255) NOT NULL,
    `username` VARCHAR(100) NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `full_name` VARCHAR(255) NULL,
    `phone` VARCHAR(50) NULL,
    `phone_verified` BOOLEAN NOT NULL DEFAULT false,
    `user_type_id` SMALLINT NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `is_system` BOOLEAN NOT NULL DEFAULT false,
    `doctor_id` BIGINT NULL,
    `last_seen_at` DATETIME(0) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    UNIQUE INDEX `users_username_key`(`username`),
    INDEX `idx_users_email`(`email`),
    INDEX `idx_users_username`(`username`),
    INDEX `idx_users_phone`(`phone`),
    INDEX `idx_users_user_type`(`user_type_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_types` (
    `id` SMALLINT NOT NULL,
    `type_name` VARCHAR(50) NOT NULL,

    UNIQUE INDEX `user_types_type_name_key`(`type_name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `patients` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `account_owner_id` BIGINT NOT NULL,
    `uuid` CHAR(36) NOT NULL,
    `medical_record_number` VARCHAR(64) NULL,
    `first_name` VARCHAR(120) NOT NULL,
    `last_name` VARCHAR(120) NOT NULL,
    `full_name` VARCHAR(255) NULL,
    `gender` VARCHAR(30) NULL,
    `date_of_birth` DATE NULL,
    `email` VARCHAR(255) NULL,
    `phone` VARCHAR(50) NULL,
    `phone_verified` BOOLEAN NOT NULL DEFAULT false,
    `address_line1` VARCHAR(191) NULL,
    `address_line2` VARCHAR(191) NULL,
    `city` VARCHAR(128) NULL,
    `state` VARCHAR(128) NULL,
    `postal_code` VARCHAR(32) NULL,
    `country` VARCHAR(64) NULL,
    `emergency_contacts` JSON NOT NULL,
    `insurance_provider` VARCHAR(255) NULL,
    `insurance_number` VARCHAR(128) NULL,
    `insurance_valid_till` DATE NULL,
    `consent_email` BOOLEAN NOT NULL DEFAULT true,
    `consent_sms` BOOLEAN NOT NULL DEFAULT true,
    `first_seen_at` DATETIME(3) NULL,
    `source` VARCHAR(128) NULL,
    `utm_source` VARCHAR(128) NULL,
    `utm_medium` VARCHAR(128) NULL,
    `utm_campaign` VARCHAR(128) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,
    `last_visit_at` DATETIME(3) NULL,

    UNIQUE INDEX `patients_medical_record_number_key`(`medical_record_number`),
    INDEX `patients_phone_idx`(`phone`),
    INDEX `patients_full_name_idx`(`full_name`),
    INDEX `patients_account_owner_id_idx`(`account_owner_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `specialities` ADD CONSTRAINT `specialities_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `specialities`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `doctors` ADD CONSTRAINT `doctors_main_speciality_id_fkey` FOREIGN KEY (`main_speciality_id`) REFERENCES `specialities`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `doctors` ADD CONSTRAINT `doctors_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `doctor_speciality` ADD CONSTRAINT `doctor_speciality_doctor_id_fkey` FOREIGN KEY (`doctor_id`) REFERENCES `doctors`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `doctor_speciality` ADD CONSTRAINT `doctor_speciality_speciality_id_fkey` FOREIGN KEY (`speciality_id`) REFERENCES `specialities`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `doctor_practices` ADD CONSTRAINT `doctor_practices_doctor_id_fkey` FOREIGN KEY (`doctor_id`) REFERENCES `doctors`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `doctor_practices` ADD CONSTRAINT `doctor_practices_hospital_id_fkey` FOREIGN KEY (`hospital_id`) REFERENCES `hospitals`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `availabilities` ADD CONSTRAINT `availabilities_doctor_practice_id_fkey` FOREIGN KEY (`doctor_practice_id`) REFERENCES `doctor_practices`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `appointment_slots` ADD CONSTRAINT `appointment_slots_doctor_practice_id_fkey` FOREIGN KEY (`doctor_practice_id`) REFERENCES `doctor_practices`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `appointments` ADD CONSTRAINT `appointments_slot_id_fkey` FOREIGN KEY (`slot_id`) REFERENCES `appointment_slots`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `appointments` ADD CONSTRAINT `appointments_doctor_practice_id_fkey` FOREIGN KEY (`doctor_practice_id`) REFERENCES `doctor_practices`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `appointments` ADD CONSTRAINT `appointments_patient_id_fkey` FOREIGN KEY (`patient_id`) REFERENCES `patients`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `appointments` ADD CONSTRAINT `appointments_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_doctor_id_fkey` FOREIGN KEY (`doctor_id`) REFERENCES `doctors`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_user_type_id_fkey` FOREIGN KEY (`user_type_id`) REFERENCES `user_types`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_doctor_id_fkey` FOREIGN KEY (`doctor_id`) REFERENCES `doctors`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `patients` ADD CONSTRAINT `patients_account_owner_id_fkey` FOREIGN KEY (`account_owner_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
