import dynamic from "next/dynamic";

const Scene = dynamic(() => import("../components/Scene"), { ssr: false });

function Home() {
    return (
        <div style={{ width: "100vw", height: "100vh" }}>
            <Scene />
        </div>
    );
}

export default Home;
