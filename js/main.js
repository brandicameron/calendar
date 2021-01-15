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
const yearContainer = document.querySelector('.year-container');
let days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat'];


// CREATE CALENDAR

function displayYear(year) {
	document.querySelector('.display-year').textContent = year;
}


function create12Months() {
	const template = document.getElementById('template');
	for (let i = 0; i < 12; i++) {
		const newMonth = template.content.cloneNode(true);
		yearContainer.appendChild(newMonth);
	}
	//important for getting first day of month & total days in a month
	let dayContainers = document.querySelectorAll('.day-cells-container');
	let i = 0;
	dayContainers.forEach((container) => {
		container.setAttribute('data-month-index', i++);
	});
}


function displayMonthName(year) {
	const monthName = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
										 'August', 'Sepetember', 'October', 'November', 'December'];
	const monthsOfYear = document.querySelectorAll('.display-month-year');
	for (let i = 0; i < monthsOfYear.length; i++) {
		monthsOfYear[i].textContent = `${monthName[i]} ${year}`;
	}
}


function createDaysofWeek() {
	let weekdays = document.querySelectorAll('.dayofweek-text-container');
	for (let i = 0; i < days.length; i++) {
		weekdays.forEach((dayTextContainer) => {
			let weekday = document.createElement('div');
			weekday.className = "day-text";
			weekday.textContent = days[i];
			dayTextContainer.appendChild(weekday);
		})
	}
};


// Returns index of first day of month, so that later that number of empty cells can be added to the calendar month ensuring the first day of the month starts on the right day
function getFirstDay(year, month) {
	let date = new Date(year, month, 1);
	let day = days[date.getDay()];
	return days.indexOf(day);
}


function getNumOfDays(year, month) {
	let totalDays = new Date(year, month + 1, 0).getDate();
	return totalDays;
}


function createDays(year) {
	const dayContainers = document.querySelectorAll('.day-cells-container');

	dayContainers.forEach((container) => {
		let monthIndex = container.getAttribute('data-month-index');
		let numOfDays = getNumOfDays(year, monthIndex);
		let firstDay = getFirstDay(year, monthIndex);

		for (let i = 1; i <= firstDay; i++) {
			let emptycell = document.createElement('div');
			emptycell.className = 'cells';
			container.appendChild(emptycell);
		}

		for (let day = 1; day <= numOfDays; day++) {
			let daycell = document.createElement('div');
			daycell.className = 'cells';
			container.appendChild(daycell);
			daycell.textContent = `${day}`;
			daycell.id = `${year}${daycell.textContent}${monthIndex}`;
		}
	})
}

function selectDays() {
	let cells = document.querySelectorAll('.cells');
	cells.forEach((select) => {
		select.addEventListener('click', e => {
			let dayCellId = e.target.id;
			e.target.classList.toggle('selected');

			// add selected days to Firestore database
			if (e.target.classList.contains('selected')) {
				auth.onAuthStateChanged((user) => {
					if (user) {
						db.collection(user.uid).doc(dayCellId).set({
								id: dayCellId,
							})
							.then(function () {
							})
							.catch(function (error) {
								console.error("Error writing document: ", error);
							})
					}
				})
			} else {
				auth.onAuthStateChanged((user) => {
					if (user) {
						db.collection(user.uid).doc(dayCellId).delete();
					}
				})
			}
		})
	})
}


// Realtime Listener
function changeListener() {
	auth.onAuthStateChanged(user => {
		if (user) {
			db.collection(user.uid).onSnapshot((snapshot) => {
				let changes = snapshot.docChanges();
				changes.forEach(change => {
					if (change.type == "added") {
						let currentDay = parseInt(change.doc.data().id);
						if (!document.getElementById(currentDay)) {
							return;
						} else {
							document.getElementById(currentDay).classList.add('selected');
						}
					} else if (change.type == 'removed') {
						//do nothing i guess lol
					}
				})
			})
		}
	})
}


// Jump to current month if current year is displayed
function createJumpLink() {
	const getCurrentMonth = new Date().getMonth();
	const monthDivs = document.querySelectorAll('.display-month-year');
	let currentMonth = monthDivs[getCurrentMonth];
	currentMonth.id = 'jumpLink';
}

function jumpToCurrentMonth() {
	let currentYear = new Date().getFullYear();
	let pageTitle = document.querySelector('.display-year').textContent;

	if (currentYear === parseInt(pageTitle)) {
		let currentMonth = document.getElementById('jumpLink');
		let currentMonthYPos = currentMonth.getBoundingClientRect().y;
		window.scrollTo(0, currentMonthYPos);
	}
}


function markCurrentDay() {
	let thisDay = new Date().getDate();
	let currentMonth = document.getElementById('jumpLink');
	let dayOfThisMonth = currentMonth.nextElementSibling.nextElementSibling.children;
	let daysArray = Array.from(dayOfThisMonth);
	
	let markDay = daysArray.filter((day) => {
		if (parseInt(day.innerHTML) === new Date().getDate()) {
			day.style.border = "2px dotted #2311fc";
			day.style.zIndex = "1000";
		}
	});
}

function createYear(year) {
			displayYear(year);
			create12Months();
			displayMonthName(year);
			createDaysofWeek();
			createDays(year);
			selectDays();
			changeListener();
			createJumpLink();
			jumpToCurrentMonth();
			markCurrentDay();
		}

