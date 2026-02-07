package main

import (
	"context"
	"net/http"
	"os"

	"github.com/lowtierkakish/praktiline-too/config"
	"github.com/lowtierkakish/praktiline-too/db"
	"github.com/lowtierkakish/praktiline-too/routes"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

func initLogging() {
	zerolog.TimeFieldFormat = zerolog.TimeFormatUnix

	hostname, err := os.Hostname()
	if err != nil {
		hostname = "unknown"
	}

	log.Logger = log.Logger.With().Str("host", hostname).Logger()
	zerolog.DefaultContextLogger = &log.Logger
}

func prettierLogging() {
	if config.Config.Debug {
		log.Logger = log.Output(zerolog.ConsoleWriter{Out: os.Stderr})
		zerolog.DefaultContextLogger = &log.Logger
	}
}

func main() {
	ctx := context.Background()

	initLogging()
	config.LoadConfig(ctx)
	prettierLogging()

	db.ConnectDB(ctx)
	db.InitializeCache(ctx)

	router := routes.SetupRoutes()

	log.Info().Msgf("server running on %s", config.Config.Addr)
	if err := http.ListenAndServe(config.Config.Addr, router); err != nil {
		log.Fatal().Msgf("error starting server: %v", err)
	}

}
