# Use an official Python runtime as the base image
FROM python:3.9-slim

# Set environment variables to prevent Python from writing .pyc files
ENV PYTHONUNBUFFERED 1

# Install system dependencies (only Tesseract OCR and curl)
RUN apt-get update && apt-get install -y \
  tesseract-ocr \
  curl \
  && rm -rf /var/lib/apt/lists/*

# Download and install Sinhala language data for Tesseract 5
RUN mkdir -p /usr/share/tesseract-ocr/5/tessdata/ \
  && curl -L -o /usr/share/tesseract-ocr/5/tessdata/sin.traineddata \
  https://github.com/tesseract-ocr/tessdata/raw/main/sin.traineddata

# Set the working directory inside the container
WORKDIR /app

# Copy only requirements.txt first to leverage Docker caching
COPY kuppi-server/requirements.txt /app/

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the Flask app into the container
COPY kuppi-server /app/

# Expose the port that the Flask app will run on
EXPOSE 5000

# Command to run the Flask app using Gunicorn
CMD ["gunicorn", "-b", "0.0.0.0:5000", "app:app"]