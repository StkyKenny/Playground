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

const defaultLang = "en-GB";
const supportedLanguages2 = {
  en: "en-GB",
  fr: "fr-FR",
};

const supportedLanguages = {
  en: "en-GB",
  es: "es-ES",
  fr: "fr-FR",
  de: "de-DE",
  it: "it-IT",
  pt: "pt-PT",
  ru: "ru-RU",
  zh: "zh-CN",
  ja: "ja-JP",
  ko: "ko-KR",
  und: defaultLang,
};

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
chrome.contextMenus.onClicked.addListener(async (data, tab) => {
  console.log("---------NEW CLICK---------------");

  await chrome.sidePanel.open({ tabId: tab.id });
  getDetector().then((detector) =>
    detector.detect(data.selectionText).then(async (detected) => {
      console.log(detected);
      /*detected.forEach((result) => {
      console.log(`${result.detectedLanguage}: ${result.confidence}`);
    });*/

      const langDetected = detected[0].detectedLanguage;
      console.log("Using this lang : " + langDetected); // "fr", "en", "es"
      chrome.tts.getVoices().then((detected) => {
        console.log(detected);
      });

      chrome.tts.stop();
      chrome.tts.speak(data.selectionText, {
        lang: supportedLanguages[langDetected] || defaultLang,
        pitch: 2,
        rate: 2,
      }); // pitch 2 or rate 2 for korean and chinese is fcked

      await chrome.storage.session.set({ lang: supportedLanguages[langDetected], lastWord: data.selectionText });
    }),
  );
});
