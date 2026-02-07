package routes

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	chimiddleware "github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
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
		})
	})

	return router
}
