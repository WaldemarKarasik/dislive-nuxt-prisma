# Migration `20200911122544-jfd`

This migration has been generated at 9/11/2020, 8:25:44 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE `dislive`.`Post` ADD COLUMN `channelId` int  ,
MODIFY `userId` int

ALTER TABLE `dislive`.`Post` ADD FOREIGN KEY (`channelId`) REFERENCES `dislive`.`Channel`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200911113735-sdf..20200911122544-jfd
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
@@ -61,10 +61,12 @@
   id Int @id @default(autoincrement())
   content String
   video Video @relation(fields: [videoId], references: [id])
   videoId Int
-  user User @relation(fields: [userId], references: [id])
-  userId Int
+  user User? @relation(fields: [userId], references: [id])
+  userId Int?
+  channel Channel? @relation(fields: [channelId], references: [id])
+  channelId Int?
   comments Comment[]
   createdAt DateTime @default(now())
 }
```


