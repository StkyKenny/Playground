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

document
  .getElementById("ttsBtn")
  .addEventListener("click", () => ttsStart(document.getElementById("sampleText").value));

document.addEventListener("DOMContentLoaded", async () => {
  initializeVoiceButtons();
});

async function initializeVoiceButtons() {
  let voiceData = [];

  try {
    const response = await fetch("/voices_bank.json");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    voiceData = await response.json();
    voiceData.sort((a, b) => {
      return a.lang.localeCompare(b.lang);
    });
    console.log(voiceData);
    console.log("Successfully loaded", voiceData.length, "voices from voices_bank.json");
  } catch (error) {
    console.warn(`Failed to load JSON: ${error.message}. Using fallback array.`);
  }

  const container = document.getElementById("voiceButtons");
  voiceData.forEach((voice) => {
    const button = document.createElement("button");
    button.textContent = `🔊 ${voice.voiceName}`;

    button.onclick = async () => {
      const textToSpeak = document.getElementById("sampleText").value;

      chrome.tts.stop();
      chrome.tts.speak(textToSpeak, {
        lang: voice.lang,
        pitch: 1,
        rate: 1,
      });
    };
    container.appendChild(button);
  });
}
