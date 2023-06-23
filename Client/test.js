// let back = document.getElementById('back');
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";

var sign = document.getElementById('sign');
var otp = document.getElementById('otp');
var verify = document.getElementById('verify');
var phone = document.getElementById('phone');
var otpnum = document.getElementById('otpnum');

verify.onclick = function() {
  login();
}

console.log("Hello");
// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCMQ0UXkXik0ZjrJQ5rx9j_DIUPscpYRT8",
    authDomain: "employee-portal-52275.firebaseapp.com",
    projectId: "employee-portal-52275",
    storageBucket: "employee-portal-52275.appspot.com",
    messagingSenderId: "658075074714",
    appId: "1:658075074714:web:902b5cd245e75de0901f23",
    measurementId: "G-J3VEN2FYSW"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
auth.useDeviceLanguage();

window.recaptchaVerifier = new RecaptchaVerifier('phonebtn', {
    'size': 'invisible',
    'callback': (response) => {
      // reCAPTCHA solved, allow signInWithPhoneNumber.
       onSignInSubmit();
       console.log("hiiii");
    //   console.log(response);
    }
  }, auth);
  // window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {}, auth);
  var i = 0;
function re() {
  if(i == 0) {
  window.recaptchaVerifier.render().then(function(widgetId) {
    console.log("18888");
      grecaptcha.reset(widgetId);
      i++;
  });
  }
}
re();


  function onSignInSubmit() {
    const phoneNumber = '+91'+phone.value;
    console.log(phoneNumber);
    const appVerifier = window.recaptchaVerifier;
    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
    .then((confirmationResult) => {
      // SMS sent. Prompt user to type the code from the message, then sign the
      // user in with confirmationResult.confirm(code).
      window.confirmationResult = confirmationResult;
      sign.style.display = 'none';
      otp.style.display = 'block';

    //   console.log(confirmationResult);
      // ...
    }).catch((error) => {
      // Error; SMS not sent
      // ...
      console.log(error);
    });
  }

//   window.recaptchaVerifier.render().then(function(widgetId) {
//     // grecaptcha.reset(widgetId);
// });
// Or, if you haven't stored the widget ID:
  function login() {
    const code = otpnum.value;
    console.log(otpnum.value);
    console.log(code);
    confirmationResult.confirm(code).then((result) => {
      // User signed in successfully.
      const user = result.user;
      console.log("success!");
      window.location.replace('')
      
      // ...
    }).catch((error) => {
      console.log(error);
      // User couldn't sign in (bad verification code?)
      // ...
    });
  }





export { auth };