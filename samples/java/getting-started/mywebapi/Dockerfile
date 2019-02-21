FROM openjdk:8-jre-slim AS base
EXPOSE 8080
WORKDIR /app

FROM maven:3.5-jdk-8-slim AS build
WORKDIR /usr/src/app
COPY pom.xml ./
RUN /usr/local/bin/mvn-entrypoint.sh \
    mvn package -Dmaven.test.skip=true -Dcheckstyle.skip=true -Dmaven.javadoc.skip=true --fail-never
COPY . .
RUN mvn package -Dmaven.test.skip=true -Dcheckstyle.skip=true -Dmaven.javadoc.skip=true

FROM base AS final
COPY --from=build /usr/src/app/target/*.jar ./
ENTRYPOINT ["java","-jar","mywebapi-0.1.0.jar"]