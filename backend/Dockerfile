# Use official stable python base image
FROM python:3.13-slim

# Prevent python from writing pyc files and buffering stdout/stderr
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install system dependencies if any are needed
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy and install python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend files
COPY . .

# Expose FastAPI port
EXPOSE 8000

# Seeding DB and starting FastAPI ASGI server
CMD ["sh", "-c", "python seed.py && uvicorn main:app --host 0.0.0.0 --port 8000"]
