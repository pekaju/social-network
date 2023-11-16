-- +migrate Up

CREATE TABLE IF NOT EXISTS comment_likes (
	User_id TEXT NOT NULL,
	Comment_id INTEGER NOT NULL
);

-- +migrate Up
-- +migrate StatementBegin
CREATE TRIGGER update_comment_likes_count
AFTER INSERT ON comment_likes
BEGIN
  UPDATE comments
  SET Likes = (
    SELECT COUNT(*)
    FROM comment_likes
    WHERE comment_likes.Comment_id = NEW.Id
  )
  WHERE comments.Id = NEW.Comment_id;
END;
-- +migrate StatementEnd

-- +migrate Down
DROP TABLE comment_likes;