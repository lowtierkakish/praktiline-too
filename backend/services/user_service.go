package services

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"net"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/Masterminds/squirrel"
	"github.com/lowtierkakish/praktiline-too/config"
	"github.com/lowtierkakish/praktiline-too/db"
	"github.com/lowtierkakish/praktiline-too/db/sqlc"
	"github.com/lowtierkakish/praktiline-too/utils"
	"github.com/rs/zerolog"
)

type UserService struct {
	DB *sql.DB
}

func CreateUser(ctx context.Context, first_name, last_name, email, password string) (int64, error) {
	logger := zerolog.Ctx(ctx)
	email = strings.ToLower(email)

	userExists, err := UserWithEmailExists(ctx, email)
	if err != nil {
		logger.Error().Err(err).Msgf("unable to check if user with %s mail exists", email)
		return 0, err
	} else if userExists {
		return 0, errors.New("user with this email already exists")
	}

	hashedPassword, err := utils.HashPassword(password)
	if err != nil {
		logger.Error().Err(err).Msgf("unable to hash password for %s", email)
		return 0, err
	}

	userID, err := db.Q.CreateUser(ctx, sqlc.CreateUserParams{
		FirstName: first_name,
		LastName:  last_name,
		Email:     email,
		Password:  hashedPassword,
	})
	if err != nil {
		logger.Error().Err(err).Msgf("unable to create user with %s mail", email)
		return 0, err
	}

	logger.Info().Int64("user", userID).Msgf("user %d was created with email %s and name %s %s", userID, first_name, last_name, email)

	return userID, nil
}

// Validates given session ID and returns user ID if valid, otherwise returns error
// Also returns true if expiration date was updated
func ValidateSession(ctx context.Context, remoteAddr, sessionID string) (bool, int64, error) {
	ip, _, err := net.SplitHostPort(remoteAddr)
	if err != nil {
		ip = remoteAddr
	}

	// First, let's check Cache for user session (it's faster than looking up in DB)
	if val, err := db.Cache.Get(ctx, SessionCacheKey(sessionID)).Result(); err == nil {
		if parts := strings.Split(val, "|"); len(parts) == 2 {
			if parts[1] != ip {
				return false, 0, errors.New("user ip mismatch, unauthorized")
			}

			id, err := strconv.ParseInt(parts[0], 10, 64)
			return false, id, err
		}
	}

	// Session does not exist in Cache, look up in DB
	userID, err := db.Q.GetUserIDBySession(ctx, sqlc.GetUserIDBySessionParams{Sid: sessionID, Ip: ip})
	if err != nil {
		return false, 0, err
	}

	db.Q.UpdateSessionExpiration(ctx, sqlc.UpdateSessionExpirationParams{
		Sid:       sessionID,
		ExpiresAt: time.Now().Add(config.Config.Session.Duration),
	})

	db.Cache.Set(ctx, SessionCacheKey(sessionID), fmt.Sprintf("%d|%s", userID, ip), time.Hour)

	return true, userID, nil
}

func SessionCacheKey(sessionID string) string {
	return "Martin's Project_:sessions:" + sessionID
}

type PasswordStrength int

const (
	PasswordWeak PasswordStrength = iota
	PasswordMedium
	PasswordStrong
)

func EvaluatePasswordStrength(password string) PasswordStrength {
	length := len(password)
	hasUpper := strings.ContainsAny(password, "ABCDEFGHIJKLMNOPQRSTUVWXYZ")
	hasLower := strings.ContainsAny(password, "abcdefghijklmnopqrstuvwxyz")
	hasDigit := strings.ContainsAny(password, "0123456789")
	hasSpecial := strings.ContainsAny(password, "!@#$%^&*()_+-=[]{}|;':\",./<>?\\")

	score := 0
	if length >= 8 {
		score++
	}
	if length >= 12 {
		score++
	}
	if hasUpper {
		score++
	}
	if hasLower {
		score++
	}
	if hasDigit {
		score++
	}
	if hasSpecial {
		score++
	}

	switch {
	case score <= 2:
		return PasswordWeak
	case score <= 4:
		return PasswordMedium
	default:
		return PasswordStrong
	}
}

// Create a new session for given user, and returns the session ID
func CreateSession(ctx context.Context, r *http.Request, userID int64) (string, error) {
	logger := zerolog.Ctx(ctx).With().Int64("user", userID).Logger()
	logger.Debug().Msg("creating session for user")

	expiresAt := time.Now().Add(config.Config.Session.Duration)
	userAgent := r.UserAgent()

	sessionID, err := utils.GenerateRandomStringURLSafe(32)
	if err != nil {
		return "", err
	}

	sessionID = strings.ReplaceAll(sessionID, "=", "")

	ip, _, err := net.SplitHostPort(r.RemoteAddr)
	if err != nil {
		ip = r.RemoteAddr
	}

	err = db.Q.CreateSession(ctx, sqlc.CreateSessionParams{
		Sid:       sessionID,
		UserID:    userID,
		ExpiresAt: expiresAt,
		Ip:        ip,
		UserAgent: userAgent,
	})
	if err != nil {
		return "", err
	}

	db.Cache.Set(ctx, SessionCacheKey(sessionID), fmt.Sprintf("%d|%s", userID, ip), time.Hour)

	return sessionID, nil
}

func Authenticate(ctx context.Context, email, password string) (int64, error) {
	email = strings.ToLower(email)

	user, err := db.Q.GetUserByEmail(ctx, email)
	if err != nil {
		return 0, err
	}

	if err := utils.CheckPassword(user.Password, password); err != nil {
		return 0, errors.New("invalid password")
	}

	return user.ID, nil
}

func UserWithEmailExists(ctx context.Context, email string) (bool, error) {
	var exists bool
	err := db.SQ.Select("1").Prefix("SELECT EXISTS (").From("users").Where(squirrel.Eq{"email": email}).Suffix(")").ScanContext(ctx, &exists)
	return exists, err
}

func DestroySession(ctx context.Context, sessionID string) error {
	if err := db.Q.DestroySession(ctx, sessionID); err != nil {
		return err
	}

	db.Cache.Del(ctx, SessionCacheKey(sessionID))

	return nil
}
