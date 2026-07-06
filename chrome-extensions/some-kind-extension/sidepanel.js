const words = {
  Lorem:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam et malesuada velit. Sed accumsan eros eu mollis dignissim. Sed bibendum augue eget dui blandit, in aliquam mi sagittis. Cras molestie dictum ex sit amet laoreet. Ut laoreet elit quis lectus rutrum tempor. Suspendisse faucibus blandit nulla quis viverra. Nullam gravida dapibus erat, quis congue massa sagittis sed. In massa dui, iaculis sed massa vel, tempor malesuada nisl. Nulla facilisi. Morbi at vehicula justo. Nam risus justo, tincidunt at nunc quis, cursus commodo magna. Vivamus vel rutrum felis."
};

chrome.storage.session.onChanged.addListener(async (changes) => {
  const lastWordChange = changes["lastWord"];
  const langChange = changes["lang"];
  console.log("listen");
  console.log(langChange);
  console.log(changes);

  await chrome.storage.session.get("lang", ({ lang }) => {
    newLang = lang;
  });
  if (!lastWordChange) {
    return;
  }
  let newLang = "en";
  /*if (!langChange) {
 
});
  } else {
    
  newLang = langChange.newValue
  }*/

  updateDefinition(lastWordChange.newValue, newLang);
});
/*
chrome.storage.session.get("lastWord", ({ lastWord }) => {
  chrome.storage.session.get("lang", ({ lang }) => {
    updateDefinition(lastWord, lang);
  });
});*/

function updateDefinition(word, langDetected) {
  // If the side panel was opened manually, rather than using the context menu,
  // we might not have a word to show the definition for.
  if (!word) return;

  console.log("in update def");
  console.log(langDetected);
  console.log("-----------");
  chrome.tts.stop();

  chrome.tts.speak(word, {
    lang: "en-GB",
  });
  // Hide instructions.
  document.body.querySelector("#select-a-word").style.display = "none";

  // Show word and definition.
  document.body.querySelector("#definition-lang").innerText = langDetected;
  console.log(langDetected);
  document.body.querySelector("#definition-word").innerText = word;
  document.body.querySelector("#definition-text").innerText =
    words[word.toLowerCase()] ?? `Unknown word! Supported words: ${Object.keys(words).join(", ")}`;
}
