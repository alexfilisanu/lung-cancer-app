from flask import Flask, request, jsonify
from flask_cors import cross_origin, CORS
from flask_mail import Mail, Message

app = Flask(__name__)
CORS(app)

app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USERNAME'] = 'lungcancerdetector@gmail.com'
app.config['MAIL_PASSWORD'] = 'awft bcge uxws naqi'
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
mail = Mail(app)


@app.route("/send-registration-email", methods=['POST'])
@cross_origin()
def send_registration_email():
    email = request.json.get('email')
    name = request.json.get('name')
    if email:
        try:
            msg = Message(
                subject='Welcome to LungCancerDetector!',
                body=f"Dear {name},\n\nThank you for registering with us!\n\nWe look forward to providing you with "
                     f"excellent service.\n\nBest regards,\nThe LungCancerDetector Team",
                sender='lungcancerdetector@gmail.com',
                recipients=[email]
            )
            mail.send(msg)
        except Exception as e:
            return jsonify({'error': str(e)}), 500

        return jsonify({'message': 'User registered successfully'}), 200
    else:
        return jsonify({'error': "Email address not provided"}), 400


@app.route("/send-survey-result", methods=['POST'])
@cross_origin()
def send_survey_result():
    email = request.json.get('email')
    prediction = request.json.get('prediction')
    if email:
        try:
            msg = Message(
                subject='Survey Result!',
                body=f"Dear user,\n\nYour survey prediction result is: {prediction}.\n\nThank you for using our "
                     f"service.\n\nBest regards,\nThe LungCancerDetector Team",
                sender='lungcancerdetector@gmail.com',
                recipients=[email]
            )
            mail.send(msg)
        except Exception as e:
            return jsonify({'error': str(e)}), 500

        return jsonify({'message': 'User registered successfully'}), 200
    else:
        return jsonify({'error': "Email address not provided"}), 400


@app.route("/send-contact-mail", methods=['POST'])
@cross_origin()
def send_contact_mail():
    email = request.json.get('email')
    name = request.json.get('name')
    message = request.json.get('message')
    if email:
        try:
            msg = Message(
                subject='Contact Form Submission',
                body=f"Dear {name},\n\nThank you for reaching out to us!\n\nYour message:\n{message}\n\nWe will get "
                     f"back to you as soon as possible.\n\nBest regards,\nThe LungCancerDetector Team",
                sender='lungcancerdetector@gmail.com',
                recipients=[email]
            )
            mail.send(msg)
        except Exception as e:
            return jsonify({'error': str(e)}), 500

        return jsonify({'message': 'Message sent successfully'}), 200
    else:
        return jsonify({'error': "Email address not provided"}), 400


if __name__ == '__main__':
    app.run(debug=True, port=3200)
