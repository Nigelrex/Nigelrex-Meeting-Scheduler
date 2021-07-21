function myFunction() {
  var CT = require("convert-time");
  let link;
  link = document.getElementById("ml").value;
  let time;
  time = document.getElementById("mt").value;
  if (typeof Storage !== "undefined") {
    localStorage.removeItem("meetingl");
    localStorage.removeItem("meetingt");
    var d = new Date();
    var c = d.toLocaleTimeString();
    const ttime = CT(time);
    localStorage.setItem("meetingt", ttime);
    localStorage.setItem("meetingl", link);
    const url = localStorage.getItem("meetingl");
    const interval = setInterval(function () {
      var dd = new Date();
      if (dd.toLocaleTimeString() >= localStorage.getItem("meetingt")) {
        localStorage.removeItem("meetingt");
        require("electron").shell.openExternal(url);
        localStorage.removeItem("meetingl");
        clearInterval(interval);
      }
    }, 1000);
  } else {
    document.getElementById("errortxt").innerText = "SORRY YOUR PC IS A POTATO";
  }
}
