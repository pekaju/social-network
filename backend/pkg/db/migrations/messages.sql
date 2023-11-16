-- +migrate Up

CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY,
    msg TEXT NOT NULL,
    from_user TEXT NOT NULL,
    to_user TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- +migrate Up

INSERT INTO messages (id, msg, from_user, to_user, created_at)
VALUES
    (0, 'Hello John, how are you?', '3ffd82e6-c8fc-4d8b-a014-d81692211890', '1', '2023-06-01 10:30:00'),
    (1, 'Hi Jane, did you watch the latest movie?', '3ffd82e6-c8fc-4d8b-a014-d81692211890', '2', '2023-06-02 14:45:00'),
    (2, 'Hey Michael, let''s catch up for lunch!', '3ffd82e6-c8fc-4d8b-a014-d81692211890', '3', '2023-06-03 12:15:00'),
    (3, 'Hi Emily, how was your trip?', '3ffd82e6-c8fc-4d8b-a014-d81692211890', '4', '2023-06-04 09:20:00'),
    (4, 'Hey David, let''s plan a hiking trip!', '3ffd82e6-c8fc-4d8b-a014-d81692211890', '5', '2023-06-05 16:10:00'),
    (5, 'Hello Sarah, have you finished the project?', '3ffd82e6-c8fc-4d8b-a014-d81692211890', '6', '2023-06-06 11:50:00'),
    (6, 'Hi Matthew, how was the concert last night?', '3ffd82e6-c8fc-4d8b-a014-d81692211890', '7', '2023-06-07 20:05:00'),
    (7, 'Hey Olivia, let''s go shopping this weekend!', '3ffd82e6-c8fc-4d8b-a014-d81692211890', '8', '2023-06-08 15:30:00'),
    (8, 'Hi Daniel, are you free for a coffee tomorrow?', '3ffd82e6-c8fc-4d8b-a014-d81692211890', '9', '2023-06-09 13:40:00'),
    (9, 'Hello Sophia, let''s plan a movie night!', '3ffd82e6-c8fc-4d8b-a014-d81692211890', '10', '2023-06-10 17:55:00'),
    (10, 'Hey, how are you doing?', '1', '3ffd82e6-c8fc-4d8b-a014-d81692211890', '2023-06-01 10:45:00'),
    (11, 'Hi, I watched the movie. It was great!', '2', '3ffd82e6-c8fc-4d8b-a014-d81692211890', '2023-06-02 15:10:00'),
    (12, 'Sure, let''s meet at the usual place.', '3', '3ffd82e6-c8fc-4d8b-a014-d81692211890', '2023-06-03 13:25:00'),
    (13, 'It was amazing! I had a fantastic time.', '4', '3ffd82e6-c8fc-4d8b-a014-d81692211890', '2023-06-04 10:55:00');


-- +migrate Up
CREATE TABLE IF NOT EXISTS groupMessages(
    id INTEGER PRIMARY KEY,
    msg TEXT NOT NULL,
    from_user TEXT NOT NULL,
    groupId TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- +migrate Down
DROP TABLE messages;

-- +migrate Down 
DROP TABLE groupMessages;