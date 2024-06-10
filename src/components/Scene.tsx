import { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Raycaster, Vector2 } from "three";
import Globe from "./Globe";

function Scene() {
    return (
        <Canvas>
            <ambientLight intensity={0.3} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <Globe />
            <OrbitControls />
        </Canvas>
    );
}

export default Scene;
