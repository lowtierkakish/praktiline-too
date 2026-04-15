FROM golang:1.23.0 AS build-stage

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

# Install goose for migrations
RUN go install github.com/pressly/goose/v3/cmd/goose@latest

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -o /postgres

FROM alpine:3.21 AS build-release-stage

WORKDIR /

COPY --from=build-stage /postgres /postgres
COPY --from=build-stage /go/bin/goose /goose
COPY --from=build-stage /app/db/migration /db/migration

EXPOSE 8080

ENV REDIS_URL=redis://redis:6379/0
ENV ADDR=:8080

ENTRYPOINT ["/postgres"]
