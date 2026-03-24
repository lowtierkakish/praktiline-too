package services

import (
	"context"

	"github.com/lowtierkakish/praktiline-too/db"
	"github.com/lowtierkakish/praktiline-too/db/sqlc"
)

func GetAllHomework(ctx context.Context) ([]sqlc.GetAllHomeworkRow, error) {
	return db.Q.GetAllHomework(ctx)
}

func CreateHomework(ctx context.Context, subject, description string, day int16, hwType string) (sqlc.CreateHomeworkRow, error) {
	return db.Q.CreateHomework(ctx, sqlc.CreateHomeworkParams{
		Subject:     subject,
		Description: description,
		Day:         day,
		Type:        hwType,
	})
}

func DeleteHomework(ctx context.Context, id int64) error {
	return db.Q.DeleteHomework(ctx, id)
}