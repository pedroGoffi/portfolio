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
import { FBXLoader } from "three/examples/jsm/Addons.js";
import { OBJLoader } from "three/examples/jsm/Addons.js";
import { FontLoader }         from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry }       from 'three/examples/jsm/geometries/TextGeometry.js';
import { CreateModalTextBox } from "./modals";
import { createOrbitPath, EARTH_ECCENTRICITY, EARTH_SEMI_MAJOR_AXIS, MOON_ECCENTRICITY, MOON_ORBITAL_PERIOD, MOON_SEMI_MAJOR_AXIS, simulateEarthOrbit, simulateMoonOrbit } from "./physics";





let renderer:                   THREE.WebGLRenderer;
let scene:                      THREE.Scene;
let camera:                     THREE.PerspectiveCamera;
const PLANETS_SCALE_UXUI:       number                = 1e2
const SUN_SIZE:                 number                = 1;
const EARTH_SIZE:               number                = SUN_SIZE * 0.009 * PLANETS_SCALE_UXUI;
const MOON_SIZE:                number                = SUN_SIZE * 0.0025 * PLANETS_SCALE_UXUI;
const ORBIT_TIMESCALE:          number                = 1e6;
const ORBIT_SCALE_UXUI:         number                = 1e5;
const ORBIT_SCALE_UXUI_ROT:     number                = 1e2;
const ORBIT_SCALE:              number                = 1e-10;  // Scaling factor (smaller orbit)
let earthVelocity:              Vector3               = new Vector3(0, 30000, 0);
let moonVelocity:               Vector3               = new Vector3(0, 1000, 0);
let timer:                      number                = 0;
let clock:                      THREE.Clock           = new THREE.Clock();
const PAUSE_TIME:               boolean               = false;
const DEBUG:                    boolean               = false;
const environment:              Map<string, object>   = new Map<string, object>();
const MoonPosition:             Vector3               = new Vector3(-3, 3, -3);
const raycaster:                THREE.Raycaster       = new THREE.Raycaster();
const mousePosition:            Vector2               = new Vector2();

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


const GetMesh = (meshName: string): Mesh | undefined => {  
  return environment.get(meshName) as Mesh
}

const Setmesh = (meshName: string, mesh: Mesh): void => {  
  if(!GetMesh(meshName)) {
    environment.set(meshName, mesh);
  }
}

const SetMeshPosition = (mesh: Mesh, pos: Vector3) => {
  mesh.position.set(pos.x, pos.y, pos.z)
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

const CreateEarth = (radius: number, position: THREE.Vector3) => {
  const geometry = new THREE.SphereGeometry(radius, 32, 32);
  
  // Load the texture maps
  const textureLoader = new THREE.TextureLoader();
  const earthTexture = textureLoader.load("/assets/3DTextures/tex_earth.jpg");
  const earthSpecular = textureLoader.load("/assets/3DTextures/spec_earth.tif");
  const earthNormal = textureLoader.load("/assets/3DTextures/normals_earth.jpg"); // Load the normal map

  // Log the texture to ensure they're being loaded properly
  earthNormal.anisotropy = 16;  // Improve texture quality, particularly for normal maps
  console.log("Earth Normal Map Loaded: ", earthNormal);

  // Set texture properties
  earthNormal.wrapS = THREE.RepeatWrapping;
  earthNormal.wrapT = THREE.RepeatWrapping;
  earthNormal.minFilter = THREE.LinearFilter;
  earthNormal.magFilter = THREE.LinearFilter;

  // Create the material for Earth using MeshPhongMaterial
  const material = new THREE.MeshPhongMaterial({
    map: earthTexture,            // Apply the diffuse map (Earth's surface texture)
    specularMap: earthSpecular,   // Apply the specular map
    normalMap: earthNormal,       // Apply the normal map
    normalScale: new THREE.Vector2(10, 10), // Adjust normal map scaling (try with higher values like (2, 2) if necessary)
    shininess: 30,                // Adjust the shininess to control highlight sharpness
  });

  // Create the Earth mesh
  let mesh: THREE.Mesh = new THREE.Mesh(geometry, material);  
  mesh.castShadow = true
  mesh.receiveShadow = true
  mesh.position.set(position.x, position.y, position.z);
  
  return mesh;
};


const CreateSun = (radius: number, position: THREE.Vector3): THREE.Mesh => {
  // Create a sphere geometry for the sun
  const geometry = new THREE.SphereGeometry(radius, 32, 32);
  const textureLoader = new THREE.TextureLoader();
  const sunTexture = textureLoader.load("/assets/3DTextures/tex_sun.jpg")

  // Create a MeshStandardMaterial with emissive properties
  // Create material with enhanced emissive effect
  const material = new THREE.MeshStandardMaterial({
    color: 0xFFFF00, // Yellow color for the sun
    emissive: 0xFFFF00, // Emissive light in yellow
    emissiveIntensity: 0.5, // Increased emissive intensity for a brighter glow
    roughness: 0.2, // Reduced roughness for a smoother surface (slightly shiny)
    metalness: 0.3, // Slight metalness for a more realistic appearance
    map: sunTexture, // Applying the sun texture
    emissiveMap: sunTexture, // Applying the same texture for the emissive effect  
    side: THREE.DoubleSide, // To render both sides of the sphere (if it's a sphere)
  });
  // Create the mesh
  const sun = new THREE.Mesh(geometry, material);
  sun.position.set(position.x, position.y, position.z);
  
  return sun;
}
  
const CreateMoon = (radius: number, position: Vector3): Mesh => {
  // Cria uma geometria esférica para representar a lua
  const geometry = new THREE.SphereGeometry(radius, 32, 32); // Usamos 32 subdivisões para a esfera

  // Carrega a textura da lua
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load("/assets/3DTextures/tex_moon.jpg");

  // Cria o material com a textura carregada
  const material = new THREE.MeshStandardMaterial({
    map: texture,  // Mapeia a textura para a superfície da esfera
    emissive: 0xaaaaaa,  // A lua emite um pouco de luz para dar um brilho suave
    emissiveIntensity: 0,  // Ajusta a intensidade do brilho da lua
    roughness: 0.6,  // Controle de rugosidade para simular uma superfície mais áspera
    metalness: 0.1  // Controla a quantidade de metalização para simular uma superfície rochosa
  });

  // Cria o mesh para a lua com a geometria e material definidos
  const moon = new Mesh(geometry, material);
  moon.castShadow = true
  moon.receiveShadow = true

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
  let foundMesh: Mesh | undefined = GetMesh(name)
  if(!foundMesh) {
    console.warn(`Mesh ${name} not found`)      
    return 
  }
  callback(foundMesh);        
}


// Function to update positions
const RenderUpdate = () => {  
  timer += PAUSE_TIME? 0: clock.getDelta() * ORBIT_TIMESCALE

  // Get Earth and Moon positions
  
  const sunPosition:    Vector3   = new Vector3(); 
  const earthPosition:  Vector3   = simulateEarthOrbit(timer, earthVelocity).multiplyScalar(ORBIT_SCALE);
  const moonPosition:   Vector3   = simulateMoonOrbit(timer, moonVelocity).divideScalar(ORBIT_SCALE_UXUI);  
  
  
  

  // Update Sun, Earth, and Moon positions
  RenderUpdateMesh("sun", (mesh: THREE.Mesh) => mesh.position.copy(sunPosition));  
  RenderUpdateMesh("earth", (mesh: THREE.Mesh) => {
    mesh.position.copy(earthPosition);

    // Rotate Earth on its axis (1 full rotation per day)
    const earthRotationSpeed = (2 * Math.PI) / (86400); // 86400 seconds in a day
    mesh.rotation.y += earthRotationSpeed * timer * ORBIT_SCALE_UXUI_ROT;
  });    
  RenderUpdateMesh("moon-orbit",
    (mesh: Mesh) => {
      mesh.position.copy(GetMesh("earth")?.position!);      
    }
  )
  RenderUpdateMesh("moon", (mesh: THREE.Mesh) => {
    mesh.position.copy(earthPosition).add(moonPosition);

    // Rotate Moon on its axis (1 full rotation every 27.3 days)
    const moonRotationSpeed = (2 * Math.PI) / (MOON_ORBITAL_PERIOD); // Moon's rotation period in seconds (27.3 days)
    mesh.rotation.y += moonRotationSpeed * timer * ORBIT_SCALE_UXUI_ROT
  });



  // Render the scene
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
const RenderEnvAdd = (name: string, callback: () => Mesh): Mesh => {
  Setmesh(name, callback())  
  return GetMesh(name) as Mesh
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
  const mesh: Mesh = RenderEnvAdd(name, callback);      
  InjectUsedData(mesh, CreateUserData(onClick))
  
  if(DEBUG) {
    const helper: THREE.BoxHelper = new THREE.BoxHelper(mesh, Colors.NeonGreen)
    scene.add(helper)
  }

  scene.add(mesh)
}

// Function to create a spherical background with a texture applied to the inside
const CreateBackgroundSphere = (radius: number): THREE.Mesh => {
  const textureLoader = new THREE.TextureLoader();

  // Load the texture and check for successful loading
  const texture: THREE.Texture = textureLoader.load('/assets/3DTextures/milky_way.jpg');

  // Make sure the texture is ready to use
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;

  // Create a sphere geometry
  const sphereGeometry: THREE.SphereGeometry = new THREE.SphereGeometry(radius, 32, 32);  // Increase segments for higher resolution

  // Create a basic material using the texture
  const material: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({
    map: texture,  // Apply the texture to the material
    side: THREE.BackSide,  // Render the inside of the sphere
  });

  // Create the mesh with the geometry and material
  const sphere: THREE.Mesh = new THREE.Mesh(sphereGeometry, material);
  scene.background = new THREE.Color(0x000000);  // Set the background to black
  return sphere;  // Return the sphere mesh
};

const StartScene = async () => {        
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Set the shadow type to a softer one

  RenderSceneAdd("background",
    () => CreateBackgroundSphere(250)
  ) 
  
  RenderSceneAdd("moon",
    () => CreateMoon(MOON_SIZE, MoonPosition),
    (mesh: Mesh) => HandleMoonClicked(mesh)
  )
  // add Orbits
  RenderSceneAdd("moon-orbit", () => createOrbitPath(MOON_SEMI_MAJOR_AXIS * ORBIT_SCALE * 1e5, MOON_ECCENTRICITY))
  RenderSceneAdd("earth-orbit", () => createOrbitPath(EARTH_SEMI_MAJOR_AXIS * ORBIT_SCALE, EARTH_ECCENTRICITY))

  const earth = CreateEarth(EARTH_SIZE, new THREE.Vector3(0, 0, 0))
  RenderSceneAdd("earth",
    () => earth
  )
  RenderSceneAdd("light",
    () => {
      const sunlight = new THREE.DirectionalLight(0xFFFFFF, 0.5); // White light with intensity of 1
      sunlight.castShadow = true
      sunlight.position.set(0, 0, 0);  // Position the light far from the scene (Sun-like position)
      sunlight.target = earth; // a little hack u know
      return sunlight;
    }
  )

    
  RenderSceneAdd("sun", 
    () => CreateSun(SUN_SIZE, new THREE.Vector3(0, 0, 0))
  );

  
  
  

    
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
