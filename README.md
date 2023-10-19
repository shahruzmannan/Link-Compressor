# Link-Compressor
A Link Compressor Application built with React JS, Python Flask, and Firebase Database. The application is deployed on heroku and can be accessed here: https://linkcompressor-a2c6a3a79786.herokuapp.com/

## client
This is single page react app written with Bootstrap that takes the long URL from a user, stores it in a database (firebase database), and gives the user a compressed URL. 

### Dependencies
1. Node.js
2. Firebase Project Account
3. Firebase Database in Project Account
4. Firebase config in index.js line 9. (Instructions can be found [here](https://support.google.com/firebase/answer/7015592?hl=en#zippy=%2Cin-this-article))

### Running client Locally
1. `cd client`
2. `npm install` To install dependencies
3. `npm start`

## server
This is a Python Flask web server that listens for calls made with the generated URL, goes to the database, fetches the long URL, and then redirects the user to the
long URL page.

### Dependencies
1. Python
2. Firebase Project Account
3. Firebase Database in Project Account
4. Firebase service account JSON key file (ServiceAccountKey.json) in server/app/main.py line 6. (Instructions can be found [here](https://firebase.google.com/docs/admin/setup#windows))
5. Firebase Database URL in server/app/main.py line 8

### Running Server Locally
1. `cd server`
2. Create a virtual environment in the server folder (py -m venv venv)
3. Activate virtual environment (`source venv/bin/activate` for Mac and `venv/Scripts/activate` for Windows)
4. `pip install -r requirements.txt` To all required packages
5. Make sure you have the ServiceAccountKey.json in the server folder. 
6. `python wsgi.py`

The Flask app is also set up to run the production version of the React app. The build should be located in the app folder for this to work.

