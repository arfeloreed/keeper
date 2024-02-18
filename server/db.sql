CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(155) NOT NULl,
    email VARCHAR(155) UNIQUE NOT NULl CHECK (email = LOWER(email)),
    password TEXT,
    google_id TEXT
)

CREATE TABLE notes (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    title VARCHAR(255),
    content TEXT
)

-- queries