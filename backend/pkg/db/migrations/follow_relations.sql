-- +migrate Up

CREATE TABLE IF NOT EXISTS follow_relations(
   follower_id VARCHAR(255) NOT NULL
  ,followed_id VARCHAR(255) NOT NULL
);

-- +migrate Up


INSERT INTO follow_relations(follower_id,followed_id) VALUES ('4','3');
INSERT INTO follow_relations(follower_id,followed_id) VALUES ('5','10');
INSERT INTO follow_relations(follower_id,followed_id) VALUES ('6','8');
INSERT INTO follow_relations(follower_id,followed_id) VALUES ('7','1');
INSERT INTO follow_relations(follower_id,followed_id) VALUES ('2','6');
INSERT INTO follow_relations(follower_id,followed_id) VALUES ('5','4');
INSERT INTO follow_relations(follower_id,followed_id) VALUES ('10','2');
INSERT INTO follow_relations(follower_id,followed_id) VALUES ('1','9');
INSERT INTO follow_relations(follower_id,followed_id) VALUES ('7','6');
INSERT INTO follow_relations(follower_id,followed_id) VALUES ('8','9');
INSERT INTO follow_relations(follower_id,followed_id) VALUES ('3ffd82e6-c8fc-4d8b-a014-d81692211890','5');
INSERT INTO follow_relations(follower_id,followed_id) VALUES ('3f8e5755-cae3-4f3b-94de-821e66c3db52','2');
INSERT INTO follow_relations(follower_id,followed_id) VALUES ('05983fcf-ae56-459c-bc10-aaf7b85068db','10');
INSERT INTO follow_relations(follower_id,followed_id) VALUES ('3','1');
INSERT INTO follow_relations(follower_id,followed_id) VALUES ('9','7');
INSERT INTO follow_relations(follower_id,followed_id) VALUES ('1','4');
INSERT INTO follow_relations(follower_id,followed_id) VALUES ('5','6');
INSERT INTO follow_relations(follower_id,followed_id) VALUES ('2','7');
INSERT INTO follow_relations(follower_id,followed_id) VALUES ('4','10');
INSERT INTO follow_relations(follower_id,followed_id) VALUES ('8','5');
INSERT INTO follow_relations(follower_id,followed_id) VALUES ('6','3');
INSERT INTO follow_relations(follower_id,followed_id) VALUES ('9','10');
INSERT INTO follow_relations(follower_id,followed_id) VALUES ('3','9');
INSERT INTO follow_relations(follower_id,followed_id) VALUES ('1','5');
INSERT INTO follow_relations(follower_id,followed_id) VALUES ('7','8');
INSERT INTO follow_relations(follower_id,followed_id) VALUES ('3f8e5755-cae3-4f3b-94de-821e66c3db52','9');
INSERT INTO follow_relations(follower_id,followed_id) VALUES ('3ffd82e6-c8fc-4d8b-a014-d81692211890','1');
INSERT INTO follow_relations(follower_id,followed_id) VALUES ('05983fcf-ae56-459c-bc10-aaf7b85068db','6');
INSERT INTO follow_relations(follower_id,followed_id) VALUES ('2','4');
INSERT INTO follow_relations(follower_id,followed_id) VALUES ('10','7');
INSERT INTO follow_relations(follower_id,followed_id) VALUES ('4','8');
INSERT INTO follow_relations(follower_id,followed_id) VALUES ('5','9');
INSERT INTO follow_relations(follower_id,followed_id) VALUES ('6','2');
INSERT INTO follow_relations(follower_id,followed_id) VALUES ('1','7');
INSERT INTO follow_relations(follower_id,followed_id) VALUES ('8','10');
INSERT INTO follow_relations(follower_id,followed_id) VALUES ('9','3');
INSERT INTO follow_relations(follower_id,followed_id) VALUES ('3','6');
INSERT INTO follow_relations(follower_id,followed_id) VALUES ('05983fcf-ae56-459c-bc10-aaf7b85068db','8');
INSERT INTO follow_relations(follower_id,followed_id) VALUES ('3ffd82e6-c8fc-4d8b-a014-d81692211890','2');
INSERT INTO follow_relations(follower_id,followed_id) VALUES ('3f8e5755-cae3-4f3b-94de-821e66c3db52','7');
INSERT INTO follow_relations(follower_id,followed_id) VALUES ('2','10');
INSERT INTO follow_relations(follower_id,followed_id) VALUES ('10','3');
INSERT INTO follow_relations(follower_id,followed_id) VALUES ('6','4');
INSERT INTO follow_relations(follower_id,followed_id) VALUES ('5','2');
INSERT INTO follow_relations(follower_id,followed_id) VALUES ('1','8');
INSERT INTO follow_relations(follower_id,followed_id) VALUES ('7','9');
INSERT INTO follow_relations(follower_id,followed_id) VALUES ('4','1');
INSERT INTO follow_relations(follower_id,followed_id) VALUES ('8','6');
INSERT INTO follow_relations(follower_id,followed_id) VALUES ('9','5');
INSERT INTO follow_relations(follower_id,followed_id) VALUES ('3','2');
INSERT INTO follow_relations(follower_id,followed_id) VALUES ('3ffd82e6-c8fc-4d8b-a014-d81692211890','10');
INSERT INTO follow_relations(follower_id,followed_id) VALUES ('05983fcf-ae56-459c-bc10-aaf7b85068db','7');
INSERT INTO follow_relations(follower_id,followed_id) VALUES ('f2d9d7c5-df85-4e27-82ad-84d722f3c37f','3ffd82e6-c8fc-4d8b-a014-d81692211890');
INSERT INTO follow_relations(follower_id,followed_id) VALUES ('9c2444e2-7f78-4c1e-a5d4-d8ff1a26b006','05983fcf-ae56-459c-bc10-aaf7b85068db');
INSERT INTO follow_relations(follower_id,followed_id) VALUES ('3f8e5755-cae3-4f3b-94de-821e66c3db52','f2d9d7c5-df85-4e27-82ad-84d722f3c37f');
INSERT INTO follow_relations(follower_id,followed_id) VALUES ('05983fcf-ae56-459c-bc10-aaf7b85068db','3f8e5755-cae3-4f3b-94de-821e66c3db52');
INSERT INTO follow_relations(follower_id,followed_id) VALUES ('f2d9d7c5-df85-4e27-82ad-84d722f3c37f','9c2444e2-7f78-4c1e-a5d4-d8ff1a26b006');
INSERT INTO follow_relations(follower_id,followed_id) VALUES ('3ffd82e6-c8fc-4d8b-a014-d81692211890','05983fcf-ae56-459c-bc10-aaf7b85068db');

-- +migrate Down
DROP TABLE follow_relations;