package services

import (
	"context"

	"github.com/lowtierkakish/praktiline-too/db"
	"github.com/lowtierkakish/praktiline-too/db/sqlc"
)

func GetAllMaterials(ctx context.Context) ([]sqlc.Material, error) {
	return db.Q.GetAllMaterials(ctx)
}

func CreateMaterial(ctx context.Context, name, matType, url string) (sqlc.Material, error) {
	return db.Q.CreateMaterial(ctx, sqlc.CreateMaterialParams{
		Name: name,
		Type: matType,
		URL:  url,
	})
}

func DeleteMaterial(ctx context.Context, id int64) (sqlc.DeleteMaterialRow, error) {
	return db.Q.DeleteMaterial(ctx, id)
}
