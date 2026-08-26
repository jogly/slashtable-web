export const THEME_STORAGE_KEY = "st-theme";

/** Inline blocking script: set `data-theme` from storage / system before first paint. */
export const THEME_BOOTSTRAP_SCRIPT = `(function(){try{var k=${JSON.stringify(THEME_STORAGE_KEY)};var d=document.documentElement;var t=localStorage.getItem(k);if(t==="system"||!t){t=t==="system"?(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"):"dark";}if(t!=="light"&&t!=="dark")t="dark";d.setAttribute("data-theme",t);d.style.colorScheme=t;}catch(e){document.documentElement.setAttribute("data-theme","dark");document.documentElement.style.colorScheme="dark";}})();`;
