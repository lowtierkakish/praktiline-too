FROM golang:1.23.0 AS build-stage

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download


COPY . .

# Build the backend binary as postgres
RUN CGO_ENABLED=0 GOOS=linux go build -o /postgres

FROM alpine:3.21 AS build-release-stage

WORKDIR /


COPY --from=build-stage /postgres /postgres

EXPOSE 8080

ENV REDIS_URL=redis://redis:6379/0
ENV ADDR=:8080

ENTRYPOINT ["/postgres"]
