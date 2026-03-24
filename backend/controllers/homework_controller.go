package controllers

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"

	"github.com/go-chi/chi/v5"
	"github.com/lowtierkakish/praktiline-too/services"
	"github.com/lowtierkakish/praktiline-too/utils"
	"github.com/rs/zerolog"
)

var validTypes = map[string]bool{
	"kodutöö":    true,
	"tunnitöö":   true,
	"kontrolltöö": true,
}

func GetHomework(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	homework, err := services.GetAllHomework(ctx)
	if err != nil {
		zerolog.Ctx(ctx).Error().Err(err).Msg("unable to get homework")
		utils.JSONErrorMessage(w, "unable to get homework", http.StatusInternalServerError)
		return
	}
	utils.JSONResponse(w, homework)
}

func CreateHomework(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	r.Body = http.MaxBytesReader(w, r.Body, 4096)

	var req struct {
		Subject     string `json:"subject"`
		Description string `json:"description"`
		Day         int16  `json:"day"`
		Type        string `json:"type"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.JSONErrorMessage(w, "invalid request format", http.StatusBadRequest)
		return
	}

	req.Subject = strings.TrimSpace(req.Subject)
	req.Description = strings.TrimSpace(req.Description)

	if req.Subject == "" || req.Description == "" {
		utils.JSONErrorMessage(w, "subject and description are required", http.StatusBadRequest)
		return
	}

	if req.Day < 1 || req.Day > 7 {
		utils.JSONErrorMessage(w, "day must be between 1 and 7", http.StatusBadRequest)
		return
	}

	if req.Type == "" {
		req.Type = "kodutöö"
	}

	if !validTypes[req.Type] {
		utils.JSONErrorMessage(w, "invalid type", http.StatusBadRequest)
		return
	}

	hw, err := services.CreateHomework(ctx, req.Subject, req.Description, req.Day, req.Type)
	if err != nil {
		zerolog.Ctx(ctx).Error().Err(err).Msg("unable to create homework")
		utils.JSONErrorMessage(w, "unable to create homework", http.StatusInternalServerError)
		return
	}

	utils.JSONResponse(w, hw)
}

func DeleteHomework(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	idStr := chi.URLParam(r, "id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		utils.JSONErrorMessage(w, "invalid id", http.StatusBadRequest)
		return
	}

	if err := services.DeleteHomework(ctx, id); err != nil {
		zerolog.Ctx(ctx).Error().Err(err).Msg("unable to delete homework")
		utils.JSONErrorMessage(w, "unable to delete homework", http.StatusInternalServerError)
		return
	}

	utils.JSONResponse(w, utils.H{"message": "deleted"})
}