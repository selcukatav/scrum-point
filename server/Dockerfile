# Use the official Go image to build the Go app
FROM golang:1.23-alpine AS builder

WORKDIR /app

# Copy go.mod and go.sum to the container and download dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy the source code and build the Go app
COPY . .
RUN go build -o main .

# Use a minimal image to run the app
FROM alpine:latest

WORKDIR /app

# Copy the built binary from the builder stage
COPY --from=builder /app/main .

EXPOSE 8080

# Run the Go app
CMD ["./main"]
