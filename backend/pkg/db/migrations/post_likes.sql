-- +migrate Up

CREATE TABLE IF NOT EXISTS post_likes (
	User_id TEXT NOT NULL,
	Post_id INTEGER NOT NULL
);

-- +migrate Up

-- +migrate StatementBegin
CREATE TRIGGER update_post_likes_count
AFTER INSERT ON post_likes
BEGIN
  UPDATE posts
  SET Number_of_likes = (
    SELECT COUNT(*)
    FROM post_likes
    WHERE post_likes.Post_id = NEW.Post_id
  )
  WHERE posts.Id = NEW.Post_id;
END;
-- +migrate StatementEnd

-- +migrate Down
DROP TABLE post_likes;