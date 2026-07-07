console.log("This is a popup!");

console.log(chrome);
console.log(chrome.browserAction); // this one not work
console.log(chrome.runtime);
console.log(chrome.action);
console.log(chrome.contextMenus);

function ttsStart() {
  chrome.tts.stop();

  chrome.tts.speak("dummy text", {
    lang: "en-GB",
  });
}
document.getElementById("ttsBtn").addEventListener("click", ttsStart);

document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get("lastWord", (data) => {
    document.getElementById("output").textContent = data.lastWord || "Nothing selected yet";
  });
});
