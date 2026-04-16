# ── Build stage ────────────────────────────────────────────────
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# ── Runtime stage ───────────────────────────────────────────────
FROM eclipse-temurin:21-jre
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar
COPY start.sh start.sh
RUN chmod +x start.sh

EXPOSE 8080
ENTRYPOINT ["./start.sh"]
