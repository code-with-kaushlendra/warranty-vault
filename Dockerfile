# ✅ Build stage with Maven and Java 21
FROM maven:3.9.6-eclipse-temurin-21 AS build

WORKDIR /app

# Copy Maven config and source code
COPY pom.xml .
COPY src ./src

# Build the app
RUN mvn clean package -DskipTests

# ✅ Runtime stage with Java 21
FROM eclipse-temurin:21-jre

WORKDIR /app

# Copy the built JAR from build stage
COPY --from=build /app/target/*.jar app.jar

# Expose default Spring Boot port
EXPOSE 8080

# Run the app
ENTRYPOINT ["java", "-jar", "app.jar"]
