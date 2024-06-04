FROM node:21

WORKDIR /lung-cancer-detector-app

COPY . /lung-cancer-detector-app

RUN npm install -g @angular/cli

RUN npm install

EXPOSE 4200

CMD ["ng", "serve", "--host", "0.0.0.0"]
