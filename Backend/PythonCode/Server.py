from flask import Flask, request, jsonify
from CompressSchedule import CompressionFunction
from flask_cors import CORS
from pymongo import MongoClient

# First run the server before sending request to backend so that a local network could get created.

# Cross-Origin Resource Sharing (CORS) can be an issue when a client on a different domain or port (your React Native app) tries to access the backend. You might need to install and configure flask-cors in your Flask app to allow requests from your React Native client.

app = Flask(__name__)
CORS(app)

# MongoDB configuration
client = MongoClient("mongodb://localhost:27017/")
db = client['JDA-Library']  # Database name
collection = db['Archit Gupta']  # Collection name

# In the backend API case, ensure to have a 3rd device to share the same network in both PC and real device emulator and also ensure that Windows Firewall is closed.

@app.route("/", methods=["GET", "POST"])
def compress():
    if request.method == 'POST':
        data = request.json
        Time = data.get('Time')
        Prev = data.get('Prev')
        Fixed = data.get('Fixed')
        output = CompressionFunction(Time, Prev, Fixed)
        return jsonify(output)
    else:
        return 'COME with a POST request rascal !!'
    
# Example: Insert data into MongoDB
@app.route('/add', methods=['POST'])
def add_data():
    data = request.json  # Get the JSON data from request
    if data:
        collection.insert_one(data)  # Insert into MongoDB
        return jsonify({"message": "Data added successfully!"}), 201
    return jsonify({"error": "No data found!"}), 400

# Example: Fetch data from MongoDB
@app.route('/data', methods=['GET'])
def get_data():
    data = list(collection.find({}, {"_id": 0}))  # Fetch all data, excluding the MongoDB "_id"
    return jsonify(data), 200


if __name__=='__main__':
    app.run(debug=True, host='0.0.0.0')