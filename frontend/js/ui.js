document.addEventListener("DOMContentLoaded", () => {
  const loginSection = document.getElementById("loginSection");
  const registerSection = document.getElementById("registerSection");
  const btnShowRegister = document.getElementById("btnShowRegister");
  const btnShowLogin = document.getElementById("btnShowLogin");

  btnShowRegister.addEventListener("click", () => {
    loginSection.classList.add("d-none");
    registerSection.classList.remove("d-none");
  });

  btnShowLogin.addEventListener("click", () => {
    registerSection.classList.add("d-none");
    loginSection.classList.remove("d-none");
  });
});
