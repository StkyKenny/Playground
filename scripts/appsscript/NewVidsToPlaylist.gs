function getLastRowCol(sheet, column) {
  let lastRow = 1;
  while (sheet.getRange(lastRow, column).getValue().trim().toLowerCase() != "") {
    lastRow += 1;
  }
  return lastRow;
}

function youtubeDurationToSeconds(duration) {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);

  const hours = parseInt(match[1] || 0, 10);
  const minutes = parseInt(match[2] || 0, 10);
  const seconds = parseInt(match[3] || 0, 10);

  console.log(hours * 3600 + minutes * 60 + seconds);
  return hours * 3600 + minutes * 60 + seconds;
}

function myFunction() {
  var spreadsheetID = "123123123123123123123123123123";
  var playlistID = "123123123123123123123123123123-123123123123123123123123123123";

  var maxVideosToCheck = 10;

  var sheet = SpreadsheetApp.openById(spreadsheetID).getSheetByName("Main Sheet");
  var lr = sheet.getLastRow();

  for (var i = 3; i <= lr; i++) {
    var channelId = sheet.getRange(i, 3).getValue();
    if (channelId.trim().toLowerCase() == "") {
      continue;
    }
    var channelName = sheet.getRange(i, 2).getValue();
    var rejectShorts = "no" == sheet.getRange(i, 5).getValue().toString().toLowerCase().trim();
    var shortsThreshold = 3 * 60; // I consider shorts on this channel are videos not lasting longer than 3 mins.

    Logger.log(sheet.getRange(i, 2).getValue());
    /*
    // OLDER APPROACH : API IS BUGGED DOESNT WORK
    var results = YouTube.Search.list('id,snippet', {
        channelId: channelId,
        maxResults: maxVideosToCheck,    
        order: "date" // Seems like this is not working //TODO // YOUTUBE API PROBLEM SEE https://issuetracker.google.com/issues/35172972 
        // Doesn't order correctly and randomly take vid
      });
    */

    var channelUploadPlaylist = channelId[0] + "U" + channelId.slice(2);
    var results = YouTube.PlaylistItems.list("snippet,contentDetails", {
      maxResults: 10,
      playlistId: channelUploadPlaylist,
    });

    var resultIds = results.items.map((item) => item.snippet.resourceId.videoId);
    var videoDetails = YouTube.Videos.list("contentDetails", { id: resultIds }); // Can't fetch duration from the previous API, so I had to call this new endpoint
    // Example output of this api endpoint
    /*
    	{ id: 'XXXXXX',
        snippet: 
        { description: '',
        title: 'xxxxxxxxxxxxxxxxxxxxxxxx',
        categoryId: '25',
        publishedAt: '2026-01-31T14:53:57Z',
        localized: 
          { title: 'xxxxxxxxxxxxxxxxxxxxxxxx',
            description: '' },
        defaultLanguage: 'fr',
        defaultAudioLanguage: 'fr',
        channelTitle: 'XXXXXXXXXXX',
        liveBroadcastContent: 'none',
        thumbnails: 
          { standard: [Object],
            high: [Object],
            default: [Object],
            medium: [Object],
            maxres: [Object] },
        channelId: 'XXXXXXXXXXXX' },
      contentDetails: 
      { contentRating: {},
        licensedContent: true,
        dimension: '2d',
        duration: 'PT57S',
        projection: 'rectangular',
        definition: 'hd',
        caption: 'false' },
      etag: 'XXXXXXXXXXXXXX',
      kind: 'youtube#video' }
    */

    var watchedVideosSheet2 = SpreadsheetApp.openById(spreadsheetID).getSheetByName("WatchedVid2.0");

    // Search for the column of watched videos related to correct channel id instead of watched ids of all
    var watchedVideosSheetLC = watchedVideosSheet2.getLastColumn();
    var foundColumn = false;
    var currentColumn = -1;

    for (var k = 1; k <= watchedVideosSheetLC; k++) {
      if (watchedVideosSheet2.getRange(2, k).getValue() == channelId) {
        currentColumn = k;
        foundColumn = true;
        break;
      }
    }

    // Automatically create a column for each new channel
    if (!foundColumn) {
      watchedVideosSheet2.getRange(1, watchedVideosSheetLC + 1).setValue(channelName);
      watchedVideosSheet2.getRange(2, watchedVideosSheetLC + 1).setValue(channelId);
      currentColumn = watchedVideosSheetLC + 1;
      console.info("added new column for " + channelName + " of Id : " + channelId);
    }

    var watchedVideosSheet2LR = getLastRowCol(watchedVideosSheet2, currentColumn);

    // Optimisation trim down the "watched list"
    let count = 256;
    let additionalBuffer = 64; // To not run this clear each time i add over the threshold
    if (watchedVideosSheet2LR > count + additionalBuffer) {
      const lastRows = watchedVideosSheet2.getRange(watchedVideosSheet2LR - count, currentColumn, count, 1).getValues();

      watchedVideosSheet2.getRange(4, currentColumn, count, 1).setValues(lastRows);
      console.info("Optimized watched vids");
      // Empty from threshold to last
      watchedVideosSheet2.getRange(count, currentColumn, watchedVideosSheet2LR, 1).clearContent();
    }


    // LOOP Each Video

    for (var j = 0; j < maxVideosToCheck; j++) {
      try {
        Logger.log(results.items[j].snippet.title + " ---  " + results.items[j].snippet.publishedAt);

        // Don't add already added
        var alreadyAdded = false;

        for (var k = 1; k <= watchedVideosSheet2LR; k++) {
          if (
            watchedVideosSheet2
              .getRange(k, currentColumn)
              .getValue()
              .indexOf(results.items[j].snippet.resourceId.videoId) > -1
          ) {
            Logger.log("vid already added");
            alreadyAdded = true;
            break;
          }
        }

        if (!alreadyAdded) {
          //var details = {videoId: results.items[j].id.videoId,kind: 'youtube#video'}; // OLDER API
          var details = {
            videoId: results.items[j].snippet.resourceId.videoId,
            kind: "youtube#video",
          };
          if (rejectShorts) {
            let durationCheck =
              shortsThreshold > youtubeDurationToSeconds(videoDetails.items[j].contentDetails.duration);
            console.log(rejectShorts && durationCheck);
            if (durationCheck) {
              console.info("skipped duration SHORT-checked");
              continue;
            }
          }
          var resource = {
            snippet: { playlistId: playlistID, resourceId: details },
          };
          try {
            Logger.log(
              "Adding this video : " +
                results.items[j].snippet.title +
                " ---- " +
                results.items[j].snippet.resourceId.videoId,
            );
            Logger.log(resource);
            YouTube.PlaylistItems.insert(resource, "snippet");
            //Problem with video added duplicate, api problem ? seems like https://stackoverflow.com/questions/70759657/youtube-data-api-playlistitems-list-returns-duplicated-entries-and-hide-other

            /*Example ressource required to add to playlist
            { snippet:  
            { playlistId: 'XXXXXXXXXXXXXXXX',
            resourceId: { videoId: 'gxxxxD6zk', kind: 'youtube#video' } } }
              */

            //Adding to the sheet "Watched Videos" for checking if that video is added or not
            console.log(watchedVideosSheet2LR);
            console.log(results.items[j].snippet.resourceId.videoId);
            watchedVideosSheet2
              .getRange(watchedVideosSheet2LR, currentColumn)
              .setValue(results.items[j].snippet.resourceId.videoId);
            //.setValue(results.items[j].id.videoId);
            watchedVideosSheet2LR += 1;

            console.log("ok");
          } catch (e) {
            Logger.log("failed inserting");
            Logger.log(e.toString());
          }
        }
      } catch (e) {
        console.error("myFunction() yielded an error: " + e);
        console.error("On this item :" + results.items[j]);
      }
    }

    sheet.getRange(i, 4).setValue(results.items[0].id.videoId);
  }
}
