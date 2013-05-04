drop table if exists timeline_entry;

create table timeline_entry(
  id          integer primary key autoincrement,
  title       string  not null,
  description string  not null,
  event_date  date    not null
);


