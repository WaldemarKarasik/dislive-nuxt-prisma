# Migration `20200908012928-create_tables`

This migration has been generated at 9/8/2020, 9:29:28 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE `dislive-nuxt`.`User` (
`id` int  NOT NULL  AUTO_INCREMENT,
`email` varchar(191)  NOT NULL ,
`username` varchar(191)  NOT NULL ,
`password` varchar(191)  NOT NULL ,
`avatar` varchar(191)  NOT NULL DEFAULT 'https://yt3.ggpht.com/a/AATXAJzEQ_UGiCdeznREI7XkDPG11JDNOEb3iyE7xaRGCQ=s100-c-k-c0xffffffff-no-rj-mo',
`isBanned` boolean  DEFAULT false,
`createdAt` datetime(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
UNIQUE Index `User.email_unique`(`email`),
PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `dislive-nuxt`.`Channel` (
`id` int  NOT NULL  AUTO_INCREMENT,
`name` varchar(191)  NOT NULL ,
`createdAt` datetime(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
`userId` int  NOT NULL ,
UNIQUE Index `Channel.name_unique`(`name`),
UNIQUE Index `Channel_userId_unique`(`userId`),
PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `dislive-nuxt`.`Video` (
`id` int  NOT NULL  AUTO_INCREMENT,
`name` varchar(191)  NOT NULL ,
`channelId` int  NOT NULL ,
`createdAt` datetime(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

ALTER TABLE `dislive-nuxt`.`Channel` ADD FOREIGN KEY (`userId`) REFERENCES `dislive-nuxt`.`User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `dislive-nuxt`.`Video` ADD FOREIGN KEY (`channelId`) REFERENCES `dislive-nuxt`.`Channel`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration ..20200908012928-create_tables
--- datamodel.dml
+++ datamodel.dml
@@ -1,0 +1,40 @@
+// This is your Prisma schema file,
+// learn more about it in the docs: https://pris.ly/d/prisma-schema
+
+datasource db {
+  provider = "mysql"
+  url = "***"
+}
+
+generator client {
+  provider = "prisma-client-js"
+}
+
+model User {
+  id Int @id @default(autoincrement())
+  email String @unique
+  username String
+  password String
+  avatar String @default("https://yt3.ggpht.com/a/AATXAJzEQ_UGiCdeznREI7XkDPG11JDNOEb3iyE7xaRGCQ=s100-c-k-c0xffffffff-no-rj-mo")
+  isBanned Boolean? @default(false)
+  createdAt DateTime @default(now())
+  channel Channel? 
+}
+
+model Channel {
+  id Int @id @default(autoincrement())
+  name String @unique
+  createdAt DateTime @default(now())
+  user User @relation(fields: [userId], references: [id])
+  userId Int
+  videos Video[]
+}
+
+model Video {
+  id Int @id @default(autoincrement())
+  name String
+  channel Channel @relation(fields: [channelId], references: [id])
+  channelId Int
+  createdAt DateTime @default(now())
+
+}
```


