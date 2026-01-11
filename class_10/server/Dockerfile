FROM python:3.13-slim

ENV PYTHONUNBUFFERED=1 \
	PIP_NO_CACHE_DIR=1

WORKDIR /app

# Install minimal build tools (some deps may need compilation)
RUN apt-get update \
	&& apt-get install -y --no-install-recommends build-essential \
	&& rm -rf /var/lib/apt/lists/*

# Copy metadata first to leverage Docker cache for dependency install
COPY pyproject.toml ./

# Upgrade pip and install runtime dependencies
RUN pip install --upgrade pip setuptools wheel \
	&& pip install --no-cache-dir "uvicorn[standard]" "fastapi[standard]" pydantic pymongo python-dotenv

# Copy application sources
COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

