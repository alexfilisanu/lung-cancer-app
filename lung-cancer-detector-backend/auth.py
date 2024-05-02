import hashlib

import psycopg2
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


def connect_to_db():
    return psycopg2.connect(
        host="localhost",
        database="lung-cancer-db",
        user="postgres",
        password="postgres"
    )


def check_email_exists(email):
    try:
        with connect_to_db() as conn, conn.cursor() as cursor:
            cursor.execute(
                """
                SELECT email FROM users WHERE email = %s
                """, (email,))
            return cursor.fetchone() is not None
    except psycopg2.Error as e:
        print("Database error:", e)
        return False


def register_user(name, email, password):
    try:
        with connect_to_db() as conn, conn.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO users (name, email, password)
                VALUES (%s, %s, %s)
                """, (name, email, password))
            conn.commit()
            return jsonify({'message': 'User registered successfully'}), 200
    except psycopg2.Error as e:
        return jsonify({'message': f'Failed to register user: {e}'}), 500
    finally:
        conn.close()


@app.route('/auth/register', methods=['POST'])
def register():
    data = request.json
    if not data:
        return jsonify({'message': 'No data provided'}), 400

    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not all([name, email, password]):
        return jsonify({'message': 'error.all-fields-required'}), 400

    if check_email_exists(email):
        return jsonify({'message': 'error.email-exists'}), 400

    hashed_password = hashlib.sha256(password.encode()).hexdigest()

    return register_user(name, email, hashed_password)


def check_credentials(email, password):
    try:
        with connect_to_db() as conn, conn.cursor() as cursor:
            cursor.execute(
                """
                SELECT email FROM users WHERE email = %s AND password = %s
                """, (email, hashlib.sha256(password.encode()).hexdigest()))
            return cursor.fetchone() is not None
    except psycopg2.Error as e:
        print("Database error:", e)
        return False
    finally:
        conn.close()


def get_user_info(email):
    try:
        with connect_to_db() as conn, conn.cursor() as cursor:
            cursor.execute(
                """
                SELECT name, email FROM users WHERE email = %s
                """, (email,))
            user_data = cursor.fetchone()
            if user_data:
                name, email = user_data
                return {'name': name, 'email': email}
            else:
                return None
    except psycopg2.Error as e:
        print("Database error:", e)
        return None


@app.route('/auth/login', methods=['POST'])
def login():
    data = request.json
    if not data:
        return jsonify({'message': 'No data provided'}), 400

    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'message': 'error.all-fields-required'}), 400

    if not check_credentials(email, password):
        return jsonify({'message': 'error.invalid-credentials'}), 401

    user_info = get_user_info(email)
    if not user_info:
        return jsonify({'message': 'Failed to retrieve user information'}), 500

    return jsonify({'message': 'Login successful', 'user': user_info}), 200


if __name__ == "__main__":
    app.run(debug=True, port=3100, host='0.0.0.0')
