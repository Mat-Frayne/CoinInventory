"""."""
import datetime
import sys
import os
import base64
import dataset
from flask import Flask, json, jsonify, render_template, request
import json
db = dataset.connect('sqlite:///database.db?check_same_thread=False')

coins = db["coins"]
app = Flask(__name__)


@app.after_request
def add_header(r):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also to cache the rendered page for 10 minutes.
    """
    r.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    r.headers["Pragma"] = "no-cache"
    r.headers["Expires"] = "0"
    r.headers['Cache-Control'] = 'public, max-age=0'
    return r

@app.route("/")
def index():
    """."""
    return render_template("index.html", keys = [x['type'] for x in coins.all()])

@app.route("/all")
def all():
    """."""
    
    return jsonify([x for x in coins.all() ])


@app.route("/img/<int:id>")
def image(id):
    """."""
    data = json.loads(coins.find_one(id=id)["images"])
    return jsonify(data)

@app.route("/single/<int:id>")
def single(id):
    """."""
    return jsonify(coins.find_one(id=id))

@app.route("/remove", methods=["POST"])
def rem():
    """."""
    if request.method == "POST":
        print(request.form)
        coins.delete(id=request.form.get("id"))

        return json.dumps({"code":1})
    return json.dumps({"code":0})


@app.route("/add", methods=["GET", "POST"])
def add():
    """."""
    try:
        if request.method == "POST":
            args = request.get_json()
            print(args)
            images = args.get("images")
            print(images)
            coinID = coins.insert(
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
            if not os.path.exists("static/coins/{}".format(coinID)):
                os.makedirs("static/coins/{}".format(coinID))
                for img in images:
                    with open("static/coins/{}/{}.png".format(coinID, images.index(img)), "wb") as fh:
                        fh.write(base64.decodebytes(img.encode()))

        return json.dumps({"code": 1})
    except Exception as exc:
        return json.dumps({"code": str(exc)})


if __name__ == '__main__':
    app.run(debug=True,
            port=800, host="0.0.0.0", threaded=True)
