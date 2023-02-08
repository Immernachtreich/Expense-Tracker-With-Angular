// URL
const URL = 'http://localhost:5005';

// User Token
const token = localStorage.getItem('token');

// Variable Declarations
const reportTable = document.getElementById('report-table');

// ITEMS_PER_PAGE
const rowsSelect = document.getElementById('rows-select');

rowsSelect.addEventListener('change', () => {
    const ITEMS_PER_PAGE = rowsSelect.value;
    getExpenses(1, ITEMS_PER_PAGE);
})


/*
* Event Listeners 
*/
window.addEventListener('DOMContentLoaded', () => {
    getExpenses(1);
});

const reportDownloadButton = document.getElementById('download-report-button');
reportDownloadButton.addEventListener('click', downloadReport);

const returnHomeButton = document.getElementById('return-home-button');
returnHomeButton.onclick = () => {
    location.href = '../views/index.html';
}

const pastLinksButton = document.getElementById('past-links-button');
pastLinksButton.addEventListener('click', getPastLinks);

/*
* Event Listener Functions 
*/
async function getExpenses(pageNumber, ITEMS_PER_PAGE) {
    try {

        reportTable.innerHTML = 
            `<tr>
                <th>Date</th>
                <th>Amount</th>
                <th>Description</th>
                <th>Category</th>
             </tr>`
        
        if(ITEMS_PER_PAGE == null) {
            ITEMS_PER_PAGE = 5;
        }

        const response = await axios.get(
            URL + '/premium/get-report?page=' + pageNumber + '&rows=' + ITEMS_PER_PAGE,
            { headers: { 'Authorization': token } } 
        );

        response.data.expenses.forEach((expense) => {
            createTable(expense);
        });

        pagination(response.data);

    } catch(err) {
        popupNotification('Error', 'You are not a Premium User');
        
    }
}

async function downloadReport() {

    try {

        const response = await axios.get(
            URL + '/premium/download-report',
            { headers: { 'Authorization': token } }
        );

        const a = document.createElement('a');

        a.href = response.data.fileUrl;
        a.download = 'myexpense.csv';
        a.click();

    } catch(err) {

        popupNotification('Error', 'Something went wrong');
    }

}

async function getPastLinks() {
    try {

        const pastReports = await axios.get(
            URL + '/premium/past-reports',
            { headers: { 'Authorization': token } } 
        );
        
        const aDiv = document.createElement('div');

        aDiv.classList.add('report-links-div');

        pastReports.data.forEach((pastReport) => {
            const a = `<a href="${pastReport.fileUrl}" download class="report-download-links"> ${pastReport.fileName} </a>`;
            aDiv.innerHTML += a;
        });

        console.log(aDiv);
        popupNotification('Links', '', aDiv);

    } catch(err) {
        popupNotification('Error', `You are not a Premium User`);
        
    }
}

/*
* DOM Manipulation Functions 
*/

function createTable(expense) {

    const tr = 
        `<tr>
            <td> ${expense.createdAt} </td>
            <td> ${expense.expenseAmount} </td>
            <td> ${expense.description} </td>
            <td> ${expense.category} </td>
        </tr>`

    reportTable.innerHTML += tr;
}

/*
*  Other Function
*/

function pagination(data) {

    const ITEMS_PER_PAGE = rowsSelect.value;
    const pageButtonsDiv = document.getElementById('page-buttons-div');

    // Clearing existing buttons
    pageButtonsDiv.innerHTML = '';

    // Creating the previous Button if it exists
    if(data.hasPreviousPage) {
        const prevButton = document.createElement('button');

        prevButton.innerHTML = data.previousPage;

        prevButton.classList.add('page-buttons');

        prevButton.addEventListener('click', () => {
            getExpenses(data.previousPage, ITEMS_PER_PAGE);
        })

        pageButtonsDiv.appendChild(prevButton);
    }

    const currentButton = document.createElement('button');

    currentButton.innerHTML = data.currentPage;

    currentButton.classList.add('page-buttons');
    currentButton.classList.toggle('active');

    currentButton.addEventListener('click', () => {
        getExpenses(data.currentPage, ITEMS_PER_PAGE);
    })

    pageButtonsDiv.appendChild(currentButton);

    // Creating the next button if it exists
    if(data.hasNextPage) {
        const nextButton = document.createElement('button');

        nextButton.innerHTML = data.nextPage;

        nextButton.classList.add('page-buttons');

        nextButton.addEventListener('click', () => {
            getExpenses(data.nextPage, ITEMS_PER_PAGE);
        })

        pageButtonsDiv.appendChild(nextButton);
    }
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
    popupInnerDiv.removeChild(childNodes[1]);
}

function popupNotification(title, message, htmlTags) {

    popupContainer.classList.add('active');

    const headingH1 = document.createElement('h1');
    headingH1.append(document.createTextNode(title));

    const innerMessage = document.createElement('div');
    
    if(htmlTags) {
        innerMessage.appendChild(htmlTags);
    }
    else {
        innerMessage.append(document.createTextNode(message));
    }

    // <h1>Success</h1>
    // <p>${message}</p>

    popupInnerDiv.appendChild(headingH1);
    popupInnerDiv.appendChild(innerMessage);
}