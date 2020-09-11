# Migration `20200911113549-jf`

This migration has been generated at 9/11/2020, 7:35:49 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE `dislive`.`Post` ADD COLUMN `content` varchar(191)  NOT NULL 
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200911060517-fd..20200911113549-jf
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
@@ -58,8 +58,9 @@
 }
 model Post {
   id Int @id @default(autoincrement())
+  content String
   video Video @relation(fields: [videoId], references: [id])
   videoId Int
   comments Comment[]
   createdAt DateTime @default(now())
```


