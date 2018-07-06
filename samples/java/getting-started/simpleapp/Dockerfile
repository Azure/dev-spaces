FROM maven:3.5-jdk-8-slim
EXPOSE 8080

WORKDIR /usr/src/app
COPY pom.xml .
RUN ["/usr/local/bin/mvn-entrypoint.sh", "mvn", "verify", "clean", "--fail-never"]
COPY . .
RUN ["mvn", "package"]

CMD ["java", "-jar", "target/simpleapp-1.0-SNAPSHOT.jar"]