FROM python:3.8.12-slim-buster

# Jenkins runs the docker image as a random UID (probably whatever it's logged in as).  As it does not have the
# privileges to install just about anything, we create a dummy path where it can create a virtualenv and install
# whatever it feels like.
RUN mkdir /.venv
RUN chmod 777 /.venv

# This is the static version of the tool.
RUN mkdir /static-ci
COPY requirements.txt /static-ci
COPY *.py /static-ci/
RUN python -m pip install wheel -r /static-ci/requirements.txt
