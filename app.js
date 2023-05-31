import * as THREE from 'three';
import {
    GLTFLoader
} from 'three/addons/loaders/GLTFLoader.js';

//construire scena
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

//creare lumini
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
ambientLight.intensity = 0.2;

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 0);
scene.add(directionalLight);



//construire camera 
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(1, 0, 20);

//construire renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

//adaugare model GLB
const loader = new GLTFLoader();
let model = null;

loader.load('boeing.glb', function(gltf) {
    model = gltf.scene;
    model.scale.set(0.3, 0.3, 0.3)
    model.rotation.y = 250;
    model.position.set(-15, 7, 0);
    scene.add(model);
    console.log(model);
}, undefined, function(error) {
    console.error(error);
});

//adaugare iarba (Texture, Mesh, Geometry)
const grassTexture = new THREE.TextureLoader().load('grass.jpg');
grassTexture.wrapS = THREE.RepeatWrapping;
grassTexture.wrapT = THREE.RepeatWrapping;
grassTexture.repeat.set(25, 25);
grassTexture.anisotropy = 4;
grassTexture.encoding = THREE.sRGBEncoding;

const groundMaterial = new THREE.MeshStandardMaterial({
    map: grassTexture
});
const groundGeometry = new THREE.PlaneGeometry(1000, 1000, 100, 100);
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -10;
scene.add(ground);


//adaugare cer
const skyGeometry = new THREE.SphereGeometry(900, 32, 32);
const skyTexture = new THREE.TextureLoader().load('clouds.jpg');
const skyMaterial = new THREE.MeshBasicMaterial({
    map: skyTexture,
    side: THREE.BackSide
});
const skyBox = new THREE.Mesh(skyGeometry, skyMaterial);
scene.add(skyBox);


//adaugare pista
const runwayTexture = new THREE.TextureLoader().load('gray.png');
runwayTexture.wrapS = THREE.RepeatWrapping;
runwayTexture.wrapT = THREE.RepeatWrapping;
runwayTexture.repeat.set(10, 10);
runwayTexture.anisotropy = 4;
runwayTexture.encoding = THREE.sRGBEncoding;

const runwayMaterial = new THREE.MeshStandardMaterial({
    map: runwayTexture
});
const runwayGeometry = new THREE.PlaneGeometry(20, 1000, 100, 100);
const runway = new THREE.Mesh(runwayGeometry, runwayMaterial);
runway.rotation.x = -Math.PI / 2;
runway.rotation.z = -Math.PI / 2.5;
runway.position.y = -9.9;
runway.position.x = -40;
scene.add(runway);

const coordinatesDiv = document.createElement('div');
coordinatesDiv.style.position = 'absolute';
coordinatesDiv.style.top = '10px';
coordinatesDiv.style.left = '10px';
document.body.appendChild(coordinatesDiv);

const secondDiv = document.createElement('div');
secondDiv.style.position = 'absolute';
secondDiv.style.top = '100px';
secondDiv.style.left = '10px';
document.body.appendChild(secondDiv);

//actualizare coordonate
function updateCoordinates() {
    if (model) {
        const {
            x,
            y,
            z
        } = model.position;
        changeLight(model);
        coordinatesDiv.innerText = `Airplane coordinates: 
     y: ${y.toFixed(2)}
    x: ${x.toFixed(2)}
    z: ${z.toFixed(2)}`;
    }
    requestAnimationFrame(updateCoordinates);
}
requestAnimationFrame(updateCoordinates);

//particule ploaie
const particleCount = 1000;
const particles = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    positions[i3] = Math.random() * 200 - 100; // x
    positions[i3 + 1] = Math.random() * 200 - 100; // y
    positions[i3 + 2] = Math.random() * 200 - 100; // z
}

//particule ploaie
particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const material = new THREE.PointsMaterial({
    size: 1,
    color: 0xFFFFFF,
    map: new THREE.TextureLoader().load('raindrop.png'),
    transparent: true,
});
const points = new THREE.Points(particles, material);
scene.add(points);

function animateRain() {
    const time = performance.now() * 0.001;
    const speed = 0.05;
    const direction = new THREE.Vector3(0, -1, 0);
    const delta = speed * time;
    points.geometry.attributes.position.array.forEach((position, index) => {
        points.geometry.attributes.position.array[index] += direction.getComponent(index % 3) * delta;
        if (points.geometry.attributes.position.array[index] < -100) {
            points.geometry.attributes.position.array[index] = Math.random() * 200 - 100;
        }
    });
    points.geometry.attributes.position.needsUpdate = true;
}

//adaugare turn
const texture = new THREE.TextureLoader().load('tower_air.png');
const materialTower = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    alphaTest: 0.5
});
const geometry = new THREE.PlaneGeometry(10, 10);
const towerMesh = new THREE.Mesh(geometry, materialTower);
towerMesh.position.x = 20;
towerMesh.position.y = -1;
scene.add(towerMesh);

// creare cerc turn
const circleGeometry = new THREE.CircleGeometry(0.5, 32);
const circleMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ff00
});
const circleMesh = new THREE.Mesh(circleGeometry, circleMaterial);
circleMesh.position.set(20.9, 4.3, -1);
circleMesh.renderOrder = 1;
scene.add(circleMesh);

// creare lumina pentru turn
const circleLight = new THREE.PointLight(0x00ff00, 1, 10);
circleLight.position.copy(circleMesh.position);
scene.add(circleLight);

let keys = {};

function changeLight(model) {
    const airplanePos = model.position;
    const towerPos = towerMesh.position;

    const distance = airplanePos.distanceTo(towerPos);

    if (distance < 20 && distance >= 10) {
        circleMaterial.color.set(0xffff00);
        circleLight.color.set(0xffff00);
        secondDiv.innerText = "Atentie! Pericol de coliziune !!!";
    } else if (distance < 10 && distance > 0) {
        circleMaterial.color.set(0xff0000);
        circleLight.color.set(0xff0000);
        secondDiv.innerText = "Avionul s-a prabusit";
        const texture = new THREE.TextureLoader().load('explosion.png');
        const materialTower = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            alphaTest: 0.5
        });
        const geometry = new THREE.PlaneGeometry(10, 8);
        const towerMesh = new THREE.Mesh(geometry, materialTower);
        towerMesh.position.x = 18;
        towerMesh.position.y = -1;
        scene.add(towerMesh);

        model.visible = false;

        setTimeout(function() {}, 5);
    } else {
        secondDiv.innerText = "Avionul se apropie de turn";
        circleMaterial.color.set(0x00ff00);
        circleLight.color.set(0x00ff00);
    }
}

function handleKeyDown(event) {
    keys[event.key] = true;
    event.preventDefault();
}

function handleKeyUp(event) {
    keys[event.key] = false;
    event.preventDefault();
}


//animatie avion (deplasare stanga, dreapta, sus, jos folosind tastatura)
function animate() {
    requestAnimationFrame(animate);
    if (model) {
        if (keys.ArrowUp) {
            model.translateY(0.05);
        }
        if (keys.ArrowDown) {
            model.translateY(-0.05);
        }
        if (keys.ArrowLeft) {
            model.translateZ(0.05);
        }
        if (keys.ArrowRight) {
            model.translateZ(-0.07);
        }
        if (keys.ArrowUp && keys.ArrowRight) {
            model.rotation.z += 0.001;
        }
    }

    animateRain();
    renderer.render(scene, camera);
}

window.addEventListener("keydown", handleKeyDown);
window.addEventListener("keyup", handleKeyUp);

animate();