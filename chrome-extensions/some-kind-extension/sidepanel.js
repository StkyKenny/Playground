const words = {
  Lorem:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam et malesuada velit. Sed accumsan eros eu mollis dignissim. Sed bibendum augue eget dui blandit, in aliquam mi sagittis. Cras molestie dictum ex sit amet laoreet. Ut laoreet elit quis lectus rutrum tempor. Suspendisse faucibus blandit nulla quis viverra. Nullam gravida dapibus erat, quis congue massa sagittis sed. In massa dui, iaculis sed massa vel, tempor malesuada nisl. Nulla facilisi. Morbi at vehicula justo. Nam risus justo, tincidunt at nunc quis, cursus commodo magna. Vivamus vel rutrum felis.",
  et: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam et malesuada velit. Sed accumsan eros eu mollis dignissim. Sed bibendum augue eget dui blandit, in aliquam mi sagittis. Cras molestie dictum ex sit amet laoreet. Ut laoreet elit quis lectus rutrum tempor. Suspendisse faucibus blandit nulla quis viverra. Nullam gravida dapibus erat, quis congue massa sagittis sed. In massa dui, iaculis sed massa vel, tempor malesuada nisl. Nulla facilisi. Morbi at vehicula justo. Nam risus justo, tincidunt at nunc quis, cursus commodo magna. Vivamus vel rutrum felis.",
};
console.log("Side panel loaded");
const defaultLang = "en-GB";

// First load
document.addEventListener("DOMContentLoaded", async () => {
  const data = await chrome.storage.session.get(["lastWord", "lang"]);

  updateDefinition(data.lastWord, data.lang || defaultLang);
});

chrome.storage.onChanged.addListener((changes) => {
  console.log("onChanged fired", changes);
  const lastWordChange = changes["lastWord"];
  console.log(changes);

  chrome.storage.session.get(["lang"], ({ lang }) => {
    updateDefinition(lastWordChange.newValue, lang || defaultLang);
  });
});

function updateDefinition(word, langDetected) {
  if (!word) return;

  document.body.querySelector("#select-a-word").style.display = "none";
  document.body.querySelector("#definition-lang").innerText = langDetected;
  document.body.querySelector("#definition-word").innerText = word;
  document.body.querySelector("#definition-text").innerText =
    words[word.toLowerCase()] ?? `Unknown word! Supported words: ${Object.keys(words).join(", ")}`;
}
