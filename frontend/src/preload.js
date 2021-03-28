const customTitlebar = require("custom-electron-titlebar");

window.addEventListener("DOMContentLoaded", () => {
  new customTitlebar.Titlebar({
    backgroundColor: customTitlebar.Color.fromHex("#E6E6E6"),
    titleHorizontalAlignment: "left",
    menu: null,
  });
});
