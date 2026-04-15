package controllers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	"github.com/lowtierkakish/praktiline-too/services"
	"github.com/lowtierkakish/praktiline-too/utils"
	"github.com/rs/zerolog"
)

func GetSchedule(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	schedule, err := services.GetAllSchedule(ctx)
	if err != nil {
		zerolog.Ctx(ctx).Error().Err(err).Msg("unable to get schedule")
		utils.JSONErrorMessage(w, "unable to get schedule", http.StatusInternalServerError)
		return
	}
	utils.JSONResponse(w, schedule)
}

func CreateScheduleEntry(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	r.Body = http.MaxBytesReader(w, r.Body, 4096)

	var req struct {
		Day     int16  `json:"day"`
		Slot    int16  `json:"slot"`
		Subject string `json:"subject"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.JSONErrorMessage(w, "invalid request format", http.StatusBadRequest)
		return
	}

	if req.Subject == "" {
		utils.JSONErrorMessage(w, "subject is required", http.StatusBadRequest)
		return
	}

	if req.Day < 1 || req.Day > 4 {
		utils.JSONErrorMessage(w, "day must be between 1 and 4", http.StatusBadRequest)
		return
	}

	if req.Slot < 1 || req.Slot > 4 {
		utils.JSONErrorMessage(w, "slot must be between 1 and 4", http.StatusBadRequest)
		return
	}

	entry, err := services.CreateScheduleEntry(ctx, req.Day, req.Slot, req.Subject)
	if err != nil {
		zerolog.Ctx(ctx).Error().Err(err).Msg("unable to create schedule entry")
		utils.JSONErrorMessage(w, "unable to create schedule entry", http.StatusInternalServerError)
		return
	}

	utils.JSONResponse(w, entry)
}

func DeleteScheduleEntry(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	idStr := chi.URLParam(r, "id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		utils.JSONErrorMessage(w, "invalid id", http.StatusBadRequest)
		return
	}

	if err := services.DeleteScheduleEntry(ctx, id); err != nil {
		zerolog.Ctx(ctx).Error().Err(err).Msg("unable to delete schedule entry")
		utils.JSONErrorMessage(w, "unable to delete schedule entry", http.StatusInternalServerError)
		return
	}

	utils.JSONResponse(w, utils.H{"message": "deleted"})
}
