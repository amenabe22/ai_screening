# Start from official Python image
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Install system dependencies including PostgreSQL and Node.js
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    curl \
    git \
    gcc \
    libpq-dev \
    ffmpeg \
    ca-certificates && \
    # Install Node.js (for Prisma CLI)
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g prisma && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy Python requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the full application code
COPY . .

# Generate Prisma client
RUN prisma generate --schema=src/schema.prisma

# Set PYTHONPATH to include /app/src
ENV PYTHONPATH=/app/src

# Expose FastAPI port
EXPOSE 8000

# Run FastAPI app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
