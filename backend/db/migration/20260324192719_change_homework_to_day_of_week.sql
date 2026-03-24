-- +goose Up
-- +goose StatementBegin
alter table homework drop column due_date;
alter table homework add column day smallint not null default 1;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
alter table homework drop column day;
alter table homework add column due_date date;
-- +goose StatementEnd
