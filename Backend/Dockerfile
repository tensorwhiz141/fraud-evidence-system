# 1. Use a slim Node.js base image
FROM node:18-slim AS base

# 2. Set working directory inside the container
WORKDIR /app

# 3. Install required system packages (for native modules if needed)
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    make \
    g++ \
    curl \
    && rm -rf /var/lib/apt/lists/*

# 4. Install production dependencies only
COPY package*.json ./
RUN npm install --omit=dev && npm cache clean --force

# 4.1 Install Python dependencies
COPY core/requirements.txt ./core/requirements.txt
RUN pip3 install --no-cache-dir -r core/requirements.txt

# 5. Copy application source
COPY . .

# 6. Add non-root user for security
RUN groupadd -r appgroup && \
    useradd -r -u 1001 -g appgroup -m -s /bin/bash appuser && \
    chown -R appuser:appgroup /app

# 7. Switch to the non-root user
USER appuser

# 8. Define environment variables
ENV NODE_ENV=production
ENV PORT=5050

# 9. Expose the application port
EXPOSE 5050

# 10. Add Docker-level health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:5050/status || exit 1

# 11. Start the backend server
CMD ["node", "server.js"]
