#!/bin/sh
# Render gives DB_URL as postgres://user:pass@host/db
# Spring Boot needs jdbc:postgresql://host/db
# This script converts it automatically before starting the app.

if [ -n "$DB_URL" ]; then
  # Replace postgres:// with jdbc:postgresql://
  JDBC_URL=$(echo "$DB_URL" | sed 's|^postgres://|jdbc:postgresql://|')
  # Extract user and password from URL if not separately set
  export SPRING_DATASOURCE_URL="$JDBC_URL"
  export SPRING_DATASOURCE_USERNAME="${DB_USER}"
  export SPRING_DATASOURCE_PASSWORD="${DB_PASSWORD}"
fi

exec java -jar /app/app.jar
