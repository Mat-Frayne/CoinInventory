"""."""
from flask import Flask, render_template, request, json
import dataset
import sys
import datetime

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
    return json.dumps([x['type'] for x in coins.all()])
@app.route("/add", methods=["GET", "POST"])
def add():
    """."""
    if request.method == "POST":
        args = request.form
        print(args)
        coins.insert(
            dict(
                type=args.get("coin"), 
                country=args.get('country'), 
                year=args.get('year'), 
                value=args.get('value'), 
                notes=args.get('notes'), 
                added=datetime.datetime.now(),
                images=args.get("images")
                )
            )

    return json.dumps({"code":1})


if __name__ == '__main__':
    app.run(debug=True,
            port=80, host="0.0.0.0", threaded=True)


