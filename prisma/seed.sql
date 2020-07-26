/** Users */
INSERT INTO "User" (name, password, email, username, admin)
VALUES ('Ben', 'password', 'ben@example.com', 'ben', TRUE);

INSERT INTO "User" (name, password, email, username, admin)
VALUES ('Xavyr', 'password', 'xavyr@example.com', 'xavyr', TRUE);

INSERT INTO "User" (name, password, email, username, admin)
VALUES ('Spenser', 'password', 'spenser@example.com', 'spenser', FALSE);

INSERT INTO "User" (name, password, email, username, admin)
VALUES ('Sarah', 'password', 'sarah@example.com', 'sarah', FALSE);

INSERT INTO "User" (name, password, email, username, admin)
VALUES ('Rachel', 'password', 'rachel@example.com', 'rachel', FALSE);

INSERT INTO "User" (name, password, email, username, admin)
VALUES ('Nic', 'password', 'nic@example.com', 'nic', FALSE);


/** Groups */
INSERT INTO "Group" (name, active)
VALUES ('Top Traders', TRUE);

INSERT INTO "Group" (name, active)
VALUES ('Binance Raiders', TRUE);

INSERT INTO "Group" (name, active)
VALUES ('Bull Traders', TRUE);

INSERT INTO "Group" (name, active)
VALUES ('Doggy Dog', FALSE);


/** GroupMemberships */
INSERT INTO "GroupMembership" ("memberId", "groupId", active, role, status)
VALUES (1, 1, TRUE, 'ADMIN', 'APPROVED');

INSERT INTO "GroupMembership" ("memberId", "groupId", active, role, status)
VALUES (2, 1, TRUE, 'MEMBER', 'APPROVED');

INSERT INTO "GroupMembership" ("memberId", "groupId", active, role, status)
VALUES (4, 1, TRUE, 'MEMBER', 'PENDING');

INSERT INTO "GroupMembership" ("memberId", "groupId", active, role, status)
VALUES (3, 1, FALSE, 'MEMBER', 'DENIED');

INSERT INTO "GroupMembership" ("memberId", "groupId", active, role, status)
VALUES (6, 1, TRUE, 'MEMBER', 'PENDING');

INSERT INTO "GroupMembership" ("memberId", "groupId", active, role, status)
VALUES (2, 2, TRUE, 'ADMIN', 'APPROVED');

INSERT INTO "GroupMembership" ("memberId", "groupId", active, role, status)
VALUES (4, 2, TRUE, 'TRADER', 'APPROVED');

INSERT INTO "GroupMembership" ("memberId", "groupId", active, role, status)
VALUES (6, 2, TRUE, 'MEMBER', 'APPROVED');

INSERT INTO "GroupMembership" ("memberId", "groupId", active, role, status)
VALUES (3, 3, TRUE, 'ADMIN', 'APPROVED');

INSERT INTO "GroupMembership" ("memberId", "groupId", active, role, status)
VALUES (5, 3, TRUE, 'MEMBER', 'PENDING');

INSERT INTO "GroupMembership" ("memberId", "groupId", active, role, status)
VALUES (5, 4, TRUE, 'ADMIN', 'APPROVED');

INSERT INTO "GroupMembership" ("memberId", "groupId", active, role, status)
VALUES (3, 4, TRUE, 'MEMBER', 'APPROVED');

INSERT INTO "GroupMembership" ("memberId", "groupId", active, role, status)
VALUES (4, 4, FALSE, 'TRADER', 'PENDING');