#!/bin/sh
# Render gives DB_URL as postgresql://user:pass@host/db
# Spring Boot needs jdbc:postgresql://host/db
# This script converts it automatically before starting the app.

if [ -n "$DB_URL" ]; then
  # Handle both postgres:// and postgresql:// prefixes
  JDBC_URL=$(echo "$DB_URL" | sed 's|^postgres://|jdbc:postgresql://|; s|^postgresql://|jdbc:postgresql://|')
  export SPRING_DATASOURCE_URL="$JDBC_URL"
  export SPRING_DATASOURCE_USERNAME="${DB_USER}"
  export SPRING_DATASOURCE_PASSWORD="${DB_PASSWORD}"
fi

exec java -jar /app/app.jar
