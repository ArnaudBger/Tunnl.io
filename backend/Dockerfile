# Dockerfile for Django REST API
FROM python:3.10

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /code

# Create a new user
RUN adduser --disabled-password --gecos '' dealrestapiuser

# Install dependencies
COPY requirements.txt /code/
RUN pip install -r requirements.txt

# Change ownership of /code to dealrestapiuser
RUN chown -R dealrestapiuser /code

# Switch to the new user
USER dealrestapiuser

# Copy project
COPY . /code/

# Run the application
CMD ["uwsgi", "--http", "0.0.0.0:8000", "--module", "deal.wsgi", "--master", "--processes", "32", "--threads", "16", "--honour-stdin"]

