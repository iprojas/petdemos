import {
  Obj,
  TransformFeedback,
  Renderer,
  Program,
  Mesh,
  Uniform,
  PointCloud,
  GeometryAttribute,
  Camera,
  Triangle,
  Plane,
  Box,
  Texture,
  Geometry,
  DollyCamera,
  Framebuffer
} from "https://cdn.skypack.dev/wtc-gl@1.0.0-beta.50";

import { Vec2, Vec3, Mat4 } from "https://cdn.skypack.dev/wtc-math@1.0.17";

console.clear();

const dpr = 2;
const d = new Vec2(window.innerWidth, window.innerHeight);
d.update = (function() {
  uniforms.u_resolution.value = this.scaleNew(dpr).array;
  renderer.dimensions = this;
  camera.perspective({ aspect: gl.canvas.width / gl.canvas.height });
  mainFBO.resize(...this.array);
  fadeFBO.resize(...this.array);
  shaderFBO.resize(...this.array);
  return this;
}).bind(d);
window.addEventListener('resize', () => d.reset(window.innerWidth, window.innerHeight).update());

// Uniforms
const cameraValues = new Vec3(5,500,.4);
const uniforms = {
  u_time: new Uniform({ name: 'time', value: 0 }),
  u_resolution: new Uniform({ name: 'resolution', value: d.scaleNew(dpr).array }),
  b_depth: new Uniform({
      name: 'depth',
      value: null,
      kind: 'texture'
    }),
  b_render: new Uniform({
      name: 'render',
      value: null,
      kind: 'texture'
    }),
  b_depthrender: new Uniform({
      name: 'depthrender',
      value: null,
      kind: 'texture'
    }),
  b_buffer: new Uniform({
      name: 'buffer',
      value: null,
      kind: 'texture'
    }),
  u_camera: new Uniform({ name: 'camera', value: cameraValues.array }),
  u_outlinestage: new Uniform({ name: 'outline', value: true }),
  u_logDepthDelta: new Uniform({ name: 'logDepthDelta', value: 2/(Math.log(cameraValues.y+1)/Math.LN2) }),
};

// Renderer
const renderer = new Renderer({ dpr, width: d.width, height: d.height, antialias: true, premultipliedAlpha:true });
// renderer.depthMask = false;
const { gl } = renderer;
const ext = gl.getExtension('EXT_frag_depth');
gl.clearColor(.95,.95,.95,0);
document.body.appendChild(gl.canvas);

// Camera
const camera = new DollyCamera({},{near: uniforms.u_camera.value[0], far:uniforms.u_camera.value[1]});
window.camera = camera;
// camera.target.reset(5, -40, 0)
camera.setPosition(20, 150, 90.);
camera.fov = 65;
camera.perspective({ aspect: gl.canvas.width / gl.canvas.height });

// Geometry, shaders and mesh
const vertex = document.getElementById('vertShader').innerText;
const fragment = document.getElementById('fragShader').innerText;
let mesh;
const program = new Program(gl, {
  vertex,
  fragment,
  // cullFace: null,
  // transparent: true,
  // depthTest: false,
  uniforms
});
const num = 160;
const translations = [];
const translationsa = new Float32Array(num*16)
const inversea = new Float32Array(num*16);
const scalesa = new Float32Array(num);
const ida = new Float32Array(num);
const coloursa = new Float32Array(num*3);
const scene = new Obj();
const attributes = {};
{
  for(let i=0; i<num; i++) {
    const m = new Mat4();
    const a = Math.PI*2/num*i;
    const l = 40;
    const s=.3+Math.cos(a*4)*.2;
    m.scale(s);
    m.translate([Math.cos(a)*l, Math.cos(a*2.+Math.PI*.5)*l, Math.sin(a)*l]);
    const inverseTranspose = m.invertNew().transpose();
    translations.push(m);
    translationsa.set(m.array, i*16);
    scalesa.set([.6], i)
    ida.set([Math.random()], i);
    coloursa.set([Math.random()*2, Math.random()*2, Math.random()*2], i*3);
  }
  attributes.translation = new GeometryAttribute({ instanced: 1, size: 16, data: translationsa });
  attributes.inverseTranspose = new GeometryAttribute({ instanced: 1, size: 16, data: inversea });
  attributes.scale = new GeometryAttribute({ instanced: 1, size: 1, data: scalesa });
  attributes.id = new GeometryAttribute({ instanced: 1, size: 1, data: ida });
  attributes.colour = new GeometryAttribute({ instanced: 1, size: 3, data: coloursa });
  
  const faceoffsetsa = new Float32Array(6*4);
  const facecolours = new Float32Array(6*4*3);
  for(let i=0; i<6*4; i+=4) {
    const c = Math.random();
    const r = Math.random();
    const g = Math.random();
    const b = Math.random();
    
    faceoffsetsa.set([c,c,c,c], i)
    facecolours.set([r,g,b,r,g,b,r,g,b,r,g,b],i*3)
  }
  attributes.faceoffset = new GeometryAttribute({ size: 1, data: faceoffsetsa });
  attributes.facecolour = new GeometryAttribute({ size: 3, data: facecolours });
  
  
  
  const geometry = new Box(gl, {
    width:5,height:5,depth:50,attributes
  });
  const mesh = new Mesh(gl, {geometry, program });
  mesh.setParent(scene);
}

// render geometry, program, and framebuffer
let renderMesh, fadeMesh, outputMesh;
{
const vertex = `#version 300 es
  in vec3 position;in vec2 uv;out vec2 v_uv;void main() {gl_Position = vec4(position, 1.0);v_uv = uv;}`;
const geometry = new Triangle(gl)
const mainProgram = new Program(gl, {
  vertex,
  fragment: document.querySelector('#renderShader').innerText,
  uniforms: uniforms
})
const outputProgram = new Program(gl, {
  vertex,
  fragment: document.querySelector('#outputShader').innerText,
  uniforms
})
const fadeProgram = new Program(gl, {
  vertex,
  fragment: document.querySelector('#fadeShader').innerText,
  uniforms
})
renderMesh = new Mesh(gl, { geometry, program: mainProgram })
fadeMesh = new Mesh(gl, { geometry, program: fadeProgram })
outputMesh = new Mesh(gl, { geometry, program: outputProgram })
}
const mainFBO = new Framebuffer(gl, { dpr, name: 'render', width: d.width, height: d.height });
const shaderFBO = new Framebuffer(gl, { dpr, name: 'render', width: d.width, height: d.height });
const fadeFBO = new Framebuffer(gl, { dpr, name: 'output', width: d.width, height: d.height, texdepth: Framebuffer.TEXTYPE_FLOAT });
window.outputMesh = outputMesh;

const settings = {
  timeOffset: Math.random()*10,
  scaleAmplitude: .2+Math.random()*.8,
  scaleFrequency: Math.floor(Math.random()*12)/2,
  scaleYFrequency: 1.+Math.floor(Math.random()*8)
};

// run loop
let playing = true, lastTime = 0;
const runloop = function(t) {
  const diff = t - lastTime;
  lastTime = t;
  
  if(playing === true) requestAnimationFrame(runloop);
  
  uniforms.u_time.value += diff * .005;
  //console.log(uniforms.u_time.value)
  
  translations.length=[];
  for(let i=0; i<num; i++) {
    const m = new Mat4();
    const a = Math.PI*2/num*i+uniforms.u_time.value*.01+settings.timeOffset;
    const b = a*settings.scaleYFrequency+Math.PI*.5+uniforms.u_time.value*.02+settings.timeOffset;
    const l = 35;
    const s = .9+settings.scaleAmplitude*Math.cos(a*settings.scaleFrequency)**2;
    
    const y = Math.cos(b)*l;
    const r = a;
    // m.scaleByVec3([s,s,s])
    const t = new Vec3(Math.cos(a)*l, y, Math.sin(a)*l);
    m.translate(t.array);
    m.scale(s);
    // m.rotate(r, new Vec3(1,1,1).normalise());
    // m.rotate(r, new Vec3(0,1,0).normalise());
    // m.rotate(y*.2, new Vec3(0,1,0).normalise());
    const look = Mat4.targetTo(t.normalise(), new Vec3(0,0,0), new Vec3(0,1,0));
    m.multiply(look)
    const inverseTranspose = m.invertNew().transpose();
    // translations.push(m);
    translationsa.set(m.array, i*16);
    inversea.set(inverseTranspose.array, i*16);
  }
  attributes.translation.updateAttribute(gl);
  attributes.inverseTranspose.updateAttribute(gl);
  
  camera.update();
  
//   u_outlinestage
  mainFBO.render(renderer, { scene, camera });
  uniforms[`u_outlinestage`].value = false;
  shaderFBO.render(renderer, { scene, camera });
  uniforms[`u_outlinestage`].value = true;
  
  uniforms[`b_depth`].value = mainFBO.read.depthTexture;
  uniforms[`b_buffer`].value = mainFBO.read.texture;
  uniforms[`b_render`].value = shaderFBO.read.texture;
  uniforms[`b_depthrender`].value = mainFBO.read.texture;
  
  mainFBO.render(renderer, { scene: renderMesh });
  
  uniforms[`b_render`].value = mainFBO.read.texture;
  uniforms[`b_buffer`].value = fadeFBO.read.texture;
  fadeFBO.render(renderer, { scene: fadeMesh });
  
  uniforms[`b_render`].value = fadeFBO.read.texture;
  
  renderer.render({ scene: outputMesh });
  
  // renderer.render({ scene: fadeMesh });
  // renderer.render({ scene, camera });
}
requestAnimationFrame(runloop);