# Use the official Python image from Docker Hub
FROM python:3.10-slim

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container
COPY . /app

# Install dependencies (assuming requirements.txt is in the root of your project)
RUN pip install --no-cache-dir -r requirements.txt

# Set environment variable for port
ENV PORT=8080

# Expose port 8080 (Cloud Run uses this default port)
EXPOSE 8080

# Command to run the app (replace 'app.py' with your entry-point script)
CMD ["python", "app.py"]
