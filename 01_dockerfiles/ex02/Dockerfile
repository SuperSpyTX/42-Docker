FROM ruby

RUN apt-get update && apt-get install nodejs -y && \
	apt-get autoclean -y && apt-get clean -y && \
	gem install rails

# Onbuild Triggers

# Copy application
ONBUILD COPY app/ /opt/app

# Install the stuff
ONBUILD RUN bundle install && \
	rake db:migrate && \
	rake db:setup && \
	rake db:seed

# Set the workdir
WORKDIR /opt/app
