
--CREATE EXTENSION pgcrypto;  -- allows usage of UUID in candidate_stats table

CREATE TABLE candidates
(
	candidate_id VARCHAR(20) NOT NULL,
	screen_name VARCHAR(20) NOT NULL,
	political_party VARCHAR NOT NULL,
	photo_id VARCHAR,
	political_orientation VARCHAR,
	PRIMARY KEY(candidate_id)
);

CREATE TABLE tweets
(
	tweet_id VARCHAR(20) NOT NULL,
	author_id VARCHAR(20) NOT NULL,
	text VARCHAR(128) NOT NULL,
	mentions json,
	favorites_number INTEGER NOT NULL DEFAULT 0,
	retweets_number INTEGER NOT NULL DEFAULT 0,
	replies_number INTEGER NOT NULL DEFAULT 0,
	text_analysis json,
	created_at TIMESTAMP WITH TIME ZONE NOT NULL,
	PRIMARY KEY (tweet_id)	
);

CREATE TABLE candidate_stats
(
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	candidate_id VARCHAR(20) REFERENCES candidates(candidate_id) NOT NULL,
	followers INTEGER NOT NULL DEFAULT 0,
	date_searched TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE followers
(
	candidate_id VARCHAR(20) REFERENCES candidates(candidate_id),
	follower_id VARCHAR(20) NOT NULL,
	PRIMARY KEY(candidate_id, follower_id)
);