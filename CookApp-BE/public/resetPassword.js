const newPasswordInput = document.getElementById("new-password");
const confirmPasswordInput = document.getElementById("confirm-password");
const submitButton = document.getElementById("submit");
const loginForm = document.getElementById("login-form");
const showNewPasswordBtn = document.getElementById("toggle-new-password");
const showConfirmPasswordBtn = document.getElementById(
  "toggle-confirm-password"
);
const loginPage = document.getElementById("login-page");
const successPage = document.getElementById("success-page");

const username = document.getElementById("username").value;
const token = document.getElementById("token").value;

submitButton.disabled = true;

const onSuccess = () => {
  loginPage.classList.add("hide");
  successPage.classList.remove("hide");
};

const onError = (msg) => {
  const errMsg = document.getElementById("fail-msg");
  errMsg.classList.add("is-error");
  errMsg.textContent = msg;
  setTimeout(() => {
    errMsg.classList.remove("is-error");
    errMsg.textContent = "";
  }, 4000);
};

const callResetPassword = (url) => {
  fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      token,
      newPassword: newPasswordInput.value,
    }),
  })
    .then((data) => data.json())
    .then((response) => {
      if (response.meta.ok) {
        onSuccess();
      } else throw new Error("Reset password fail\nPlease try again later");
    })
    .catch((err) => {
      onError(err.message);
    });
};

const setError = (isError) => {
  const errMsg = document.getElementById("error-message");
  if (isError) {
    errMsg.classList.add("is-error");
  } else {
    errMsg.classList.remove("is-error");
  }
};

const showPassword = (x) => {
  if (x.type === "password") {
    x.type = "text";
  } else {
    x.type = "password";
  }
};

showNewPasswordBtn.addEventListener("click", () => {
  showPassword(newPasswordInput);
  if (newPasswordInput.type === "password") {
    showNewPasswordBtn.classList.remove("fa-eye-slash");
    showNewPasswordBtn.classList.add("fa-eye");
  } else {
    showNewPasswordBtn.classList.remove("fa-eye");
    showNewPasswordBtn.classList.add("fa-eye-slash");
  }
});

showConfirmPasswordBtn.addEventListener("click", () => {
  showPassword(confirmPasswordInput);
  if (confirmPasswordInput.type === "password") {
    showConfirmPasswordBtn.classList.remove("fa-eye-slash");
    showConfirmPasswordBtn.classList.add("fa-eye");
  } else {
    showConfirmPasswordBtn.classList.remove("fa-eye");
    showConfirmPasswordBtn.classList.add("fa-eye-slash");
  }
});

const onPasswordInputChange = () => {
  const newPass = newPasswordInput.value;
  const confirmPass = confirmPasswordInput.value;
  setError(newPass !== confirmPass);
  if (newPass !== confirmPass) submitButton.disabled = true;
  else submitButton.disabled = false;
};

newPasswordInput.addEventListener("input", onPasswordInputChange);
confirmPasswordInput.addEventListener("input", onPasswordInputChange);

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const callbackUrl = loginForm.action;
  callResetPassword(callbackUrl);
});
