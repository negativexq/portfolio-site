export const THEME_STORAGE_KEY = "theme";

/**
 * Runs in <head> before first paint so a stored choice never flashes the
 * other theme. "system" stores nothing and leaves the CSS on
 * prefers-color-scheme, which is also the no-script behaviour.
 */
export const themeInitScript = `try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;
