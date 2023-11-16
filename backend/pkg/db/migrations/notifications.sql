-- +migrate Up

CREATE TABLE IF NOT EXISTS notifications (
    id TEXT NOT NULL,
    toUser TEXT NOT NULL,
    fromId TEXT NOT NULL,
    groupId TEXT,
    type TEXT NOT NULL,
    message TEXT NOT NULL,
    unread int NOT NULL,
    link TEXT NOT NULL,
    time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- +migrate Up

INSERT INTO notifications (id, toUser, fromId, groupId, type, message, unread, link, time)
VALUES
    ('05983fcf-ae56-459c-bc10-aaf7b85068sw','05983fcf-ae56-459c-bc10-aaf7b85068db', 2, '', 'new_following', 'followed_user', 1, '/profile?id=2', CURRENT_TIMESTAMP),
    ('05983fcf-ae56-459c-bc10-aaf7b85068xw','05983fcf-ae56-459c-bc10-aaf7b85068db', 4, 'e2539b37-2e3c-4b2f-9e6f-28e1d90ed1c3', 'group_post', 'posted_in_group', 1, '/group?id=e2539b37-2e3c-4b2f-9e6f-28e1d90ed1c3', CURRENT_TIMESTAMP),
    ('05983fcf-ae56-459c-bc10-aaf7b85068se','05983fcf-ae56-459c-bc10-aaf7b85068db', 2, '', 'like', 'liked_post', 1, '/feed?id=ce0f8896-6794-444a-9c39-d29dfb22293a', CURRENT_TIMESTAMP);

-- +migrate Down
DROP TABLE notifications;