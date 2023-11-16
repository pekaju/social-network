-- +migrate Up

CREATE TABLE IF NOT EXISTS cookies (
    id INTEGER PRIMARY KEY,
    userId TEXT NOT NULL, 
    cookieId TEXT NOT NULL,
    expires TIMESTAMP NOT NULL
);

-- +migrate Down
DROP TABLE cookies;