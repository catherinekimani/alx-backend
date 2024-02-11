#!/usr/bin/env python3
""" Get locale from request """
from flask import Flask, render_template, request
from flask_babel import Babel

app = Flask(__name__)
babel = Babel(app)
app.url_map.strict_slashes(False)


class Config:
    """ Config class """
    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = "en"
    BABEL_DEFAULT_TIMEZONE = "UTC"

app.config.from_object(Config)


@babel.localeselector
def get_locale():
    """ locale selector """
    return request.accept_languages.best_match(app.config['LANGUAGES'])


@app.route('/')
def index():
    """ route """
    return render_template("2-index.html")


if __name__ == '__main__':
    app.run(host="0.0.0.0", port="5000")