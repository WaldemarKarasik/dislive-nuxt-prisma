# Migration `20200911113735-sdf`

This migration has been generated at 9/11/2020, 7:37:35 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE `dislive`.`Post` ADD COLUMN `userId` int  NOT NULL 

ALTER TABLE `dislive`.`Post` ADD FOREIGN KEY (`userId`) REFERENCES `dislive`.`User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200911113549-jf..20200911113735-sdf
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
@@ -61,8 +61,10 @@
   id Int @id @default(autoincrement())
   content String
   video Video @relation(fields: [videoId], references: [id])
   videoId Int
+  user User @relation(fields: [userId], references: [id])
+  userId Int
   comments Comment[]
   createdAt DateTime @default(now())
 }
```


