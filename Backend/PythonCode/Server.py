from flask import Flask, request, jsonify
from CompressSchedule import CompressionFunction
from flask_cors import CORS

# Cross-Origin Resource Sharing (CORS) can be an issue when a client on a different domain or port (your React Native app) tries to access the backend. You might need to install and configure flask-cors in your Flask app to allow requests from your React Native client.

app = Flask(__name__)
CORS(app)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

# @app.route("/compress")
# def compress():
#     data = request.json
#     time = data.get('Time')
#     Prev = data.get('Prev')
#     Remov = data.get('Remov')
#     output = CompressionFunction(time, Prev, Remov)
#     return jsonify(output)

@app.route("/inputs")
def inputs():
    data = request.get_json()
    print(data)
    mess = data.get('Message')
    return jsonify(mess)


if __name__=='__main__':
    app.run(debug=True)