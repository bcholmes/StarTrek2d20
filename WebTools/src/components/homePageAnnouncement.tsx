import { Header } from "./header";

const HomePageAnnouncement = () => {
    if (true) {
        return undefined;
    } else {
        return (<div className="my-4">
                <Header level={2}>Congratulations</Header>
                <p>Congratulations to everyone at Modiphius, and to Jim J., Michael D., Josh A., Alison C., and many others,
                    including designer team Michael C., Roo T., and Jane R. for the Origins nomination for <cite>Captain's Log</cite> {' '}
                    in the category of Best RPG Core Product.</p>
                <p>Even if it wasn't a win, it's still incredible recognition for an excellent product. Well done!</p>
            </div>);
    }
}

export default HomePageAnnouncement;