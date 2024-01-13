//In  GSAP we call these blocks of codes; tweens
gsap.to(".bg-silver", {
  scale: 1.1,
  duration: 2,
  repeat: -1,
  yoyo: true,
  ease: "power1.inOut"
});

const splittedText = new SplitText(".split", { type: "chars" });
const chars = splittedText.chars;

gsap.from(chars, {
  yPercent: 450,
  // stagger: 0.05 Makes the letter come in one by one.
  stagger: {
    each: 0.05,
    from: "random"
  },
  ease: "back.out",
  duration: 1
});

/*
gsap.from([chars[2], chars[12]], {
  rotation: 360,
  duration: 2,
  delay: 3,
  repeat: -1
});
*/

// Here we're creating a timeline that we can use
const tl = gsap.timeline({
  repeat: -1,
  duration: 2,
  delay: 3,
  yoyo: true
});

tl.to(chars[2], { rotation: 360 });
tl.to(chars[12], { rotation: 360 });

// Horizontal Scrolling part 👇

const horizontalPanels = gsap.utils.toArray(".horizontal .panel");

const scrollTween = gsap.to(horizontalPanels, {
  xPercent: -100 * (horizontalPanels.length - 1), // Regardless how many panels you have, this will work
  ease: "none",
  scrollTrigger: {
    trigger: ".horizontal",
    pin: true,
    scrub: 1,
    snap: 1 / (horizontalPanels.length - 1), // snap prevents the scroll to stop "in between" panels
    end: "+=3500"
  }
});

// PANEL 1 - CIRCLES
let tml = gsap.timeline({ repeat: -1, repeatDelay: 1, yoyo: true });

// choose the order of the animations here
tl.to(".circle1", { rotation: 360 });
tl.to(".circle3", { rotation: 360 });
tl.to(".circle4", { rotation: 360 });
tl.to(".circle2", { rotation: 360 });

// PANEL 2 - PULSE THE IMAGE
gsap.to(".panel2 img", {
  scale: 1.1, // Scale up to 110%
  duration: 2, // Duration of each pulse
  ease: "power1.inOut", // Easing function for a smooth effect
  repeat: -1, // Repeat the animation indefinitely
  yoyo: true // Make the animation reverse on alternate repeats
});

// PANEL 3 - MORPHING BETWEEN TWO SVG PATHS
const morph = gsap.to("#start", {
  duration: 7,
  morphSVG: "#end",
  repeat: -1,
  yoyo: true,
  ease: "sine.out"
});

// Some ppl have this setting turned off, so for accessibility reasons it is a good thing to check if users prefers website without animations, they dont have to see the animations.
const animationIsOkay = window.matchMedia(
  "(prefers-reduced-motion: no-preference)"
).matches;

//Then wrap the animations in an if statemanet,
if (animationIsOkay) {
  //  ...do the animations in here
}