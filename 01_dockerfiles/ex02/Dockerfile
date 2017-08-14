FROM ruby

# Copy application
COPY app/ /opt/app

# Set the workdir
WORKDIR /opt/app

# Install the stuff
RUN apt-get update && apt-get install nodejs -y && \
	apt-get autoclean -y && apt-get clean -y && \
	gem install rails && \
	bundle install && \
	rake db:migrate && \
	rake db:setup && \
	rake db:seed
