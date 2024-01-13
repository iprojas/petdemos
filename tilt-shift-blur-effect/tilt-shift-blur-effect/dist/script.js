/*!
Tilt-Shift Blur Effect
 - Miniature Effect
 - Miniature faking
 - Tilt-Shift Effect
 - Diorama Effect
Copyright (c) 2023 by Wakana Y.K. (https://codepen.io/wakana-k/pen/KKJgQjX)
*/
"use strict";
console.clear();

var root = document.querySelector(":root");
function pointer(e) {
  root.style.setProperty("--y", e.pageY + "px");
}
window.addEventListener("pointermove", pointer);
window.addEventListener("pointerdown", pointer);