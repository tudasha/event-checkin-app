#!/bin/sh
# Render gives DB_URL as postgresql://user:pass@host/db
# Spring Boot needs jdbc:postgresql://host/db (WITHOUT user:pass@ in the string)
# This script converts it and strips credentials from the URL.

if [ -n "$DB_URL" ]; then
  # 1. Strip the prefix and credentials to get just the host and path
  # 2. Reconstruct as jdbc:postgresql://host/path
  CLEAN_URL=$(echo "$DB_URL" | sed -E 's|^postgresql?://[^@]+@||; s|^postgresql?://||')
  export SPRING_DATASOURCE_URL="jdbc:postgresql://$CLEAN_URL"
  export SPRING_DATASOURCE_USERNAME="${DB_USER}"
  export SPRING_DATASOURCE_PASSWORD="${DB_PASSWORD}"
fi

echo "Starting app with URL: $SPRING_DATASOURCE_URL"
exec java -jar /app/app.jar
