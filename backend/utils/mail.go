package utils

import (
	"errors"
	"regexp"
	"strings"
)

var emailRegex = regexp.MustCompile(`^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)

func SanitazeEmail(email string) (string, error) {
	email = strings.TrimSpace(email)
	email = strings.ToLower(email)
	email = strings.TrimPrefix(email, "<")
	email = strings.TrimSuffix(email, ">")

	if email == "" {
		return "", errors.New("email cannot be empty")
	}

	if len(email) > 100 {
		return "", errors.New("email cannot be longer that 100 symbols")
	}

	if !emailRegex.MatchString(email) {
		return "", errors.New("invalid email format")
	}

	return email, nil
}
