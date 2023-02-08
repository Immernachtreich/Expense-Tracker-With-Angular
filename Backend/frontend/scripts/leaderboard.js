// URL
const URL = 'http://localhost:5005';

//Checking if user token exists
const token = localStorage.getItem('token');

if(!token) {
    window.location.href = '../views/login.html';
}


window.addEventListener('DOMContentLoaded', retrieveUsersFromDatabase);

const returnHomeButton = document.getElementById('return-home-button');
returnHomeButton.onclick = () => {
    location.href = '../views/index.html';
}

async function retrieveUsersFromDatabase() {

    const users = await axios.get(URL + '/leaderboard/get-users');

    const mainLeaderboardList = document.getElementById('main-ordered-list');

    users.data.forEach((user) => {
        const li = 
        `
            <li class="leaderboard-li">

                <div class="list-text-div">
                    ${user.username}
                </div>

                <div class="leaderboard-button-div">
                    <button class="view-expenses-button" onclick="getUserExpenses('${user._id}')"> 
                    View Expenses 
                    </button>
                </div>

            </li>
        `
        mainLeaderboardList.innerHTML += li;
    })
}

async function getUserExpenses(userId) {

    console.log(userId)
    const expenses = await axios.get(
        URL + '/leaderboard/get-user-expenses',
        { headers: { 'userId': userId } }
    );
    
    const expenseUl = document.getElementById('user-expense-list');
    
    let ul = ``;
    
    expenses.data.forEach((expense) => {
        
        const li =
            `
                <li class="user-expense-list">
                    <div class="user-expense-list-text-div">
                    ${expense.expenseAmount} - ${expense.description} - ${expense.category}
                    </div>
                </li>
            `
        ul += li;
    });

    popupNotification(ul);
}

/*
* Popup Notification
*/
const close = document.getElementById('close');
const popupContainer = document.getElementById('popup-container');
const popupInnerDiv = document.getElementById('popup-inner-div');

close.addEventListener('click', closePopup);

function closePopup() {

    popupContainer.classList.remove('active');

    const childNodes = popupInnerDiv.children;

    popupInnerDiv.removeChild(childNodes[1]);
}

function popupNotification(message) {

    popupContainer.classList.add('active');

    // const headingH1 = document.createElement('h1');
    // headingH1.append(document.createTextNode(title));

    // const innerMessage = document.createElement('p');
    // innerMessage.append(document.createTextNode(message));

    // // <h1>Success</h1>
    // // <p>${message}</p>

    // popupInnerDiv.appendChild(headingH1);
    // popupInnerDiv.appendChild(innerMessage);

    const ul = document.createElement('ul');
    ul.innerHTML += message;

    popupInnerDiv.appendChild(ul);
}