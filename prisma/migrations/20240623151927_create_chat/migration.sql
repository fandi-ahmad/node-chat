-- CreateTable
CREATE TABLE `chats` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_user_from` INTEGER NOT NULL,
    `id_user_to` INTEGER NOT NULL,
    `message` TEXT NOT NULL,
    `created_at` TIMESTAMP NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
