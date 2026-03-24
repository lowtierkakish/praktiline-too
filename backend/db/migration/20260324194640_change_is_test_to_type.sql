-- +goose Up
-- +goose StatementBegin
alter table homework drop column is_test;
alter table homework add column type text not null default 'kodutöö';
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
alter table homework drop column type;
alter table homework add column is_test boolean not null default false;
-- +goose StatementEnd
