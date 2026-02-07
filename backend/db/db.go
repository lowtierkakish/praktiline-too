package db

import (
	"context"
	"database/sql"
	"net/url"
	"strings"
	"time"

	"github.com/Masterminds/squirrel"
	"github.com/go-redsync/redsync/v4"
	rediswrapper "github.com/go-redsync/redsync/v4/redis/goredis/v9"
	pgxdecimal "github.com/jackc/pgx-shopspring-decimal"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/jackc/pgx/v5/stdlib"
	"github.com/lowtierkakish/praktiline-too/config"
	"github.com/lowtierkakish/praktiline-too/db/sqlc"
	"github.com/redis/go-redis/v9"
	"github.com/rs/zerolog"
)

var Pool *pgxpool.Pool
var DB *sql.DB
var Cache *redis.Client
var SQ squirrel.StatementBuilderType
var Q *sqlc.Queries
var Sync *redsync.Redsync

var Config = &config.Config

func ConnectDB(ctx context.Context) {
	log := zerolog.Ctx(ctx)

	databaseURL, err := url.Parse(Config.DatabaseURL)
	if err != nil {
		log.Fatal().Err(err).Msg("error parsing database URL")
	}

	cfg, err := pgxpool.ParseConfig(databaseURL.String())
	if err != nil {
		log.Fatal().Err(err).Msg("bad connection string")
	}

	cfg.AfterConnect = func(ctx context.Context, c *pgx.Conn) error {
		pgxdecimal.Register(c.TypeMap())
		return nil
	}

	Pool, err = pgxpool.NewWithConfig(ctx, cfg)
	if err != nil {
		log.Fatal().Err(err).Msg("error connecting to the database")
	}

	DB = stdlib.OpenDBFromPool(Pool)
	if err = DB.Ping(); err != nil {
		log.Fatal().Err(err).Msgf("error pinging database")
	}

	SQ = squirrel.StatementBuilder.PlaceholderFormat(squirrel.Dollar).RunWith(DB)
	Q = sqlc.New(Pool)

	log.Info().Msgf("successful connection to %s", databaseURL.Redacted())
}

func InitializeCache(ctx context.Context) {
	log := zerolog.Ctx(ctx)

	opt, err := redis.ParseURL(Config.RedisURL)
	if err != nil {
		log.Fatal().Err(err).Msg("unable to parse redis url")
	}

	Cache = redis.NewClient(opt)

	ctx, cancel := context.WithDeadline(context.Background(), time.Now().Add(5*time.Second))
	defer cancel()

	if _, err := Cache.Ping(ctx).Result(); err != nil {
		log.Fatal().Err(err).Msg("unable to ping redis")
	}

	pool := rediswrapper.NewPool(Cache)
	Sync = redsync.New(pool)

	log.Info().Msg("successfully connected to redis database")
}

func Tx(ctx context.Context) (pgx.Tx, error) {
	return Pool.BeginTx(ctx, pgx.TxOptions{})
}

func SerialTx(ctx context.Context) (pgx.Tx, error) {
	return Pool.BeginTx(ctx, pgx.TxOptions{
		IsoLevel: pgx.Serializable,
	})
}

func Pattern(in string) string {
	if in == "" {
		return in
	}

	in = strings.ToLower(in)
	in = strings.ReplaceAll(in, "%", "\\%")
	in = strings.ReplaceAll(in, "\\", "\\\\")
	in = strings.ReplaceAll(in, "_", "\\_")
	return "%" + in + "%"
}
