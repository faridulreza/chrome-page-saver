/**
MIT License

Copyright (c) [year] [fullname]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
**/



const mhtml = function () {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    console.log("okkk0");
    if (tabs && tabs.length) {
      console.log("okkk1");
      if (tabs[0] && tabs[0].url && tabs[0].url.indexOf("http") === 0) {
        console.log("okkk2");
        chrome.pageCapture.saveAsMHTML({ tabId: tabs[0].id }, (mhtml) => {
          var lastError = chrome.runtime.lastError;
          if (mhtml && lastError === undefined) {
            var blob = new Blob([mhtml], { type: "text/mhtml" });
            blob.text().then((text) => {
              var hostname = new URL(tabs[0].url).hostname;
              var filename = hostname.replace("www.", "").split(".")[0];
              download(
                beepBoop.convert(text).window.document.documentElement
                  .innerHTML,
                filename
              );
            });
          }
        });
      }
    }
  });
};

const mhtmlWithID = function (id, url) {
  console.log("h1");
  chrome.pageCapture.saveAsMHTML({ tabId: id }, (mhtml) => {
    console.log("h2");
    var lastError = chrome.runtime.lastError;
    if (mhtml && lastError === undefined) {
      console.log("h3");
      var blob = new Blob([mhtml], { type: "text/mhtml" });
      blob.text().then((text) => {
        var hostname = new URL(url).hostname;
        var filename = hostname.replace("www.", "").split(".")[0];
        download(
          beepBoop.convert(text).window.document.documentElement.innerHTML,
          filename
        );
      });
    }
  });
};

chrome.browserAction.onClicked.addListener(mhtml);

chrome.contextMenus.create({
  contexts: ["page"],
  title: "Save this page",
  onclick: mhtml,
});

function download(data, filename, type = "text/html") {
  var file = new Blob([data], { type: type });
  if (window.navigator.msSaveOrOpenBlob)
    // IE10+
    window.navigator.msSaveOrOpenBlob(file, filename);
  else {
    // Others
    var a = document.createElement("a"),
      url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log("dfsad");
  mhtmlWithID(sender.tab.id, sender.tab.url);

  sendResponse({ status: true });
});
