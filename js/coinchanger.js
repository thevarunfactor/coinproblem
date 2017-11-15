/*Function to clear the screen each time the user hits enter or clicks Go*/
function clearResults() {
    let getTable = document.getElementById('outputTable');
    for (let i = 0; i < getTable.rows.length;) {
        getTable.deleteRow(i);
    }
    let clearError = document.getElementById('errorMessage');
    if (clearError) {
        clearError.display = "none";
        clearError.innerHTML = '';
        clearError.classList.remove("error");
    } 
}

/*Validate user input*/
function validateInput() {
    let errorDiv = document.getElementById('errorMessage');
    let amount = document.getElementById('coins').value.toLowerCase();
	amount=amount.replace(/^[0.]+/, "");
	let amountLength = amount.length-1;
	console.log('jkhjkhkh'+amount);
	/* 
	The following statements check for user input as per the detailed test cases listed in the 'testcases.xlsx' file
	*/
	if((amount.match(new RegExp("£", "g")) || []).length>1 || (amount.match(new RegExp("p", "gi")) || []).length>1) { 
		console.log('1');
		errorDiv.setAttribute("display", "block");
        errorDiv.setAttribute("class", "error");
        errorDiv.innerHTML = 'Please ensure that there is only one \'£\' and \'p\' symbol in the amount';
		return;
	} else if (amount[0] == '£' && amount[amountLength] == 'p') {
		console.log('2');
        amount = parseFloat(amount.substr(1).slice(0, -1),10);
        amount *= 100;
	} else if (amount[0] == 'p' && amount[amountLength]=='£') {
		console.log('3');
        errorDiv.setAttribute("display", "block");
        errorDiv.setAttribute("class", "error");
        errorDiv.innerHTML = 'Please put the \'£\' symbol at the beginning and  \'p\' symbol at the end of the amount';
        return;
		
    } else if (amount[amountLength] == 'p') {
		console.log('4');
        amount = parseFloat(amount.slice(0, -1));
		
    } else if (amount[amountLength] == '£') {
		console.log('5');
        amount = parseFloat(amount.slice(0, -1))*100; 
	
    } else if (amount[0] == 'p') {
		console.log('8');
        amount = parseFloat(amount.substr(1));
    } else if (amount[0] == '£') {
		console.log('9');
        amount = parseFloat(amount.substr(1)) * 100;		
    } else if (amount[0] != '£'&& amount[amountLength]!='£') {
		console.log('6');
		if(amount.includes('£')){
			errorDiv.setAttribute("display", "block");
			errorDiv.setAttribute("class", "error");
			errorDiv.innerHTML = 'Please put the \'£\' symbol at the beginning or end of the amount';
			return;
		}
    } else if(amount[amountLength]!='p'&&amount[0]!='p') {
		if(amount.includes('p')) {
			errorDiv.setAttribute("display", "block");
			errorDiv.setAttribute("class", "error");
			errorDiv.innerHTML = 'Please put the \'p\' symbol at the beginning or end of the amount';
			return;
		}
    } 
	if (amount<=0) {
        errorDiv.setAttribute("display", "block");
        errorDiv.setAttribute("class", "error");
        errorDiv.innerHTML = 'Invalid input. Please enter only positive numbers greater than 0';
        return;
    } 
	if (isNaN(amount)) {
        errorDiv.setAttribute("display", "block");
        errorDiv.setAttribute("class", "error");
        errorDiv.innerHTML = 'Invalid input. Please enter only numbers, \'£\' or \'p\'';
        return;
    }
	if(amount>Number.MAX_SAFE_INTEGER){
		errorDiv.setAttribute("display", "block");
        errorDiv.setAttribute("class", "error");
        errorDiv.innerHTML = 'Please enter a smaller number!';
		return;
	}
    changeMaker(amount);

}

function changeMaker(amount) {
    let dArray = [200, 100, 50, 20, 10, 5, 2, 1];
    let displayArray = ["£2", "£1", "50p", "20p", "10p", "5p", "2p", "1p"];
    let j = 0;
    let newValue;
    let resultArray = new Array();
    let divOutput = document.getElementById('output');
	/*LOGIC
	Loop through all the denominations, highest to lowest.
	On each iteration, divide the amount by the denomination and store the quotient. This is the no. of coins of that denomination that we require. 
	Now, we need to account for the remaining amount, that is, the remainder from the previous division.
	So we make the remainder the new amount and continue with the iterations until the remainder becomes 0.
	We store in the resultArray the denomination and the no. of coins of that denomination we require.
	*/
    for (let i = 0; i < dArray.length; i++) {
        if (amount >= dArray[i]) {
            resultArray[j] = displayArray[i];
            resultArray[j + 1] = parseInt(amount / dArray[i],10);
            j += 2;
        }
        amount = amount % dArray[i];
    }
    populateTable(resultArray);
}

function populateTable(resultArray) {
	/*
	Manipulating DOM by adding table elements on the fly because the table elements are not fixed.
	*/
    let getTable = document.getElementById('outputTable');
    let col = document.createElement("col");
    let tr = document.createElement("tr");
    let td1 = document.createElement("th");
    let txt1 = document.createTextNode("Coin type");
    let td2 = document.createElement("th");
    let txt2 = document.createTextNode("No. of coins");
    td1.appendChild(txt1);
    td2.appendChild(txt2);
    tr.appendChild(td1);
    tr.appendChild(td2);
    getTable.appendChild(col);
    getTable.appendChild(tr);
    for (i = 0; i < resultArray.length; i += 2) {
        let tr = document.createElement("tr");
        let td1 = document.createElement("td");
        let txt1 = document.createTextNode(resultArray[i]);
        let td2 = document.createElement("td");
        let txt2 = document.createTextNode(resultArray[i + 1]);
        td1.appendChild(txt1);
        td2.appendChild(txt2);
        tr.appendChild(td1);
        tr.appendChild(td2);
        getTable.appendChild(tr);
    }
}