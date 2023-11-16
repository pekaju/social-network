-- +migrate Up

CREATE TABLE IF NOT EXISTS attendees (
   id TEXT NOT NULL,
   userId TEXT NOT NULL,
   eventId TEXT NOT NULL,
   going BOOLEAN NOT NULL
);

-- +migrate Down
DROP TABLE attendees;