package sqlc

import (
	"context"
	"time"
)

type Material struct {
	ID        int64     `json:"id"`
	Name      string    `json:"name"`
	Type      string    `json:"type"`
	URL       string    `json:"url"`
	CreatedAt time.Time `json:"created_at"`
}

type CreateMaterialParams struct {
	Name string
	Type string
	URL  string
}

type DeleteMaterialRow struct {
	URL  string
	Type string
}

const getAllMaterials = `
select id, name, type, url, created_at
from materials
order by created_at desc
`

func (q *Queries) GetAllMaterials(ctx context.Context) ([]Material, error) {
	rows, err := q.db.Query(ctx, getAllMaterials)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var items []Material
	for rows.Next() {
		var m Material
		if err := rows.Scan(&m.ID, &m.Name, &m.Type, &m.URL, &m.CreatedAt); err != nil {
			return nil, err
		}
		items = append(items, m)
	}
	return items, rows.Err()
}

const createMaterial = `
insert into materials (name, type, url)
values ($1, $2, $3)
returning id, name, type, url, created_at
`

func (q *Queries) CreateMaterial(ctx context.Context, arg CreateMaterialParams) (Material, error) {
	row := q.db.QueryRow(ctx, createMaterial, arg.Name, arg.Type, arg.URL)
	var m Material
	err := row.Scan(&m.ID, &m.Name, &m.Type, &m.URL, &m.CreatedAt)
	return m, err
}

const deleteMaterial = `delete from materials where id = $1 returning url, type`

func (q *Queries) DeleteMaterial(ctx context.Context, id int64) (DeleteMaterialRow, error) {
	row := q.db.QueryRow(ctx, deleteMaterial, id)
	var r DeleteMaterialRow
	err := row.Scan(&r.URL, &r.Type)
	return r, err
}
