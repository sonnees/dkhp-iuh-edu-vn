FROM openjdk:17

WORKDIR /notification-service

CMD ["./gradlew", "clean", "bootJar"]

COPY build/libs/*.jar app.jar

EXPOSE 8085 9092

ENTRYPOINT ["java", "-jar", "app.jar"]