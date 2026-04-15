-- +goose Up
create table schedule (
    id bigint primary key generated always as identity,
    day smallint not null,
    slot smallint not null,
    subject text not null,
    unique(day, slot)
);

-- +goose Down
drop table schedule;
