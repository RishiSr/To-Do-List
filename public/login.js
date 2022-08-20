
function check(){
  let username = getCookie("message");
  if (username != "") {
  document.getElementById("prompt").innerHTML="Wrong Credentials!!!";
  document.cookie = "message=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

}

}function getCookie(cname) {
  let name = cname + "=";
  let ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
check();