let { getStorage, ref, getDownloadURL, uploadBytes } = require("firebase/storage");

var axios = require("axios");
// const http = require("localhost");

let { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, RecaptchaVerifier } = require("firebase/auth");

const Jimp = require("jimp");
const admin =  require("firebase-admin");
// Import the functions you need from the SDKs you need
const init =  require("firebase/app");
const multer = require('multer');

var nodemailer = require('nodemailer');

const accountSid = "AC0c424d181f2c8bc9f18710894ba96703";
const authToken = "520b5be896afe84ce77d14f0f7366d24";
console.log(process.env.authacc);
const client = require('twilio')(accountSid, authToken);

const upload = multer({storage: multer.memoryStorage()});
require('dotenv').config();
// var serviceAccount = require("../key.json");

const readl = require('readline-sync');

const fs = require('fs');

// const admin = require('firebase-admin');
const path = require('path'); 

const express = require('express');
const app = express();

const cors = require('cors');

app.use(cors());

const port = process.env.PORT || 8080;

// const db = admin.firestore();

const { log } = require('console');
const { mainModule } = require("process");
const { url } = require("inspector");

const credential = {
  type: process.env.type,
  project_id: process.env.project_id,
  private_key_id: process.env.private_key_id,
  private_key: process.env.private_key,
  client_email: process.env.client_email,
  client_id: process.env.client_id,
  auth_uri: process.env.auth_uri,
  token_uri: process.env.token_uri,
  auth_provider_x509_cert_url: process.env.auth_provider_x509_cert_url,
  client_x509_cert_url: process.env.client_x509_cert_url,
  universe_domain: process.env.universe_domain,
}

app.use(express.json());

app.use(express.urlencoded({extended: true}));
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.measurementId,
  appId: process.env.appId,
  measurementId: process.env.measurementId,
};
//   apiKey: "AIzaSyCMQ0UXkXik0ZjrJQ5rx9j_DIUPscpYRT8",
//   authDomain: "employee-portal-52275.firebaseapp.com",
//   projectId: "employee-portal-52275",
//   storageBucket: "employee-portal-52275.appspot.com",
//   messagingSenderId: "658075074714",
//   appId: "1:658075074714:web:902b5cd245e75de0901f23",
//   measurementId: "G-J3VEN2FYSW"


// Initialize Firebase
const firebase = init.initializeApp(firebaseConfig);


admin.initializeApp({
  credential: admin.credential.cert(credential),
});

// const auth = admin.auth();

const auth = getAuth();
auth.useDeviceLanguage();

const db = admin.firestore();


const storage = getStorage(firebase);
const storageRef = ref(storage);
// imagesRef now points to 'images'

// Child references can also take paths delimited by '/'
// const fileRef = ref(imagesRef, 'bg4.jpg');
// spaceRef now points to "images/space.jpg"
// imagesRef still points to "images"
app.post('/imgs', async (req, res) => {
  let img = req.body.img;
  const fileRef = ref(folderRef, req.file.originalname);
  console.log("fileref: "+fileRef);
  fs.readFile(img, function (err, data) {
    console.log(data);
    const metadata = {
        contentType: 'image/*',
       };
    uploadBytes(fileRef, data, metadata).then((snapshot) => {
        console.log('Uploaded a blob or file!');
        console.log(snapshot);
      });
  });
})
var urll, fname;
var i = 1;
app.post('/img', upload.single("image"), (req, res) => {
  if(!req.file) {
    res.status(400).send("No File uploaded");
    return;
  }
  let id = req.body.id;
  console.log("req.b.i: "+ req.body.id);
  const folderRef = ref(storageRef, id);
  i++;
  const fileRef = ref(folderRef, req.file.originalname);
  console.log("fileref: "+fileRef);
  const metadata = {
    contentType: 'image/*',
  };
  console.log("okkk");
  uploadBytes(fileRef, req.file.buffer, metadata)
  .then(() => {
    getDownloadURL(fileRef).then(url => {
      fname = fileRef.name
      console.log("fname: "+ fileRef.name);
      console.log("url: " + url);
      urll = url;
      const imgdata = {
        imgname: fname,
        url: url
      }
      res.send(imgdata);
      console.log("fname: "+ fname);
      console.log("urll: " + urll);
    })
    .catch(err => {
      console.log(err);
      res.status(500).send(err);
    })
  })
})
// fs.readFile('images/bg4.jpg', function (err, data) {
//     console.log(data);
//     const metadata = {
//         contentType: 'image/jpg',
//        };
//     uploadBytes(fileRef, data, metadata).then((snapshot) => {
//         console.log('Uploaded a blob or file!');
//         console.log(snapshot);
//       });
// });
app.post('/recap', async (req, res) => {
  window.recaptchaVerifier = new RecaptchaVerifier(req.body.div, {
    'size': 'invisible',
    'callback': (response) => {
      // reCAPTCHA solved, allow signInWithPhoneNumber.
      onSignInSubmit();
      console.log(response);
    }
  }, auth);
  res.send(window.recaptchaVerifier);
  signin();
})

function signin() {
  const phoneNumber = "+1 650-555-1234";
  const appVerifier = window.recaptchaVerifier;
  
  signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      .then((confirmationResult) => {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        window.confirmationResult = confirmationResult;
        console.log(window.confirmationResult);
        res.send(window.confirmationResult);
        // ...
      }).catch((error) => {
        console.log("Error: "+ error);
        // Error; SMS not sent
        // ...
      });
    }

// app.post('/signin', async (req, res) => {
//   const phoneNumber = "9326242640";
//   const appVerifier = window.recaptchaVerifier;
  
//   signInWithPhoneNumber(auth, phoneNumber, appVerifier)
//       .then((confirmationResult) => {
//         // SMS sent. Prompt user to type the code from the message, then sign the
//         // user in with confirmationResult.confirm(code).
//         window.confirmationResult = confirmationResult;
//         console.log(window.confirmationResult);
//         res.send(window.confirmationResult);
//         // ...
//       }).catch((error) => {
//         console.log("Error: "+ error);
//         // Error; SMS not sent
//         // ...
//       });
// })

// const recaptchaResponse = grecaptcha.getResponse(recaptchaWidgetId);

app.post('/update', async (req, res) => {
  try {
    console.log("Update!");
    const userRef = await db.collection('users').doc(req.body.Id).update({
      name: req.body.Name,
      email: req.body.Email,
      id: req.body.Id,
      contact: req.body.Contact,
      url: req.body.Url
    });
    console.log(req.body.Url);
    res.send(userRef);
  }
  catch(error) {
    res.send(error);
  }
})

app.post('/delete', async (req, res) => {
  try {
    console.log(req.body.contact);
    const response = await db.collection('users').doc(req.body.id).delete();
    console.log(response);
    res.send(response);
  }
  catch(error) {
    res.send(error);
  } 
})

app.post('/create', async (req, res) => {
  console.log("Calling Create api");
  try {
    // call_read();
    let idfs = req.body.Id;
    console.log("Contact: "+req.body.Contact);
    console.log("Id: "+req.body.Id);
    const userJson = {
      name: req.body.Name,
      id: req.body.Id,
      email: req.body.Email,
      contact: req.body.Contact,
      url: req.body.Url,
      imagename: req.body.ImgName
    };
    // const response = await db.collection(process.env.collectionName).add(userJson);
    console.log("Calling Create api2");
    const response = await db.collection(process.env.collectionName1).doc(idfs).set(userJson);
    console.log("Calling Create api3");
    //res.send(response);
    // console.log(response);
    sendsms(req.body.Contact);
    res.send(response);
    console.log("success");
    sendmail(req.body.Email);
  } catch (error) {
    res.send(error);
  }
});

function sendmail(gmail) {
console.log("Gmail&Pass: "+gmail);
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.authacc,
    pass: process.env.authpass,
  }
});

var mailOptions = {
  from: 'ayush.s.sharma04@gmail.com',
  to: gmail,
  subject: 'Employee Portal Registration',
  text: 'You have been registered',
};
console.log("hiii");
transporter.sendMail(mailOptions, function (error, info) {
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent');
  }
});
console.log("hiii");
}

function sendsms(cont) {
client.messages
.create({
  body: 'You have been registered sms',
  from: '+12179968735', // your Twilio phone number
  to: '+91'+cont // recipient phone number
})
.then(message => console.log('SMS sent :', message.sid))
.catch(error => console.error('Error sending SMS:', error));

}

app.post('/sign', async (req, res) => {
  console.log("sign");
  createUserWithEmailAndPassword(auth, req.body.semail, req.body.spass)
    .then((userCredential) => {
      console.log("sign1");
      // Signed in 
      const user = userCredential.user;
      res.send("Hello: "+user.uid);
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
    });
})

app.post('/login', async (req, res) => {  
  signInWithEmailAndPassword(auth, req.body.lemail, req.body.lpass)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      console.log("log:" + user.uid);
      res.send('Success');
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
})

app.get('/readall', async (req, res) => {
  try {
    const userRef = db.collection(process.env.collectionName1);
    const response = await userRef.get();
    let responseArr = [];
    if(response.empty) {
      console.log("Response is empty");
    }
    response.forEach(doc => {
      responseArr.push(doc.data())
    })
    res.send(responseArr);
  } catch (error) {
    console.log(error);
  }
})


app.post('/readid', async (req, res) => {
  try {
    let id = req.body.Id;
    console.log(id);
    const userRef = db.collection(process.env.collectionName1).doc(id);
    const response = await userRef.get();
    res.send(response.data());
    console.log(response);
  }
  catch(error) {
    res.send(error);
  }
});

function call_get() {

  var options = {
    method: 'GET',
    url: 'http://localhost:8080/main',
    headers: {Accept: '*/*', 'User-Agent': 'Thunder Client (https://www.thunderclient.com)'}
  };
  
  axios.request(options).then(function (response) {
    // console.log(response.data);
  }).catch(function (error) {
    console.error(error);
  });
}


app.get('/get', function(req, res){
  res.sendFile(path.join(__dirname, '../Client/employee.html'));
  res.send("hello world");
})

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, '../Client/employee.html'));
})

app.engine('html', require('ejs').renderFile);

app.get('/main', function(req, res) {

  res.render(__dirname + "../../Client/employee.html");

});


app.get('/login', function(req, res) {

  res.render(__dirname + "../../Client/phone.html");

});

app.listen(port);
console.log(`Server started on ${port}`);
call_get();