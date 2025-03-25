# Use a base image with Java
FROM openjdk:21-jdk-slim as builder

# Set the working directory
WORKDIR /app

# Copy the Maven or Gradle build file
COPY mvnw ./
COPY .mvn .mvn
COPY pom.xml .

# Ensure mvnw has execute permissions
RUN chmod +x ./mvnw

# Copy source code
COPY src ./src

# Build the application
ARG ENV=production

RUN echo "Building with ENV=$ENV"

RUN if [ "$ENV" = "production" ]; then ./mvnw package -DskipTests; else ./mvnw clean package -DskipTests; fi

# Use a smaller image to run the application
FROM openjdk:21-jdk-slim

# Set the working directory
WORKDIR /app

# Copy the jar file from the builder stage
COPY --from=builder /app/target/*.jar app.jar

# Expose the application port
EXPOSE 8080

# Expose the debug port
EXPOSE 5005

# Run the application
#ENTRYPOINT ["java", "-jar", "app.jar"]

# Use a separate command for development
CMD ["./mvnw", "spring-boot:run", "-Dspring-boot.run.profiles=dev", "-Dspring-boot.run.jvmArguments=-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005"]