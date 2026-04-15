-- +goose Up
create table materials (
    id bigint primary key generated always as identity,
    name text not null,
    type text not null,
    url text not null,
    created_at timestamptz not null default now()
);

-- +goose Down
drop table materials;
