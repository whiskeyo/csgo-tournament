# CSGO Tournament

Web application which makes organising CSGO torurnaments and leagues easier.

It is written in Django and Vue.js.

## Install Vue CLI, build virtualenv

```
$ sudo npm install -g @vue/cli
$ sudo pip install virtualenv
$ virtualenv venv
$ source venv/bin/activate
$ pip install -r requirements.txt
```

## Building for development (available on `localhost:8000`):

```
# Terminal 1:
$ source venv/bin/activate
$ python3 app/backend/manage.py runserver

# Terminal 2:
$ cd app/frontend
$ npm run serve
```

## Building for production (available on `localhost:8080`):

```
$ pushd app/frontend
$ npm run build
$ popd
$ source venv/bin/activate
$ python3 app/backend/manage.py runserver
```
