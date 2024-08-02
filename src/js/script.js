// create variable
const generateButton = document.getElementById("generate-btn");
const showQuote = document.getElementById("output");
const saveBtn = document.getElementById("saveQuote");
const btnLogData = document.getElementById("btnLogData");
const btnDelete = document.getElementById("btnDelete");
const listQuote = document.getElementById("outputList");
const spanTag = document.createElement("span");
const pTag = document.createElement("p");
const loadingIndicator = document.getElementById("loading");
const renderList = document.getElementById("list");

//dataQuote
let dataQuote = [];
// Fetch API of Quote
var category = ["good", "great", "happiness", "morning", "success"];
const random = Math.floor(Math.random(0) * category.length);

// Function to show loading indicator
function showLoading() {
	loadingIndicator.style.display = "flex";
}

// Function to hide loading indicator
function hideLoading() {
	loadingIndicator.style.display = "none";
}

async function quotesAPI() {
	const API_KEY = "fYgNNaQoIw3iba2kilcFzA==d3IO5xaZU2QmJPLi";
	showLoading();
	await $.ajax({
		method: "GET",
		url: "https://api.api-ninjas.com/v1/quotes?category=" + category[random],
		headers: { "X-Api-Key": API_KEY },
		contentType: "application/json",
		success: function (result) {
			dataQuote = result[0];
			console.log(dataQuote);
			pTag.classList = "text-quote";
			spanTag.classList = "text-author";
			pTag.textContent = dataQuote.quote;
			spanTag.textContent = "~ " + dataQuote.author + " ~";
			showQuote.appendChild(pTag);
			showQuote.appendChild(spanTag);
			hideLoading();
		},
		error: function ajaxError(jqXHR) {
			console.error("Error: ", jqXHR.responseText);
			hideLoading();
		},
	});
}

// Initial render
quotesAPI();

// Handle Change Quote
generateButton.addEventListener("click", (e) => {
	pTag.textContent = "";
	spanTag.textContent = "";
	e.preventDefault();
	quotesAPI();
});

// MockUp path
saveBtn.addEventListener("click", () => {
	let newData = [];
	const newTask = {
		quote: dataQuote.quote,
		author: dataQuote.author,
		category: dataQuote.category,
	};
	newData.push(newTask);
	console.log(newData[0]);
	saveUserData(newData[0]);
});

btnLogData.addEventListener("click", () => {
	getUserData();
});

function getUserData() {
	showLoading();
	fetch("https://66aa0680613eced4eba73df1.mockapi.io/repository", {
		method: "GET",
		headers: { "content-type": "application/json" },
	})
		.then((res) => {
			if (res.ok) {
				return res.json();
			}
		})
		.then((tasks) => {
			let fetchData = tasks;
			renderList.textContent = "";
			console.log(fetchData);
			const titleList = document.createElement("h2");
			titleList.classList = "list--heading";
			titleList.textContent = "List Quotes";
			renderList.appendChild(titleList);
			const ulTag = document.createElement("ul");
			ulTag.classList = "quote-list";
			ulTag.id = "outputList";
			renderList.appendChild(ulTag);
			const buttonClose = document.createElement("button");
			buttonClose.classList = "btn button--close";
			buttonClose.innerHTML = `<i class="fa-regular fa-rectangle-xmark"></i>`;
			renderList.appendChild(buttonClose);
			buttonClose.addEventListener("click", () => {
				renderList.textContent = "";
			});
			fetchData.map((item) => {
				const liTag = document.createElement("li");
				const buttonDelete = document.createElement("button");
				const buttonChange = document.createElement("button");
				const divHandleButton = document.createElement("div");
				divHandleButton.classList = "list-action";
				liTag.textContent = item.quote + "{ Author: " + item.author + " } ";
				liTag.id = item.id;
				liTag.className = "list-item";
				buttonDelete.id = item.id;
				buttonChange.classList = "list-action-change btn";
				buttonDelete.classList = "list-action-delete btn";
				buttonDelete.innerHTML = `<i class="fa-regular fa-trash-can"></i>`;
				buttonChange.innerHTML = `<i class="fa-solid fa-right-left"></i>`;
				console.log(liTag.id);
				liTag.appendChild(divHandleButton);
				divHandleButton.appendChild(buttonChange);
				divHandleButton.appendChild(buttonDelete);
				ulTag.appendChild(liTag);
				buttonDelete.addEventListener("click", (e) => {
					e.preventDefault();
					deleteUserData(item.id);
				});
				buttonChange.addEventListener("click", (e) => {
					e.preventDefault();
					updateUserData(item.id);
				});
			});
			hideLoading();
		})
		.catch((error) => {
			console.error("Error: ", error);
			hideLoading();
		});
}

function saveUserData(newData) {
	showLoading();
	fetch("https://66aa0680613eced4eba73df1.mockapi.io/repository", {
		method: "POST",
		headers: { "content-type": "application/json" },
		body: JSON.stringify(newData),
	})
		.then((res) => {
			if (res.ok) {
				return res.json();
			}
		})
		.then((task) => {
			console.log("Saved ! ID: ", task.id);
			hideLoading();
		})
		.catch((error) => {
			console.error("Error: ", error);
			hideLoading();
		});
}

function deleteUserData(id) {
	showLoading();
	fetch(`https://66aa0680613eced4eba73df1.mockapi.io/repository/${id}`, {
		method: "DELETE",
	})
		.then((res) => {
			if (res.ok) {
				return res.json();
			}
			// handle error
		})
		.then((task) => {
			let fetchData = task;
			console.log(fetchData);
			getUserData();
			hideLoading();
		})
		.catch((error) => {
			console.error("Error: ", error);
			hideLoading();
		});
}

function updateUserData(id) {
	showLoading();
	fetch(`https://66aa0680613eced4eba73df1.mockapi.io/repository/${id}`, {
		method: "PUT",
		headers: { "content-type": "application/json" },
		body: JSON.stringify({ completed: true }),
	})
		.then((res) => {
			if (res.ok) {
				return res.json();
			}
		})
		.then((task) => {
			console.log(task);
			task = {
				id: dataQuote.id,
				quote: dataQuote.quote,
				author: dataQuote.author,
				category: dataQuote.category,
			};
			console.log("okok");
			console.log(task);
			getUserData();
			return fetch(
				`https://66aa0680613eced4eba73df1.mockapi.io/repository/${id}`,
				{
					method: "PUT",
					headers: { "content-type": "application/json" },
					body: JSON.stringify(task),
				}
			);
		})
		.then(() => {
			hideLoading();
		})
		.catch((error) => {
			console.error("Error: ", error);
			hideLoading();
		});
}
