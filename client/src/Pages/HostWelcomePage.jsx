import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Sparkles, ArrowRight } from "lucide-react";

const HostWelcomePage = () => {
  const navigate = useNavigate();
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mark that user has seen welcome page
    localStorage.setItem("hasSeenHostWelcome", "true");

    // Load Three.js dynamically
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
    script.async = true;
    
    script.onload = () => {
      setIsLoading(false);
      initThreeJS();
    };
    
    document.body.appendChild(script);

    return () => {
      if (sceneRef.current) {
        if (sceneRef.current.cleanup) {
          sceneRef.current.cleanup();
        }
        if (mountRef.current && sceneRef.current.renderer) {
          mountRef.current.removeChild(sceneRef.current.renderer.domElement);
        }
      }
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const initThreeJS = () => {
    if (!window.THREE || !mountRef.current) return;

    const THREE = window.THREE;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8f9fa);

    const camera = new THREE.PerspectiveCamera(
      60,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(6, 4, 8);
    camera.lookAt(0, 1, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);

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
        
        // Window frame
        const frameGeometry = new THREE.BoxGeometry(0.7, 0.7, 0.1);
        const frameMaterial = new THREE.MeshStandardMaterial({ 
          color: 0xffffff,
          roughness: 0.5
        });
        const frame = new THREE.Mesh(frameGeometry, frameMaterial);
        windowGroup.add(frame);

        // Window glass
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

        // Window cross
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

      // Front windows
      house.add(createWindow(-1.2, 1.5, 1.55));
      house.add(createWindow(1.2, 1.5, 1.55));

      // Side windows
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

      // Chimney top
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

    // Ground with grass texture effect
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
    const animate = () => {
      requestAnimationFrame(animate);
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

    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('mouseup', onMouseUp);
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('mouseleave', onMouseUp);

    // Resize handler
    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    sceneRef.current = { 
      renderer, 
      cleanup: () => {
        renderer.domElement.removeEventListener('mousedown', onMouseDown);
        renderer.domElement.removeEventListener('mouseup', onMouseUp);
        renderer.domElement.removeEventListener('mousemove', onMouseMove);
        renderer.domElement.removeEventListener('mouseleave', onMouseUp);
        window.removeEventListener('resize', handleResize);
      }
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/10 flex">
      {/* Content - Left Side */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center lg:text-left space-y-6 max-w-xl">
          <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-primary animate-pulse" />
            <Home className="w-12 h-12 text-primary" />
            <Sparkles className="w-8 h-8 text-primary animate-pulse" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Welcome to Hosting! 🎉
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground">
            You're now a host! Start sharing your spaces, experiences, or services with guests around the world.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
            <Button 
              size="lg" 
              onClick={() => navigate("/host")}
              className="gap-2"
            >
              <Home className="w-5 h-5" />
              Create Your First Listing
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate("/host/dashboard")}
              className="gap-2"
            >
              Go to Dashboard
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>

          <p className="text-sm text-muted-foreground pt-4 hidden lg:block">
            Drag the house to rotate it • Click and explore
          </p>
        </div>
      </div>

      {/* 3D Scene - Right Side (Hidden on mobile/tablet) */}
      <div 
        ref={mountRef} 
        className="hidden lg:block flex-1 min-h-screen" 
      />

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background lg:left-1/2">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HostWelcomePage;