import { useTranslation } from "react-i18next"
import { Header } from "../../components/header"
import LcarsFrame from "../../components/lcarsFrame"
import { PageIdentity } from "../../pages/pageIdentity"

const ViewTablePage: React.FC<{}> = () => {

    const { t } = useTranslation();

    return (<LcarsFrame activePage={PageIdentity.TableList}>
        <div id="app">

            <div className="page container ms-0">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="index.html">{t('Page.title.home')}</a></li>
                        <li className="breadcrumb-item active" aria-current="page">{t('Page.title.viewTable')}</li>
                    </ol>
                </nav>

                <main>
                    <Header>{t('Page.title.viewTable')}</Header>
                </main>
            </div>
        </div>
    </LcarsFrame>)
}

export default ViewTablePage;