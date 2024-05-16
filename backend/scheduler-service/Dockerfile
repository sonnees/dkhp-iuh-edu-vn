FROM openjdk:17

WORKDIR /scheduler-service

CMD ["./gradlew", "clean", "bootJar"]

COPY build/libs/*.jar app.jar

EXPOSE 8083 9093

ENTRYPOINT ["java", "-jar", "app.jar"]