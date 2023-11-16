-- +migrate Up

CREATE TABLE IF NOT EXISTS posts (
    Id TEXT PRIMARY KEY,
    User_id TEXT NOT NULL,
    Nickname TEXT NOT NULL,
    Content TEXT NOT NULL,
	  Created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Number_of_likes INTEGER DEFAULT 0,
    Number_of_comments INTEGER DEFAULT 0,
    "Type" INT NOT NULL, -- types are 1 = Personal, 2 = Group
    Target_id TEXT, -- if type is 2 then group id
    PrivacyId INT NOT NULL, -- types are 1 = Private, 2 = Public, 3 = Custom
    AllowedUsers TEXT, -- joined array of users who can see this post if PrivacyId is 3, array is joined with pipe (|)
    Images TEXT
);

-- +migrate Up

INSERT INTO posts (Id, User_id, Nickname, Content, Created_at, Number_of_likes, Number_of_comments, Type, Target_id, PrivacyId, AllowedUsers, Images)
VALUES
    ('1f821139-ee0c-4849-a0b0-b0c9a93e92ac', '1', 'John Doe', 'Sample post 1', CURRENT_TIMESTAMP, 0, 5, 1, "", 2, "", ""),
    ('24204507-d1fd-4946-872e-1bf2e2ade783', '2', 'Jane Smith', 'Sample post 2', CURRENT_TIMESTAMP, 0, 1, 1, "", 2, "", ""),
    ('09e93f3e-0631-40f5-ad42-c499b5bdee6c', '3', 'Michael Johnson', 'Sample post 3', CURRENT_TIMESTAMP, 0, 1, 1, "", 2, "", ""),
    ('338b0231-8240-4be0-ba22-f7f43cd01d3a', '4', 'Emily Brown', 'Sample post 4', CURRENT_TIMESTAMP, 0, 1, 1, "", 2, "", ""),
    ('f2c4e501-cfdd-4e36-8e8a-7b5043d7d265', '5', 'David Wilson', 'Sample post 5', CURRENT_TIMESTAMP, 0, 1, 1, "", 2, "", "");

-- +migrate Up
-- +migrate StatementBegin
CREATE TRIGGER update_comments_count
AFTER INSERT ON comments
BEGIN
  UPDATE posts
  SET Number_of_comments = (
    SELECT COUNT(*)
    FROM comments
    WHERE comments.Post_id = NEW.Post_id
  )
  WHERE posts.Id = NEW.Post_id;
END;
-- +migrate StatementEnd

-- +migrate Down
DROP TABLE posts;