async function createTable() {
	async function makeRequest(url) {  
	    const resp = await fetch(url)
		return await resp.json();
	}
	data = await makeRequest('https://gtk-sp.ru/products')
	console.log(data)

	let table = document.createElement('table');
	let thead = document.createElement('thead');
	let tbody = document.createElement('tbody');
	table.appendChild(thead);
	table.appendChild(tbody);

	let row_1 = document.createElement('tr');
	// let heading_0 = document.createElement('th');
	// heading_0.innerHTML = "";
	let heading_1 = document.createElement('th');
	heading_1.innerHTML = "Идентификатор";
	let heading_2 = document.createElement('th');
	heading_2.innerHTML = "Название категории";
	let heading_3 = document.createElement('th');
	heading_3.innerHTML = "Описание";
	let heading_4 = document.createElement('th');
	heading_4.innerHTML = "Emoji ID";
	let heading_5 = document.createElement('th');
	heading_5.innerHTML = "Категория";
	let heading_6 = document.createElement('th');
	heading_6.innerHTML = "Цена";
	let heading_7 = document.createElement('th');
	heading_7.innerHTML = "Enabled";
	let heading_8 = document.createElement('th');
	heading_8.innerHTML = "";
	// row_1.appendChild(heading_0);
	row_1.appendChild(heading_1);
	row_1.appendChild(heading_2);
	row_1.appendChild(heading_3);
	row_1.appendChild(heading_4);
	row_1.appendChild(heading_5);
	row_1.appendChild(heading_6);
	row_1.appendChild(heading_7);
	row_1.appendChild(heading_8);
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
		// let buttons = `<button class="arrow" id="up" onclick="replaceData('${data[i]["id"]}', -1)" ${disUp}>
		// <span class="material-symbols-outlined">
		// expand_less
		// </span></button><h4>${data[i]["order_id"]}</h4><button class="arrow" id="down" onclick="replaceData('${data[i]["id"]}', 1)" ${disDown}>
		// <span class="material-symbols-outlined">
		// expand_more
		// </span></button>`;
		// newRowData_0.innerHTML = buttons
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
		newRowData_5.innerHTML = data[i]["category_id"]
		let newRowData_6 = document.createElement('td');
		newRowData_6.innerHTML = data[i]["price"];
		let newRowData_7 = document.createElement('td');
		newRowData_7.innerHTML = data[i]["enabled"];
		let newRowData_8 = document.createElement('td');
		newRowData_8.innerHTML = `<button class='edit' onclick='editData(${i})'>Изменить</button><button class='delete' onclick='delData("${data[i]["id"]}")'>Удалить</button>`
		newRowData_8.classList.add("no-border");

		newRow.appendChild(newRowData_0);
		newRow.appendChild(newRowData_1);
		newRow.appendChild(newRowData_2);
		newRow.appendChild(newRowData_3);
		newRow.appendChild(newRowData_4);
		newRow.appendChild(newRowData_5);
		newRow.appendChild(newRowData_6);
		newRow.appendChild(newRowData_7);
		newRow.appendChild(newRowData_8);
		tbody.appendChild(newRow);
	}
	
	document.getElementById('content').appendChild(table);
}
window.onload = function(){
   const cont = document.getElementById('content')
   createTable()
};