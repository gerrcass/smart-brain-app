BEGIN TRANSACTION;

INSERT into users (name,email,pet,age,entries,joined) values ('foo','foo@gmail.com','Cat',20,3,'2020-02-01');
INSERT into login (hash,email) values ('$2a$10$Twuv8T7wF7D.EnkCVO.CROYjr31u42o/f9djHAO2ADOrSnpIn8rDq','foo@gmail.com');
COMMIT;