import toast from "react-hot-toast";
import { AccessingView } from "../../common/accessingView";
import LcarsFrame from "../../components/lcarsFrame";
import { PageIdentity } from "../../pages/pageIdentity";
import { isTableCollectionAlreadyImported } from "../../state/tableFunctions";
import TableMarshaller from "../model/tableMarshaller";
import { useNavigate } from "react-router";
import store from "../../state/store";
import { importTableCollection, setTableCollectionSelection } from "../../state/tableActions";

const ImportTablePage = () => {

    const navigate = useNavigate();

    let url = new URL(window.location.href);
    let query = new URLSearchParams(url.search);
    let encodedTable = query.get('table');

    let collection = TableMarshaller.instance.unmarshall(encodedTable);

    if (isTableCollectionAlreadyImported(collection.name, encodedTable)) {

        setTimeout(() => {
            navigate("/table/list");
            toast("This table has already been imported", { className: "bg-warning" });
        }, 500);
    } else {
        setTimeout(() => {
            store.dispatch(importTableCollection(collection));
            store.dispatch(setTableCollectionSelection(collection));
            navigate("/table/view");
            toast("Table successfully imported.", { className: "bg-success" });
        }, 500);
    }

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