DROP TABLE IF EXISTS timeline_entry;

CREATE TABLE IF NOT EXISTS timeline_entry(
  id          integer primary key autoincrement,
  title       string  not null,
  description string  not null,
  event_date  date    not null
);


