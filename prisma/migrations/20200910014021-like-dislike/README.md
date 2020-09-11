# Migration `20200910014021-like-dislike`

This migration has been generated at 9/10/2020, 9:40:21 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE `dislive`.`Like` (
`id` int  NOT NULL  AUTO_INCREMENT,
`videoId` int  NOT NULL ,
`userId` int  NOT NULL ,
PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `dislive`.`Dislike` (
`id` int  NOT NULL  AUTO_INCREMENT,
`userId` int  NOT NULL ,
`videoId` int  NOT NULL ,
PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

ALTER TABLE `dislive`.`Like` ADD FOREIGN KEY (`videoId`) REFERENCES `dislive`.`Video`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `dislive`.`Like` ADD FOREIGN KEY (`userId`) REFERENCES `dislive`.`User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `dislive`.`Dislike` ADD FOREIGN KEY (`userId`) REFERENCES `dislive`.`User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `dislive`.`Dislike` ADD FOREIGN KEY (`videoId`) REFERENCES `dislive`.`Video`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200910013906-sjldkf..20200910014021-like-dislike
--- datamodel.dml
+++ datamodel.dml
@@ -2,9 +2,9 @@
 // learn more about it in the docs: https://pris.ly/d/prisma-schema
 datasource db {
   provider = "mysql"
-  url = "***"
+  url = "***"
 }
 generator client {
   provider = "prisma-client-js"
@@ -39,4 +39,19 @@
   channel Channel @relation(fields: [channelId], references: [id])
   channelId Int
   createdAt DateTime @default(now())
 }
+
+model Like {
+  id Int @id @default(autoincrement())
+  video Video @relation(name: "likeVideo", fields: [videoId], references: [id])
+  videoId Int
+  user User @relation(name: "likeUser", fields: [userId], references: [id])
+  userId Int
+}
+model Dislike {
+  id Int @id @default(autoincrement())
+  user User @relation(name: "dislikeUser", fields: [userId], references: [id])
+  userId Int
+  video Video @relation(name: "dislikeVideo", fields: [videoId], references: [id])
+  videoId Int
+}
```


