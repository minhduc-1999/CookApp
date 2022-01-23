-- Create constrain
CREATE CONSTRAINT email_unique IF NOT EXISTS FOR (n:User) REQUIRE n.email IS UNIQUE
CREATE CONSTRAINT display_name_unique IF NOT EXISTS FOR (n:User) REQUIRE n.displayName IS UNIQUE
CREATE CONSTRAINT username_unique IF NOT EXISTS FOR (n:User) REQUIRE n.username IS UNIQUE
CREATE CONSTRAINT user_id_unique IF NOT EXISTS FOR (n:User) REQUIRE n.id IS UNIQUE

CREATE CONSTRAINT post_id_unique IF NOT EXISTS FOR (n:Post) REQUIRE n.id IS UNIQUE

-- Create index
CREATE FULLTEXT INDEX user_search_index IF NOT EXISTS FOR (n:User) ON EACH [n.displayName, n.firstName, n.lastName]
