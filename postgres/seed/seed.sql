BEGIN TRANSACTION;

INSERT into users (name,email,entries,joined) values ('foo','foo@gmail.com',3,'2020-01-01');
INSERT into login (hash,email) values ('$2a$10$Twuv8T7wF7D.EnkCVO.CROYjr31u42o/f9djHAO2ADOrSnpIn8rDq','foo@gmail.com');
COMMIT;