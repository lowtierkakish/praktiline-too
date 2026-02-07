package utils

import (
	"golang.org/x/crypto/bcrypt"
)

func CheckPassword(hash []byte, password string) error {
	return bcrypt.CompareHashAndPassword(hash, []byte(password))
}

func HashPassword(password string) ([]byte, error) {
	return bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
}
