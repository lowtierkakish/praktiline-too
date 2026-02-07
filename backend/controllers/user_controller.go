package controllers

import (
	"encoding/json"
	"errors"
	"net/http"
	"strings"

	"github.com/jackc/pgx"
	"github.com/rs/zerolog"

	"github.com/lowtierkakish/praktiline-too/middleware"
	"github.com/lowtierkakish/praktiline-too/services"
	"github.com/lowtierkakish/praktiline-too/utils"
)

func RegisterUser(w http.ResponseWriter, r *http.Request) {
	var err error
	var userRequest struct {
		FirstName string `json:"first_name"`
		LastName  string `json:"last_name"`
		Email     string `json:"email"`
		Password  string `json:"password"`
	}

	ctx := r.Context()
	logger := zerolog.Ctx(ctx)
	r.Body = http.MaxBytesReader(w, r.Body, 1024)

	if err = json.NewDecoder(r.Body).Decode(&userRequest); err != nil {
		utils.JSONErrorMessage(w, "Invalid request format", http.StatusBadRequest)
		return
	}

	userRequest.FirstName = strings.TrimSpace(userRequest.FirstName)
	userRequest.LastName = strings.TrimSpace(userRequest.LastName)
	userRequest.Email = strings.TrimSpace(strings.ToLower(userRequest.Email))
	userRequest.Password = strings.TrimSpace(userRequest.Password)

	userRequest.Email, err = utils.SanitazeEmail(userRequest.Email)
	if err != nil {
		utils.JSONErrorMessage(w, err.Error(), http.StatusBadRequest)
		return
	}

	if userRequest.FirstName == "" || userRequest.LastName == "" || userRequest.Password == "" {
		utils.JSONErrorMessage(w, "All fields are required", http.StatusBadRequest)
		return
	}

	strength := services.EvaluatePasswordStrength(userRequest.Password)
	if strength == services.PasswordWeak {
		utils.JSONErrorMessage(w, "Password is too weak. Use a combination of uppercase, lowercase, numbers, and symbols", http.StatusBadRequest)
		return
	}

	userID, err := services.CreateUser(ctx, userRequest.FirstName, userRequest.LastName, userRequest.Email, userRequest.Password)
	if err != nil {
		if strings.Contains(err.Error(), "already exists") {
			utils.JSONErrorMessage(w, "User with this email already exists", http.StatusConflict)
		} else {
			utils.JSONErrorMessage(w, "Error creating user: "+err.Error(), http.StatusInternalServerError)
		}
		return
	}

	sessionID, err := services.CreateSession(ctx, r, userID)
	if err != nil {
		logger.Error().Err(err).Int64("user", userID).Msg("unable to create session")
		utils.JSONErrorMessage(w, err.Error(), http.StatusInternalServerError)
		return
	}

	middleware.SetSessionID(w, sessionID)

	utils.JSONResponse(w, utils.H{
		"id": userID,
	})
}

func LoginUser(w http.ResponseWriter, r *http.Request) {
	var loginRequest struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	ctx := r.Context()
	logger := zerolog.Ctx(ctx)
	r.Body = http.MaxBytesReader(w, r.Body, 1024)

	if err := json.NewDecoder(r.Body).Decode(&loginRequest); err != nil {
		utils.JSONErrorMessage(w, err.Error(), http.StatusBadRequest)
		return
	}

	if strings.TrimSpace(loginRequest.Email) == "" || strings.TrimSpace(loginRequest.Password) == "" {
		utils.JSONErrorMessage(w, "Email and password are required", http.StatusBadRequest)
		return
	}

	userID, err := services.Authenticate(ctx, loginRequest.Email, loginRequest.Password)
	if err != nil {
		logger.Error().Err(err).Str("email", loginRequest.Email).Msg("unable to authenticate user")
		http.Error(w, "invalid credentials", http.StatusUnauthorized)
		return
	}

	sessionID, err := services.CreateSession(ctx, r, userID)
	if err != nil {
		logger.Error().Err(err).Int64("user", userID).Msg("unable to create session")
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	middleware.SetSessionID(w, sessionID)

	utils.JSONResponse(w, utils.H{
		"id": userID,
	})
}

func GetMe(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	logger := zerolog.Ctx(ctx)
	user, err := middleware.GetUser(ctx)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			utils.JSONErrorMessage(w, "unauthorized", http.StatusUnauthorized)
			return
		}

		logger.Error().Err(err).Msg("unable get user (me)")
		http.Error(w, "unable get user", http.StatusInternalServerError)
		return
	}

	utils.JSONResponse(w, user)
}

func Logout(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	log := zerolog.Ctx(ctx)
	sessionID, err := middleware.GetSessionID(r)
	if err != nil {
		utils.JSONErrorMessage(w, err.Error(), http.StatusInternalServerError)
		return
	}

	middleware.RemoveSessionID(w)

	if err = services.DestroySession(ctx, sessionID); err != nil {
		log.Error().Err(err).Msg("unable to logout user")
		utils.JSONErrorMessage(w, "unable to logout user", http.StatusInternalServerError)
		return
	}

	utils.JSONResponse(w, utils.H{"message": "logged out"})
}
