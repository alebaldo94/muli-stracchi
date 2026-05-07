CREATE TABLE IF NOT EXISTS members (
  id              SERIAL PRIMARY KEY,
  role            VARCHAR(10)  NOT NULL DEFAULT 'member',
  name            VARCHAR(100) NOT NULL,
  email           VARCHAR(100) UNIQUE NOT NULL,
  password_hash   VARCHAR(255) NOT NULL,
  birth_date      DATE,
  tax_code        VARCHAR(20),
  phone           VARCHAR(20),
  address         VARCHAR(200),
  cap             VARCHAR(10),
  city            VARCHAR(100),
  province        VARCHAR(5),
  member_number   VARCHAR(20),
  member_type     VARCHAR(20)  DEFAULT 'ordinario',
  join_date       DATE         DEFAULT CURRENT_DATE,
  membership_expiry DATE,
  insurance       BOOLEAN      DEFAULT FALSE,
  insurance_type  VARCHAR(20),
  insurance_expiry DATE,
  insurance_number VARCHAR(50),
  level           VARCHAR(20)  DEFAULT 'beginner',
  km_year         INT          DEFAULT 0,
  km_month        INT          DEFAULT 0,
  rides_count     INT          DEFAULT 0,
  notes           TEXT,
  created_at      TIMESTAMP    DEFAULT NOW(),
  updated_at      TIMESTAMP    DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS events (
  id          SERIAL PRIMARY KEY,
  title       VARCHAR(200) NOT NULL,
  date        DATE         NOT NULL,
  location    VARCHAR(200),
  distance    INT,
  elevation   INT,
  category    VARCHAR(20)  DEFAULT 'strada',
  level       VARCHAR(20)  DEFAULT 'intermediate',
  description TEXT,
  created_by  INT REFERENCES members(id) ON DELETE SET NULL,
  created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS event_participants (
  event_id  INT REFERENCES events(id)  ON DELETE CASCADE,
  member_id INT REFERENCES members(id) ON DELETE CASCADE,
  joined_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (event_id, member_id)
);

CREATE TABLE IF NOT EXISTS rides (
  id         SERIAL PRIMARY KEY,
  user_id    INT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  title      VARCHAR(200) NOT NULL,
  date       DATE         NOT NULL,
  km         DECIMAL(8,2) NOT NULL,
  duration   VARCHAR(10),
  elevation  INT   DEFAULT 0,
  source     VARCHAR(20)  DEFAULT 'manual',
  note       TEXT,
  created_at TIMESTAMP    DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
  id          SERIAL PRIMARY KEY,
  member_id   INT REFERENCES members(id) ON DELETE CASCADE,
  member_name VARCHAR(100),
  email       VARCHAR(100),
  type        VARCHAR(50),
  type_label  VARCHAR(200),
  status      VARCHAR(20) DEFAULT 'sent',
  sent_at     TIMESTAMP   DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS email_settings (
  id           INT PRIMARY KEY DEFAULT 1,
  sender_name  VARCHAR(100) DEFAULT 'I Muli Stracchi ASD',
  sender_email VARCHAR(100) DEFAULT 'segreteria@muliastracchi.it',
  remind_days  INT[]        DEFAULT '{30,15,7}',
  auto_send    BOOLEAN      DEFAULT FALSE,
  updated_at   TIMESTAMP    DEFAULT NOW()
);

INSERT INTO email_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;
