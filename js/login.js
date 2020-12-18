var firebaseConfig = {
    apiKey: "AIzaSyCUCzjEAhIXzd2a25u0Nt8nIVDi8qhUm3k",
    authDomain: "calendar-e9e4a.firebaseapp.com",
    databaseURL: "https://calendar-e9e4a.firebaseio.com",
    projectId: "calendar-e9e4a",
    storageBucket: "calendar-e9e4a.appspot.com",
    messagingSenderId: "473369134213",
    appId: "1:473369134213:web:f6e1c7c07dd5f1671bd5ec"
  };

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

const loginSection = document.querySelector('.login-screen');
const loginForm = document.querySelector('.login-form');
const loginEmail = document.getElementById('login-email');
const loginPassword = document.getElementById('login-password');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const yearContainer = document.querySelector('.year-container');
const currentYear = new Date().getFullYear();


function loginUser(e) {
	e.preventDefault();
	const email = loginEmail.value;
	const password = loginPassword.value;

	auth.signInWithEmailAndPassword(email, password)
		.then(() => {
			window.location = `${currentYear}.html`;
		}).catch((err) => {
			console.log('Login Error Occured');
		})
}

function logOutUser() {
	auth.signOut().then(function() {
  console.log('Sign out successful.');
}).catch(function(error) {
  console.log('Sign out error occured.');
});
}

loginBtn.addEventListener('click', loginUser);
logoutBtn.addEventListener('click', logOutUser);

auth.onAuthStateChanged(user => {
			console.log(user);
		})