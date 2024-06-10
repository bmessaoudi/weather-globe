import { extend, useFrame, useLoader, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import {
    AmbientLight,
    BufferGeometry,
    DirectionalLight,
    Float32BufferAttribute,
    Line,
    LineBasicMaterial,
    Mesh,
    Object3D,
    Object3DEventMap,
    TextureLoader,
    Vector2,
} from "three";
import { FeatureCollection, Geometry } from "geojson";
import { OrbitControls } from "@react-three/drei";

function Globe() {
    const globeRef = useRef<Mesh>(null);
    const controlsRef = useRef<any>(null);
    const texture = useLoader(TextureLoader, "/textures/earth16k.jpg");
    const mouseRef = useRef(new Vector2());
    const { camera, gl } = useThree();

    function handleMouseMove(event: MouseEvent) {
        mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    // Load the GeoJSON data and create lines
    useEffect(() => {
        async function fetchGeoData() {
            const response = await fetch("/geo.json");
            const geoData: FeatureCollection<Geometry> = await response.json();
            const lines = createLinesFromGeoJSON(geoData);
            lines.forEach((line: Object3D<Object3DEventMap>) => globeRef.current?.add(line));
        }

        fetchGeoData();
    }, []);

    // Function to create line geometries from GeoJSON data
    function createLinesFromGeoJSON(geoData: FeatureCollection<Geometry>) {
        const lines: Line[] = [];
        geoData.features.forEach(feature => {
            if (feature.geometry.type === "Polygon" || feature.geometry.type === "MultiPolygon") {
                const coordinates =
                    feature.geometry.type === "Polygon" ? [feature.geometry.coordinates] : feature.geometry.coordinates;
                coordinates.forEach(polygon => {
                    polygon.forEach(ring => {
                        const points: number[] = [];
                        ring.forEach(([lng, lat]) => {
                            const { x, y, z } = convertLatLngToXYZ(lat, lng, 5);
                            points.push(x, y, z);
                        });
                        const geometry = new BufferGeometry().setAttribute(
                            "position",
                            new Float32BufferAttribute(points, 3),
                        );
                        const material = new LineBasicMaterial({ color: 0xffffff });
                        const line = new Line(geometry, material);
                        lines.push(line);
                    });
                });
            }
        });
        return lines;
    }

    // Function to convert latitude and longitude to 3D coordinates
    function convertLatLngToXYZ(lat: number, lng: number, radius: number) {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lng + 180) * (Math.PI / 180);
        const x = -(radius * Math.sin(phi) * Math.cos(theta));
        const y = radius * Math.cos(phi);
        const z = radius * Math.sin(phi) * Math.sin(theta);
        return { x, y, z };
    }

    // Add lights and controls
    useEffect(() => {
        if (globeRef.current) {
            const ambientLight = new AmbientLight(0x404040); // soft white light
            const directionalLight = new DirectionalLight(0xffffff, 1);
            directionalLight.position.set(5, 5, 5).normalize();
            globeRef.current.add(ambientLight);
            globeRef.current.add(directionalLight);
        }
    }, []);

    useFrame(() => {
        controlsRef.current.update();
    });

    return (
        <group>
            <OrbitControls ref={controlsRef} args={[camera, gl.domElement]} />

            <mesh ref={globeRef} position={[0, 0, 0]}>
                <sphereGeometry args={[5, 32, 32]} />
                <meshStandardMaterial map={texture} />
            </mesh>
        </group>
    );
}

export default Globe;
