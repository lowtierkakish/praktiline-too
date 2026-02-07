package utils

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"

	"github.com/go-playground/validator/v10"
	"github.com/jackc/pgx/v5"
)

type HTTPError struct {
	status  int
	message string
}

func (e *HTTPError) Error() string {
	return e.message
}

func NewHTTPError(status int, message string) *HTTPError {
	return &HTTPError{status: status, message: message}
}

var (
	ErrNotFound         = NewHTTPError(http.StatusNotFound, "not found")
	ErrNotEnoughStorage = NewHTTPError(http.StatusForbidden, "not enough storage")
	ErrDatabaseError    = NewHTTPError(http.StatusInternalServerError, "database error")
	ErrFilesystemError  = NewHTTPError(http.StatusInternalServerError, "filesystem error")
	ErrPaymentError     = NewHTTPError(http.StatusInternalServerError, "payment server error")
)

var Validate *validator.Validate

type H map[string]any

func init() {
	Validate = validator.New(validator.WithRequiredStructEnabled())
}

func JSONErrorMessage(w http.ResponseWriter, message string, statusCode int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(H{"error": message})
}

func JSONError(w http.ResponseWriter, err error) {
	if err == nil {
		return
	}

	if errors.Is(err, pgx.ErrNoRows) {
		JSONErrorMessage(w, "not found", http.StatusNotFound)
		return
	}

	if err, ok := err.(validator.ValidationErrors); ok {
		JSONErrorMessage(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err, ok := err.(*json.SyntaxError); ok {
		JSONErrorMessage(w, err.Error(), http.StatusBadRequest)
		return
	}
	if err, ok := err.(*json.UnmarshalTypeError); ok {
		if err.Field == "" {
			err.Field = ":root"
		}

		JSONErrorMessage(w, fmt.Sprintf("expected %s but got %s in %s", err.Type, err.Value, err.Field), http.StatusBadRequest)
		return
	}

	if err, ok := err.(*HTTPError); ok {
		JSONErrorMessage(w, err.message, err.status)
		return
	}

	JSONErrorMessage(w, err.Error(), 500)
}

func JSONResponse(w http.ResponseWriter, v any) error {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(200)
	return json.NewEncoder(w).Encode(v)
}

func JSONBody(r *http.Request, v any) error {
	if err := json.NewDecoder(r.Body).Decode(v); err != nil {
		if errors.Is(err, io.ErrUnexpectedEOF) || errors.Is(err, io.EOF) {
			return NewHTTPError(http.StatusBadRequest, "unexpected end of body")
		}

		return err
	}

	if err := Validate.Var(v, "required,dive"); err != nil {
		return err
	}

	return nil
}
