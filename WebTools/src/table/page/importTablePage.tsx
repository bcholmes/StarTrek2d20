import { AccessingView } from "../../common/accessingView";
import LcarsFrame from "../../components/lcarsFrame";
import { PageIdentity } from "../../pages/pageIdentity";
import TableMarshaller from "../model/tableMarshaller";

const ImportTablePage = () => {

    let url = new URL(window.location.href);
    let query = new URLSearchParams(url.search);
    let encodedTable = query.get('table');

    let collection = TableMarshaller.instance.unmarshall(encodedTable);

    return (
        <LcarsFrame activePage={PageIdentity.ImportTable}>
            <div id="app">
                <div className="ms-0 page container">
                    <AccessingView />
                </div>
            </div>
        </LcarsFrame>);
}

export default ImportTablePage;