FROM python:3.9

RUN apt-get update && apt-get install -y \
    build-essential \
    libhdf5-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /models

COPY ./requirements.txt /models/requirements.txt
RUN pip3 install --no-cache-dir -r requirements.txt

COPY . /models

EXPOSE 3000

CMD ["python3", "lung_cancer_prediction.py"]
