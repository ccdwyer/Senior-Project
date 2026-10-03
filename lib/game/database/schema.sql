-- Database schema for the Senior Project game.
-- Reconstructed from the queries in lib/game/database/*.php and the game code
-- that sends/reads the values (lib/game/main.js, lib/game/entities/player.js).
--
-- Import in phpMyAdmin (Import tab) or with:
--   mysql -u root < lib/game/database/schema.sql
--
-- The database name matches $dbname in DBlogin.php.

CREATE DATABASE IF NOT EXISTS chrisdwy_seniorProject;
USE chrisdwy_seniorProject;

-- One row per player. Created by sign_upAction.php, updated by saveUserAction.php.
CREATE TABLE IF NOT EXISTS users (
    email     VARCHAR(255) NOT NULL,
    password  CHAR(64)     NOT NULL,            -- sha256(salt . sha256(password)), hex
    hashID    CHAR(3)      NOT NULL,            -- the 3-character salt
    level     INT          NOT NULL DEFAULT 0,  -- director level index
    coins     INT          NOT NULL DEFAULT 0,
    potions   INT          NOT NULL DEFAULT 5,  -- player starts with 5 (player.js)
    game_keys INT          NOT NULL DEFAULT 0,  -- number of keys held
    xpos      FLOAT        NOT NULL DEFAULT 0,  -- player position, saved as raw pos.x
    ypos      FLOAT        NOT NULL DEFAULT 0,  -- player position, saved as raw pos.y
    PRIMARY KEY (email)
);

-- One row per player. Sign-up inserts only the email, so the defaults are
-- the starting item levels from player.js setItemLevels() (-1 = not owned).
CREATE TABLE IF NOT EXISTS weapons (
    email         VARCHAR(255) NOT NULL,
    boomerang     INT          NOT NULL DEFAULT -1,
    fist          INT          NOT NULL DEFAULT -1,
    grapplinghook INT          NOT NULL DEFAULT -1,
    wand          INT          NOT NULL DEFAULT -1,
    cloak         INT          NOT NULL DEFAULT -1,
    bow           INT          NOT NULL DEFAULT -1,
    sword         INT          NOT NULL DEFAULT 0,
    PRIMARY KEY (email)
);

-- Lists of entity names, rewritten in full by saveStateAction.php on each save.
-- The IDs are entity names from the level files (e.g. "grapplinghook3x1280y1184"),
-- and an empty list is saved as a single '' row, so they must be strings.
CREATE TABLE IF NOT EXISTS game_keys (
    email VARCHAR(255) NOT NULL,
    keyID VARCHAR(64)  NOT NULL,
    INDEX (email)
);

CREATE TABLE IF NOT EXISTS chests (
    email   VARCHAR(255) NOT NULL,
    chestID VARCHAR(64)  NOT NULL,
    INDEX (email)
);

CREATE TABLE IF NOT EXISTS doors (
    email  VARCHAR(255) NOT NULL,
    doorID VARCHAR(64)  NOT NULL,
    INDEX (email)
);
