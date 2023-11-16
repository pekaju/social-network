-- +migrate Up

CREATE TABLE IF NOT EXISTS group_relations(
   user_id  VARCHAR(255) NOT NULL 
  ,group_id VARCHAR(255) NOT NULL
);

-- +migrate Up

INSERT INTO group_relations(user_id,group_id) VALUES ('1','82a83c9e-00e7-455a-9e63-8e90dfb7e68d');
INSERT INTO group_relations(user_id,group_id) VALUES ('1','56232a0d-6f86-48d1-b752-c19ee83d84a2');
INSERT INTO group_relations(user_id,group_id) VALUES ('1','ff019ef9-b63c-4b6c-9a0c-85b93dd72aeb');
INSERT INTO group_relations(user_id,group_id) VALUES ('1','b09c8f47-4f10-4f76-9259-2e0c2fb60f4a');
INSERT INTO group_relations(user_id,group_id) VALUES ('2','f20db1a5-2e2f-4d36-92bc-c9f39f5bdfae');
INSERT INTO group_relations(user_id,group_id) VALUES ('2','917d125c-7339-43b4-81b5-398e6c3fdcc4');
INSERT INTO group_relations(user_id,group_id) VALUES ('2','e8f3d61a-d2b4-4fda-9cb7-9278577f546e');
INSERT INTO group_relations(user_id,group_id) VALUES ('2','d7e2a69b-65ae-4ae0-ae2b-1c9a4ae300a7');
INSERT INTO group_relations(user_id,group_id) VALUES ('3','79b8f92a-4b35-4c4f-9c54-1f9b69fbf02f');
INSERT INTO group_relations(user_id,group_id) VALUES ('3','3a6ab95a-3c3e-4be2-a0b4-0b9246c7b747');
INSERT INTO group_relations(user_id,group_id) VALUES ('3','8f85ad71-1476-41d2-8f0d-9c6e38a81eb1');
INSERT INTO group_relations(user_id,group_id) VALUES ('3','1a051e39-221e-4a3f-82f6-c16d6a3bbf8e');
INSERT INTO group_relations(user_id,group_id) VALUES ('4','6d91b9fe-4ccf-4e3f-8728-cb919c4b91b5');
INSERT INTO group_relations(user_id,group_id) VALUES ('4','2e30f155-f9f5-4e0d-9427-11b0f5c20f77');
INSERT INTO group_relations(user_id,group_id) VALUES ('4','a6c8c7ab-9440-4f0e-8d6c-15c65eeb2b66');
INSERT INTO group_relations(user_id,group_id) VALUES ('5','4b1a6f85-7800-4f32-afac-9186f6fde021');
INSERT INTO group_relations(user_id,group_id) VALUES ('5','e2539b37-2e3c-4b2f-9e6f-28e1d90ed1c3');
INSERT INTO group_relations(user_id,group_id) VALUES ('6','56232a0d-6f86-48d1-b752-c19ee83d84a2');
INSERT INTO group_relations(user_id,group_id) VALUES ('6','ff019ef9-b63c-4b6c-9a0c-85b93dd72aeb');
INSERT INTO group_relations(user_id,group_id) VALUES ('6','c7599f2e-1ef4-4fde-8bb1-7d64621d94c7');
INSERT INTO group_relations(user_id,group_id) VALUES ('7','b09c8f47-4f10-4f76-9259-2e0c2fb60f4a');
INSERT INTO group_relations(user_id,group_id) VALUES ('7','f20db1a5-2e2f-4d36-92bc-c9f39f5bdfae');
INSERT INTO group_relations(user_id,group_id) VALUES ('7','917d125c-7339-43b4-81b5-398e6c3fdcc4');
INSERT INTO group_relations(user_id,group_id) VALUES ('8','e8f3d61a-d2b4-4fda-9cb7-9278577f546e');
INSERT INTO group_relations(user_id,group_id) VALUES ('8','d7e2a69b-65ae-4ae0-ae2b-1c9a4ae300a7');
INSERT INTO group_relations(user_id,group_id) VALUES ('9','4b1a6f85-7800-4f32-afac-9186f6fde021');
INSERT INTO group_relations(user_id,group_id) VALUES ('9','ce4a59c9-0e5d-4f02-83be-8ef0dc31455e');
INSERT INTO group_relations(user_id,group_id) VALUES ('9','82a83c9e-00e7-455a-9e63-8e90dfb7e68d');
INSERT INTO group_relations(user_id,group_id) VALUES ('10','6d91b9fe-4ccf-4e3f-8728-cb919c4b91b5');
INSERT INTO group_relations(user_id,group_id) VALUES ('10','2e30f155-f9f5-4e0d-9427-11b0f5c20f77');
INSERT INTO group_relations(user_id,group_id) VALUES ('10','a6c8c7ab-9440-4f0e-8d6c-15c65eeb2b66');
INSERT INTO group_relations(user_id,group_id) VALUES ('cac63e22-ba45-49d6-842a-5765e7427e27','3a6ab95a-3c3e-4be2-a0b4-0b9246c7b747');
INSERT INTO group_relations(user_id,group_id) VALUES ('cac63e22-ba45-49d6-842a-5765e7427e27','8f85ad71-1476-41d2-8f0d-9c6e38a81eb1');
INSERT INTO group_relations(user_id,group_id) VALUES ('cac63e22-ba45-49d6-842a-5765e7427e27','1a051e39-221e-4a3f-82f6-c16d6a3bbf8e');
INSERT INTO group_relations(user_id,group_id) VALUES ('7fe786a5-51ed-4991-807f-ac1af27500d4','e2539b37-2e3c-4b2f-9e6f-28e1d90ed1c3');
INSERT INTO group_relations(user_id,group_id) VALUES ('7fe786a5-51ed-4991-807f-ac1af27500d4','56232a0d-6f86-48d1-b752-c19ee83d84a2');
INSERT INTO group_relations(user_id,group_id) VALUES ('7fe786a5-51ed-4991-807f-ac1af27500d4','ff019ef9-b63c-4b6c-9a0c-85b93dd72aeb');
INSERT INTO group_relations(user_id,group_id) VALUES ('7fe786a5-51ed-4991-807f-ac1af27500d4','3a6ab95a-3c3e-4be2-a0b4-0b9246c7b747');
INSERT INTO group_relations(user_id,group_id) VALUES ('7fe786a5-51ed-4991-807f-ac1af27500d4','8f85ad71-1476-41d2-8f0d-9c6e38a81eb1');

-- +migrate Down
DROP TABLE group_relations;