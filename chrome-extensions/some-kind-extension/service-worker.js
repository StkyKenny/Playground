function setupContextMenu() {
  /*chrome.contextMenus.create({
    id: 'select-word',
    title: 'Select this',
    contexts: ['selection']
  });*/

  chrome.contextMenus.create({
    id: "define-word",
    title: "Define",
    contexts: ["selection"],
  });
}
let detector;

async function getDetector() {
  if (detector) {
    return detector;
  }

  if (!("LanguageDetector" in self)) {
    throw new Error("LanguageDetector API non supportée");
  }

  const availability = LanguageDetector.availability();

  if (availability === "unavailable") {
    throw new Error("LanguageDetector indisponible");
  }

  detector = await LanguageDetector.create({
    monitor(monitor) {
      monitor.addEventListener("downloadprogress", (e) => {
        console.log(`Téléchargement : ${Math.round(e.loaded * 100)}%`);
      });
    },
  });

  return detector;
}
chrome.runtime.onInstalled.addListener(async () => {
  setupContextMenu();
  try {
    await getDetector();
  } catch (e) {
    console.error(e);
  }
});

chrome.runtime.onStartup.addListener(async () => {
  try {
    await getDetector();
    console.log("LanguageDetector prêt");
  } catch (e) {
    console.error(e);
  }
});
chrome.contextMenus.onClicked.addListener( (data, tab) => {



  detector.detect(data.selectionText).then(async (detected) => {
    console.log(detected);
    detected.forEach((result) => {
      console.log(`${result.detectedLanguage}: ${result.confidence}`);
    });

const langDetected = detected[0].detectedLanguage;
   await chrome.storage.session.set({ lang: langDetected ,lastWord: data.selectionText});
    console.log("setted lang"); // "fr", "en", "es"
    console.log(langDetected); // "fr", "en", "es"
      chrome.sidePanel.open({ tabId: tab.id });

  });

  // Make sure the side panel is open.
  chrome.sidePanel.open({ tabId: tab.id });
    console.log("side openned"); 
});
