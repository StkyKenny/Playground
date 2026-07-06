
Can only have 1 context menu for each extension

When an extension contains more than one context menu, Chrome automatically collapses them into a single parent menu as shown here:
https://developer.chrome.com/docs/extensions/develop/ui/context-menu#:~:text=When%20an%20extension%20contains%20more,in%20the%20extension%20service%20worker



// THIS IS PROBLEMATIC due to small delay the lang Isn't the updated value
chrome.storage.session.onChanged.addListener(async (changes) => {
  const lastWordChange = changes["lastWord"];
  const langChange = changes["lang"];


    await chrome.storage.session.get("lang", ({ lang }) => {
    newLang = lang;
  });