import { useTranslation } from "react-i18next";
import { Starship } from "../../common/starship";
import { starshipMapStateToProperties } from "./soloCharacterProperties";
import { connect } from "react-redux";
import ReactMarkdown from "react-markdown";
import { Header } from "../../components/header";
import SoloStarshipBreadcrumbs from "../component/soloStarshipBreadcrumbs";
import { Button } from "../../components/button";

interface ISoloStarshipTalentsProperties {
    starship: Starship;
}

const SoloStarshipTalentsPage: React.FC<ISoloStarshipTalentsProperties> = ({starship}) => {

    const { t } = useTranslation();

    const navigateToNextPage = () => {

    }

    return (<div className="page container ms-0">
            <SoloStarshipBreadcrumbs />
            <Header>{t('Page.title.starshipTalentSelection')}</Header>

            <ReactMarkdown>
                {t('StarshipTalentSelection.instruction', { count: starship.scale, interpolation: { escapeValue: false } })}
            </ReactMarkdown>

            <div className='text-end mt-4'>
                <Button buttonType={true} className="btn btn-primary" onClick={() => navigateToNextPage() }>{t('Common.button.next')}</Button>
            </div>
        </div>);
}

export default connect(starshipMapStateToProperties)(SoloStarshipTalentsPage);