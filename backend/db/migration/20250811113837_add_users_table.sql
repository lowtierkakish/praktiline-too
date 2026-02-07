-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';

create table users (
    id bigint primary key generated always as identity,
    first_name text not null,
    last_name text not null,
    email text not null,
    password bytea not null
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
drop table users;
-- +goose StatementEnd