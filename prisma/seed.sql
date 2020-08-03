/** Users */
INSERT INTO "User" (password, email, username)
VALUES ('password', 'ben@example.com', 'ben');

INSERT INTO "User" (password, email, username)
VALUES ('password', 'xavyr@example.com', 'xavyr');

INSERT INTO "User" (password, email, username)
VALUES ('password', 'spenser@example.com', 'spenser');

INSERT INTO "User" (password, email, username)
VALUES ('password', 'sarah@example.com', 'sarah');

INSERT INTO "User" (password, email, username)
VALUES ('password', 'rachel@example.com', 'rachel');

INSERT INTO "User" (password, email, username)
VALUES ('password', 'nic@example.com', 'nic');


/** Permission types */
INSERT INTO "Permission" (name, description)
VALUES ('site:admin', 'Allows access to everything in the site');

INSERT INTO "Permission" (name, description)
VALUES ('site:member', 'Registered member of the site');


/** Assign site:admin */
INSERT INTO "UserPermission" ("userId", "permissionId")
VALUES (1, 1);

INSERT INTO "UserPermission" ("userId", "permissionId")
VALUES (2, 1);


/** Assign site:member */
INSERT INTO "UserPermission" ("userId", "permissionId")
VALUES (1, 2);

INSERT INTO "UserPermission" ("userId", "permissionId")
VALUES (2, 2);

INSERT INTO "UserPermission" ("userId", "permissionId")
VALUES (3, 2);

INSERT INTO "UserPermission" ("userId", "permissionId")
VALUES (4, 2);

INSERT INTO "UserPermission" ("userId", "permissionId")
VALUES (5, 2);

INSERT INTO "UserPermission" ("userId", "permissionId")
VALUES (6, 2);
