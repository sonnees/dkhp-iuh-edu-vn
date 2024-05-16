FROM openjdk:17

WORKDIR /administrator-service

CMD ["./gradlew", "clean", "bootJar"]

COPY build/libs/*.jar app.jar

EXPOSE 8082 9091

ENTRYPOINT ["java", "-jar", "app.jar"]