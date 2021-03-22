let bookList = [];
const cart = [];

/**
 * Render the listBox based on input bookList.
 */
const renderListBox = (categoriesNode, tbodyNode) => {
	const categories = [];
	bookList.map((book, index) => {
		//find out the categories.
		if (!categories.includes(book.category)) {
			categories.push(book.category);

			//create the categories.
			const categoryNode = document.createElement("option");
			categoryNode.innerHTML = book.category;
			categoryNode.setAttribute("value", book.category);
			categoriesNode.appendChild(categoryNode);
		}

		//render the books
		const bookNode = document.createElement("tr");
		let ratingHtml = "";

		//the html for rating
		if (book.rating >= 0 && book.rating <= 5) {
			let i = 0;
			for (i = 0; i < 5 - book.rating; i++) {
				ratingHtml +=
					'<img class="star" src="./images/outline-star-16.ico" />';
			}
			for (i = 0; i < book.rating; i++) {
				ratingHtml += '<img class="star" src="./images/star-16.ico" />';
			}
		}
		//the html for the row
		bookNode.innerHTML =
			`<td><input type="checkbox" class="checkbox" id="checkbox${index}"></td>` +
			`<td><img src="${book.img}" height="100" width="80"/></td>` +
			`<td>${book.title + ratingHtml}</td>` +
			`<td>${book.authors}</td><td>${book.year}</td><td>${book.price}</td>` +
			`<td>${book.publisher}</td><td>${book.category}</td>`;

		bookNode.setAttribute("id", "row" + index);
		bookNode.setAttribute("class", "row");
		tbodyNode.append(bookNode);
	});

	//hide #notFound, if book(s) exist.
	if (bookList.length > 0) {
		document.querySelector("#notFound").style.display = "none";
	}
};

/**
 * Clear all of the checkboxes
 */
const clearCheckbox = (tbodyNode) => {
	tbodyNode.childNodes.forEach((rowNode) => {
		//Find out the rows with a valid checkbox
		if (rowNode.nodeType !== Node.ELEMENT_NODE) return;
		const checkboxNode = rowNode.querySelector(".checkbox");
		if (!checkboxNode) return;

		//Clear the checkbox
		checkboxNode.checked = false;
	});
};

/**
 * Filter Action
 */
const filterAction = (filterButtonNode, categoriesNode, tbodyNode) => {
	filterButtonNode.onclick = () => {
		let notFound = true;
		clearCheckbox(tbodyNode);

		//For each of the books in bookList.
		bookList.map((book, index) => {
			const rowNode = document.querySelector("#row" + index);
			rowNode.style.display = "";

			//Hide the books that do not belong to the chosen category.
			if (
				book.category !== categoriesNode.value &&
				categoriesNode.value !== "Category"
			) {
				rowNode.style.display = "none";
			}

			//Found a result.
			if (
				book.category === categoriesNode.value ||
				categoriesNode.value === "Category"
			) {
				notFound = false;
			}
		});

		//Hide the #notFound if there is a result.
		if (notFound) {
			document.querySelector("#notFound").style.display = "";
		}
	};
};

/**
 * Search Action
 */
const SearchAction = (searchButtonNode, searchTextNode, darkModeNode) => {
	searchButtonNode.onclick = () => {
		let notFound = true;

		//For every books in the put bootList.
		bookList.map((book, index) => {
			const rowNode = document.querySelector("#row" + index);
			rowNode.style.backgroundColor = "";

			//Find the matching book(s).
			if (
				book.title
					.toUpperCase()
					.includes(searchTextNode.value.toUpperCase()) &&
				searchTextNode.value !== ""
			) {
				//Change the background color.
				if (darkModeNode.checked) {
					rowNode.style.backgroundColor = "green";
				} else {
					rowNode.style.backgroundColor = "#00ff90";
				}

				notFound = false;
			}
		});

		if (notFound && searchTextNode.value !== "") alert("Item Not Found.");
	};
};

/**
 * Find out the selected item.
 */
const findSelectedItem = (tbodyNode) => {
	let selected = undefined;
	tbodyNode.childNodes.forEach((rowNode) => {
		//Find out the rows with a valid checkbox
		if (rowNode.nodeType !== Node.ELEMENT_NODE) return;
		const checkboxNode = rowNode.querySelector(".checkbox");
		if (!checkboxNode) return;

		//Return the selected item
		if (checkboxNode.checked) {
			checkboxNode.checked = false;
			selected = rowNode;
		}
	});
	//Otherwise return undefined.
	return selected;
};

/**
 * Add to Cart Action
 */
const AddToCartAction = (addButtonNode, cartNode, tbodyNode) => {
	addButtonNode.onclick = () => {
		//Find out the selected item.
		const selected = findSelectedItem(tbodyNode);

		if (selected) {
			//Ask for the quantity.
			let quantity;
			let quantityInput = window.prompt("Quantity of the selected item:");

			//Validate the input.
			quantity = parseInt(quantityInput);
			if (/[a-zA-Z.]/.test(quantityInput)) quantity = undefined;

			if (quantity) {
				let i = 0;
				//Add the item(s) to the cart.
				for (; i < quantity; i++) {
					cart.push(selected);
				}
				cartNode.innerHTML = "(" + cart.length + ")";
			} else {
				window.alert("Invalid input.");
			}
		} else {
			window.alert("No item selected.");
		}
	};
};

/**
 * Empty Cart Action
 */
const EmptyCartAction = (resetButtonNode, tbodyNode, cartNode) => {
	resetButtonNode.onclick = () => {
		if (confirm("Is it okay to reset the cart?")) {
			cart.splice(0, cart.length);
			clearCheckbox(tbodyNode);
			cartNode.innerHTML = "(" + cart.length + ")";
		}
	};
};

/**
 * Dark Mode Action
 */
const darkModeAction = (darkModeNode) => {
	darkModeNode.onclick = () => {
		const listBoxStyle = document.querySelector("#listBox").style;
		const searchStyle = document.querySelector("#searchBox").style;
		const threadStyle = document.querySelector("#thread").style;
		if (darkModeNode.checked) {
			//Dark mode case
			document.body.style.backgroundColor = "black";
			document.body.style.color = "white";

			listBoxStyle.backgroundColor = "black";
			searchStyle.backgroundColor = "#23819b";
			threadStyle.backgroundColor = "#23819b";

			document.querySelectorAll(".row").forEach((rowNode) => {
				if (!rowNode.style.backgroundColor == "") {
					rowNode.style.backgroundColor = "green";
				}
			});
		} else {
			//Light mode case
			document.body.style.backgroundColor = "";
			document.body.style.color = "";

			listBoxStyle.backgroundColor = "";
			searchStyle.backgroundColor = "";
			threadStyle.backgroundColor = "#ebf4fb";

			document.querySelectorAll(".row").forEach((rowNode) => {
				if (!rowNode.style.backgroundColor == "") {
					rowNode.style.backgroundColor = "#00ff90";
				}
			});
		}
	};
};

/**
 * Make sure that Only one checkbox can be selected.
 */
const onlyOneCheckBox = () => {
	const checkBoxNodes = document.querySelectorAll(".checkbox");
	checkBoxNodes.forEach((checkBoxNode) => {
		checkBoxNode.onclick = () => {
			if (checkBoxNode.checked) {
				checkBoxNodes.forEach((each) => {
					if (each.id !== checkBoxNode.id) {
						each.checked = false;
					}
				});
			}
		};
	});
};

/**
 * Fetch the input bookList.
 */
function getJsonObject(path, success, error) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
		if (xhr.readyState === XMLHttpRequest.DONE) {
			if (xhr.status === 200) {
				if (success) success(JSON.parse(xhr.responseText));
			} else {
				if (error) error(xhr);
			}
		}
	};

	xhr.open("GET", path, true);
	xhr.send();
}

/**
 * Entry point of the page renderings and actions.
 */
const main = () => {
	const categoriesNode = document.querySelector("select#categories");
	const tbodyNode = document.querySelector("#listBox table tbody");
	const filterButtonNode = document.querySelector("#filterButton");
	const searchTextNode = document.querySelector("#searchText");
	const searchButtonNode = document.querySelector("#searchButton");
	const addButtonNode = document.querySelector("#addButton");
	const resetButtonNode = document.querySelector("#resetButton");
	const cartNode = document.querySelector("#cartNum");
	const darkModeNode = document.querySelector("#darkMode");

	renderListBox(categoriesNode, tbodyNode);

	filterAction(filterButtonNode, categoriesNode, tbodyNode);

	SearchAction(searchButtonNode, searchTextNode, darkModeNode);

	AddToCartAction(addButtonNode, cartNode, tbodyNode);

	EmptyCartAction(resetButtonNode, tbodyNode, cartNode);

	darkModeAction(darkModeNode);

	onlyOneCheckBox();

	//Set up test category.
	const testCategoryNode = document.createElement("option");
	testCategoryNode.innerHTML = "Test";
	testCategoryNode.setAttribute("value", "Test");
	categoriesNode.appendChild(testCategoryNode);
};

window.onload = () => {
	getJsonObject(
		"data.json",
		function (data) {
			bookList = data;
			main();
		},
		function (xhr) {
			console.error(xhr);
			main();
		}
	);
};
