import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Mesh, Raycaster, TextureLoader, Vector2 } from "three";

function Globe() {
    const globeRef = useRef<Mesh>(null);
    const texture = useLoader(TextureLoader, "/textures/earth.jpg");

    const raycasterRef = useRef(new Raycaster());
    const mouseRef = useRef(new Vector2());
    const { scene, camera } = useThree();

    const handleMouseMove = (event: MouseEvent) => {
        mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    useFrame(() => {
        if (globeRef.current) {
            globeRef.current.rotation.y += 0.001; // Rotazione lenta del globo
        }
    });

    useFrame(() => {
        raycasterRef.current.setFromCamera(mouseRef.current, camera);
        const intersects = raycasterRef.current.intersectObjects(scene.children);

        if (intersects.length > 0) {
            const intersectedObject = intersects[0].object;
            // Logica per identificare gli stati al passaggio del mouse
            console.log(intersectedObject); // Per ora, stampiamo l'oggetto intercettato
        }
    });

    return (
        <mesh ref={globeRef} position={[0, 0, 0]}>
            <sphereGeometry args={[5, 32, 32]} />
            <meshStandardMaterial map={texture} />
        </mesh>
    );
}

export default Globe;
