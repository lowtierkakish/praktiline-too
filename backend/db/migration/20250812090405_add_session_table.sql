-- +goose Up
create table sessions (
    sid text not null primary key,
    user_id bigint not null references users (id) on delete cascade,
    expires_at timestamptz not null,
    ip varchar not null,
    user_agent varchar not null
);

create index idx_sessions_expires_at on sessions (expires_at);

-- +goose Down
drop table sessions;