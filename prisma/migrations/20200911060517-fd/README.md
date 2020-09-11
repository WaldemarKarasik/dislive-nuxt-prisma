# Migration `20200911060517-fd`

This migration has been generated at 9/11/2020, 2:05:17 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE `dislive`.`Post` (
`id` int  NOT NULL  AUTO_INCREMENT,
`videoId` int  NOT NULL ,
`createdAt` datetime(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `dislive`.`Comment` (
`id` int  NOT NULL  AUTO_INCREMENT,
`postId` int  NOT NULL ,
`createdAt` datetime(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

ALTER TABLE `dislive`.`Post` ADD FOREIGN KEY (`videoId`) REFERENCES `dislive`.`Video`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `dislive`.`Comment` ADD FOREIGN KEY (`postId`) REFERENCES `dislive`.`Post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200910014021-like-dislike..20200911060517-fd
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
@@ -38,8 +38,9 @@
   src String
   channel Channel @relation(fields: [channelId], references: [id])
   channelId Int
   createdAt DateTime @default(now())
+  posts Post[]
 }
 model Like {
   id Int @id @default(autoincrement())
@@ -54,4 +55,19 @@
   userId Int
   video Video @relation(name: "dislikeVideo", fields: [videoId], references: [id])
   videoId Int
 }
+
+model Post {
+  id Int @id @default(autoincrement())
+  video Video @relation(fields: [videoId], references: [id])
+  videoId Int
+  comments Comment[]
+  createdAt DateTime @default(now())
+}
+
+model Comment {
+    id Int @id @default(autoincrement())
+    post Post @relation(fields: [postId], references: [id])
+    postId Int
+    createdAt DateTime @default(now())
+}
```


