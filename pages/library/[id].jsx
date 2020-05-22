import Authorization from "../../components/Authorization";
import Navigation from "../../components/Navigation";
import Library from "../../components/Library";

export default function Home() {

    return (
        <Authorization>
            <Navigation />
            <Library limit={20} />
        </Authorization>
    );
}
