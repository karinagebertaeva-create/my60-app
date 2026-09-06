import hashlib
import os
import secrets
import sqlite3
from datetime import datetime, timedelta, timezone
from functools import wraps

from flask import Flask, Response, jsonify, request, send_from_directory
from werkzeug.security import check_password_hash, generate_password_hash

app = Flask(__name__, static_folder=".", static_url_path="")
DB_PATH = os.environ.get("DATABASE_PATH", "/data/my60.db")


def db():
    os.makedirs(os.path.dirname(DB_PATH) or ".", exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("""CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY, email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL,
      payload TEXT, created_at TEXT NOT NULL)""")
    conn.execute("""CREATE TABLE IF NOT EXISTS tokens (
      token_hash TEXT PRIMARY KEY, user_id INTEGER NOT NULL, expires_at TEXT NOT NULL)""")
    return conn


def clean_email(value):
    return (value or "").strip().lower()


def issue_token(conn, user_id):
    raw = secrets.token_urlsafe(32)
    digest = hashlib.sha256(raw.encode()).hexdigest()
    expires = (datetime.now(timezone.utc) + timedelta(days=30)).isoformat()
    conn.execute("DELETE FROM tokens WHERE expires_at < ?", (datetime.now(timezone.utc).isoformat(),))
    conn.execute("INSERT INTO tokens(token_hash,user_id,expires_at) VALUES(?,?,?)", (digest, user_id, expires))
    return raw


def authorised(fn):
    @wraps(fn)
    def wrapped(*args, **kwargs):
        token = request.headers.get("Authorization", "").removeprefix("Bearer ")
        if not token:
            return jsonify(error="Нужен вход"), 401
        conn = db()
        row = conn.execute("SELECT user_id FROM tokens WHERE token_hash=? AND expires_at > ?", (hashlib.sha256(token.encode()).hexdigest(), datetime.now(timezone.utc).isoformat())).fetchone()
        if not row:
            conn.close()
            return jsonify(error="Сессия истекла"), 401
        request.user_id = row["user_id"]
        request.conn = conn
        try:
            return fn(*args, **kwargs)
        finally:
            conn.close()
    return wrapped


@app.post("/api/register")
def register():
    body = request.get_json(silent=True) or {}
    email, password = clean_email(body.get("email")), body.get("password", "")
    if "@" not in email or len(password) < 8:
        return jsonify(error="Укажи e-mail и пароль минимум из 8 символов"), 400
    conn = db()
    try:
        cur = conn.execute("INSERT INTO users(email,password_hash,created_at) VALUES(?,?,?)", (email, generate_password_hash(password), datetime.now(timezone.utc).isoformat()))
        token = issue_token(conn, cur.lastrowid)
        conn.commit()
        return jsonify(token=token)
    except sqlite3.IntegrityError:
        return jsonify(error="Этот e-mail уже зарегистрирован"), 409
    finally:
        conn.close()


@app.post("/api/login")
def login():
    body = request.get_json(silent=True) or {}
    conn = db()
    user = conn.execute("SELECT * FROM users WHERE email=?", (clean_email(body.get("email")),)).fetchone()
    if not user or not check_password_hash(user["password_hash"], body.get("password", "")):
        conn.close()
        return jsonify(error="Неверный e-mail или пароль"), 401
    token = issue_token(conn, user["id"])
    conn.commit()
    conn.close()
    return jsonify(token=token, hasPayload=bool(user["payload"]))


@app.route("/api/state", methods=["GET", "PUT"])
@authorised
def state():
    if request.method == "GET":
        row = request.conn.execute("SELECT payload FROM users WHERE id=?", (request.user_id,)).fetchone()
        return jsonify(payload=row["payload"])
    body = request.get_json(silent=True) or {}
    payload = body.get("payload")
    if not isinstance(payload, str) or len(payload) > 18_000_000:
        return jsonify(error="Некорректные данные"), 400
    request.conn.execute("UPDATE users SET payload=? WHERE id=?", (payload, request.user_id))
    request.conn.commit()
    return jsonify(ok=True)


@app.get("/health")
def health():
    return jsonify(ok=True)


@app.get("/")
def home():
    with open("index.html", "r", encoding="utf-8") as source:
        html = source.read()
    html = html.replace(
        "</head>",
        '<link rel="stylesheet" href="premium.css?v=7"><meta name="theme-color" content="#101513"></head>',
    )
    html = html.replace(
        "</body>",
        '<script src="premium.js?v=7"></script></body>',
    )
    return Response(html, mimetype="text/html", headers={"Cache-Control": "no-cache"})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
