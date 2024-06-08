import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { Header } from "../components/header";
import { Button } from "react-bootstrap";
import { PageIdentity } from "./pageIdentity";
import { preventDefaultAnchorEvent } from "../common/navigator";
import LcarsFrame from "../components/lcarsFrame";

const OtherToolsPage = () => {

    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <LcarsFrame activePage={PageIdentity.OtherTools}>
            <div id="app">
                <div className="page container ms-0">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/index.html" onClick={(e) => preventDefaultAnchorEvent(e, () => navigate("/"))}>{t('Page.title.home')}</a></li>
                        <li className="breadcrumb-item active" aria-current="page">{t('Page.title.otherTools')}</li>
                    </ol>
                    </nav>
                    <main className="row">
                        <div className="col-12">
                            <Header>{t('Page.title.otherTools')}</Header>
                        </div>
                        <div className="col-md-8">
                            <p className="mt-3">
                                {t('Home.selection')}
                            </p>
                            <div className="button-column">
                                <Button className="mt-4" onClick={() => navigate("/tools/safety")} >{t('Page.title.safetyChecklist')}</Button>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </LcarsFrame>
    );
}

export default OtherToolsPage;