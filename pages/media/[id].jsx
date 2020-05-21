import Authorization from "../../components/Authorization";
import MediaDetail from "../../components/MediaDetail";
import Navigation from "../../components/Navigation";

export default function Media() {
    return (
        <Authorization>
            <Navigation />
            <MediaDetail />
        </Authorization>
    );
}
