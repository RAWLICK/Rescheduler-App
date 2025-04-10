from flask import Flask, request, jsonify
from CompressSchedule import CompressionFunction
# from Rough import CompressionFunction
from flask_cors import CORS
from pymongo import MongoClient

# First run the server before sending request to backend so that a local network could get created.

# Cross-Origin Resource Sharing (CORS) can be an issue when a client on a different domain or port (your React Native app) tries to access the backend. You might need to install and configure flask-cors in your Flask app to allow requests from your React Native client.

app = Flask(__name__)
CORS(app)

# MongoDB configuration
client = MongoClient("mongodb+srv://archit_gupta_0019:My_Lord%3B7@rescheduler.kmyql.mongodb.net/")
db = client['Users-Information']  # Database name
LibrariansInfo = db['Librarians Info']  # Collection name
SchedulesCompletion = db['Schedules Completion']  # Collection name
StudentInfo = db['Students Info']
StudentsSchedules = db['Students Schedules']

# In the backend API case, ensure to have a 3rd device to share the same network in both PC and real device emulator and also ensure that Windows Firewall is closed.

@app.route("/", methods=["GET", "POST"])
def compress():
    if request.method == 'POST':
        data = request.json
        ImportedDataFrame = data.get('ImportedDataFrame')
        currentTime = data.get('currentTime')
        PriorSelections = data.get('PriorSelections')
        FixedSelections = data.get('FixedSelections')
        RemovingSelections = data.get('RemovingSelections')
        output = CompressionFunction(ImportedDataFrame, currentTime, PriorSelections, FixedSelections, RemovingSelections)
        return jsonify(output)
    else:
        return 'COME with a POST request rascal !!'
    
# Example: Insert data into MongoDB
@app.route('/addDistributor', methods=['POST'])
def add_Distributor():
    data = request.json  # Get the JSON data from request
    uniqueID = data.get('uniqueID')
    Name = data.get('Name')
    PhoneNumber = data.get('Phone Number')
    Email = data.get('Email')
    DistributorName = data.get('Distributor Name')
    DistributorID = data.get('Distributor ID')
    DateJoined = data.get('Date Joined')
    City = data.get('City')
    State = data.get('State')
    Country = data.get('Country')
    if data:
        LibrariansInfo.insert_one(data)  # Insert into MongoDB
        DistributorAsUser = {
            "uniqueID": uniqueID,
            "Name": Name,
            "Phone Number": PhoneNumber,
            "Date Joined": DateJoined,
            "Email ID": Email,
            "Gender": "",
            "Streak": "",
            "Subscription Type": "Library",
            "Distributor Name": DistributorName,
            "Distributor ID": DistributorID,
            "City": City,
            "State": State,
            "Country": Country,
            "Type of Account": "Distributor",
        }
        StudentInfo.insert_one(DistributorAsUser)
        StudentsSchedules.insert_one({
            "uniqueID": data["uniqueID"],
            "Name": data["Name"],
            "Phone Number": data["Phone Number"],
            "ScheduleArray": []
        })  # Insert into MongoDB
        SchedulesCompletion.insert_one({
            "uniqueID": data["uniqueID"],
            "Name": data["Name"],
            "Phone Number": data["Phone Number"],
            "Completion": []
        })
        return jsonify({"message": "Data added successfully!"}), 201
    return jsonify({"error": "No data found!"}), 400

# Example: Fetch data from MongoDB
@app.route('/data', methods=['GET'])
def get_data():
    data = list(LibrariansInfo.find({}, {"_id": 0}))  # Fetch all data, excluding the MongoDB "_id"
    return jsonify(data), 200

@app.route('/MatchNumber', methods=['POST'])
def match_number():
    userPhoneNumber = request.json
    if userPhoneNumber:
        userExists = StudentInfo.find_one({ "Phone Number": userPhoneNumber })
        if userExists:
            return jsonify("true"), 201
        else:
            return jsonify("false"), 201
    else:
        return jsonify({"error": "No data found!"}), 400
    
@app.route('/AddStudent', methods=['POST'])
def add_student():
    data = request.json
    if data:
        StudentInfo.insert_one(data)  # Insert into MongoDB
        StudentsSchedules.insert_one({
            "uniqueID": data["uniqueID"],
            "Name": data["Name"],
            "Phone Number": data["Phone Number"],
            "ScheduleArray": []
        })  # Insert into MongoDB
        SchedulesCompletion.insert_one({
            "uniqueID": data["uniqueID"],
            "Name": data["Name"],
            "Phone Number": data["Phone Number"],
            "Completion": []
        })
        return jsonify({"message": "Student added successfully!"}), 201
    return jsonify({"error": "No data found!"}), 400

@app.route('/GetStudentInfo', methods=['POST'])
def get_studentInfo():
    data = request.json
    if data:
        studentData = StudentInfo.find_one({ "Phone Number": data }, {"_id": 0})
        if studentData:
            return jsonify(studentData), 201
        else:
            return jsonify({"error": "No data found!"}), 400
    else:
        return jsonify({"error": "No data found!"}), 400

if __name__=='__main__':
    app.run(debug=True, host='0.0.0.0')