.PHONY: clean build

API_NAME = fractal-compress

build:
	yarn build
	GOBIN=${PWD}/functions GOOS=linux GOARCH=amd64 go build -o functions/${API_NAME} ./fractal-image-compression/*.go

clean:
	rm -rf build functions/*
