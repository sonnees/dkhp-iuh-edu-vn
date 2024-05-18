FROM openjdk:17

WORKDIR /authentication-service

CMD ["./gradlew", "clean", "bootJar"]

COPY build/libs/*.jar app.jar

EXPOSE 8081 9090

ENTRYPOINT ["java", "-jar", "app.jar"]