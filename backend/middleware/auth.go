package middleware

import (
	"context"
	"errors"
	"net/http"
	"time"

	"github.com/lowtierkakish/praktiline-too/config"
	"github.com/lowtierkakish/praktiline-too/db"
	"github.com/lowtierkakish/praktiline-too/db/sqlc"
	"github.com/lowtierkakish/praktiline-too/services"
	"github.com/rs/zerolog"
)

type ctxKeyUser int

const ContextUserIDKey ctxKeyUser = 0

const cookieSessionKey = "praktiline_too_session"

func Auth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		sessionID, err := GetSessionID(r)
		if err != nil || sessionID == "" {
			next.ServeHTTP(w, r)
			return
		}

		ctx := r.Context()
		logger := zerolog.Ctx(ctx)

		updated, userID, err := services.ValidateSession(ctx, r.RemoteAddr, sessionID)
		if err != nil {
			logger.Warn().Err(err).Msg("invalid session")
			RemoveSessionID(w)
			next.ServeHTTP(w, r)
			return
		}

		if updated {
			SetSessionID(w, sessionID)
		}

		logger.UpdateContext(func(c zerolog.Context) zerolog.Context {
			return c.Int64("user", userID)
		})

		ctx = context.WithValue(ctx, ContextUserIDKey, userID)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func Protect(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()
		userID := GetUserID(ctx)
		if userID == 0 {
			http.Error(w, "unauthorized", http.StatusUnauthorized)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func SetSessionID(w http.ResponseWriter, sessionID string) {
	http.SetCookie(w, &http.Cookie{
		Name:     cookieSessionKey,
		Value:    sessionID,
		Expires:  time.Now().Add(config.Config.Session.Duration),
		HttpOnly: true,
		SameSite: http.SameSiteStrictMode,
		Secure:   true,
		Path:     "/",
	})
}

func GetSessionID(r *http.Request) (string, error) {
	c, err := r.Cookie(cookieSessionKey)
	if err != nil {
		return "", err
	}
	return c.Value, nil
}

func RemoveSessionID(w http.ResponseWriter) {
	http.SetCookie(w, &http.Cookie{
		Name:     cookieSessionKey,
		Value:    "",
		MaxAge:   -1,
		HttpOnly: true,
	})
}

// GetUserID returns 0 if unable to get user id, otherwise returns user id
func GetUserID(ctx context.Context) int64 {
	if ctx == nil {
		return 0
	}
	if userID, ok := ctx.Value(ContextUserIDKey).(int64); ok {
		return userID
	}
	return 0
}

func GetUser(ctx context.Context) (sqlc.GetUserByIDRow, error) {
	if ctx == nil {
		return sqlc.GetUserByIDRow{}, errors.New("context does not exist")
	}
	userID := GetUserID(ctx)
	if userID == 0 {
		return sqlc.GetUserByIDRow{}, errors.New("user id not found in context")
	}

	return db.Q.GetUserByID(ctx, userID)
}
