FROM openjdk:17

WORKDIR /student-service

CMD ["./gradlew", "clean", "bootJar"]

COPY build/libs/*.jar app.jar

EXPOSE 8084

ENTRYPOINT ["java", "-jar", "app.jar"]