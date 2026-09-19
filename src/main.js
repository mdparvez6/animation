import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { gsap } from 'https://cdn.jsdelivr.net/npm/gsap@3.13.0/+esm';
import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.20.0/+esm';
import './style.css';

const canvas=document.querySelector('#scene');
const scene=new THREE.Scene();
scene.background=new THREE.Color(0x090a08);
scene.fog=new THREE.FogExp2(0x090a08,.043);

const camera=new THREE.PerspectiveCamera(43,innerWidth/innerHeight,.1,100);
camera.position.set(8.5,5.3,10.8);

const renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.setSize(innerWidth,innerHeight);
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.18;

const controls=new OrbitControls(camera,renderer.domElement);
controls.enableDamping=true;
controls.target.set(0,1.5,0);
controls.minDistance=7;
controls.maxDistance=18;
controls.maxPolarAngle=Math.PI*.49;

scene.add(new THREE.HemisphereLight(0xdbe6cf,0x24170e,2));
const key=new THREE.DirectionalLight(0xffd3a0,4.6);
key.position.set(-4,9,5);
key.castShadow=true;
key.shadow.mapSize.set(2048,2048);
key.shadow.camera.left=-9; key.shadow.camera.right=9;
key.shadow.camera.top=9; key.shadow.camera.bottom=-4;
scene.add(key);
const rim=new THREE.PointLight(0x91c5ff,18,18,2);
rim.position.set(6,4,-5);
scene.add(rim);

const material=(color,rough=.8,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness:rough,metalness});
const wood=material(0x7f471f,.93), wood2=material(0xc17a3d,.86);
const dark=material(0x22211d,.91), cloth=material(0x304b3a,.84);
const skin=material(0xc6815b,.86), steel=material(0xaeb2b0,.34,.86);

const floor=new THREE.Mesh(new THREE.PlaneGeometry(36,36),material(0x14150f));
floor.rotation.x=-Math.PI/2;
floor.receiveShadow=true;
scene.add(floor);

for(let i=0;i<75;i++){
 const chip=new THREE.Mesh(new THREE.CylinderGeometry(.008,.013,THREE.MathUtils.randFloat(.25,1.2),5),wood2);
 chip.position.set(THREE.MathUtils.randFloatSpread(23),.016,THREE.MathUtils.randFloatSpread(20));
 chip.rotation.y=Math.random()*Math.PI;
 chip.rotation.z=Math.PI/2;
 scene.add(chip);
}

const logGroup=new THREE.Group();
scene.add(logGroup);
const log=new THREE.Mesh(new THREE.CylinderGeometry(1.18,1.18,5.8,32),wood);
log.rotation.z=Math.PI/2;
log.castShadow=true; log.receiveShadow=true;
logGroup.add(log);

const end=new THREE.Mesh(new THREE.CircleGeometry(1.12,56),wood2);
end.rotation.y=Math.PI/2; end.position.x=2.91; end.receiveShadow=true;
logGroup.add(end);

for(let r=.17;r<1.02;r+=.17){
 const ring=new THREE.Mesh(new THREE.RingGeometry(r,r+.018,72),material(0x704019,.96));
 ring.rotation.y=Math.PI/2;
 ring.position.x=2.925;
 logGroup.add(ring);
}

for(const x of [-1.7,1.5]){
 const support=new THREE.Mesh(new THREE.BoxGeometry(.55,1.1,2.5),dark);
 support.position.set(x,.55,0);
 support.rotation.z=.32*(x<0?-1:1);
 support.castShadow=true;
 scene.add(support);
}

const worker=new THREE.Group();
worker.position.set(-4.0,0,1.0);
scene.add(worker);

const torso=new THREE.Mesh(new THREE.CapsuleGeometry(.65,1.25,8,16),cloth);
torso.position.y=2; torso.scale.z=.72; torso.castShadow=true; worker.add(torso);
const head=new THREE.Mesh(new THREE.SphereGeometry(.48,24,16),skin);
head.position.set(0,3.45,0); head.castShadow=true; worker.add(head);
const hat=new THREE.Mesh(new THREE.CylinderGeometry(.57,.62,.18,24),material(0x27382c));
hat.position.y=3.86; hat.castShadow=true; worker.add(hat);
const brim=new THREE.Mesh(new THREE.BoxGeometry(.9,.06,.42),material(0x27382c));
brim.position.set(.15,3.77,.05); worker.add(brim);

const limb=(r,l,m)=>{const mesh=new THREE.Mesh(new THREE.CylinderGeometry(r,r*1.08,l,12),m);mesh.castShadow=true;return mesh};
const armL=limb(.18,1.25,cloth),armR=limb(.18,1.25,cloth);
armL.position.set(-.63,2.3,0);armL.rotation.z=-.75;worker.add(armL);
armR.position.set(.63,2.3,0);armR.rotation.z=.75;worker.add(armR);
const legL=limb(.23,1.55,dark),legR=limb(.23,1.55,dark);
legL.position.set(-.3,.72,0);legL.rotation.z=-.08;worker.add(legL);
legR.position.set(.3,.72,0);legR.rotation.z=.08;worker.add(legR);

const saw=new THREE.Group();
worker.add(saw);
saw.position.set(0,1.78,-.02);
saw.rotation.z=-.15;

const blade=new THREE.Mesh(new THREE.BoxGeometry(4,.065,.18),steel);
blade.position.x=1.5;blade.castShadow=true;saw.add(blade);
for(let x=-.35;x<3.46;x+=.13){
 const tooth=new THREE.Mesh(new THREE.ConeGeometry(.045,.12,4),steel);
 tooth.position.set(x,-.09,0); tooth.rotation.z=Math.PI; saw.add(tooth);
}
const handle=new THREE.Mesh(new THREE.TorusGeometry(.3,.06,10,24,Math.PI*1.55),material(0x59331c));
handle.rotation.z=Math.PI/2;handle.position.set(-.15,.05,0);saw.add(handle);

const groove=new THREE.Mesh(new THREE.BoxGeometry(.11,2.2,2.34),material(0x4b2715,1));
groove.position.set(.55,0,.01);
groove.scale.y=.01;
groove.visible=false;
scene.add(groove);

const chips=[];
for(let i=0;i<80;i++){
 const c=new THREE.Mesh(new THREE.TetrahedronGeometry(THREE.MathUtils.randFloat(.025,.085)),wood2);
 c.visible=false;
 c.position.set(THREE.MathUtils.randFloat(.1,2.2),THREE.MathUtils.randFloat(.5,2),THREE.MathUtils.randFloat(-.7,.8));
 c.userData={vx:THREE.MathUtils.randFloat(-.03,.06),vy:THREE.MathUtils.randFloat(.02,.08),vz:THREE.MathUtils.randFloat(-.05,.05)};
 scene.add(c);chips.push(c);
}

const params={speed:1,autoRotate:false};
const gui=new GUI({title:'Scene Controls'});
gui.add(params,'speed',0,2,.05).name('Animation speed');
gui.add(params,'autoRotate').name('Auto rotate');

let playing=true,time=0;
const toggle=document.querySelector('#toggle');
toggle.onclick=()=>{playing=!playing;toggle.textContent=playing?'Pause animation':'Play animation'};
document.querySelector('#reset').onclick=()=>{
 time=0;
 worker.position.y=0;
 saw.position.x=0;
 groove.visible=false;
 chips.forEach(c=>{c.visible=false;c.position.set(THREE.MathUtils.randFloat(.1,2.2),THREE.MathUtils.randFloat(.5,2),THREE.MathUtils.randFloat(-.7,.8));c.userData.vy=THREE.MathUtils.randFloat(.02,.08);});
 camera.position.set(8.5,5.3,10.8);
 controls.target.set(0,1.5,0);
};

const clock=new THREE.Clock();
function animate(){
 requestAnimationFrame(animate);
 const dt=clock.getDelta();
 if(playing) time+=dt*params.speed;
 saw.position.x=Math.sin(time*3.1)*.18;
 armL.rotation.z=-.75+Math.sin(time*3.1)*.22;
 armR.rotation.z=.75-Math.sin(time*3.1)*.22;
 worker.position.y=Math.abs(Math.sin(time*1.55))*.035;

 const cut=Math.max(0,Math.min(1,(time%10)/10));
 groove.visible=cut>.02;
 groove.scale.y=THREE.MathUtils.lerp(.01,1,cut);
 document.querySelector('#bar').style.width=(cut*100)+'%';
 document.querySelector('#progressText').textContent='Cut depth '+Math.round(cut*100)+'%';

 const burst=(time%4)>.35&&(time%4)<.7;
 if(burst&&playing){
  chips.forEach(c=>{
   c.visible=true;
   c.position.x+=c.userData.vx;
   c.position.y+=c.userData.vy;
   c.position.z+=c.userData.vz;
   c.userData.vy-=.002;
   if(c.position.y<.05){c.position.y=THREE.MathUtils.randFloat(.5,2);c.userData.vy=THREE.MathUtils.randFloat(.02,.08);}
  });
 }
 if(params.autoRotate) scene.rotation.y+=dt*.08;
 controls.update();
 renderer.render(scene,camera);
}
animate();

addEventListener('resize',()=>{
 camera.aspect=innerWidth/innerHeight;
 camera.updateProjectionMatrix();
 renderer.setSize(innerWidth,innerHeight);
});
