const customTitlebar = require("custom-electron-titlebar");

/**
 * Add a custom title bar when the DOM Content is loaded
 */
window.addEventListener("DOMContentLoaded", () => {
  new customTitlebar.Titlebar({
    backgroundColor: customTitlebar.Color.fromHex("#E6E6E6"),
    titleHorizontalAlignment: "left",
    menu: null,
  });
});
