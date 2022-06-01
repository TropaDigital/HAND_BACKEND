-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL,
    `role` ENUM('USER', 'ADMIN') NOT NULL,

    UNIQUE INDEX `User_userName_key`(`userName`),
    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Associated` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `affiliation` VARCHAR(191) NOT NULL,
    `gender` VARCHAR(191) NOT NULL,
    `birth_date` DATETIME(3) NOT NULL,
    `martial_status` VARCHAR(191) NOT NULL,
    `nationality` VARCHAR(191) NOT NULL,
    `place_of_birth` VARCHAR(191) NOT NULL,
    `taxId` VARCHAR(191) NOT NULL,
    `register_id` VARCHAR(191) NOT NULL,
    `emission_state` VARCHAR(191) NOT NULL,
    `issuing_agency` VARCHAR(191) NOT NULL,
    `emission_date` DATETIME(3) NOT NULL,
    `cel_phone` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `father` VARCHAR(191) NOT NULL,
    `mother` VARCHAR(191) NOT NULL,
    `partner` VARCHAR(191) NULL,
    `bank` VARCHAR(191) NOT NULL,
    `agency` VARCHAR(191) NOT NULL,
    `account_type` VARCHAR(191) NOT NULL,
    `account_number` VARCHAR(191) NOT NULL,
    `pix_key` VARCHAR(191) NOT NULL,
    `address_type` VARCHAR(191) NOT NULL,
    `postal_code` VARCHAR(191) NOT NULL,
    `street` VARCHAR(191) NOT NULL,
    `house_number` VARCHAR(191) NOT NULL,
    `complement` VARCHAR(191) NOT NULL,
    `district` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `occupation` VARCHAR(191) NOT NULL,
    `salary` VARCHAR(191) NOT NULL,
    `payment_day` INTEGER NOT NULL,
    `register_number` VARCHAR(191) NOT NULL,
    `contract_type` VARCHAR(191) NOT NULL,
    `final_date` DATETIME(3) NULL,
    `public_agency` VARCHAR(191) NOT NULL,
    `created_by` VARCHAR(75) NOT NULL,
    `updated_by` VARCHAR(75) NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(0) NULL,

    UNIQUE INDEX `Associated_taxId_key`(`taxId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Consultant` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `tax_id` VARCHAR(11) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `commission` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `created_by` VARCHAR(75) NOT NULL,
    `updated_by` VARCHAR(75) NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
