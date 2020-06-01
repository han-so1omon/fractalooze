.PHONY: clean build

API_NAME = fractal-compress

build:
	yarn build
	mkdir -p functions
	GOOS=linux GOARCH=amd64 go build -o functions/${API_NAME} ./fractal-image-compression/...

clean:
	rm -rf build functions/*
