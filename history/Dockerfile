FROM python:3.9

WORKDIR /history

COPY ./requirements.txt /history/requirements.txt
RUN pip3 install --no-cache-dir -r requirements.txt

COPY . /history

EXPOSE 3050

CMD ["python3", "history.py"]
