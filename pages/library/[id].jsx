import Authorization from "../../components/Authorization";
import Navigation from "../../components/Navigation";
import Head from "next/head";
import Library from "../../components/Library";

export default function Home() {

    return (
        <Authorization>
            <Navigation />
            <Library limit={20} />
        </Authorization>
    );
}
