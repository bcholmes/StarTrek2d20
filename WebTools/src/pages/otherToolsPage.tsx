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
                    <main>
                        <Header>{t('Page.title.otherTools')}</Header>
                        <p className="mt-3">
                            {t('OtherToolsPage.instruction')}
                        </p>
                        <div className="row row-cols-md-2 row-cols-1">
                            <div className="col mt-5">
                                <Header level={2}>{t('Page.title.safetyChecklist')}</Header>
                                <p className="mt-3">
                                    {t('OtherToolsPage.safetyChecklist.instruction')}
                                </p>
                                <div className="text-end mt-4">
                                    <Button onClick={() => navigate("/tools/safety")} >{t('Page.title.safetyChecklist')}</Button>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </LcarsFrame>
    );
}

export default OtherToolsPage;