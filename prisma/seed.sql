/** Users */
INSERT INTO "User" (password, email, username, admin)
VALUES ('password', 'ben@example.com', 'ben', TRUE);

INSERT INTO "User" (password, email, username, admin)
VALUES ('password', 'xavyr@example.com', 'xavyr', TRUE);

INSERT INTO "User" (password, email, username, admin)
VALUES ('password', 'spenser@example.com', 'spenser', FALSE);

INSERT INTO "User" (password, email, username, admin)
VALUES ('password', 'sarah@example.com', 'sarah', FALSE);

INSERT INTO "User" (password, email, username, admin)
VALUES ('password', 'rachel@example.com', 'rachel', FALSE);

INSERT INTO "User" (password, email, username, admin)
VALUES ('password', 'nic@example.com', 'nic', FALSE);


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

INSERT INTO "UserPermission" ("userId", "permissionId")
VALUES (7, 2);

INSERT INTO "UserPermission" ("userId", "permissionId")
VALUES (8, 2);

INSERT INTO "UserPermission" ("userId", "permissionId")
VALUES (9, 2);

INSERT INTO "UserPermission" ("userId", "permissionId")
VALUES (10, 2);

INSERT INTO "UserPermission" ("userId", "permissionId")
VALUES (11, 2);

INSERT INTO "UserPermission" ("userId", "permissionId")
VALUES (12, 2);

INSERT INTO "UserPermission" ("userId", "permissionId")
VALUES (13, 2);

INSERT INTO "UserPermission" ("userId", "permissionId")
VALUES (14, 2);

INSERT INTO "UserPermission" ("userId", "permissionId")
VALUES (15, 2);
