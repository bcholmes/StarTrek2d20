import React from "react";
import { EventIdentity, Events } from "../../common/eventChannel";
import LcarsFrame from "../../components/lcarsFrame";
import { PageFactory } from "../../pages/pageFactory";
import { PageIdentity } from "../../pages/pageIdentity";

interface IModificationFrameState {
    activePage: PageIdentity;
}

class ModificationFramePage extends React.Component<{}, IModificationFrameState> {

    constructor(props) {
        super(props);
        this.state = {
            activePage: PageIdentity.ModificationTypeSelection
        };
    }

    componentDidMount() {
        Events.listen(EventIdentity.ShowPage, (page: any) => {
            this.activatePage(page as PageIdentity, false);
        });

        Events.listen(EventIdentity.HistoryBack, (page: any) => {
            this.activatePage(page as PageIdentity, true);
        });

        document.title = "Modify Character - STAR TREK ADVENTURES";
    }

    componentWillUnmount(): void {
        Events.removeAllListeners();
    }

    private activatePage(page: PageIdentity, isHistory: boolean) {
        document.getElementById("app")!.scrollTop = 0;

        if (page === this.state.activePage) {
            var pageComponent = document.getElementsByClassName('page')[0];
            pageComponent.classList.remove('page-out');
            return;
        }

        this.setState({
            ...this.state,
            activePage: page
        })
    }

    render() {
        const page = PageFactory.instance.createPage(this.state.activePage);
        return (<LcarsFrame activePage={this.state.activePage}>
                <div id="app">{page}</div>
            </LcarsFrame>);
    }
}

export default ModificationFramePage;