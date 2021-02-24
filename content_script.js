var isOn = null,
  timeOut = null;

window.onload = (event) => {
  chrome.storage.local.get(
    { autoSaveOn: true, timeOut: 180 },
    function (result) {
      timeOut = result.timeOut;
      if (result.autoSaveOn) {
        doJob();
      }
    }
  );
};

function doJob() {
  chrome.runtime.sendMessage({ greeting: "hello" }, function (response) {});
  setTimeout(doJob, timeOut * 1000);
}
