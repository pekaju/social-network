-- +migrate Up

CREATE TABLE IF NOT EXISTS comments (
	Id INTEGER PRIMARY KEY AUTOINCREMENT,
	Post_id INTEGER,
	Comment TEXT NOT NULL,
    Likes INTEGER DEFAULT 0,
	Comment_user_id TEXT,
	Created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Image TEXT
);

-- +migrate Up

INSERT INTO comments (Post_id, Comment, Comment_user_id, Image)
VALUES
    ('1f821139-ee0c-4849-a0b0-b0c9a93e92ac', 'Great post!', '1', ''),
    ('1f821139-ee0c-4849-a0b0-b0c9a93e92ac', 'Amazing stuff here!', '2', ''),
    ('1f821139-ee0c-4849-a0b0-b0c9a93e92ac', 'I really like you opinion on this', '3', ''),
    ('1f821139-ee0c-4849-a0b0-b0c9a93e92ac', 'Agreed..', '4', ''),
    ('24204507-d1fd-4946-872e-1bf2e2ade783', 'Interesting topic!', '2', ''),
    ('09e93f3e-0631-40f5-ad42-c499b5bdee6c', 'I totally agree with you.', '3', ''),
    ('338b0231-8240-4be0-ba22-f7f43cd01d3a', 'Nice job!', '4', ''),
    ('f2c4e501-cfdd-4e36-8e8a-7b5043d7d265', 'Thanks for sharing.', '5', ''),
    ('1f821139-ee0c-4849-a0b0-b0c9a93e92ac', 'This is really helpful!', '6', ''),
    ('24204507-d1fd-4946-872e-1bf2e2ade783', 'I have a question...', '7', ''),
    ('09e93f3e-0631-40f5-ad42-c499b5bdee6c', 'Well written!', '8', ''),
    ('338b0231-8240-4be0-ba22-f7f43cd01d3a', 'I learned something new.', '9', ''),
    ('f2c4e501-cfdd-4e36-8e8a-7b5043d7d265', 'Keep up the good work!', '10', '');

-- +migrate Down
DROP TABLE comments;