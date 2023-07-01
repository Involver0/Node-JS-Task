console.log(document.cookie);
if (document.cookie === '' || !document.cookie.includes('token')) {
  window.location.replace('./login.html');
}
