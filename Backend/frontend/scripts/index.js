// URL
const URL = 'http://localhost:5005';

// Main Form
const mainForm = document.getElementById('Main-Form');

// Three input fields
const expenseAmount = document.getElementById('Expense-Amount-Input');
const description = document.getElementById('Description-Input');
const category = document.getElementById('Category-Input');

// Main Display List
const mainList = document.getElementById('Main-List');

// Edit true or false var
let edit = [false, ''];

//Checking if user token exists
const token = localStorage.getItem('token');

if(!token) {
    window.location.href = '../views/login.html';
}

/* 
* ------ Event Listeners ------
*/

window.addEventListener('DOMContentLoaded', () => {
    retrieveFromDatabase(1);
});

mainForm.addEventListener('submit', onSubmit);


/* 
* ------ Event Functions ------
*/


function onSubmit(e) {

    e.preventDefault();

    if(expenseAmount.value.trim() === '' || description.value.trim() === '' || category.value.trim() === '') {
        popupNotification('Error','Please Enter All The Fields');
    } else if(edit[0]){

        // Editing the existing details
        editToDatabase(edit[1]);

        // Clearing the fields
        clearFields();
    } else {
        // Storing to local Storage and creating new list
        storeToDatabase();

        // Clearing the fields
        clearFields();
    }
}

async function editItem(e) {

    e.preventDefault()


    // Accessing the list
    let li = e.target.parentElement.parentElement;
    let url = URL+ '/expenses/edit-expense/' + li.id;

    try{
        let response = await axios.get(url);
        // Changing input values to the list values
        expenseAmount.value = response.data.expenseAmount;
        description.value = response.data.description;
        category.value = response.data.category;

        // Removing the list
        mainList.removeChild(li);

        // Changing edit variable
        edit = [true, url];

    } catch(err) {
        console.log(err);
    }
}

async function deleteItem(e) {

    e.preventDefault();

    // Accessing the list
    let li = e.target.parentElement.parentElement;

    let url = URL+ '/expenses/delete-expense/' + li.id;

    try {

        await axios.post(url,'',{ headers: { 'Authorization': token } });

        // Removing From screen
        mainList.removeChild(li);

    } catch(err) {

        if(err.response.status === 401) {
            popupNotification('Error', 'You are not authorized');
        }
        
        console.log(err);
    }
}


/* 
* ------ Storing, Editing and Retrieving Functions ------
*/


async function storeToDatabase() {

    // Storing expense details in an object
    let expenseDetails = {
        expenseAmount: expenseAmount.value,
        description: description.value,
        category: category.value
    }

    // Storing to crud crud
    try{
        await axios.post(
            URL+ '/expenses/add-expense',
            expenseDetails,
            { headers: { 'Authorization': token } }
        );
        retrieveFromDatabase(1);
        
    } catch(err) {
        if(err.response.status === 401) {
            localStorage.removeItem('token');
            location.href = '../views/login.html';
        }
        console.log(err);
    }
}

async function retrieveFromDatabase(pageNumber) {

    try {
        mainList.innerHTML = '';

        const response = await axios.get(
            URL+ '/expenses/get-expenses/?page=' + pageNumber,
            { headers: { 'Authorization': token } } 
        );

        if(response.data.isPremium === true) {
            activatePremiumFeatures();
        }

        response.data.expenses.forEach((data) => {
            createList(data);
        });

        pagination(response.data);

    } catch(err) {
        if(err.response.status === 401) {
            localStorage.removeItem('token');
            location.href = '../views/login.html';
        }
        console.log(err);
    }
}

async function editToDatabase(url) {
    
    // Making the new Object
    let expenseDetails = {
        expenseAmount: expenseAmount.value,
        description: description.value,
        category: category.value
    }

    // Making edit false for next user
    edit = [false, ''];

    try{
        await axios.post(url, expenseDetails);

        let response = await axios.get(url);
        createList(response.data);

    } catch(err) {
        console.log(err);
    }
    
}

/* 
* ------ Create Functions ------
*/


function createList(data) {

    // Creating an empty li
    let li = document.createElement('li');

    // Creating edit and delete buttons;
    let editButton = createEditButton();
    let deleteButton = createDeleteButton();

    // Creating buttons div where all the buttons are contained
    const buttonsDiv = document.createElement('div');
    buttonsDiv.classList.add('buttons-div');
    buttonsDiv.appendChild(editButton);
    buttonsDiv.appendChild(deleteButton);

    // Creating a Div for Text
    const textDiv = document.createElement('div');
    textDiv.classList.add('list-text-div');
    textDiv.append(document.createTextNode(
        `${data.expenseAmount} - ${data.description} - ${data.category}`
    ));

    // Assinging the description as id for list
    li.id = data._id;
    li.className = 'Expense-List';

    // Adding edit and delete buttons to the list
    li.appendChild(textDiv);
    li.appendChild(buttonsDiv);
    
    // Adding the list to the main list
    mainList.appendChild(li);
}

function createEditButton() {

    // Creating the button
    let editButton = document.createElement('button');

    // Adding Class Name
    editButton.className = 'Edit-Button';
    
    // Adding event listener 
    editButton.onclick = editItem;
    // Adding Text
    editButton.append(document.createTextNode('Edit'));

    return editButton;
}

function createDeleteButton() {

    // Creating the button
    let deleteButton = document.createElement('button');

    // Adding class to the button
    deleteButton.className = 'Delete-Button';

    // Adding event listener
    deleteButton.onclick = deleteItem;

    // Adding Text to the button
    deleteButton.append(document.createTextNode('Delete'));

    return deleteButton;
}

/*
* --- Other Functions ---
*/
function clearFields() {

    expenseAmount.value = '';
    description.value = '';
}

const close = document.getElementById('close');
const popupContainer = document.getElementById('popup-container');
const popupInnerDiv = document.getElementById('popup-inner-div');

close.addEventListener('click', closePopup);

function closePopup() {

    popupContainer.classList.remove('active');

    const childNodes = popupInnerDiv.children;

    popupInnerDiv.removeChild(childNodes[1]);
    popupInnerDiv.removeChild(childNodes[1]);
}

function popupNotification(title, message) {

    popupContainer.classList.add('active');

    const headingH1 = document.createElement('h1');
    headingH1.append(document.createTextNode(title));

    const innerMessage = document.createElement('p');
    innerMessage.append(document.createTextNode(message));

    // <h1>Success</h1>
    // <p>${message}</p>

    popupInnerDiv.appendChild(headingH1);
    popupInnerDiv.appendChild(innerMessage);

}

function pagination(data) {

    const pageButtonsDiv = document.getElementById('page-buttons-div');

    // Clearing existing buttons
    pageButtonsDiv.innerHTML = '';

    // Creating the previous Button if it exists
    if(data.hasPreviousPage) {
        const prevButton = document.createElement('button');

        prevButton.innerHTML = data.previousPage;

        prevButton.classList.add('page-buttons');

        prevButton.addEventListener('click', () => {
            retrieveFromDatabase(data.previousPage);
        })

        pageButtonsDiv.appendChild(prevButton);
    }

    const currentButton = document.createElement('button');

    currentButton.innerHTML = data.currentPage;

    currentButton.classList.add('page-buttons');
    currentButton.classList.toggle('active');

    currentButton.addEventListener('click', () => {
        retrieveFromDatabase(data.currentPage);
    })

    pageButtonsDiv.appendChild(currentButton);

    // Creating the next button if it exists
    if(data.hasNextPage) {
        const nextButton = document.createElement('button');

        nextButton.innerHTML = data.nextPage;

        nextButton.classList.add('page-buttons');

        nextButton.addEventListener('click', () => {
            retrieveFromDatabase(data.nextPage);
        })

        pageButtonsDiv.appendChild(nextButton);
    }
}

/*
* Header Button and Features 
*/
const logoutButton = document.getElementById('logout-button');

logoutButton.onclick = (e) => {
    localStorage.removeItem('token');
    location.href = '../views/login.html';
}

const leaderboardButton = document.getElementById('leaderboard-button');

leaderboardButton.onclick = (e) => {
    location.href = '../views/leaderboard.html';
}

const reportButton = document.getElementById('generate-report-button');

reportButton.onclick = (e) => {
    location.href = '../views/report.html';
}

/*
* Premium Mode Features
*/

const toggle = document.getElementById('toggle');
const toggleDarkModeDiv = document.getElementById('toggle-dark-mode-div');

toggle.addEventListener('change', (e) => {
    document.body.classList.toggle('dark', e.target.checked);
});

function activatePremiumFeatures() {
    
    toggleDarkModeDiv.style.display = '';

    buyPremium.style.display = 'none';
    leaderboardButton.style.display = '';
    reportButton.style.display='';
}

/*
* Razor Pay Functions
 */

const buyPremium = document.getElementById('buy-premium-button');

buyPremium.onclick = async function (e) {


    const response = await axios.post(
        URL+ '/premium/get-premium',
        '',
        { headers: { 'Authorization': token } }
    );
    
    const options = {

        "key": response.data.key_id, // Enter the Key ID generated from the Dashboard
        "amount": "10000", // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        "currency": "INR",

        "name": "Expense Tracker Corporation",
        "description": "Test Transaction",

        "order_id": response.data.orderId,

        // Callback function on successful payment
        "handler": async function (response){
             
            try {

                const transactionStatus = await axios.post(
                    URL+ '/premium/transaction-status',
                    {
                        orderId: response.razorpay_order_id,
                        paymentId: response.razorpay_payment_id
                    },
                    { headers: { 'Authorization': token } }
                );
                
                activatePremiumFeatures();
                popupNotification('Success', transactionStatus.data.message);

            } catch (err) {
                window.alert('Error: Payment Failed');
            }
        },

        "prefill": {
            "name": "Test User",
            "email": "testuser@gmail.com",
            "contact": "810878886"
        },

        "theme": {
            "color": "#3399cc"
        }
    };

    // Configuring rzp API
    const rzp = new Razorpay(options);

    // To open razorPay window
    rzp.open();
    e.preventDefault();

    // On payment Failed
    rzp.on('payment.failed', function (response){

        window.alert('Error: Payment Failed');
    });

}