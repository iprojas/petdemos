/*!
Focus
Copyright (c) 2023 by Wakana Y.K. (https://codepen.io/wakana-k/pen/KKJgQXa)
*/
"use strict";
console.clear();

var root = document.querySelector(":root");
function spotlight(e) {
  root.style.setProperty("--x", e.pageX + "px");
  root.style.setProperty("--y", e.pageY + "px");
}
window.addEventListener("pointermove", spotlight);
window.addEventListener("pointerdown", spotlight);
