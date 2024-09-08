from flask import Flask, request, jsonify
from CompressSchedule import CompressionFunction
from flask_cors import CORS

# Cross-Origin Resource Sharing (CORS) can be an issue when a client on a different domain or port (your React Native app) tries to access the backend. You might need to install and configure flask-cors in your Flask app to allow requests from your React Native client.

app = Flask(__name__)
CORS(app)

# In the backend API case, ensure to have a 3rd device to share the same network in both PC and real device emulator and also ensure that Windows Firewall is closed.

@app.route("/", methods=["GET", "POST"])
def compress():
    if request.method == 'POST':
        data = request.json
        time = data.get('Time')
        Prev = data.get('Prev')
        Remov = data.get('Remov')
        output = CompressionFunction(time, Prev, Remov)
        return jsonify(output)
    else:
        return 'COME with a POST request rascal !!'


if __name__=='__main__':
    app.run(debug=True, host='0.0.0.0')