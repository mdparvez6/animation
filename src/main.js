import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.20.0/+esm';

const canvas=document.querySelector('#scene');
const scene=new THREE.Scene();
scene.background=new THREE.Color(0x090a08);
scene.fog=new THREE.FogExp2(0x090a08,0.035);

const camera=new THREE.PerspectiveCamera(40,innerWidth/innerHeight,0.05,100);
camera.position.set(6.4,3.25,7.8);

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
controls.target.set(.15,1.18,.35);
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
const warm=new THREE.PointLight(0xff9b52,18,8,2);
warm.position.set(-.5,2.8,2.5);
scene.add(warm);

const groundMat=new THREE.MeshStandardMaterial({color:0x17140f,roughness:.96});
const ground=new THREE.Mesh(new THREE.PlaneGeometry(30,30),groundMat);
ground.rotation.x=-Math.PI/2;
ground.receiveShadow=true;
scene.add(ground);

function barkTexture(){
 const s=1024,c=document.createElement('canvas');c.width=c.height=s;
 const x=c.getContext('2d');
 x.fillStyle='#5a2f16';x.fillRect(0,0,s,s);
 for(let i=0;i<420;i++){
  const xx=Math.random()*s;
  const width=THREE.MathUtils.randFloat(.7,4.5);
  const light=Math.random()>.42;
  x.beginPath();x.moveTo(xx,0);
  for(let yy=0;yy<=s;yy+=28){
   x.lineTo(xx+Math.sin(yy*.014+xx*.02)*THREE.MathUtils.randFloat(2,9),yy);
  }
  x.strokeStyle=light?'rgba(157,83,36,.34)':'rgba(24,11,5,.42)';
  x.lineWidth=width;x.stroke();
 }
 for(let i=0;i<1800;i++){
  const xx=Math.random()*s,yy=Math.random()*s;
  x.fillStyle=Math.random()>.5?'rgba(205,116,51,.08)':'rgba(10,5,2,.10)';
  x.fillRect(xx,yy,THREE.MathUtils.randFloat(.5,3),THREE.MathUtils.randFloat(2,12));
 }
 const t=new THREE.CanvasTexture(c);
 t.wrapS=t.wrapT=THREE.RepeatWrapping;
 t.repeat.set(1.15,1.05);
 t.colorSpace=THREE.SRGBColorSpace;
 t.anisotropy=renderer.capabilities.getMaxAnisotropy();
 return t;
}
const bark=barkTexture();

const logGroup=new THREE.Group();
logGroup.position.set(.45,.92,0);
scene.add(logGroup);

const logMat=new THREE.MeshStandardMaterial({map:bark,roughness:.86});
const log=new THREE.Mesh(new THREE.CylinderGeometry(.86,.9,4.9,64,16),logMat);
log.rotation.z=Math.PI/2;
log.castShadow=true;log.receiveShadow=true;
logGroup.add(log);

const endCanvas=document.createElement('canvas');endCanvas.width=endCanvas.height=1024;
const ec=endCanvas.getContext('2d');
ec.fillStyle='#b8783b';ec.fillRect(0,0,1024,1024);
ec.translate(512,512);
for(let r=28;r<420;r+=25){
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
const end=new THREE.Mesh(new THREE.CircleGeometry(.84,64),endMat);
end.rotation.y=Math.PI/2;end.position.x=2.41;
end.castShadow=true;
logGroup.add(end);

const supportMat=new THREE.MeshStandardMaterial({color:0x5a321a,roughness:.88});
function beam(x,z,rotY){
 const b=new THREE.Mesh(new THREE.BoxGeometry(.22,.9,2.0),supportMat);
 b.position.set(x,.45,z);b.rotation.z=rotY;b.castShadow=true;b.receiveShadow=true;scene.add(b);
}
for(const x of [-1.25,1.35]){
 beam(x,-.55,x<0?.42:-.42);
 beam(x,.55,x<0?-.42:.42);
 const cross=new THREE.Mesh(new THREE.BoxGeometry(.38,.18,2.0),supportMat);
 cross.position.set(x,.78,0);cross.castShadow=true;scene.add(cross);
}
const saw=new THREE.Group();
const sawBaseX=-1.30;
saw.position.set(sawBaseX,1.42,1.02);
saw.rotation.z=-.12;
scene.add(saw);

const bladeMat=new THREE.MeshStandardMaterial({color:0xaeb3ae,metalness:.8,roughness:.24});
const blade=new THREE.Mesh(new THREE.BoxGeometry(4.4,.06,.12),bladeMat);
blade.position.x=1.5;blade.castShadow=true;saw.add(blade);
for(let x=-.68;x<3.68;x+=.105){
 const tooth=new THREE.Mesh(new THREE.ConeGeometry(.028,.085,3),bladeMat);
 tooth.position.set(x,-.062,0);tooth.rotation.z=Math.PI;tooth.castShadow=true;saw.add(tooth);
}
const handleMat=new THREE.MeshStandardMaterial({color:0x4b2513,roughness:.65});
const handle=new THREE.Mesh(new THREE.TorusGeometry(.31,.065,12,28,Math.PI*1.55),handleMat);
handle.rotation.z=Math.PI/2;handle.position.set(-.55,.05,0);handle.castShadow=true;saw.add(handle);
const grip=new THREE.Mesh(new THREE.CylinderGeometry(.105,.105,.72,20),handleMat);
grip.rotation.z=Math.PI/2;grip.position.set(-.63,.03,0);grip.castShadow=true;saw.add(grip);

const cutMaterial=new THREE.MeshStandardMaterial({color:0x160b05,roughness:1});
const cut=new THREE.Mesh(new THREE.BoxGeometry(.035,1.55,.035),cutMaterial);
cut.position.set(.28,1.34,1.0);
cut.scale.y=.02;
cut.visible=false;
scene.add(cut);
const cutDustLine=new THREE.Mesh(new THREE.BoxGeometry(.045,1.65,.02),new THREE.MeshBasicMaterial({color:0x8b4a20,transparent:true,opacity:.45}));
cutDustLine.position.set(.28,1.34,1.015);
cutDustLine.scale.y=.02;
cutDustLine.visible=false;
scene.add(cutDustLine);

const dustGroup=new THREE.Group();scene.add(dustGroup);
const dust=[];
const dustMat=new THREE.MeshStandardMaterial({color:0xd49a5a,roughness:1});
for(let i=0;i<110;i++){
 const p=new THREE.Mesh(new THREE.TetrahedronGeometry(THREE.MathUtils.randFloat(.012,.045),0),dustMat);
 p.visible=false;
 p.userData={v:new THREE.Vector3(),life:0};
 dustGroup.add(p);dust.push(p);
}

let worker=null,mixer=null,armL=null,armR=null,foreL=null,foreR=null,handL=null,handR=null,workerBaseY=0,workerReady=false;
const loader=new GLTFLoader();
const HUMAN_URL='https://raw.githubusercontent.com/kunalkushwaha/vsim/main/packages/assets/library/human.glb';

function findBone(root,names){
 let found=null;
 root.traverse(o=>{if(!found && o.isBone){const n=o.name.toLowerCase();if(names.some(v=>n===v||n.includes(v)))found=o;}});
 return found;
}

loader.load(HUMAN_URL,gltf=>{
 worker=gltf.scene;
 const box=new THREE.Box3().setFromObject(gltf.scene);
 const size=box.getSize(new THREE.Vector3());
 const targetHeight=2.45;
 worker.scale.setScalar(targetHeight/Math.max(size.y,0.001));
 const scaledBox=new THREE.Box3().setFromObject(worker);
 worker.position.set(-1.85,-scaledBox.min.y,1.28);
 workerBaseY=worker.position.y;
 worker.rotation.y=Math.PI;
 worker.traverse(o=>{
  if(o.isMesh){o.castShadow=true;o.receiveShadow=true;
   if(o.material){o.material.envMapIntensity=1.1;o.material.roughness=Math.min(o.material.roughness??.7,.78);}
  }
 });
 scene.add(worker);
 workerReady=true;
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
},undefined,e=>{
 console.error('Human model failed to load',e);
 workerReady=false;
});

const params={speed:1,autoRotate:false};
const gui=new GUI({title:'Realism Controls'});
gui.add(params,'speed',.2,2,.05).name('Saw speed');
gui.add(params,'autoRotate').name('Auto rotate');

let playing=true,time=0;
document.querySelector('#toggle').onclick=()=>{playing=!playing;document.querySelector('#toggle').textContent=playing?'Pause animation':'Play animation'};
document.querySelector('#reset').onclick=()=>{time=0;camera.position.set(6.4,3.25,7.8);controls.target.set(.15,1.18,.35);};

const clock=new THREE.Clock();
function spawnDust(){
 for(let i=0;i<3;i++){
  const p=dust.find(v=>!v.visible);if(!p)continue;
  p.visible=true;p.life=1;
  p.position.set(.28+THREE.MathUtils.randFloat(-.06,.06),1.9+THREE.MathUtils.randFloat(-.18,.18),THREE.MathUtils.randFloat(.75,1.2));
  p.userData.v.set(THREE.MathUtils.randFloat(.02,.09),THREE.MathUtils.randFloat(.02,.08),THREE.MathUtils.randFloat(-.04,.04));
 }
}
function animate(){
 requestAnimationFrame(animate);
 const dt=clock.getDelta();
 if(playing)time+=dt*params.speed;
 const stroke=Math.sin(time*4.2);
 saw.position.x=sawBaseX+stroke*.20;
 saw.rotation.z=-.12+stroke*.025;

 if(mixer&&playing)mixer.update(dt);
 if(workerReady&&worker){
  worker.position.y=workerBaseY+Math.abs(Math.sin(time*2.1))*.006;
  // Make the loaded humanoid lean into the work and drive both arms with the saw stroke.
  worker.rotation.z=-.055+Math.sin(time*2.1)*.018;
  if(armL)armL.rotation.z+=stroke*.035;
  if(armR)armR.rotation.z-=stroke*.035;
  if(foreL)foreL.rotation.z-=stroke*.06;
  if(foreR)foreR.rotation.z+=stroke*.06;
 }
 if(Math.abs(stroke)>.86&&playing)spawnDust();

 const cutDepth=(time%12)/12;
 cut.visible=cutDepth>.015;
 cut.scale.y=.02+cutDepth*.98;
 cutDustLine.visible=cut.visible;
 cutDustLine.scale.y=cut.scale.y;
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
