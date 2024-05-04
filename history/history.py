import base64
import psycopg2
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app, origins=['http://127.0.0.1:4200'])

conn = psycopg2.connect(
    host="localhost",
    database="lung-cancer-db",
    user="postgres",
    password="postgres"
)
cursor = conn.cursor()


def get_user_id(email):
    try:
        cursor.execute("""
        SELECT id FROM users WHERE email = %s
        """, (email,))
        user_id = cursor.fetchone()

        return user_id[0] if user_id else None

    except Exception as e:
        print("Database error:", e)
        return None


@app.route('/insert-ct-prediction', methods=['POST'])
@cross_origin()
def insert_ct_prediction():
    try:
        image_file = request.files['image']
        user_id = get_user_id(request.form.get('user-email'))
        prediction_result = request.form.get('prediction')
        cursor.execute(
            """
            INSERT INTO predictions (user_id, prediction_result) VALUES (%s, %s) RETURNING id
            """, (user_id, prediction_result))
        prediction_id = cursor.fetchone()[0]

        cursor.execute("""
            INSERT INTO ct_diagram_data (prediction_id, ct_diagram_photo) VALUES (%s, %s)
            """, (prediction_id, psycopg2.Binary(image_file.read())))

        conn.commit()

        return jsonify({'message': 'CT prediction inserted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/get-registration', methods=['POST'])
@cross_origin()
def get_registration():
    try:
        email = request.form.get('user-email')
        user_id = get_user_id(email)

        if user_id is None:
            return jsonify({'error': 'User not found'}), 404

        cursor.execute("""
                    SELECT cd.ct_diagram_photo, p.prediction_result, p.timestamp
                    FROM ct_diagram_data cd
                    JOIN predictions p ON cd.prediction_id = p.id
                    WHERE p.user_id = %s
                    ORDER BY p.timestamp DESC
                    LIMIT 6
                """, (user_id,))

        registrations = []
        for row in cursor.fetchall():
            image, result, timestamp = row
            registrations.append({
                'image': base64.b64encode(image).decode('utf-8'), 'result': result, 'timestamp': timestamp})

        return jsonify({'registrations': registrations}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=3050, host='0.0.0.0')
