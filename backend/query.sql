-- name: CreateUser :one
insert into
    users (
        first_name,
        last_name,
        email,
        password
    )
values ($1, $2, $3, $4)
returning
    id;

-- name: CreateSession :exec
insert into
    sessions (
        sid,
        user_id,
        expires_at,
        ip,
        user_agent
    )
values ($1, $2, $3, $4, $5);

-- name: DestroySession :exec
delete from sessions where sid = $1;

-- name: DestroyAllSessions :many
delete from sessions where user_id = $1 returning sid;

-- name: UpdateSessionExpiration :exec
update sessions set expires_at = $1 where sid = $2;

-- name: GetUserIDBySession :one
select user_id from sessions where sid = $1 and ip = $2;

-- name: GetUserByID :one
select id, first_name, last_name, email from users where id = $1;

-- name: GetUserEmailByID :one
select email from users where id = $1;

-- name: GetUserByEmail :one
select id, password from users where email = $1;
