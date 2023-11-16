-- +migrate Up

CREATE TABLE IF NOT EXISTS events (
    id TEXT,
    title TEXT NOT NULL,
    'description' TEXT NOT NULL,
    'date' TEXT NOT NULL,
    groupId TEXT NOT NULL,
    creator TEXT NOT NULL,
    creatorName TEXT NOT NULL
);

-- +migrate Up

INSERT INTO events (id, title, 'description', 'date', groupId, creator, creatorName) VALUES ("1", "2", "3", "4", "5", "6", "7");

-- +migrate Down
DROP TABLE events;