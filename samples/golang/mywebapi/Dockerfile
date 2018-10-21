FROM golang:1.10

RUN mkdir -p /go/src

COPY src /go/src/
WORKDIR /go/src/app

RUN go install app
EXPOSE 80

ENTRYPOINT /go/bin/app