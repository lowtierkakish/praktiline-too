package controllers

import (
	"encoding/json"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"

	"github.com/go-chi/chi/v5"
	"github.com/lowtierkakish/praktiline-too/config"
	"github.com/lowtierkakish/praktiline-too/services"
	"github.com/lowtierkakish/praktiline-too/utils"
	"github.com/rs/zerolog"
)

func GetMaterials(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	materials, err := services.GetAllMaterials(ctx)
	if err != nil {
		zerolog.Ctx(ctx).Error().Err(err).Msg("unable to get materials")
		utils.JSONErrorMessage(w, "unable to get materials", http.StatusInternalServerError)
		return
	}
	utils.JSONResponse(w, materials)
}

func UploadImage(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	r.Body = http.MaxBytesReader(w, r.Body, 10<<20) // 10MB max

	if err := r.ParseMultipartForm(10 << 20); err != nil {
		utils.JSONErrorMessage(w, "fail too large (max 10MB)", http.StatusBadRequest)
		return
	}

	name := strings.TrimSpace(r.FormValue("name"))
	if name == "" {
		utils.JSONErrorMessage(w, "name is required", http.StatusBadRequest)
		return
	}

	file, header, err := r.FormFile("file")
	if err != nil {
		utils.JSONErrorMessage(w, "file is required", http.StatusBadRequest)
		return
	}
	defer file.Close()

	ext := strings.ToLower(filepath.Ext(header.Filename))
	if ext != ".jpg" && ext != ".jpeg" && ext != ".png" && ext != ".gif" && ext != ".webp" {
		utils.JSONErrorMessage(w, "only images allowed (jpg, png, gif, webp)", http.StatusBadRequest)
		return
	}

	randomStr, err := utils.GenerateRandomStringURLSafe(16)
	if err != nil {
		utils.JSONErrorMessage(w, "server error", http.StatusInternalServerError)
		return
	}
	filename := randomStr + ext

	// Create data dir if it doesn't exist
	if err := os.MkdirAll(config.Config.DataDir, 0755); err != nil {
		utils.JSONErrorMessage(w, "server error", http.StatusInternalServerError)
		return
	}

	savePath := filepath.Join(config.Config.DataDir, filename)
	out, err := os.Create(savePath)
	if err != nil {
		zerolog.Ctx(ctx).Error().Err(err).Msg("unable to save file")
		utils.JSONErrorMessage(w, "unable to save file", http.StatusInternalServerError)
		return
	}
	defer out.Close()

	if _, err := io.Copy(out, file); err != nil {
		utils.JSONErrorMessage(w, "unable to save file", http.StatusInternalServerError)
		return
	}

	material, err := services.CreateMaterial(ctx, name, "image", filename)
	if err != nil {
		os.Remove(savePath)
		zerolog.Ctx(ctx).Error().Err(err).Msg("unable to save material")
		utils.JSONErrorMessage(w, "unable to save material", http.StatusInternalServerError)
		return
	}

	utils.JSONResponse(w, material)
}

func AddLink(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	r.Body = http.MaxBytesReader(w, r.Body, 4096)

	var req struct {
		Name string `json:"name"`
		URL  string `json:"url"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.JSONErrorMessage(w, "invalid request format", http.StatusBadRequest)
		return
	}

	req.Name = strings.TrimSpace(req.Name)
	req.URL = strings.TrimSpace(req.URL)

	if req.Name == "" || req.URL == "" {
		utils.JSONErrorMessage(w, "name and url are required", http.StatusBadRequest)
		return
	}

	material, err := services.CreateMaterial(ctx, req.Name, "link", req.URL)
	if err != nil {
		zerolog.Ctx(ctx).Error().Err(err).Msg("unable to save link")
		utils.JSONErrorMessage(w, "unable to save link", http.StatusInternalServerError)
		return
	}

	utils.JSONResponse(w, material)
}

func DeleteMaterial(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	idStr := chi.URLParam(r, "id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		utils.JSONErrorMessage(w, "invalid id", http.StatusBadRequest)
		return
	}

	row, err := services.DeleteMaterial(ctx, id)
	if err != nil {
		zerolog.Ctx(ctx).Error().Err(err).Msg("unable to delete material")
		utils.JSONErrorMessage(w, "unable to delete material", http.StatusInternalServerError)
		return
	}

	if row.Type == "image" {
		filePath := filepath.Join(config.Config.DataDir, row.URL)
		os.Remove(filePath)
	}

	utils.JSONResponse(w, utils.H{"message": "deleted"})
}
