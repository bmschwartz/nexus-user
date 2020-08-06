/** Users */
INSERT INTO "User" (password, email, username)
VALUES ('$2a$10$pRiUYltGoZ0eJQDg3TyKD.d34n3o0T1a8wDIpe11pvhNBVTSZyBPy', 'ben@example.com', 'ben');

INSERT INTO "User" (password, email, username)
VALUES ('$2a$10$pRiUYltGoZ0eJQDg3TyKD.d34n3o0T1a8wDIpe11pvhNBVTSZyBPy', 'xavyr@example.com', 'xavyr');

INSERT INTO "User" (password, email, username)
VALUES ('$2a$10$pRiUYltGoZ0eJQDg3TyKD.d34n3o0T1a8wDIpe11pvhNBVTSZyBPy', 'spenser@example.com', 'spenser');

INSERT INTO "User" (password, email, username)
VALUES ('$2a$10$pRiUYltGoZ0eJQDg3TyKD.d34n3o0T1a8wDIpe11pvhNBVTSZyBPy', 'sarah@example.com', 'sarah');

INSERT INTO "User" (password, email, username)
VALUES ('$2a$10$pRiUYltGoZ0eJQDg3TyKD.d34n3o0T1a8wDIpe11pvhNBVTSZyBPy', 'rachel@example.com', 'rachel');

INSERT INTO "User" (password, email, username)
VALUES ('$2a$10$pRiUYltGoZ0eJQDg3TyKD.d34n3o0T1a8wDIpe11pvhNBVTSZyBPy', 'nic@example.com', 'nic');


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
