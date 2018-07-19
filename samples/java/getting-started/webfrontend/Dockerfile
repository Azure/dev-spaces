FROM openjdk:8-jre-slim AS base
EXPOSE 8080
WORKDIR /app

FROM maven:3.5-jdk-8-slim AS build
WORKDIR /usr/src/app
COPY pom.xml .
RUN ["/usr/local/bin/mvn-entrypoint.sh", "mvn", "verify", "--fail-never"]
COPY . .
RUN ["mvn", "package"]

FROM base AS final
COPY --from=build /usr/src/app/target .
CMD ["java", "-jar", "webfrontend-0.1.0.jar"]