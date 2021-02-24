var isOn = null;
window.onload = (event) => {
  let but = document.getElementById("toggler");
  let input = document.getElementById("input");
  let apply = document.getElementById("apply");
  but.innerHTML = "Turn dfgdfgdfgdgdoff";

  chrome.storage.local.get({"autoSaveOn":true, "timeOut":180}, function (result) {
    if (result.autoSaveOn === true) {
      but.classList.add("btn1");
      but.innerHTML = "Turn off";
      isOn = true;
    } else {
      but.classList.add("btn");
      but.innerHTML = "Turn on";
      isOn = false;
    }
   
    input.value = result.timeOut;

    but.addEventListener("click", (event) => {
      if (isOn) {
        but.classList.replace("btn1", "btn");
        but.innerHTML = "Turn on";
      } else {
        but.classList.replace("btn", "btn1");
        but.innerHTML = "Turn off";
      }
      isOn = !isOn;
      chrome.storage.local.set({ autoSaveOn: isOn }, function () {});
    });
  });

  apply.addEventListener("click", (event) => {
    chrome.storage.local.set({ timeOut: input.value }, function () {});
    alert("The page will be saved\n in every " + input.value + " second\n");
  });
};
