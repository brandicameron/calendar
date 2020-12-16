const yearContainer = document.querySelector('.year-container');
const year = 2020;
let days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat'];



function displayYear() {
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



function displayMonthName() {
	const monthName = ['January','February','March','April','May','June','July',
										 'August','Sepetember','October','November','December'];
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



function getFirstDay(year, month) {
	let date = new Date(year, month, 1);
	let day = days[date.getDay()];
	return days.indexOf(day);
	//returns index of first day of month, so that later that number of empty cells can be created so that the first day of the month starts on the right day
}



function getNumOfDays(year, month) {
	let totalDays = new Date(year, month + 1, 0).getDate();
	return totalDays;
}



function createDays() {
	const dayContainers = document.querySelectorAll('.day-cells-container');

	dayContainers.forEach((container) => {
		let monthIndex = container.getAttribute('data-month-index');
		let numOfDays = getNumOfDays(year, parseInt(monthIndex));
		let firstDay = getFirstDay(year, parseInt(monthIndex));

		for (let i = 1; i <= firstDay; i++) {
			let emptycell = document.createElement('div');
			emptycell.className = 'cells';
			container.appendChild(emptycell);
			emptycell.textContent = '';
		}

		for (let day = 1; day <= numOfDays; day++) {
			let daycell = document.createElement('div');
			daycell.className = 'cells';
			container.appendChild(daycell);
			daycell.textContent = `${day}`;
			daycell.id = `${year}${daycell.textContent}${parseInt(monthIndex)}`;
		}
	})
}



(function createYear() {
	displayYear();
	create12Months();
	displayMonthName();
	createDaysofWeek();
	createDays();
})();



const userSelection = (() => {
	let cells = document.querySelectorAll('.cells');
	cells.forEach((select) => {
		select.addEventListener('click', event => {
			event.target.classList.toggle('selected');
		})
	})
})();


yearContainer.addEventListener('click', (e) => {
	if (e.target.classList.contains('selected')) {
		console.log(e.target.id);
	}
})


// TO DO


// Take out hard coded year and print a range of years instead - better yet, make input page where you can select dates you want to display!

// Add selected dates to Firebase and create login of course
