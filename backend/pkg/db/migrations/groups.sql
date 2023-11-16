-- +migrate Up

CREATE TABLE IF NOT EXISTS groups(
   group_id    VARCHAR(255) NOT NULL PRIMARY KEY
  ,group_name  VARCHAR(255) NOT NULL
  ,creator     VARCHAR(255) NOT NULL
  ,description VARCHAR(255) NOT NULL
  ,image       VARCHAR(255) NOT NULL
);

-- +migrate Up

INSERT INTO groups(group_id,group_name, creator, description,image) VALUES ('4b1a6f85-7800-4f32-afac-9186f6fde021','Hiking Enthusiasts','1', 'A group for hiking and outdoor adventure lovers','files/groups/hiking_group.png');
INSERT INTO groups(group_id,group_name, creator, description,image) VALUES ('e2539b37-2e3c-4b2f-9e6f-28e1d90ed1c3','Photography Club','2','A group for photography enthusiasts','files/groups/photography_group.png');
INSERT INTO groups(group_id,group_name, creator, description,image) VALUES ('ce4a59c9-0e5d-4f02-83be-8ef0dc31455e','Foodie Followers','3','A group for food lovers and culinary explorers','files/groups/foodie_group.png');
INSERT INTO groups(group_id,group_name, creator, description,image) VALUES ('db05e7b4-2de7-4d38-a71a-66de1030e319','Art Enthusiasts','4','A group for art lovers and creative minds','files/groups/art_group.png');
INSERT INTO groups(group_id,group_name, creator, description,image) VALUES ('82a83c9e-00e7-455a-9e63-8e90dfb7e68d','Tech Talk','5','A group for technology enthusiasts and industry professionals','files/groups/tech_group.png');
INSERT INTO groups(group_id,group_name, creator, description,image) VALUES ('56232a0d-6f86-48d1-b752-c19ee83d84a2','Gaming Community','6','A group for gamers and gaming enthusiasts','files/groups/gaming_group.png');
INSERT INTO groups(group_id,group_name, creator, description,image) VALUES ('ff019ef9-b63c-4b6c-9a0c-85b93dd72aeb','Music Lovers','7','A group for music enthusiasts and musicians','files/groups/music_group.png');
INSERT INTO groups(group_id,group_name, creator, description,image) VALUES ('c7599f2e-1ef4-4fde-8bb1-7d64621d94c7','Fashionistas','8','A group for fashion lovers and trendsetters','files/groups/fashion_group.png');
INSERT INTO groups(group_id,group_name, creator, description,image) VALUES ('b09c8f47-4f10-4f76-9259-2e0c2fb60f4a','Pet Lovers','9','A group for pet owners and animal enthusiasts','files/groups/pet_group.png');
INSERT INTO groups(group_id,group_name, creator, description,image) VALUES ('f20db1a5-2e2f-4d36-92bc-c9f39f5bdfae','Fitness Fanatics','10','A group for fitness enthusiasts and health-conscious individuals','files/groups/fitness_group.png');
INSERT INTO groups(group_id,group_name, creator, description,image) VALUES ('917d125c-7339-43b4-81b5-398e6c3fdcc4','Nature Explorers','1','A group for nature lovers and outdoor adventurers','files/groups/nature_group.png');
INSERT INTO groups(group_id,group_name, creator, description,image) VALUES ('e8f3d61a-d2b4-4fda-9cb7-9278577f546e','Language Exchange','2','A group for language learners and cultural exchange','files/groups/language_group.png');
INSERT INTO groups(group_id,group_name, creator, description,image) VALUES ('d7e2a69b-65ae-4ae0-ae2b-1c9a4ae300a7','Reading Club','3','A group for bookworms and literature enthusiasts','files/groups/reading_group.png');
INSERT INTO groups(group_id,group_name, creator, description,image) VALUES ('79b8f92a-4b35-4c4f-9c54-1f9b69fbf02f','Volunteer Network','4','A group for volunteers and community service enthusiasts','files/groups/volunteer_group.png');
INSERT INTO groups(group_id,group_name, creator, description,image) VALUES ('3a6ab95a-3c3e-4be2-a0b4-0b9246c7b747','Cooking Club','5','A group for cooking enthusiasts and aspiring chefs','files/groups/cooking_group.png');
INSERT INTO groups(group_id,group_name, creator, description,image) VALUES ('8f85ad71-1476-41d2-8f0d-9c6e38a81eb1','Film Buffs','6','A group for film lovers and cinema enthusiasts','files/groups/film_group.png');
INSERT INTO groups(group_id,group_name, creator, description,image) VALUES ('1a051e39-221e-4a3f-82f6-c16d6a3bbf8e','Technology Startups','7','A group for entrepreneurs and technology startup enthusiasts','files/groups/startup_group.png');
INSERT INTO groups(group_id,group_name, creator, description,image) VALUES ('6d91b9fe-4ccf-4e3f-8728-cb919c4b91b5','Yoga and Meditation','8','A group for yoga practitioners and meditation enthusiasts','files/groups/yoga_group.png');
INSERT INTO groups(group_id,group_name, creator, description,image) VALUES ('2e30f155-f9f5-4e0d-9427-11b0f5c20f77','Fashion Designers','9','A group for fashion designers and aspiring fashionistas','files/groups/fashion_design_group.png');
INSERT INTO groups(group_id,group_name, creator, description,image) VALUES ('a6c8c7ab-9440-4f0e-8d6c-15c65eeb2b66','Sports Fan Club','10','A group for sports fans and team supporters','files/groups/sports_fan_group.png');

-- +migrate Down
DROP TABLE groups;