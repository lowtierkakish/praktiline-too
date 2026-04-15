package sqlc

import "context"

type Schedule struct {
	ID      int64  `json:"id"`
	Day     int16  `json:"day"`
	Slot    int16  `json:"slot"`
	Subject string `json:"subject"`
}

type CreateScheduleParams struct {
	Day     int16  `json:"day"`
	Slot    int16  `json:"slot"`
	Subject string `json:"subject"`
}

const getAllSchedule = `
select id, day, slot, subject
from schedule
order by day asc, slot asc
`

func (q *Queries) GetAllSchedule(ctx context.Context) ([]Schedule, error) {
	rows, err := q.db.Query(ctx, getAllSchedule)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var items []Schedule
	for rows.Next() {
		var s Schedule
		if err := rows.Scan(&s.ID, &s.Day, &s.Slot, &s.Subject); err != nil {
			return nil, err
		}
		items = append(items, s)
	}
	return items, rows.Err()
}

const createScheduleEntry = `
insert into schedule (day, slot, subject)
values ($1, $2, $3)
on conflict (day, slot) do update set subject = $3
returning id, day, slot, subject
`

func (q *Queries) CreateScheduleEntry(ctx context.Context, arg CreateScheduleParams) (Schedule, error) {
	row := q.db.QueryRow(ctx, createScheduleEntry, arg.Day, arg.Slot, arg.Subject)
	var s Schedule
	err := row.Scan(&s.ID, &s.Day, &s.Slot, &s.Subject)
	return s, err
}

const deleteScheduleEntry = `delete from schedule where id = $1`

func (q *Queries) DeleteScheduleEntry(ctx context.Context, id int64) error {
	_, err := q.db.Exec(ctx, deleteScheduleEntry, id)
	return err
}
