import {
  changeBasedOnPreference1,
} from "./options/options_of_something";

import removeElement from "./utilities/removeElement";
import { getStorage } from "./utilities/storage";
import throttle from "./utilities/throttle";

// Function to start MutationObserver
let mt; // Mutations timeout
export const observe = () => {
  const observer = new MutationObserver((mutationsList) => {
    if (!mutationsList.length) return;

    const runDocumentMutations = throttle(async () => {
      console.log(document);
      return;

      const data = await getStorage([
        "listsButton",
        "communitiesButton",
        "topicsButton",
        "circlesButton",
        "twitterBlueButton",
        "typefullyGrowTab",
        "followingTimeline",
        "trendsHomeTimeline",
        "removeTimelineTabs",
        "writerMode",
      ]);

      if (data?.writerMode === "on") {
        changeWriterMode(data?.writerMode);
      } else {
        changeTimelineTabs(data?.removeTimelineTabs, data?.writerMode);
        changeTrendsHomeTimeline(data?.trendsHomeTimeline, data?.writerMode);
        changeFollowingTimeline(data?.followingTimeline);
        addTypefullyPlug();
      }

      if (data?.listsButton === "on") addListsButton();
      if (data?.communitiesButton === "on") addCommunitiesButton();
      if (data?.topicsButton === "on") addTopicsButton();
      if (data?.circlesButton === "on") addCirclesButton();
      if (data?.twitterBlueButton === "on") addTwitterBlueButton();
      if (data?.typefullyGrowTab === "on") {
        clearTimeout(mt);
        mt = setTimeout(() => {
          addGrowButton();
        });
      }

      saveCurrentReplyToLink();
      checkUrlForFollow();
      hideViewCount();
      changeRecentMedia();

      const scheduleButton = document.querySelector(
        'div[data-testid="scheduleOption"]'
      );
      if (scheduleButton) addWriterModeButton(scheduleButton);

      return;
    }, 1000);

    runDocumentMutations();
  });

  observer.observe(document, {
    childList: true,
    subtree: true,
  });
};

// Resize Listener
export const addResizeListener = () => {
  window.addEventListener(
    "resize",
    throttle(async () => {
      /*

        Code here

      */
    }, 1000)
  );
};

// Append override-functions.js to the page
export const injectOverrideFunctions = () => {
  const script = document.createElement("script");
  script.src = chrome.runtime.getURL("js/override-functions.js");
  document.body.appendChild(script);
}
