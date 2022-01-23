-- Create constrain
CREATE CONSTRAINT email_unique IF NOT EXISTS FOR (n:User) REQUIRE n.email IS UNIQUE
CREATE CONSTRAINT display_name_unique IF NOT EXISTS FOR (n:User) REQUIRE n.displayName IS UNIQUE
CREATE CONSTRAINT username_unique IF NOT EXISTS FOR (n:User) REQUIRE n.username IS UNIQUE

-- Create index
CREATE INDEX user_id_index IF NOT EXISTS FOR (n:User) ON (n.id)
