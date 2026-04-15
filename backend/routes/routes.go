package routes

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	chimiddleware "github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/lowtierkakish/praktiline-too/config"
	"github.com/lowtierkakish/praktiline-too/controllers"
	"github.com/lowtierkakish/praktiline-too/middleware"
)

func SetupRoutes() *chi.Mux {
	router := chi.NewRouter()

	router.Use(chimiddleware.RequestID)
	router.Use(cors.Handler(cors.Options{
		AllowOriginFunc:  func(r *http.Request, origin string) bool { return true },
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300, // Maximum value not ignored by any of major browsers
	}))
	router.Use(middleware.Auth)
	router.Use(chimiddleware.Recoverer)
	router.Use(chimiddleware.Heartbeat("/healthz"))

	// Serve uploaded images
	fileServer := http.FileServer(http.Dir(config.Config.DataDir))
	router.Handle("/uploads/*", http.StripPrefix("/uploads", fileServer))

	router.Route("/api", func(r chi.Router) {

		// Public routes
		r.Route("/users", func(r chi.Router) {
			r.Post("/register", controllers.RegisterUser)
			r.Post("/login", controllers.LoginUser)
		})

		// protected routes
		r.Group(func(r chi.Router) {
			r.Use(middleware.Protect)

			r.Route("/me", func(r chi.Router) {
				r.Get("/", controllers.GetMe)
				r.Post("/logout", controllers.Logout)
			})

			r.Route("/homework", func(r chi.Router) {
				r.Get("/", controllers.GetHomework)
				r.Post("/", controllers.CreateHomework)
				r.Delete("/{id}", controllers.DeleteHomework)
			})

			r.Route("/schedule", func(r chi.Router) {
				r.Get("/", controllers.GetSchedule)
				r.Post("/", controllers.CreateScheduleEntry)
				r.Delete("/{id}", controllers.DeleteScheduleEntry)
			})

			r.Route("/materials", func(r chi.Router) {
				r.Get("/", controllers.GetMaterials)
				r.Post("/upload", controllers.UploadImage)
				r.Post("/link", controllers.AddLink)
				r.Delete("/{id}", controllers.DeleteMaterial)
			})
		})
	})

	return router
}
