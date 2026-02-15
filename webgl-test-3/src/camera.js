import { viewMatrix } from "./math.js";

export class Camera{
  constructor(){
    this.pos=[0,1.7,10];
    this.yaw=0;
    this.pitch=0;
    this.keys={};
  }

  update(dt){
    const s=7*dt;

    const fx=Math.sin(this.yaw);
    const fz=Math.cos(this.yaw);
    const rx=fz, rz=-fx;

    // FIXED forward/back
    if(this.keys["KeyW"]){ this.pos[0]-=fx*s; this.pos[2]-=fz*s; }
    if(this.keys["KeyS"]){ this.pos[0]+=fx*s; this.pos[2]+=fz*s; }

    if(this.keys["KeyA"]){ this.pos[0]-=rx*s; this.pos[2]-=rz*s; }
    if(this.keys["KeyD"]){ this.pos[0]+=rx*s; this.pos[2]+=rz*s; }

    if(this.keys["KeyE"]) this.pos[1]+=s;
    if(this.keys["KeyQ"]) this.pos[1]-=s;
  }

  view(){
    return viewMatrix(this.pos,this.yaw,this.pitch);
  }
}

export function setupKeyboard(cam){
  onkeydown=e=>cam.keys[e.code]=true;
  onkeyup=e=>cam.keys[e.code]=false;
}

export function setupMouseLook(canvas,cam){
  document.body.onclick = ()=>canvas.requestPointerLock();

  document.addEventListener("mousemove",e=>{
    if(document.pointerLockElement!==canvas) return;
    cam.yaw -= e.movementX*0.002;
    cam.pitch -= e.movementY*0.002;
    cam.pitch = Math.max(-1.55,Math.min(1.55,cam.pitch));
  });
}
