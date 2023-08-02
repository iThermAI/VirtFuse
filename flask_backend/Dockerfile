FROM python:3.8-slim-buster

WORKDIR /app/flask_backend
COPY . .

RUN apt-get update && apt-get install -y \
    libsm6 \
    libxext6 \
    libxrender-dev \
    && pip install --trusted-host pypi.python.org -r requirements.txt

CMD ["python", "app.py"]