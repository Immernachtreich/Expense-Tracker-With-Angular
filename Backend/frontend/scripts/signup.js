// URL
const URL = 'http://localhost:5005';

// Main Form
const mainForm = document.getElementById('Main-Form');

// Three input fields
const username = document.getElementById('Username-Input');
const email = document.getElementById('Email-Input');
const password = document.getElementById('Password-Input');

mainForm.addEventListener('submit', onSubmit);

function onSubmit(e) {

    e.preventDefault();

    if(username.value.trim() === '' || email.value.trim() === '' || password.value.trim() === '') {

        popupNotification('Caution', 'Please Enter all the fields');

    } 
    else {
        
        storeUserToDatabase();

    }  
}

async function storeUserToDatabase() {

    const userDetails = {
        username: username.value,
        email: email.value,
        password: password.value
    }

    try{
        const response = await axios.post(URL + '/user/add-user', userDetails);
        
        if(response.data.alreadyExisting) {
            
            popupNotification('Error','Email Already Exists');
        }
        else{
            
            //popupNotification('Success', 'Successfully signed up');
            location.href = '../views/login.html';
        }
    }
    catch(err) {
        console.log(err);
    }
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