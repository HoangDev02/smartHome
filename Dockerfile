# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/engine/reference/builder/

ARG NODE_VERSION=16.17.0

FROM node:${NODE_VERSION}-alpine

# Use production node environment by default.
# ENV NODE_ENV production
ENV   MONGODB  mongodb+srv://smarthome:1234567890@cluster0.swcub0e.mongodb.net/?retryWrites=true&w=majority
ENV   JWT_ACCESS_KEY  escretkey
ENV   SESSION_SECRET secret
ENV   STRIPE_KEY sk_test_51NGljnKH3pJMvdn533XlTSNi9jiQen9x0BrjY5qavry6h4n32qrTjAgGaahJpdnvPqIwkt39jcq8oKrqhnE1uMHq00OCW72oY9
ENV   REACT_APP_FRONTEND_URL  http://localhost:3000/

ENV   MQTT_BROKER_HOST f63a3874d1364c15ba9d13699c92dc63.s1.eu.hivemq.cloud
ENV   MQTT_BROKER_PORT 8883
ENV   MQTT_BROKER_PROTOCOL mqtts
ENV   MQTT_USERNAME esp8266Den
ENV   MQTT_PASSWORD esp8266Den

WORKDIR /app

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage a bind mounts to package.json and package-lock.json to avoid having to copy them into
# into this layer.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev
COPY package*.json ./
# Run the application as a non-root user.
USER node


# Copy the rest of the source files into the image.
COPY . .

# Expose the port that the application listens on.
EXPOSE 8080

# Run the application.
CMD npm start
