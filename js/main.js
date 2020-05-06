const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");

cartButton.addEventListener("click", toggleModal);
close.addEventListener("click", toggleModal);

function toggleModal() {
  modal.classList.toggle("is-open");
}

const buttonAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeAuth = document.querySelector('.close-auth');
const logInForm = document.getElementById('logInForm');
const loginInput = document.getElementById('login');
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');
const loginWarning = document.querySelector('.login-warning');
const passwordWarning = document.querySelector('.password-warning');

let login = localStorage.getItem('userLogin');

function toggleModalAuth () {
  modalAuth.classList.toggle('is-open');
  loginInput.style.border = '';
  loginWarning.style.display = '';
  loginWarning.textContent = '';
}

function authorized() {
  console.log('авторизован');

  function logOut () {
    login = '';

    buttonAuth.style.display = '';
    userName.style.display = '';
    buttonOut.style.display = '';

    buttonOut.removeEventListener('click',logOut);
    localStorage.removeItem('userLogin')

    checkAuth();
  }

  buttonAuth.style.display = 'none';
  userName.textContent = login;
  userName.style.display = 'inline';
  buttonOut.style.display = 'block';
  buttonOut.addEventListener('click',logOut)
}
function notAuthorized() {

  console.log('не авторизован');

  function logIn (event) {
    event.preventDefault();
    login = loginInput.value;
    if (login) {
      toggleModalAuth();
      buttonAuth.removeEventListener('click', toggleModalAuth);
      closeAuth.removeEventListener('click',toggleModalAuth);
      logInForm.removeEventListener('submit',logIn);
      localStorage.setItem('userLogin',login)
      logInForm.reset();
      checkAuth();
    } else {
      loginInput.style.border = '1px solid red';
      loginWarning.style.display = 'inline-block';
      loginWarning.textContent = '!'
    }


  }

  buttonAuth.addEventListener('click', toggleModalAuth);
  closeAuth.addEventListener('click',toggleModalAuth);
  logInForm.addEventListener('submit',logIn);
}

function checkAuth() {
  if (login) {
    authorized()
  } else {
    notAuthorized()
  }
}

checkAuth();
