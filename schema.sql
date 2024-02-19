drop table if exists companies;

drop table if exists participation;

create table companies(
  id serial primary key,
  name text not null,
  email text not null unique,
  password text not null
);

create table participation(
  id serial primary key,
  first_name text not null,
  last_name text not null,
  participation text not null,
  company_id integer not null,
  foreign key (company_id) references companies(id)
);