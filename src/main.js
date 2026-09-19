import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.20.0/+esm';

const canvas=document.querySelector('#scene');
const scene=new THREE.Scene();
scene.background=new THREE.Color(0x090a08);
scene.fog=new THREE.FogExp2(0x090a08,0.035);

const camera=new THREE.PerspectiveCamera(40,innerWidth/innerHeight,0.05,100);
camera.position.set(7.2,3.6,8.8);

const renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.setSize(innerWidth,innerHeight);
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.2;

const controls=new OrbitControls(camera,renderer.domElement);
controls.enableDamping=true;
controls.target.set(0,1.15,0);
controls.minDistance=5;
controls.maxDistance=15;
controls.maxPolarAngle=Math.PI*0.48;

scene.add(new THREE.HemisphereLight(0xcbd7c5,0x1a1009,1.8));
const key=new THREE.DirectionalLight(0xffd6ad,5.5);
key.position.set(-4,7,5);
key.castShadow=true;
key.shadow.mapSize.set(2048,2048);
key.shadow.camera.left=-8;key.shadow.camera.right=8;
key.shadow.camera.top=7;key.shadow.camera.bottom=-3;
scene.add(key);
const rim=new THREE.PointLight(0x8eb8ff,12,15,2);
rim.position.set(4,4,-4);
scene.add(rim);

const groundMat=new THREE.MeshStandardMaterial({color:0x17140f,roughness:.96});
const ground=new THREE.Mesh(new THREE.PlaneGeometry(30,30),groundMat);
ground.rotation.x=-Math.PI/2;
ground.receiveShadow=true;
scene.add(ground);

function barkTexture(){
 const s=1024,c=document.createElement('canvas');c.width=c.height=s;
 const x=c.getContext('2d'),g=x.createLinearGradient(0,0,s,0);
 g.addColorStop(0,'#24150c');g.addColorStop(.12,'#6b3818');g.addColorStop(.35,'#3d2111');g.addColorStop(.55,'#79401c');g.addColorStop(.8,'#3a1f10');g.addColorStop(1,'#24140b');
 x.fillStyle=g;x.fillRect(0,0,s,s);
 for(let i=0;i<900;i++){
  const yy=Math.random()*s, amp=2+Math.random()*9, thick=Math.random()*4+1;
  x.beginPath();x.moveTo(0,yy);
  for(let xx=0;xx<=s;xx+=32)x.lineTo(xx,yy+Math.sin(xx*.018+Math.random())*amp);
  x.strokeStyle=Math.random()>.45?'rgba(120,66,29,.28)':'rgba(15,8,4,.35)';
  x.lineWidth=thick;x.stroke();
 }
 const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(2,1);t.colorSpace=THREE.SRGBColorSpace;
 return t;
}
const bark=barkTexture();

const logGroup=new THREE.Group();
logGroup.position.set(.4,1.15,0);
scene.add(logGroup);

const logMat=new THREE.MeshStandardMaterial({map:bark,roughness:.86});
const log=new THREE.Mesh(new THREE.CylinderGeometry(1.05,1.08,5.4,64,12),logMat);
log.rotation.z=Math.PI/2;
log.castShadow=true;log.receiveShadow=true;
logGroup.add(log);

const endCanvas=document.createElement('canvas');endCanvas.width=endCanvas.height=1024;
const ec=endCanvas.getContext('2d');
ec.fillStyle='#b8783b';ec.fillRect(0,0,1024,1024);
ec.translate(512,512);
for(let r=35;r<500;r+=28){
 ec.beginPath();ec.arc(0,0,r,0,Math.PI*2);
 ec.strokeStyle=r%56?'rgba(94,48,22,.52)':'rgba(229,151,79,.38)';
 ec.lineWidth=5+Math.random()*5;ec.stroke();
}
for(let i=0;i<260;i++){
 ec.beginPath();ec.arc((Math.random()-.5)*760,(Math.random()-.5)*760,Math.random()*8,0,Math.PI*2);
 ec.fillStyle='rgba(69,35,16,.22)';ec.fill();
}
const endTex=new THREE.CanvasTexture(endCanvas);endTex.colorSpace=THREE.SRGBColorSpace;
const endMat=new THREE.MeshStandardMaterial({map:endTex,roughness:.78});
const end=new THREE.Mesh(new THREE.CircleGeometry(1.0,64),endMat);
end.rotation.y=Math.PI/2;end.position.x=2.71;
end.castShadow=true;
logGroup.add(end);

const supportMat=new THREE.MeshStandardMaterial({color:0x29251d,roughness:.82});
for(const x of [-1.45,1.25]){
 const support=new THREE.Mesh(new THREE.BoxGeometry(.45,.9,2.1),supportMat);
 support.position.set(x,.45,0);
 support.rotation.z=x<0?-.22:.22;
 support.castShadow=true;support.receiveShadow=true;
 scene.add(support);
}

const saw=new THREE.Group();
saw.position.set(.05,2.12,.1);
saw.rotation.z=-.12;
scene.add(saw);

const bladeMat=new THREE.MeshStandardMaterial({color:0xaeb3ae,metalness:.8,roughness:.24});
const blade=new THREE.Mesh(new THREE.BoxGeometry(3.35,.055,.11),bladeMat);
blade.position.x=.9;blade.castShadow=true;saw.add(blade);
for(let x=-.75;x<2.58;x+=.105){
 const tooth=new THREE.Mesh(new THREE.ConeGeometry(.028,.085,3),bladeMat);
 tooth.position.set(x,-.062,0);tooth.rotation.z=Math.PI;tooth.castShadow=true;saw.add(tooth);
}
const handleMat=new THREE.MeshStandardMaterial({color:0x4b2513,roughness:.65});
const handle=new THREE.Mesh(new THREE.TorusGeometry(.31,.065,12,28,Math.PI*1.55),handleMat);
handle.rotation.z=Math.PI/2;handle.position.set(-.55,.05,0);handle.castShadow=true;saw.add(handle);
const grip=new THREE.Mesh(new THREE.CylinderGeometry(.105,.105,.72,20),handleMat);
grip.rotation.z=Math.PI/2;grip.position.set(-.63,.03,0);grip.castShadow=true;saw.add(grip);

const cut=new THREE.Mesh(new THREE.BoxGeometry(.08,1.8,2.05),new THREE.MeshStandardMaterial({color:0x251006,roughness:1}));
cut.position.set(.35,1.16,.02);cut.scale.y=.01;cut.visible=false;scene.add(cut);

const dustGroup=new THREE.Group();scene.add(dustGroup);
const dust=[];
const dustMat=new THREE.MeshStandardMaterial({color:0xd49a5a,roughness:1});
for(let i=0;i<110;i++){
 const p=new THREE.Mesh(new THREE.TetrahedronGeometry(THREE.MathUtils.randFloat(.012,.045),0),dustMat);
 p.visible=false;
 p.userData={v:new THREE.Vector3(),life:0};
 dustGroup.add(p);dust.push(p);
}

let worker=null,mixer=null,armL=null,armR=null,foreL=null,foreR=null,handL=null,handR=null;
const loader=new GLTFLoader();
const HUMAN_URL='https://raw.githubusercontent.com/kunalkushwaha/vsim/main/packages/assets/library/human.glb';

function findBone(root,names){
 let found=null;
 root.traverse(o=>{if(!found && o.isBone){const n=o.name.toLowerCase();if(names.some(v=>n===v||n.includes(v)))found=o;}});
 return found;
}

loader.load(HUMAN_URL,gltf=>{
 worker=gltf.scene;
 worker.scale.setScalar(.315);
 worker.position.set(-2.35,.02,.55);
 worker.rotation.y=Math.PI/2;
 worker.traverse(o=>{
  if(o.isMesh){o.castShadow=true;o.receiveShadow=true;
   if(o.material){o.material.envMapIntensity=1.1;o.material.roughness=Math.min(o.material.roughness??.7,.78);}
  }
 });
 scene.add(worker);
 if(gltf.animations.length){
  mixer=new THREE.AnimationMixer(worker);
  const idle=gltf.animations.find(a=>/idle|stand/i.test(a.name))||gltf.animations[0];
  mixer.clipAction(idle).play();
 }
 armL=findBone(worker,['upperarm.l','upper_arm.l','upperarm_l','leftarm']);
 armR=findBone(worker,['upperarm.r','upper_arm.r','upperarm_r','rightarm']);
 foreL=findBone(worker,['forearm.l','forearm_l','lowerarm_l','leftforearm']);
 foreR=findBone(worker,['forearm.r','forearm_r','lowerarm_r','rightforearm']);
 handL=findBone(worker,['hand.l','hand_l','lefthand']);
 handR=findBone(worker,['hand.r','hand_r','righthand']);
},undefined,e=>console.error('Human model failed to load',e));

const params={speed:1,autoRotate:false};
const gui=new GUI({title:'Realism Controls'});
gui.add(params,'speed',.2,2,.05).name('Saw speed');
gui.add(params,'autoRotate').name('Auto rotate');

let playing=true,time=0;
document.querySelector('#toggle').onclick=()=>{playing=!playing;document.querySelector('#toggle').textContent=playing?'Pause animation':'Play animation'};
document.querySelector('#reset').onclick=()=>{time=0;camera.position.set(7.2,3.6,8.8);controls.target.set(0,1.15,0);};

const clock=new THREE.Clock();
function spawnDust(){
 for(let i=0;i<3;i++){
  const p=dust.find(v=>!v.visible);if(!p)continue;
  p.visible=true;p.life=1;
  p.position.set(.35+THREE.MathUtils.randFloat(-.08,.08),1.85+THREE.MathUtils.randFloat(-.1,.1),THREE.MathUtils.randFloat(-.5,.5));
  p.userData.v.set(THREE.MathUtils.randFloat(.02,.09),THREE.MathUtils.randFloat(.02,.08),THREE.MathUtils.randFloat(-.04,.04));
 }
}
function animate(){
 requestAnimationFrame(animate);
 const dt=clock.getDelta();
 if(playing)time+=dt*params.speed;
 const stroke=Math.sin(time*4.2);
 saw.position.x=.05+stroke*.18;
 saw.rotation.z=-.12+stroke*.025;

 if(mixer&&playing)mixer.update(dt);
 if(worker){
  worker.position.y=.02+Math.abs(Math.sin(time*2.1))*.012;
  // Make the loaded humanoid lean into the work and drive both arms with the saw stroke.
  worker.rotation.z=-.055+Math.sin(time*2.1)*.018;
  if(armL)armL.rotation.x=-.72+stroke*.16;
  if(armR)armR.rotation.x=-.72-stroke*.16;
  if(foreL)foreL.rotation.x=-.62-stroke*.18;
  if(foreR)foreR.rotation.x=-.62+stroke*.18;
 }
 if(Math.abs(stroke)>.86&&playing)spawnDust();

 const cutDepth=(time%12)/12;
 cut.visible=cutDepth>.015;
 cut.scale.y=.02+cutDepth*.98;
 document.querySelector('#bar').style.width=(cutDepth*100)+'%';
 document.querySelector('#progressText').textContent='Cut depth '+Math.round(cutDepth*100)+'%';

 dust.forEach(p=>{
  if(!p.visible)return;
  p.life-=dt*1.5;
  p.position.addScaledVector(p.userData.v,dt*60);
  p.userData.v.y-=.0015;
  if(p.life<=0){p.visible=false;}
 });
 if(params.autoRotate)scene.rotation.y+=dt*.05;
 controls.update();
 renderer.render(scene,camera);
}
animate();

addEventListener('resize',()=>{
 camera.aspect=innerWidth/innerHeight;
 camera.updateProjectionMatrix();
 renderer.setSize(innerWidth,innerHeight);
});
