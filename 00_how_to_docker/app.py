from flask import Flask
app = Flask("TestApp")

@app.route("/")
def index():
	return "<h1>Hello World!</h1>"
