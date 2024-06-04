FROM python:3.9

WORKDIR /email

COPY ./requirements.txt /email/requirements.txt
RUN pip3 install --no-cache-dir -r requirements.txt

COPY . /email

EXPOSE 3200

CMD ["python3", "app.py"]
