import * as THREE from 'three';

export const init3DScene = (mountElement) => {
    if (!mountElement) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8f9fa);

    const camera = new THREE.PerspectiveCamera(
        60,
        mountElement.clientWidth / mountElement.clientHeight,
        0.1,
        1000
    );
    camera.position.set(6, 4, 8);
    camera.lookAt(0, 1, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountElement.clientWidth, mountElement.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountElement.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 15, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -10;
    directionalLight.shadow.camera.right = 10;
    directionalLight.shadow.camera.top = 10;
    directionalLight.shadow.camera.bottom = -10;
    scene.add(directionalLight);

    const fillLight = new THREE.DirectionalLight(0xffeedd, 0.3);
    fillLight.position.set(-5, 5, -5);
    scene.add(fillLight);

    // Create Realistic House
    const createHouse = () => {
        const house = new THREE.Group();

        // Foundation
        const foundationGeometry = new THREE.BoxGeometry(4.2, 0.2, 3.2);
        const foundationMaterial = new THREE.MeshStandardMaterial({
            color: 0x555555,
            roughness: 0.9
        });
        const foundation = new THREE.Mesh(foundationGeometry, foundationMaterial);
        foundation.position.y = 0.1;
        foundation.castShadow = true;
        foundation.receiveShadow = true;
        house.add(foundation);

        // Main building - textured walls
        const wallGeometry = new THREE.BoxGeometry(4, 2.5, 3);
        const wallMaterial = new THREE.MeshStandardMaterial({
            color: 0xf5f0e6,
            roughness: 0.8
        });
        const walls = new THREE.Mesh(wallGeometry, wallMaterial);
        walls.position.y = 1.45;
        walls.castShadow = true;
        walls.receiveShadow = true;
        house.add(walls);

        // Roof
        const roofShape = new THREE.Shape();
        roofShape.moveTo(-2.3, 0);
        roofShape.lineTo(0, 1.5);
        roofShape.lineTo(2.3, 0);
        roofShape.lineTo(-2.3, 0);

        const extrudeSettings = {
            steps: 1,
            depth: 3.4,
            bevelEnabled: false
        };

        const roofGeometry = new THREE.ExtrudeGeometry(roofShape, extrudeSettings);
        const roofMaterial = new THREE.MeshStandardMaterial({
            color: 0x8b4513,
            roughness: 0.7
        });
        const roof = new THREE.Mesh(roofGeometry, roofMaterial);
        roof.position.set(0, 2.7, -1.7);
        roof.castShadow = true;
        house.add(roof);

        // Door
        const doorGeometry = new THREE.BoxGeometry(0.7, 1.4, 0.1);
        const doorMaterial = new THREE.MeshStandardMaterial({
            color: 0x5c3317,
            roughness: 0.6
        });
        const door = new THREE.Mesh(doorGeometry, doorMaterial);
        door.position.set(0, 0.9, 1.55);
        house.add(door);

        // Door frame
        const doorFrameGeometry = new THREE.BoxGeometry(0.85, 1.55, 0.05);
        const doorFrameMaterial = new THREE.MeshStandardMaterial({
            color: 0xf5f5f5,
            roughness: 0.5
        });
        const doorFrame = new THREE.Mesh(doorFrameGeometry, doorFrameMaterial);
        doorFrame.position.set(0, 0.95, 1.53);
        house.add(doorFrame);

        // Door knob
        const knobGeometry = new THREE.SphereGeometry(0.05, 16, 16);
        const knobMaterial = new THREE.MeshStandardMaterial({
            color: 0xffd700,
            metalness: 0.8,
            roughness: 0.2
        });
        const knob = new THREE.Mesh(knobGeometry, knobMaterial);
        knob.position.set(0.25, 0.9, 1.6);
        house.add(knob);

        // Windows
        const createWindow = (x, y, z) => {
            const windowGroup = new THREE.Group();

            const frameGeometry = new THREE.BoxGeometry(0.7, 0.7, 0.1);
            const frameMaterial = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                roughness: 0.5
            });
            const frame = new THREE.Mesh(frameGeometry, frameMaterial);
            windowGroup.add(frame);

            const glassGeometry = new THREE.BoxGeometry(0.55, 0.55, 0.05);
            const glassMaterial = new THREE.MeshStandardMaterial({
                color: 0x87ceeb,
                transparent: true,
                opacity: 0.7,
                roughness: 0.1
            });
            const glass = new THREE.Mesh(glassGeometry, glassMaterial);
            glass.position.z = 0.03;
            windowGroup.add(glass);

            const crossVGeometry = new THREE.BoxGeometry(0.03, 0.55, 0.06);
            const crossHGeometry = new THREE.BoxGeometry(0.55, 0.03, 0.06);
            const crossMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
            const crossV = new THREE.Mesh(crossVGeometry, crossMaterial);
            const crossH = new THREE.Mesh(crossHGeometry, crossMaterial);
            crossV.position.z = 0.05;
            crossH.position.z = 0.05;
            windowGroup.add(crossV);
            windowGroup.add(crossH);

            windowGroup.position.set(x, y, z);
            return windowGroup;
        };

        house.add(createWindow(-1.2, 1.5, 1.55));
        house.add(createWindow(1.2, 1.5, 1.55));

        const sideWindow1 = createWindow(0, 1.5, 0);
        sideWindow1.rotation.y = Math.PI / 2;
        sideWindow1.position.set(2.05, 1.5, 0);
        house.add(sideWindow1);

        const sideWindow2 = createWindow(0, 1.5, 0);
        sideWindow2.rotation.y = -Math.PI / 2;
        sideWindow2.position.set(-2.05, 1.5, 0);
        house.add(sideWindow2);

        // Chimney
        const chimneyGeometry = new THREE.BoxGeometry(0.4, 1.2, 0.4);
        const chimneyMaterial = new THREE.MeshStandardMaterial({
            color: 0x8b0000,
            roughness: 0.8
        });
        const chimney = new THREE.Mesh(chimneyGeometry, chimneyMaterial);
        chimney.position.set(1.2, 3.5, -0.5);
        chimney.castShadow = true;
        house.add(chimney);

        const chimneyTopGeometry = new THREE.BoxGeometry(0.5, 0.1, 0.5);
        const chimneyTop = new THREE.Mesh(chimneyTopGeometry, chimneyMaterial);
        chimneyTop.position.set(1.2, 4.15, -0.5);
        house.add(chimneyTop);

        // Steps
        const stepGeometry = new THREE.BoxGeometry(1, 0.15, 0.4);
        const stepMaterial = new THREE.MeshStandardMaterial({
            color: 0x808080,
            roughness: 0.9
        });

        for (let i = 0; i < 2; i++) {
            const step = new THREE.Mesh(stepGeometry, stepMaterial);
            step.position.set(0, 0.075 + i * 0.15, 1.7 + i * 0.4);
            step.receiveShadow = true;
            house.add(step);
        }

        return house;
    };

    const house = createHouse();
    scene.add(house);

    // Ground
    const groundGeometry = new THREE.PlaneGeometry(20, 20);
    const groundMaterial = new THREE.MeshStandardMaterial({
        color: 0x7cba3d,
        roughness: 0.9
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Trees
    const createTree = (x, z) => {
        const tree = new THREE.Group();

        const trunkGeometry = new THREE.CylinderGeometry(0.15, 0.2, 1, 8);
        const trunkMaterial = new THREE.MeshStandardMaterial({
            color: 0x4a3728,
            roughness: 0.9
        });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.y = 0.5;
        trunk.castShadow = true;
        tree.add(trunk);

        const leavesGeometry = new THREE.ConeGeometry(0.8, 2, 8);
        const leavesMaterial = new THREE.MeshStandardMaterial({
            color: 0x228b22,
            roughness: 0.8
        });
        const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
        leaves.position.y = 2;
        leaves.castShadow = true;
        tree.add(leaves);

        tree.position.set(x, 0, z);
        return tree;
    };

    scene.add(createTree(-4, -2));
    scene.add(createTree(5, 1));
    scene.add(createTree(-3, 4));

    // Animation
    let rotationSpeed = 0.003;
    let animationId;
    const animate = () => {
        animationId = requestAnimationFrame(animate);
        house.rotation.y += rotationSpeed;
        renderer.render(scene, camera);
    };
    animate();

    // Mouse interaction
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = () => {
        isDragging = true;
        rotationSpeed = 0;
    };

    const onMouseUp = () => {
        isDragging = false;
        rotationSpeed = 0.003;
    };

    const onMouseMove = (e) => {
        if (isDragging) {
            const deltaX = e.clientX - previousMousePosition.x;
            house.rotation.y += deltaX * 0.01;
        }
        previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onMouseDown);
    domElement.addEventListener('mouseup', onMouseUp);
    domElement.addEventListener('mousemove', onMouseMove);
    domElement.addEventListener('mouseleave', onMouseUp);

    const handleResize = () => {
        if (!mountElement) return;
        camera.aspect = mountElement.clientWidth / mountElement.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(mountElement.clientWidth, mountElement.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
        cancelAnimationFrame(animationId);
        window.removeEventListener('resize', handleResize);
        domElement.removeEventListener('mousedown', onMouseDown);
        domElement.removeEventListener('mouseup', onMouseUp);
        domElement.removeEventListener('mousemove', onMouseMove);
        domElement.removeEventListener('mouseleave', onMouseUp);

        if (mountElement && domElement) {
            mountElement.removeChild(domElement);
        }

        renderer.dispose();
        scene.traverse((object) => {
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(material => material.dispose());
                } else {
                    object.material.dispose();
                }
            }
        });
    };
};
