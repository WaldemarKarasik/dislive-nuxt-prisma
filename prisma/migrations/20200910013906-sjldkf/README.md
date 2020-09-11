# Migration `20200910013906-sjldkf`

This migration has been generated at 9/10/2020, 9:39:06 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE `dislive`.`Like` DROP FOREIGN KEY `Like_ibfk_2`

ALTER TABLE `dislive`.`Like` DROP FOREIGN KEY `Like_ibfk_1`

DROP TABLE `dislive`.`Like`
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration ..20200910013906-sjldkf
--- datamodel.dml
+++ datamodel.dml
@@ -1,0 +1,42 @@
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
+  channel Channel? @relation(name: "user")
+  subscribtions Channel[] @relation(name: "subscribtion")
+}
+
+model Channel {
+  id Int @id @default(autoincrement())
+  name String @unique
+  createdAt DateTime @default(now())
+  user User @relation(name: "user", fields: [userId], references: [id])
+  userId Int
+  videos Video[]
+  subscribers User[] @relation(name: "subscribtion")
+}
+
+model Video {
+  id Int @id @default(autoincrement())
+  name String
+  src String
+  channel Channel @relation(fields: [channelId], references: [id])
+  channelId Int
+  createdAt DateTime @default(now())
+}
```


