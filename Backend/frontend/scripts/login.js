// URL
const URL = 'http://localhost:5005';

// Main Form
const mainForm = document.getElementById('Main-Form');

// Input fields
const email = document.getElementById('Email-Input');
const password = document.getElementById('Password-Input');

mainForm.addEventListener('submit', onSubmit);

function onSubmit(e) {

    e.preventDefault();

    if(email.value.trim() === '' || password.value.trim() === '') {

        popupNotification('Caution', 'Please Enter all the fields')

    } 
    else {
        
        loginUser();
    }  
}

async function loginUser() {

    const userDetails = {
        email: email.value,
        password: password.value
    }

    try{
        const response = await axios.post(URL+ '/user/login', userDetails);
        
        localStorage.setItem('token', response.data.token);

        location.href = '../views/index.html';

    }
    catch(err) {
        
        if(err.response.status === 401) {
            
            popupNotification('Failed', 'Wrong Password')
        }

        if(err.response.status === 404) {
            
            popupNotification('Failed','User Not Found');
        }
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