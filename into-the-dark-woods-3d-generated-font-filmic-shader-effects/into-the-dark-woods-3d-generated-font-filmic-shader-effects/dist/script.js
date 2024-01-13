/*

  ★ Into the Dark Woods ★
  
  The 3D letters are generated at runtime from a font file (try uploading other fonts!), thanks to @ycw:
  https://github.com/ycw/three-font-outliner
  
  Matcap source:
  https://github.com/nidorx/matcaps
  
  Generative tree geometry thanks to @mattatz:
  https://github.com/mattatz/THREE.Tree
  
  Font - Oz's Wizard Font by Mario Arturo:
  https://marioarturotype.com/blog/2017/05/27/ozs-wizard/
  
  art & code by Anna Zenn Scavenger, November 2020
  https://twitter.com/ouchpixels
  
  License: You can remix, adapt, and build upon my code non-commercially.

*/

import { EffectComposer } from 'https://unpkg.com/three@0.122.0/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://unpkg.com/three@0.122.0/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'https://unpkg.com/three@0.122.0/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'https://unpkg.com/three@0.122.0/examples/jsm/postprocessing/ShaderPass.js';
import { FXAAShader } from 'https://unpkg.com/three@0.122.0/examples/jsm/shaders/FXAAShader.js';
import { RGBShiftShader } from 'https://unpkg.com/three@0.122.0/examples/jsm/shaders/RGBShiftShader.js';
import Outliner from "https://cdn.jsdelivr.net/gh/ycw/three-font-outliner@1.0.2/src/index.js";

Sketch();

function Sketch() {
  
  let scene, camera, renderer, controls;
  let container = document.querySelector("#scene-container");
  
  // MESHES
  
  let iTree, iSparkle;
  let lettersGroup = new THREE.Group();
  let dummy = new THREE.Object3D();
  let mat4 = new THREE.Matrix4();
  let counter = 0;

  // ASSETS
  
  let textureURL = "https://assets.codepen.io/911157/matcap_steel_256.jpg";
  let fontURL = "https://assets.codepen.io/911157/OzsWizard_optimized_super.ttf";
    
  let materials;
  
  // POSTPROCESSING
  
  let composer, aaPass;
  let clock = new THREE.Clock();

  // MOUSE & FLASHLIGHT EFFECT
  
  let flashLight;
  let mouse = new THREE.Vector2(0, 0);
  let target = new THREE.Vector3(0, 0, 65);
  let mouseV3 = new THREE.Vector3();
  let mousePlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  let raycaster = new THREE.Raycaster();
  let dirLight2;
  
  // LANDSCAPE / PORTRAIT

  let isMobile = /(Android|iPhone|iOS|iPod|iPad)/i.test(navigator.userAgent);
  let windowRatio = window.innerWidth / window.innerHeight;
  let isLandscape = (windowRatio > 1) ? true : false;
  let cameraZ = isLandscape ? 400 : 750;
  
  // PARAMS SPARKLES
  
  let sparkleCount = 1500;
  let sparkleCountX = isLandscape ? 50 : 30;
  let sparkleCountY = sparkleCount / sparkleCountX;
    
  let sceneStyles;
  
  // CONTROLS MENU
  
  let buttons;
  let isMenuOpen = false;
  
  introAnimation();
  init();
  render();
  
  function init() {
    
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050505);
    
    materials = initMaterials();
    
    initCamera();
    initRenderer();
    initLights();
    
    initTrees();
    initSparkles();
    initLetters();
    initPostEffects();
    
    sceneStyles = {
      
      classic: {
        
        lettersMat: materials.silver,
        torchPos: new THREE.Vector3(0, 0, 65),
        lightColor: new THREE.Color(0xff00ff),
        lightPos: new THREE.Vector3(0, 20, 0),
        bloom: false,
        fxaa: false,
        rgbShift: false
        
      },
      
      cinematic: {
         
        lettersMat: materials.green,
        torchPos: new THREE.Vector3(0, 0, 150),
        lightColor: new THREE.Color(0xff00ff),
        lightPos: new THREE.Vector3(0, 20, 0),
        bloom: true,
        fxaa: true,
        rgbShift: false
        
      },
      
      vintage: {
         
        lettersMat: materials.brown,
        torchPos: new THREE.Vector3(0, 0, 150),
        lightColor: new THREE.Color(0x3f2701),
        lightPos: new THREE.Vector3(-50, 0, 50),
        bloom: true,
        fxaa: true,
        rgbShift: true
        
      },
      
      metal: {
        
        lettersMat: materials.silver,
        torchPos: new THREE.Vector3(0, 0, 50),
        lightColor: new THREE.Color(0xcd70e0),
        lightPos: new THREE.Vector3(0, 20, 0),
        bloom: false,
        fxaa: false,
        rgbShift: false
        
      }
      
    };

    window.addEventListener("resize", onWindowResize);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("touchmove", onTouchMove);

    
    buttons = document.querySelectorAll('.btn--scene');
    buttons.forEach(btn => { btn.addEventListener("click", toggleStyle);});
    let btnClose = document.querySelector('.btn--close');
    btnClose.addEventListener("click", toggleMenu);
    
  }
  
  function introAnimation() {
  
    const overlayContainer = document.querySelector("#overlay-container");
    const sceneContainer = container;

    overlayContainer.style.animation = "fadeOut 1.1s ease-out forwards";
    sceneContainer.style.animation = "fadeIn 1.1s ease-in forwards";
    
    const credits = document.querySelector(".credits");
    credits.style.animation = "fadeIn2 5.5s ease-in forwards";
  
  }
  
  function initCamera() {
    
    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 20, cameraZ);
    camera.lookAt(0, 0, 0);
    scene.add(camera);
    
  }
  
  function initRenderer() {
    
    renderer = new THREE.WebGLRenderer({antialias: true, alpha: false});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.physicallyCorrectLights = true;
    renderer.outputEncoding = THREE.GammaEncoding;
    renderer.gammaFactor = 2.2;
    renderer.setPixelRatio(window.devicePixelRatio > 1.5 ? Math.min(window.devicePixelRatio, 1.4) : Math.min(window.devicePixelRatio, 1.25));
    container.appendChild(renderer.domElement);
    
  }
  
  function initLights() {
  
    const bottomLight = new THREE.DirectionalLight(0x5000ff, 1.25);
    bottomLight.position.set(0, -100, 0);
    scene.add(bottomLight);
    
    const dirLight = new THREE.DirectionalLight(0xa6e200, 1.25);
    dirLight.position.set(-100, 50, -100);
    scene.add(dirLight);
    
    dirLight2 = new THREE.DirectionalLight(0xff00ff, 1.5);
    dirLight2.position.set(0, 20, 0);
    scene.add(dirLight2);
    
    flashLight = new THREE.PointLight(0xffe7a8, 40, 90);
    scene.add(flashLight);
    
  }
  
  function initMaterials() {
    
    const brown = new THREE.MeshPhongMaterial({
      
      color: 0x3f2a00,
      shininess: 100,
      specular: 0x323232,
      flatShading: true
      
    });
    
    const green = new THREE.MeshPhongMaterial({
      
      color: 0x00aa3b,
      shininess: 100,
      specular: 0x323232,
      flatShading: true
      
    });
    
    const silverTex = new THREE.TextureLoader().load(textureURL);
    
    const silver = new THREE.ShaderMaterial({
      transparent: false,
      side: THREE.DoubleSide,
      uniforms: {
        tMatCap: {type: "t", value: silverTex}
      },
      vertexShader: document.querySelector("#vs-matcap").textContent,
      fragmentShader: document.querySelector("#fs-matcap").textContent,
      flatShading: false
    });
    
    return {
      
      brown,
      green,
      silver,
    
    }
    
    
  }
  
  function initTrees() {
    
    let radius = 5;
    let numInstances = 30;
    
    const purple = new THREE.MeshPhongMaterial({
      color: 0xa5b59d,
      shininess: 100,
      specular: 0x323232
    });
  
    const tree = new THREE.Tree({

      generations : 4,
      length      : 60.0,
      uvLength    : 300.0,
      radius      : 4,
      radiusSegments : 6,
      heightSegments : 6

    });
    
    const treeGeom = THREE.TreeGeometry.build(tree);
    const treeBufferGeom = new THREE.BufferGeometry().fromGeometry(treeGeom);
    treeBufferGeom.computeBoundingBox();
    treeBufferGeom.rotateX(-Math.PI / 2);
    
    let baseGeom = treeBufferGeom;
    
    let fibonacciSpherePoints = getFibonacciSpherePoints(numInstances, radius);
    
    iTree = new THREE.InstancedMesh(baseGeom, purple, numInstances);
    
    let dummy = new THREE.Object3D();
    
    for (let i = 0; i < numInstances; i++) {
      
      let point = fibonacciSpherePoints[i];
      
      dummy.position.set(
      
        point.x,
        point.y,
        point.z
      
      );
      
      dummy.rotation.set(

        2 * Math.PI * Math.random(),  
        2 * Math.PI * Math.random(),
        2 * Math.PI * Math.random(),  
        
      );
      
      dummy.lookAt(0, 0, 0);
      dummy.updateMatrix();
      iTree.setMatrixAt(i, dummy.matrix);
    
    }
    
    scene.add(iTree);
    
  }
  
  function initSparkles() {
    
    const sparkleGeom = new THREE.PlaneBufferGeometry(1.75, 1.75);

    const purpleStandard = new THREE.MeshStandardMaterial({
      color: 0x86ad6b, 
      roughness: 0.35, 
      metalness: 0.75
    });
    
    const purpleLambert = new THREE.MeshLambertMaterial({color: 0xb500f2});
    
    const sparkleMat = isMobile ? purpleLambert : purpleStandard;
    
    iSparkle = new THREE.InstancedMesh(sparkleGeom, sparkleMat, sparkleCount);
    
    for (let y = 0; y < sparkleCountY; y++) {
      
      for (let x = 0; x < sparkleCountX; x++) {
        
        dummy.position.set(
          -(5 * sparkleCountX / 2) + 5 * x, 
          -(5 * sparkleCountY / 2) + 5 * y, 
          50).multiplyScalar(1.9);
        
        dummy.rotation.set(
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2
        );
        
        dummy.scale.set(
          1 + Math.random(),
          1 + Math.random(),
          1 + Math.random()
        );
        
        dummy.updateMatrix();
        iSparkle.setMatrixAt(counter, dummy.matrix);
        counter++;
        
      }
      
    }
    
    iSparkle.instanceMatrix.needsUpdate = true;
    scene.add(iSparkle);
    
  }
  
  function initLetters() {
    
    const chars = "Into The Dark Woods . ".split("");

    // Generate path to place the letters on
    const points = [];
    for (let i = 0, I = chars.length; i <= I; ++i) {

        const angle = i / I * Math.PI * 2;
        const x = 135 * Math.sin(angle);
        // const y = i % 2 * 20;
        const y = i % 3 * 10;
        const z = 135 * Math.cos(angle);
        points.push(new THREE.Vector3(x, y, z));

    }

    const path = new THREE.CatmullRomCurve3(points);
    const frenetFrames = path.computeFrenetFrames(chars.length, true);

    (async function () {

      const outliner = await Outliner.fromUrl(fontURL, THREE.ShapePath);

      for (const [i, char] of chars.entries()) {

        const { shapes, w } = outliner.outline(char);
        
        // letters group - each letter is a separate mesh
        let group = new THREE.Group();

        const options = { 

          depth: 2.5, 
          curveSegments: 5, 
          bevelSegments: 5 
        };
        
        const geom = new THREE.ExtrudeBufferGeometry(shapes, options).center();
        
        // add each mesh to the group
        group.add(new THREE.Mesh(geom, materials.silver));

        path.getPointAt(i / chars.length, group.position);
        group.lookAt(
          frenetFrames.normals[i].negate().add(group.position));

        group.scale.setScalar(0.55);
        lettersGroup.add(group);
        
      }

      lettersGroup.children[9].position.x = 80;
      scene.add(lettersGroup);

    })();
  
  }
  
  function initPostEffects() {
    
    composer = new EffectComposer(renderer);
    
    let renderPass = new RenderPass(scene, camera);

	  let bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
    
    let params = {
    
      exposure: 0.9,
      bloomStrength: 1.75,
      bloomThreshold: 0,
      bloomRadius: 1.0
    
    };
    
    bloomPass.threshold = params.bloomThreshold;
		bloomPass.strength = params.bloomStrength;
	  bloomPass.radius = params.bloomRadius;
    
    aaPass = new ShaderPass(FXAAShader);
    let pixelRatio = renderer.getPixelRatio();
    
    let RGBShiftPass = new ShaderPass(RGBShiftShader);
    let RGBAmount = 0.003;
    let angle = 3.5;
    RGBShiftPass.uniforms.amount.value = RGBAmount;
    RGBShiftPass.uniforms.angle.value = angle;
    
	  composer.addPass(renderPass);
	  composer.addPass(bloomPass);
    composer.addPass(RGBShiftPass);
    composer.addPass(aaPass);
    
    composer.passes[1].enabled = false;
    composer.passes[2].enabled = false;
    composer.passes[3].enabled = false;

    aaPass.material.uniforms.resolution.value.set(1 / (window.innerWidth * pixelRatio), 1 / (window.innerHeight * pixelRatio));
    
  }
  
  function render() {
    
    requestAnimationFrame(render);
    composer.render(0.1);    
    
    let t = clock.getDelta();
    
    iTree.rotation.y += 0.15 * t;
    iTree.rotation.x = 0.1 * mouse.y * Math.PI;
    iTree.rotation.z = 0.1 * mouse.x * Math.PI;
    iTree.position.z = 140 * Math.abs(mouse.x * mouse.x);
    
    target.x = mouseV3.x;
    target.y = mouseV3.y;
    flashLight.position.copy(target);
    
    if (lettersGroup) {
      
      lettersGroup.rotation.y += -0.45 * t;
      lettersGroup.position.copy(iTree.position);

    }
    
    for (let i = 0; i < counter; i++) {
      
      iSparkle.getMatrixAt(i, mat4);
      mat4.decompose(dummy.position, dummy.quaternion, dummy.scale);
      dummy.rotation.x += t * 0.75;
      dummy.rotation.z += t * 1.75;
      dummy.updateMatrix();
      iSparkle.setMatrixAt(i, dummy.matrix);
      iSparkle.instanceMatrix.needsUpdate = true;
      
    }
        
  }
  
  // *** EVENT LISTENERS ***
  
  function onWindowResize() {
    
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
    
    let pixelRatio = renderer.getPixelRatio();
    aaPass.material.uniforms.resolution.value.set(1 / (window.innerWidth * pixelRatio), 1 / (window.innerHeight * pixelRatio));
    
  }
  
  function onMouseMove() {
    
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    updateMouseV3();
    
  }
  
  function onTouchMove(event) {
    
	  let x = event.changedTouches[0].clientX;
    let y = event.changedTouches[0].clientY;
    mouse.x = (x / window.innerWidth) * 2 - 1;
    mouse.y = -(y / window.innerHeight) * 2 + 1;
        
  }
  
  // TORCH
  
  function updateMouseV3() {
    
    const v3 = new THREE.Vector3();
    camera.getWorldDirection(v3);
    mousePlane.normal.copy(v3.normalize());
    raycaster.setFromCamera(mouse, camera);
    raycaster.ray.intersectPlane(mousePlane, mouseV3);
  
  }
  
  // CONTROLS SCENE STYLE TOGGLE
  
  function toggleStyle() {
    
    buttons.forEach(button => {
      
      button.classList.remove("btn--active");
      
    });
  
    this.classList.add("btn--active");
        
    if (this.dataset.scene == "classic") {
      
      updateScene(sceneStyles.classic);
      
    } else if (this.dataset.scene == "cinematic") {
      
      updateScene(sceneStyles.cinematic);
      
    } else if (this.dataset.scene == "vintage") {
      
      updateScene(sceneStyles.vintage);
            
    } else if (this.dataset.scene == "metal") {
      
      updateScene(sceneStyles.metal);
      
    }
    
  }
  
  function updateScene(params) {
    
    lettersGroup.children.forEach(child => {
      
      child.children[0].material = params.lettersMat;
    
    });
    
    target.z = params.torchPos.z;
    
    dirLight2.color = params.lightColor;
    dirLight2.position.copy(params.lightPos);
    
    composer.passes[1].enabled = params.bloom;
    composer.passes[2].enabled = params.rgbShift;
    composer.passes[3].enabled = params.fxaa;

  }
  
  function toggleMenu() {
    
    if (isMenuOpen) {
      
      this.textContent = "Open Controls ✨";
    
      buttons.forEach(button => {
        button.style.display = "none";
      });
      
    } else {
      
      this.textContent = "Close Controls ✨";
    
      buttons.forEach(button => {
        button.style.display = "block";
      });
      
    }
    
    isMenuOpen = !isMenuOpen;

  }
  
}

// *** UTILS ***

function getFibonacciSpherePoints(samples, radius, randomize) {

  // Translated from Python from https://stackoverflow.com/a/26127012

  samples = samples || 1;
  radius = radius || 1;
  randomize = randomize || true;

  let random = 1;

  if (randomize === true) {
    random = Math.random() * samples;
  }

  let points = [];
  let offset = 2 / samples;
  let increment = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < samples; i++) {

    let y = ((i * offset) - 1) + (offset / 2);
    let distance = Math.sqrt(1 - Math.pow(y, 2));
    let phi = ((i + random) % samples) * increment;
    let x = Math.cos(phi) * distance;
    let z = Math.sin(phi) * distance;

    x = x * radius;
    y = y * radius;
    z = z * radius;

    let point = {
      'x': x,
      'y': y,
      'z': z
    }

    points.push(point);

  }

  return points;

}