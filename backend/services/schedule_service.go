package services

import (
	"context"

	"github.com/lowtierkakish/praktiline-too/db"
	"github.com/lowtierkakish/praktiline-too/db/sqlc"
)

func GetAllSchedule(ctx context.Context) ([]sqlc.Schedule, error) {
	return db.Q.GetAllSchedule(ctx)
}

func CreateScheduleEntry(ctx context.Context, day, slot int16, subject string) (sqlc.Schedule, error) {
	return db.Q.CreateScheduleEntry(ctx, sqlc.CreateScheduleParams{
		Day:     day,
		Slot:    slot,
		Subject: subject,
	})
}

func DeleteScheduleEntry(ctx context.Context, id int64) error {
	return db.Q.DeleteScheduleEntry(ctx, id)
}
