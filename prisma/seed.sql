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

INSERT INTO "Permission" (name, description)
VALUES ('site:admin', 'Allows access to everything in the site');

INSERT INTO "UserPermission" ("userId", "permissionId")
VALUES (1, 1);

INSERT INTO "UserPermission" ("userId", "permissionId")
VALUES (2, 1);
