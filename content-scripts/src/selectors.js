const selectors = {};

// Layout
selectors.mainWrapper = `main[role="main"]`;
selectors.mainColumn = `[data-testid="primaryColumn"]`;
selectors.topHeader = `${selectors.mainColumn} > div > div:nth-of-type(1)`;
selectors.timelineTabs = `${selectors.mainColumn} > div > div:nth-of-type(1) > div > div > nav:only-child[role="navigation"]`;
selectors.leftSidebar = `header[role="banner"]`;
selectors.leftSidebarLinks = `${selectors.leftSidebar} nav[role="navigation"]`;
selectors.leftSidebarUnreadBadge = `${selectors.leftSidebarLinks} a svg + div[dir]`;
selectors.sidebarLinks = {
  home: `[data-testid="AppTabBar_Home_Link"]`,
  explore: `[data-testid="AppTabBar_Explore_Link"]`,
  notifications: `[data-testid="AppTabBar_Notifications_Link"]`,
  messages: `[data-testid="AppTabBar_DirectMessage_Link"]`,
  bookmarks: `a[href*="bookmarks"]`,
  articles: `a[href*="i/articles"]`,
  topics: `a[href*=topics]`,
  circles: `a[href*=circles]`,
  communities: `a[href*=communities]`,
  profile: `[data-testid="AppTabBar_Profile_Link"]`,
  lists: `a[href*="lists"][role="link"][aria-label]`,
  twitterBlue: `a[href*="blue"][role="link"][aria-label]`,
};
selectors.accountSwitcherButton = `[data-testid="SideNav_AccountSwitcher_Button"]`;
selectors.rightSidebar = `[data-testid="sidebarColumn"]`;
// Timeline
selectors.tweetCounts = `[role="group"][id*="id__"]:only-child`;
selectors.viewCount = selectors.tweetCounts + " a[href*='/analytics']";
// Search
selectors.searchBox = `${selectors.rightSidebar} form[role="search"]`;
selectors.searchBoxInput = `${selectors.searchBox} input:only-child`;
// Modals
selectors.modalExternalWrapper = `div[role="group"]`;
selectors.modalBackground = `${selectors.modalExternalWrapper} > div:empty`;
selectors.modalWrapper = `div[aria-labelledby="modal-header"][role="dialog"]`;
selectors.modalUi = `${selectors.modalWrapper} > div`;

export default selectors;
