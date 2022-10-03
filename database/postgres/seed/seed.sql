BEGIN TRANSACTION;

INSERT into users (name,email,pet,age,entries,joined) values ('foo','foo@gmail.com','Cat',20,3,'2022-09-01');
INSERT into login (hash,email) values ('$2b$10$XBNA16kQPkwJEyvBhy4rkesCSSVzKkd.Px5A92DN92nsGGXdWZIve','foo@gmail.com');
COMMIT;