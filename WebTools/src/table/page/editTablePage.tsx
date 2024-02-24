import { connect } from "react-redux";
import { TableCollection } from "../model/table";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import LcarsFrame from "../../components/lcarsFrame";
import { PageIdentity } from "../../pages/pageIdentity";
import { AccessingView } from "../../common/accessingView";
import { preventDefaultAnchorEvent } from "../../common/navigator";
import { Header } from "../../components/header";

interface IEditTablePageProperties {
    initial: boolean;
    tableCollection?: TableCollection;
}

const EditTablePage: React.FC<IEditTablePageProperties> = ({tableCollection, initial}) => {

    const { t } = useTranslation();
    const navigate = useNavigate();

    if (tableCollection == null) {
        setTimeout(() => {
            navigate("/table/list");
        }, 500);
        return (<LcarsFrame activePage={PageIdentity.ViewTable}>
                <div id="app">
                    <div className="page container ms-0">
                        <AccessingView />
                    </div>
                </div>
            </LcarsFrame>);
    } else {
        return (<LcarsFrame activePage={PageIdentity.ViewTable}>
            <div id="app">

                <div className="page container ms-0">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="/index.html">{t('Page.title.home')}</a></li>
                            <li className="breadcrumb-item"><a href="/table/list" onClick={(e) => preventDefaultAnchorEvent(e, () => navigate("/table/list"))}>{t('Page.title.tableList')}</a></li>
                            <li className="breadcrumb-item active" aria-current="page">{t('Page.title.viewTable')}</li>
                        </ol>
                    </nav>

                    <Header>{initial ? t('EditTablePage.header.createTable') : t('EditTablePage.header.modifyTable')}</Header>
                </div>
            </div>
        </LcarsFrame>);
    }
}

const mapStateToProps = (state) => {
    return {
        initial: true,
        tableCollection: state.table?.editing
    }
}

export default connect(mapStateToProps)(EditTablePage);