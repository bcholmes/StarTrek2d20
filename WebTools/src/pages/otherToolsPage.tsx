import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { Header } from "../components/header";
import { Button } from "react-bootstrap";
import { PageIdentity } from "./pageIdentity";
import { navigateTo } from "../common/navigator";

const OtherToolsPage = () => {

    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <div className="page container ms-0">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                <li className="breadcrumb-item"><a href="/index.html" onClick={(e) => navigateTo(e, PageIdentity.Home)}>{t('Page.title.home')}</a></li>
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
                        <Button className="mt-4" onClick={() => navigate("/safety")} >{t('Page.title.safetyChecklist')}</Button>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default OtherToolsPage;