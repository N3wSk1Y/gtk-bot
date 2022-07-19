async function createTable() {
	async function makeRequest(url) {  
	    const resp = await fetch(url)
		return await resp.json();
	}
	data = await makeRequest('https://gtk-sp.ru/categories')
	console.log(data)

	let table = document.createElement('table');
	let thead = document.createElement('thead');
	let tbody = document.createElement('tbody');
	table.appendChild(thead);
	table.appendChild(tbody);

	let row_1 = document.createElement('tr');
	let heading_0 = document.createElement('th');
	heading_0.innerHTML = "";
	let heading_1 = document.createElement('th');
	heading_1.innerHTML = "Идентификатор";
	let heading_2 = document.createElement('th');
	heading_2.innerHTML = "Название категории";
	let heading_3 = document.createElement('th');
	heading_3.innerHTML = "Описание";
	let heading_4 = document.createElement('th');
	heading_4.innerHTML = "Emoji ID";
	let heading_5 = document.createElement('th');
	heading_5.innerHTML = "<button class='add' onclick='addRow()'>Добавить</button>";
	row_1.appendChild(heading_0);
	row_1.appendChild(heading_1);
	row_1.appendChild(heading_2);
	row_1.appendChild(heading_3);
	row_1.appendChild(heading_4);
	row_1.appendChild(heading_5);
	thead.appendChild(row_1);

	for (let i = 0; i < data.length; i++) {
		let newRow = document.createElement('tr');
		let newRowData_0 = document.createElement('td');
		let disUp = ' ';
		let disDown = ' ';
		switch (i){
			case 0:
				disUp = "disabled"
				break
			case data.length-1:
				disDown = "disabled"
				break
		}
		let buttons = `<button class="arrow" id="up" onclick="replaceData('${data[i]["id"]}', -1)" ${disUp}>
		<span class="material-symbols-outlined">
		expand_less
		</span></button><h4>${data[i]["order_id"]}</h4><button class="arrow" id="down" onclick="replaceData('${data[i]["id"]}', 1)" ${disDown}>
		<span class="material-symbols-outlined">
		expand_more
		</span></button>`;
		newRowData_0.innerHTML = buttons
		newRowData_0.classList.add("no-border");
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
		newRowData_5.innerHTML = `<button class='edit' onclick='editData(${i})'>Изменить</button><button class='delete' onclick='delData("${data[i]["id"]}")'>Удалить</button>`
		newRowData_5.classList.add("no-border");

		newRow.appendChild(newRowData_0);
		newRow.appendChild(newRowData_1);
		newRow.appendChild(newRowData_2);
		newRow.appendChild(newRowData_3);
		newRow.appendChild(newRowData_4);
		newRow.appendChild(newRowData_5);
		tbody.appendChild(newRow);
	}
	
	document.getElementById('content').appendChild(table);
}
window.onload = function(){
   const cont = document.getElementById('content')
   createTable()
};

let modal = document.getElementById("myModal");
let span =  document.getElementsByClassName("close")[0];
let warning = document.getElementById('warning')
let textForm = document.getElementById("addText");
let buttonForm = document.getElementById("submit-form");
let isEdit = true;

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
	
	fetch(`https://gtk-sp.ru/categories?id=${respData[0]}&name=${respData[1]}&description=${respData[2]}&emoji_id=${respData[3].toString()}`, requestOptions)
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
		fetch(`https://gtk-sp.ru/categories?id=${id}`, requestOptions)
			.then(() => location.reload())
			.catch(error => console.log('error', error));
	}
}

function editData(num) {
	modal.style.display = "block";
	dataForEdit = data[num];

	let idForm = document.getElementById("id-form");
	let nameForm = document.getElementById("name-form");
	let descriptionForm = document.getElementById("description-form");
	let emojiIdForm = document.getElementById("emoji_id-form");
	$("#id-form").attr("disabled", true)
	idForm.value = dataForEdit["id"]
	nameForm.value = dataForEdit["name"]
	descriptionForm.value = dataForEdit["description"]
	emojiIdForm.value = dataForEdit["emoji_id"]
	textForm.innerHTML = "Изменение категории"
	buttonForm.innerHTML = "Изменить"
	isEdit = true;
}

function replaceData(id, pos) {
	const requestOptions = {
		method: 'PUT',
		redirect: 'follow'
	};
	
	fetch(`https://gtk-sp.ru/categories/order?id=${id}&direction=${pos}}`, requestOptions)
	.then(() => location.reload())
	.catch(error => console.log('error', error));
}