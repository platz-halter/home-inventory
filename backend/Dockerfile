FROM python:3.14.3

# Set working directory inside the container
WORKDIR /app

# Copy and install dependencies first (Docker caches this layer —
# if requirements.txt didn't change, it skips reinstalling on rebuild)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Run the server, binding to 0.0.0.0 so it's reachable outside the container
CMD ["sh", "-c", "alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port 8000"]
