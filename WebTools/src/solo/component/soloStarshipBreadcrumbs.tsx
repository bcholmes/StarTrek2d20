import { connect } from "react-redux";
import { starshipMapStateToProperties } from "../page/soloCharacterProperties";
import { PageIdentity } from "../../pages/pageIdentity";
import { useTranslation } from "react-i18next";
import { navigateTo } from "../../common/navigator";
import { Starship } from "../../common/starship";

interface ISoloCharacterBreadcrumbProperties {
    pageIdentity: PageIdentity;
    starship?: Starship;
}

const SoloStarshipBreadcrumbs: React.FC<ISoloCharacterBreadcrumbProperties> = ({starship, pageIdentity}) => {

    const { t } = useTranslation();

    const renderSpaceframe = () => {
        if (starship?.spaceframeModel != null && pageIdentity === PageIdentity.SoloStarshipSpaceframe) {
            return (<li className="breadcrumb-item active" aria-current="page">{t('Page.title.spaceframeSelection')}</li>);
        } else if (starship?.spaceframeModel) {
            return (<li className="breadcrumb-item"><a href="/index.html" onClick={(e) => navigateTo(e, PageIdentity.SoloStarshipSpaceframe)}>{t('Page.title.spaceframeSelection')}</a></li>);
        } else {
            return undefined;
        }
    }

    return (<nav aria-label="breadcrumb">
        <ol className="breadcrumb">
        <li className="breadcrumb-item"><a href="/index.html" onClick={(e) => navigateTo(e, PageIdentity.Home)}>{t('Page.title.home')}</a></li>
            <li className="breadcrumb-item"><a href="/index.html" onClick={(e) => navigateTo(e, PageIdentity.SourceSelection)}>{t('Page.title.sourceSelection')}</a></li>
            <li className="breadcrumb-item"><a href="/index.html" onClick={(e) => navigateTo(e, PageIdentity.SoloConstructType)}>{t('Page.title.soloConstructType')}</a></li>
            <li className="breadcrumb-item"><a href="/index.html" onClick={(e) => navigateTo(e, PageIdentity.SoloStarshipEra)}>{t('Page.title.era')}</a></li>
            {renderSpaceframe()}
        </ol>
    </nav>);
}

export default connect(starshipMapStateToProperties)(SoloStarshipBreadcrumbs);