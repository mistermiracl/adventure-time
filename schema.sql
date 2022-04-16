CREATE TABLE season (
    id PRIMARY KEY AUTOINCREMENT,
    `number` INT,
    `name` VARCHAR(300),
    slug VARCHAR(300),
    `description` TEXT
);

CREATE TABLE episode (
    id PRIMARY KEY AUTOINCREMENT,
    `number` INT,
    `name` VARCHAR(300),
    slug VARCHAR(300),
    `description` TEXT,
    season_id INT 
);

CREATE TABLE rotating_image_pair (
    id PRIMARY KEY AUTOINCREMENT,
    `left` TEXT,
    `right` TEXT
);
