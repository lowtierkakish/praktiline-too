package config

import (
	"context"
	"path/filepath"
	"time"

	"github.com/joho/godotenv"
	"github.com/rs/zerolog"
	"github.com/sethvargo/go-envconfig"
)

type SessionConfig struct {
	Duration time.Duration `env:"DURATION, default=168h"`
}

type AppConfig struct {
	Session *SessionConfig `env:", prefix=SESSION_"`

	Debug bool `env:"DEBUG, default=true"`

	DatabaseURL string `env:"DATABASE_URL, required"`
	RedisURL    string `env:"REDIS_URL,default=redis://localhost:6379/0"`

	PublicURL string `env:"PUBLIC_URL, default=http://localhost:3000"`

	Addr    string `env:"ADDR, default=localhost:8080"`
	DataDir string `env:"DATA_DIR, default=./data"`
}

var Config AppConfig

func LoadConfig(ctx context.Context) {
	log := zerolog.Ctx(ctx)

	err := godotenv.Load()
	if err != nil {
		log.Debug().Err(err).Msg("unable to load .env")
	}

	err = envconfig.Process(ctx, &Config)
	if err != nil {
		log.Fatal().Err(err).Msg("unable to parse config from environment")
	}

	Config.DataDir, err = filepath.Abs(Config.DataDir)
	if err != nil {
		log.Fatal().Err(err).Msg("unable to resolve data dir")
	}

	log.Debug().Msgf("files will be saved in '%s'", Config.DataDir)
}
