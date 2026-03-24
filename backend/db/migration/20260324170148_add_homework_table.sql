-- +goose Up
-- +goose StatementBegin
create table homework (
    id bigint primary key generated always as identity,
    subject text not null,
    description text not null,
    due_date date,
    created_at timestamptz not null default now()
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
drop table homework;
-- +goose StatementEnd
