async function createTable() {
	async function makeRequest(url) {  
	    const resp = await fetch(url)
		return await resp.json();
	}
	console.log("!")
	data = await makeRequest('https://gtk-sp.ru/products')
	data_cat = await makeRequest('https://gtk-sp.ru/categories')

	function getName(id) {
		for (let i = 0; i < data_cat.length; i++) {
			if (data_cat[i]["id"] == id) {
				return data_cat[i]["name"]
			}
		}
	}

	let table = document.createElement('table');
	let thead = document.createElement('thead');
	let tbody = document.createElement('tbody');
	table.appendChild(thead);
	table.appendChild(tbody);

	let row_1 = document.createElement('tr');
	let heading_1 = document.createElement('th');
	heading_1.innerHTML = "Идентификатор";
	let heading_2 = document.createElement('th');
	heading_2.innerHTML = "Товар";
	let heading_3 = document.createElement('th');
	heading_3.innerHTML = "Описание";
	let heading_4 = document.createElement('th');
	heading_4.innerHTML = "Emoji ID";
	let heading_5 = document.createElement('th');
	heading_5.innerHTML = "Категория";
	let heading_6 = document.createElement('th');
	heading_6.innerHTML = "Цена";
	let heading_7 = document.createElement('th');
	heading_7.innerHTML = "<button class='add' onclick='addRow()'>Добавить</button>";

	row_1.appendChild(heading_1);
	row_1.appendChild(heading_2);
	row_1.appendChild(heading_3);
	row_1.appendChild(heading_4);
	row_1.appendChild(heading_5);
	row_1.appendChild(heading_6);
	row_1.appendChild(heading_7);
	thead.appendChild(row_1);

	for (let i = 0; i < data.length; i++) {
		let newRow = document.createElement('tr');
		let newRowData_1 = document.createElement('td');
		newRowData_1.classList.add("id");
		newRowData_1.innerHTML = data[i]["id"];
		let newRowData_2 = document.createElement('td');
		newRowData_2.innerHTML = data[i]["name"];
		let newRowData_3 = document.createElement('td');
		newRowData_3.innerHTML = data[i]["description"];
		newRowData_3.classList.add("description");
		let newRowData_4 = document.createElement('td');
		newRowData_4.innerHTML = data[i]["emoji_id"];
		let newRowData_5 = document.createElement('td');
		newRowData_5.innerHTML = getName(data[i]["category_id"]);
		let newRowData_6 = document.createElement('td');
		newRowData_6.innerHTML = data[i]["price"];
		let newRowData_7 = document.createElement('td');
		newRowData_7.innerHTML = `<button class='edit' onclick='editData(${i})'>Изменить</button><button class='delete' onclick='delData("${data[i]["id"]}")'>Удалить</button>`
		newRowData_7.classList.add("no-border");

		newRow.appendChild(newRowData_1);
		newRow.appendChild(newRowData_2);
		newRow.appendChild(newRowData_3);
		newRow.appendChild(newRowData_4);
		newRow.appendChild(newRowData_5);
		newRow.appendChild(newRowData_6);
		newRow.appendChild(newRowData_7);
		tbody.appendChild(newRow);
	}
	
	document.getElementById('content').appendChild(table);
}
console.log("!!!")
let modal = document.getElementById("myModal");
let span =  document.getElementsByClassName("close")[0];
let warning = document.getElementById('warning')
let textForm = document.getElementById("addText");
let buttonForm = document.getElementById("submit-form");
let isEdit = true;
var data;
var data_cat;
let	idForm = document.getElementById("id-form");
let	nameForm = document.getElementById("name-form");
let	descriptionForm = document.getElementById("description-form");
let	emojiIdForm = document.getElementById("emoji_id-form");
let	categoryForm = document.getElementById("category-form");
let priceForm = document.getElementById("price-form");

	
async function init() {
	await createTable().then(() => {
	for (const cat in data_cat) {
		let newOption = document.createElement('option');
		newOption.innerHTML = cat;
		categoryForm.appendChild(newOption);
		console.log(categoryForm, cat, newOption)
	}});
	// console.log(data_cat)
}
window.onload = function(){
	const cont = document.getElementById('content')
	init()
};


function getId(name) {
	for (let i = 0; i < data_cat.length; i++) {
		if (data_cat[i]["name"] == name) {
			return data_cat[i]["id"]
		}
	}
}


function addRow(){
	modal.style.display = "block";
	textForm.innerHTML = "Добавление категории"
	buttonForm.innerHTML = "Добавить"
	$("#id-form").attr("disabled", false)
	document.getElementById('form').reset();
	isEdit = false;
}

window.onclick = function(event) {
	if (event.target == modal) {
		modal.style.display = "none";
	}
  }

span.onclick = function() {
	modal.style.display = "none";
}

function serializeForm(formNode) {
	const { elements } = formNode
	let respData = []

    for(const element of elements) {
      const { name, value } = element
	  console.log({ name, value })
	  console.log(value.length)
	  if ((value.length > 38 || value.length < 1) && name != "submit") {
		warning.style.display = "block"
		return 
	  } else {
		warning.style.display = "none"
	  }
      respData.push(value)
    }
	let reqMethod = ""
	if (isEdit) {
		reqMethod = 'PUT'
	} else {
		reqMethod = 'POST'
	}
	const requestOptions = {
		method: reqMethod,
		redirect: 'follow'
	};
	
	fetch(`https://gtk-sp.ru/products?
			id=${respData[0]}&
			name=${respData[1]}&
			description=${respData[2]}&
			emoji_id=${respData[3].toString()}&
			category=${getId(respData[4])}&
			price=${respData[5].toString()}`, requestOptions)
		.then(() => location.reload())
		.catch(error => console.log('error', error));
	
}
function handleFormSubmit(event) {
	event.preventDefault()
	serializeForm(applicantForm)
}

const applicantForm = document.getElementById('form')
applicantForm.addEventListener('submit', handleFormSubmit)

function delData(id) {
	var requestOptions = {
		method: 'DELETE',
		redirect: 'follow'
	};
	let conf = confirm("Вы точно хотите это удалить?");
	if (conf) {
		fetch(`https://gtk-sp.ru/products?id=${id}`, requestOptions)
			.then(() => location.reload())
			.catch(error => console.log('error', error));
	}
}

function editData(num) {
	modal.style.display = "block";
	dataForEdit = data[num];

	$("#id-form").attr("disabled", true)
	idForm.value = dataForEdit["id"]
	nameForm.value = dataForEdit["name"]
	descriptionForm.value = dataForEdit["description"]
	emojiIdForm.value = dataForEdit["emoji_id"]
	categoryForm.value = dataForEdit["category"]
	priceForm.value = dataForEdit["price"]
	textForm.innerHTML = "Изменение категории"
	buttonForm.innerHTML = "Изменить"
	isEdit = true;
}
