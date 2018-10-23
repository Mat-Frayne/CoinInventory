"""."""
import base64
import datetime
import json
import os
import shutil
import logging
import dataset
from flask import Flask, flash, json, jsonify, render_template, request
from PyDebug import Log, Logger

DB = dataset.connect('sqlite:///database.db?check_same_thread=False')

Logger.level = 3

COINS = DB["coins"]
APP = Flask(__name__)
APP.secret_key = os.environ['app_secret']
LOG = logging.getLogger('werkzeug')
LOG.disabled = True
APP.logger.disabled = True

@APP.errorhandler(Exception)
def error_(error):
    """."""
    Log(error, level=3)
    raise error

@APP.after_request
def add_header(req):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also to cache the rendered page for 10 minutes.
    """
    req.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    req.headers["Pragma"] = "no-cache"
    req.headers["Expires"] = "0"
    req.headers['Cache-Control'] = 'public, max-age=0'
    return req

@APP.route("/")
def index():
    """."""
    return render_template("index.html", keys=[x['type'] for x in COINS.all()])

@APP.route("/all")
def all_():
    """."""
    return jsonify([x for x in COINS.all()])


@APP.route("/img/<int:id>")
def image(id_):
    """."""
    data = json.loads(COINS.find_one(id=id_)["images"])
    return jsonify(data)

@APP.route("/single/<int:id_>")
def single(id_):
    """."""
    return jsonify(COINS.find_one(id=id_))

@APP.route("/remove", methods=["POST"])
def rem():
    """."""
    if request.method == "POST":
        COINS.delete(id=request.form.get("id"))
        shutil.rmtree("static/coins/{}".format(request.form.get("id")))
        return json.dumps({"code":1})
    return json.dumps({"code":0})

@APP.route("/edit", methods=["GET", "POST"])
def edit():
    """."""
    try:
        # if request.method == "POST":
        args = request.get_json()
        if not args.get("id"):
            return jsonify({"code": 0, "error": "No 'id' supplied"})

        COINS.update(args, ["id"])
        return json.dumps({"code": 1})

    except Exception as exc:
        Log(exc, level=3)
        return json.dumps({"code": str(exc)})



@APP.route("/add", methods=["GET", "POST"])
def add():
    """."""
    try:
        if request.method == "POST":
            args = request.get_json()
            images = args.get("images")
            coin_id = COINS.insert(
                dict(
                    type=args.get("coin"),
                    country=args.get('country'),
                    year=args.get('year'),
                    value=args.get('value'),
                    notes=args.get('notes'),
                    added=datetime.datetime.now(),
                    images=int(len(images))
                )
            )
            if not os.path.exists("static/coins/{}".format(coin_id)):
                os.makedirs("static/coins/{}".format(coin_id))
                for img in images:
                    with open(
                        "static/coins/{}/{}.png"
                        .format(coin_id, images.index(img)), "wb") as file:
                        file.write(base64.decodebytes(img.encode()))
        Log("Added", args.get("coin"),
            args.get('country'), args.get('year'),
            "$" + args.get('value'))
        flash("Sucessfully added {} {} {} worth ${}.".format(args.get("year"),
            args.get('country'), args.get('coin'),
            args.get('value')))
        return json.dumps({"code": 1})

    except Exception as exc:
        Log(exc, level=3)
        return json.dumps({"code": str(exc)})

@APP.before_first_request
def before():
    """."""
    Log("Running server on port {}.".format(request.host))

def Run(debug=False, port=800, host="0.0.0.0", threaded=True):
    """."""
    APP.run(debug=debug,
            port=port,
            host=host,
            threaded=threaded)

if __name__ == '__main__':
    Run()
