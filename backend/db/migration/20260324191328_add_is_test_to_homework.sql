-- +goose Up
-- +goose StatementBegin
alter table homework add column is_test boolean not null default false;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
alter table homework drop column is_test;
-- +goose StatementEnd
