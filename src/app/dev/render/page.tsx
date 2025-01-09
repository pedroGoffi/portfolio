"use client";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import WebGL from "three/addons/capabilities/WebGL.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { 
  Vector2, 
  Vector3, 
  Mesh 
} from "three";
import { FontLoader }         from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry }       from 'three/examples/jsm/geometries/TextGeometry.js';
import { texture_lune }       from "./textures";
import { CreateModalTextBox } from "./modals";




let renderer:                 THREE.WebGLRenderer;
let scene:                    THREE.Scene;
let camera:                   THREE.PerspectiveCamera;
//let timer:                    number                = 0;
//let clock:                    THREE.Clock           = new THREE.Clock();
const environment:              Map<string, object>   = new Map<string, object>();
const GroundGridSize:           number                = 10;
const GroundGrindDivisions:     number                = 10;
const MoonPosition:             Vector3               = new Vector3(-3, 3, -3);
const raycaster:                THREE.Raycaster       = new THREE.Raycaster();
const mousePosition:            Vector2               = new Vector2();
const UI_CREATOR_TEXT_POSITION: Vector3               = new Vector3(-3, 6, 0);
type UD_oClick_t = (mesh: Mesh) => void;
// NOTE: UserData is injected into THREE objects to make more versatile use on the same object
interface UserData {
  onClick?: UD_oClick_t
}

// Enum for neon colors
enum Colors {
  NeonPink = 0xff2d5d,
  NeonBlue = 0x29c4dd,
  NeonPurple = 0x9b6fbd,
  NeonGreen = 0x39e288,
  NeonYellow = 0xfffc00,
  NeonOrange = 0xff8c00,
  NeonRed = 0xe50000,
  NeonLightBlue = 0x1f8cf5,
}
const MoveMesh = (mesh: Mesh, targetPosition: Vector3) => {
  mesh.position.add(targetPosition);
};

const CenterMesh = (mesh: Mesh) => {
  // Create a Box3 to compute the bounding box of the mesh
  const boundingBox = new THREE.Box3().setFromObject(mesh);

  // Calculate the center of the bounding box
  const center = new Vector3();
  boundingBox.getCenter(center);

  // Set the mesh position to the negative of the center to "center" it in the scene
  mesh.position.sub(center);
};
const MeshRotate = (mesh: Mesh, rotationOffset: THREE.Vector3): void => {
  // Get the current rotation as a Vector3
  const oldRotation: THREE.Vector3 = new THREE.Vector3(mesh.rotation.x, mesh.rotation.y, mesh.rotation.z);  
  // Calculate the new rotation by adding the offset
  const newRotation: THREE.Vector3 = oldRotation.add(rotationOffset);
  
  // Apply the new rotation to the mesh
  mesh.rotation.setFromVector3(newRotation);
    
}
// const CreateLine = (start: Vector3, end: Vector3, color: number): Mesh => 
// {
//   const geometry: THREE.BufferGeometry = new THREE.BufferGeometry().setFromPoints([start, end]);
//   const material: THREE.LineBasicMaterial = new THREE.LineBasicMaterial({ color })
// 
//   return new Mesh(geometry, material);
// }

const CreateMountain = (size: Vector3, position: Vector3, color: number) => {
  const geometry = new THREE.ConeGeometry(size.x, size.y, size.z);
  const material = new THREE.MeshStandardMaterial({
    color: color,
    emissive: color, // Neon effect
    emissiveIntensity: 1, // Glowing intensity
    flatShading: true,
  });

  const mountain = new Mesh(geometry, material);
  mountain.position.set(position.x, position.y, position.z); // Position the mountain
  return mountain;
};

const CreateMoon = (radius: number, position: Vector3, textureUrl: string): Mesh => {
  // Cria uma geometria esférica para representar a lua
  const geometry = new THREE.SphereGeometry(radius, 32, 32); // Usamos 32 subdivisões para a esfera

  // Carrega a textura da lua
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load(textureUrl);

  // Cria o material com a textura carregada
  const material = new THREE.MeshStandardMaterial({
    map: texture,  // Mapeia a textura para a superfície da esfera
    emissive: 0xaaaaaa,  // A lua emite um pouco de luz para dar um brilho suave
    emissiveIntensity: 0.2,  // Ajusta a intensidade do brilho da lua
    roughness: 0.6,  // Controle de rugosidade para simular uma superfície mais áspera
    metalness: 0.1  // Controla a quantidade de metalização para simular uma superfície rochosa
  });

  // Cria o mesh para a lua com a geometria e material definidos
  const moon = new Mesh(geometry, material);

  // Posiciona a lua na cena
  moon.position.set(position.x, position.y, position.z);

  return moon;
};
// Create the 3D text mesh and return a promise
const Create3DText = (text: string): Promise<THREE.Mesh> => {
  const fontLoader = new FontLoader();
  return new Promise((resolve, reject) => {
      // Load the font
      fontLoader.load(
          'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',
          (font) => {
              // Create the 3D text geometry
              const textGeometry = new TextGeometry(text, {
                  font: font,
                  size: 1, // Font size
                  depth: 0.2, // Depth of the text
                  curveSegments: 12,
                  bevelEnabled: true,
                  bevelThickness: 0.1,
                  bevelSize: 0.05,
              });

              // Create a material for the text
              const textMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });

              // Create a mesh for the text
              const textMesh = new THREE.Mesh(textGeometry, textMaterial);
              
              // Resolve the promise with the created text mesh
              resolve(textMesh);
          },
          undefined, // You can add a progress callback if needed
          (error) => reject(error) // Reject the promise if an error occurs
      );
  });
};
const CreateGlowingGrid = (size: number, divisions: number) => {
  // Create the grid helper, which contains both the ground and lines
  const gridHelper   = new THREE.GridHelper(size, divisions, Colors.NeonBlue, Colors.NeonPink);  
  return gridHelper;
};


const RenderUpdateMesh = (name: string, callback: (mesh: Mesh) => void) => {
  let foundMesh: Mesh;
  if(foundMesh = environment.get(name) as Mesh)
  {
    callback(foundMesh);
  }
}
// Render function to update the scene

const RenderUpdate = () => {  
  RenderUpdateMesh("moon", 
    (mesh: Mesh) => {
      const rotation: Vector3 = new Vector3(0, 1, 0.5);
      const rotationScale: number = 0.005;
      MeshRotate(mesh, rotation.multiplyScalar(rotationScale))
    }
  )  
  renderer.render(scene, camera);
};

const SettupRenderer = () => {
  if(typeof window != "undefined"){
    // Renderer setup
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
const SettupScene  = () => {
  scene = new THREE.Scene();
}
const SettupCamera = () => {
  if(typeof window != "undefined"){
    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const cameraPosition: Vector3 = new Vector3(10, 5, -0.3);    
    camera.position.add(cameraPosition);  
  }
}
// Wrap the render loop to handle animation
const RenderMainLoop = () => {
  requestAnimationFrame(RenderMainLoop);
  RenderUpdate();
};

// Takes a callback that returns a mesh and add it to the scene environment to be used in RenderUpdate
const RenderEnvAdd = (name: string, callback: () => Mesh, environment: Map<string, object>): Mesh => {
  environment.set(name, callback())
  return environment.get(name) as Mesh
}

const InjectUsedData = (mesh: Mesh, userData: UserData): void => {
  mesh.userData =  userData
}

const CreateUserData = (onClick?: UD_oClick_t): UserData  => {
    return {
      onClick: onClick
    }
}

const HandleCreathorClicked = (mesh: Mesh): void => {    
  const creathorDescriptionModalText: string = `
    <h2>Me chamo Pedro Henrique Goffi de Paulo</h2>
    <p>Tenho trabalhado em diversos projetos ao longo da minha jornada como desenvolvedor, sempre buscando novas soluções e desafiando meus limites técnicos.</p>
    <p>Alguns dos meus projetos incluem:</p>
    <ul>
        <li><strong>Pietra</strong>: Uma linguagem de programação que visa a geração de código de assembly x86_64. <br/> Focada em otimização de código e eficiência.</li> <br/>
        <li><strong>BinanceStatisticBot</strong>: Um bot desenvolvido em Python para análise de criptomoedas. <br/> Ele utiliza indicadores como Z-score, RSI e médias móveis para recomendar as melhores ações de compra, venda e hold.</li> <br/>
        <li><strong>youtube-download</strong>: Um simples script Python para baixar vídeos e músicas do YouTube, com funcionalidades como suporte a playlists e escolha de qualidade.</li> <br/>
        <li><strong>portfolio</strong>: Um site de portfólio pessoal desenvolvido com TypeScript. O objetivo é exibir meu trabalho de maneira eficiente e clara.</li> <br/>
    </ul>
    <p>Para ver mais projetos e colaborar, acesse meu <a href="https://github.com/pedroGoffi" target="_blank" style="color: #66ff66;">GitHub</a>.</p>
    <p>Estou sempre aberto a novas oportunidades! Vamos conversar? Conecte-se comigo no <a href="https://www.linkedin.com/in/pedro-henrique-goffi-de-paulo-bb0426230/" target="_blank" style="color: #66ff66;">LinkedIn</a>.</p>
  `;
  CreateModalTextBox("creathor-description", creathorDescriptionModalText)  
}

const HandleMoonClicked = (mesh: Mesh): void => {    
  if(typeof window != "undefined"){
    window.open("https://pt.wikipedia.org/wiki/Lua", "_blank")
  }
}

const RenderSceneAdd = (
  name: string,   
  // @ts-nocheck
  callback: () => any, 
  onClick?: UD_oClick_t
) => {
  const mesh: Mesh = RenderEnvAdd(name, callback, environment);      
  InjectUsedData(mesh, CreateUserData(onClick))
  scene.add(mesh)
}
const StartScene = async () => {
  RenderSceneAdd("ambientLight", 
    () => new THREE.AmbientLight(0x404040, 1.5)
  )  

  RenderSceneAdd("directionalLight",
    () => {
      const light: THREE.DirectionalLight = new THREE.DirectionalLight(0xffffff, 1)
      light.position.set(0, 10, 10)
      return light;

    }
  )

  RenderSceneAdd("gridHelper",
    () => CreateGlowingGrid(GroundGridSize, GroundGrindDivisions)
  )

  RenderSceneAdd("mountain",
    () => CreateMountain(new Vector3(1, 3, 5), new Vector3(-3, 1.5, 2), Colors.NeonPurple)
  )
  
  RenderSceneAdd("moon",
    () => CreateMoon(2, MoonPosition, texture_lune),
    (mesh: Mesh) => HandleMoonClicked(mesh)
  )
  
  
  const UI_CREATOR_TEXT: Mesh = await Create3DText("Sobre Mim");
  //UI_CREATOR_TEXT.position.add(UI_CREATOR_TEXT_POSITION)
  UI_CREATOR_TEXT.rotation.y += Math.PI / 2;
  CenterMesh(UI_CREATOR_TEXT)
  MoveMesh(UI_CREATOR_TEXT, UI_CREATOR_TEXT_POSITION);
  RenderSceneAdd("creathor-name-3d", 
    () => UI_CREATOR_TEXT,
    (mesh: Mesh) => HandleCreathorClicked(mesh)
  )
}
// Function to set up and start the scene rendering
const RenderThreeScene = () => {  
  StartScene()
  RenderMainLoop();
};

const ThreeWebGLUnavailable: React.FC = () => {
  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1 style={{ color: "red" }}>Error: WebGL Não possui suporte no seu navegador!</h1>
      <p>Por favor, hablite WebGL ou use um navegador com suporte. Para visualizar o conteudo</p>      
    </div>
  );
};

const UpdateMousePosition = (event: MouseEvent): void => {
  if(typeof window != "undefined"){
    // Normalize mouse coordinates to [-1, +1] for both axes  
    mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
    mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }
}
const OnMouseClick = (event: MouseEvent): void => {
  UpdateMousePosition(event);  
  raycaster.ray.origin.setFromMatrixPosition(camera.matrixWorld);
  raycaster.ray.direction.set(mousePosition.x, mousePosition.y, 1).unproject(camera).sub(raycaster.ray.origin).normalize()

  const intersects: THREE.Intersection<THREE.Object3D<THREE.Object3DEventMap>>[] = raycaster.intersectObjects(scene.children, true);
  
  for(const obj of intersects){
    const userData: UserData = obj.object.userData
    if(userData.onClick) userData.onClick(obj.object as Mesh)
  }

}
const ThreeScene: React.FC = () => {  

  const mountRef = useRef<HTMLDivElement>(null);
  const [webGLAvailable, setWebGLAvailable] = useState<boolean>(true);
    
  useEffect(() => {

    if (!WebGL.isWebGL2Available()) {
      setWebGLAvailable(false);
      return;
    }    
    SettupScene();
    SettupCamera();
    SettupRenderer();
    
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Smooth movement
    controls.dampingFactor = 0.25; // Damping factor to control the movement speed
    controls.screenSpacePanning = false; // Restrict pan to horizontal/vertical direction
    if (mountRef.current && !mountRef.current.contains(renderer.domElement)) {
      mountRef.current.appendChild(renderer.domElement);
    }
    
    RenderThreeScene();

    // Handle resizing
    const handleResize = () => {
      if (typeof window != "undefined"){ 
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
      }
    };
    if (typeof window != "undefined"){
      window.addEventListener("resize", handleResize);
    }

    // Cleanup on component unmount
    return () => {      
      renderer.dispose();
    };
  }, []);
  if (typeof window != "undefined") {
    window.addEventListener('click', OnMouseClick, false);
  }
  return (
    <div id="ThreeRoot">
      {webGLAvailable ? ( 
        <div ref={mountRef} style={{ width: "100%", height: "100%" }} /> 
      ): ( 
        <ThreeWebGLUnavailable /> 
      )};
    </div>
  );
};

export default ThreeScene;
