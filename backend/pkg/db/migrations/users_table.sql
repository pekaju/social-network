-- +migrate Up

CREATE TABLE IF NOT EXISTS users (
	User_id TEXT NOT NULL,
	Email TEXT NOT NULL,
	"Password" TEXT NOT NULL,
    First_name TEXT NOT NULL,
	Last_name TEXT NOT NULL,
	Date_of_birth TEXT NOT NULL,
	"Image" TEXT NOT NULL,
	Nickname TEXT NOT NULL,
	About_me TEXT NOT NULL,
	Followers INTEGER NOT NULL,
	Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Staatus TEXT NOT NULL,
    Public BOOLEAN
);

-- +migrate Up

INSERT INTO users (User_id, Email, "Password", First_name, Last_name, Date_of_birth, "Image", Nickname, About_me, Followers, Created_At, Staatus, Public)
VALUES
    ('1', 'user1@example.com', 'password1', 'John', 'Doe', '01.01.2001', '', 'johndoe', 'About user 1', 100, CURRENT_TIMESTAMP, "online", true),
    ('2', 'user2@example.com', 'password2', 'Jane', 'Smith', '12.05.1992', '', 'janesmith', 'About user 2', 50, CURRENT_TIMESTAMP, "online", true),
    ('3', 'user3@example.com', 'password3', 'Michael', 'Johnson', '20.09.1985', '', 'michaeljohnson', 'About user 3', 200, CURRENT_TIMESTAMP, "online", true),
    ('4', 'user4@example.com', 'password4', 'Emily', 'Brown', '15.03.1998', '', 'emilybrown', 'About user 4', 75, CURRENT_TIMESTAMP, "online", true),
    ('5', 'user5@example.com', 'password5', 'David', 'Wilson', '30.11.1993', '', 'davidwilson', 'About user 5', 150, CURRENT_TIMESTAMP, "online", true),
    ('6', 'user6@example.com', 'password6', 'Sarah', 'Taylor', '18.07.1987', '', 'sarahtaylor', 'About user 6', 90, CURRENT_TIMESTAMP, "online", true),
    ('7', 'user7@example.com', 'password7', 'Matthew', 'Anderson', '25.04.1991', '', 'matthewanderson', 'About user 7', 120, CURRENT_TIMESTAMP, "online", true),
    ('8', 'user8@example.com', 'password8', 'Olivia', 'Martin', '09.02.1995', '', 'oliviamartin', 'About user 8', 80, CURRENT_TIMESTAMP, "online", true),
    ('9', 'user9@example.com', 'password9', 'Daniel', 'Thompson', '05.06.1989', '', 'danielthompson', 'About user 9', 110, CURRENT_TIMESTAMP, "online", true),
    ('10', 'user10@example.com', 'password10', 'Sophia', 'Clark', '23.12.1994', '', 'sophiaclark', 'About user 10', 70, CURRENT_TIMESTAMP, "online", true),
    ('3ffd82e6-c8fc-4d8b-a014-d81692211890', 'p@k.com', 'pk', 'Peeter', 'Kaju', '04.09.2001', '', 'pets', 'hellopets', 0, CURRENT_TIMESTAMP, "online", false),
    ('05983fcf-ae56-459c-bc10-aaf7b85068db', 'karl@kani.ee', 'Password1', 'Karlos', 'Kajakas', '02.02.1920', 'files/05983fcf-ae56-459c-bc10-aaf7b85068db_1687970312.gif', 'Jujutsu master', 'haak-tza', '123', CURRENT_TIMESTAMP, 'offline', false);

-- +migrate Down
DROP TABLE users;