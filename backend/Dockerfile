# Dockerfile for Django REST API with Selenium and Chrome
FROM python:3.10

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /code

# Create a new user
RUN adduser --disabled-password --gecos '' dealrestapiuser

# Install Chrome for Selenium
RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
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
