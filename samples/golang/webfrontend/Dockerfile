FROM golang:1.10
EXPOSE 80

WORKDIR /go/src

COPY src .
WORKDIR /go/src/app

RUN go install app

ENTRYPOINT /go/bin/app