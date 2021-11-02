/*
 * Tests whether the browser that has requested localspacepatrol.com
 *    is Internet Explorer 5-11.
 * window.document.documentMode is undefined for all browsers outside of these.
 *
 * Web audio playback in IE has several issues.
 * In IE10 and lower, it may be prudent to offer a download link instead of showing
 *    an audio player.
 *
 * For now, we are simply displaying a message encouraging the user to use a different browser.
 */

if (window.document.documentMode) {
  var node = document.createElement("div")
  node.innerHTML =
    "<h3>You are currently viewing this site in Internet Explorer. Please switch to a different web browser to access this site's full functionality.<h3>"
  node.setAttribute(
    "style",
    "width: 60vw; margin-left: 15vw; text-align: center; color: rgba(200, 200, 200, 1); text-shadow: 0.5px 0.5px black;"
  )
  document.getElementsByTagName("h1").item(0).insertAdjacentElement("afterend", node)
}
