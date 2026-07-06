console.log('This is a popup!');

console.log(chrome);
console.log(chrome.browserAction); // this one not work
console.log(chrome.runtime); 
console.log(chrome.action);
console.log(chrome.contextMenus);

function ttsStart(){
    chrome.tts.stop();

  chrome.tts.speak("dummy text", {
        lang: "en-GB"
    });

      /*chrome.tts.speak("I am so strong  ", {
        lang: "en-GB"
    });*/
}
document.getElementById("ttsBtn").addEventListener("click", ttsStart);



const logBox = document.getElementById("log");

function log(...args) {
  const msg = args.map(a =>
    typeof a === "object" ? JSON.stringify(a, null, 2) : String(a)
  ).join(" ");

  const line = document.createElement("div");
  line.textContent = msg;

  logBox.appendChild(line);

  // auto-scroll
  logBox.scrollTop = logBox.scrollHeight;
}


document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get("lastWord", (data) => {
    document.getElementById("output").textContent =
      data.lastWord || "Nothing selected yet";
  });
});