import "../styles/globals.css";
import { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <header>Header</header>
            <Component {...pageProps} />
            <footer>Footer</footer>
        </>
    );
}

export default MyApp;
