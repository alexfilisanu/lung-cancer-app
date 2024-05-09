import base64
import json
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


@app.route('/insert-survey-prediction', methods=['POST'])
@cross_origin()
def insert_survey_prediction():
    try:
        survey_data = request.json
        user_id = get_user_id(survey_data.pop('user-email', None))
        prediction_result = survey_data.pop('prediction', None)

        cursor.execute(
            """
            INSERT INTO predictions (user_id, prediction_result) VALUES (%s, %s) RETURNING id
            """, (user_id, prediction_result))
        prediction_id = cursor.fetchone()[0]

        cursor.execute("""
            INSERT INTO survey_form_data (prediction_id, survey_form_data) VALUES (%s, %s)
            """, (prediction_id, json.dumps(survey_data)))

        conn.commit()

        return jsonify({'message': 'Survey prediction inserted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/get-registrations', methods=['POST'])
@cross_origin()
def get_registrations():
    try:
        email = request.form.get('user-email')
        user_id = get_user_id(email)
        registrations = []

        if user_id is None:
            return jsonify({'error': 'User not found'}), 404

        cursor.execute("""
            SELECT 'ct' AS type, cd.ct_diagram_photo AS image, p.prediction_result AS result, p.timestamp
            FROM ct_diagram_data cd
            JOIN predictions p ON cd.prediction_id = p.id
            WHERE p.user_id = %s
            UNION ALL
            SELECT 'survey' AS type, '' AS image, p.prediction_result AS result, p.timestamp
            FROM predictions p
            JOIN survey_form_data sf ON p.id = sf.prediction_id
            WHERE p.user_id = %s
            ORDER BY timestamp DESC
            """, (user_id, user_id))

        for row in cursor.fetchall():
            registration = {
                'type': row[0],
                'image': base64.b64encode(row[1]).decode('utf-8') if row[0] == 'ct' else '',
                'result': row[2],
                'timestamp': row[3]
            }
            registrations.append(registration)
        return jsonify({'registrations': registrations}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=3050, host='0.0.0.0')
