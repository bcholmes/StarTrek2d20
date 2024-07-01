import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import LcarsFrame from "../../components/lcarsFrame";
import { PageIdentity } from "../../pages/pageIdentity";
import { Header } from "../../components/header";
import { preventDefaultAnchorEvent } from "../../common/navigator";
import { Button } from "react-bootstrap";
import { starshipGenerator } from "../model/starshipGenerator";
import { Era, eraDefaultYear } from "../../helpers/eras";
import ReactMarkdown from "react-markdown";
import { DropDownElement, DropDownSelect } from "../../components/dropDownInput";
import { RandomStarshipCharacterType, RandomStarshipCharacterTypes } from "../model/randomStarshipCharacterTypes";
import { useState } from "react";
import { marshaller } from "../../helpers/marshaller";
import { connect } from "react-redux";
import { ServiceYearSelector } from "../view/serviceYearView";

interface IRandomStarshipProperties {
    era: Era;
}

const RandomStarshipPage: React.FC<IRandomStarshipProperties> = ({ era }) => {

    const { t } = useTranslation();
    const navigate = useNavigate();
    const [ type, setType ] = useState(RandomStarshipCharacterType.Starfleet);
    const [ campaignYear, setCampaignYear ] = useState(eraDefaultYear(era));

    const createStarship = () => {
        let starship = starshipGenerator({
            era: era,
            campaignYear: campaignYear,
            type: type
        });

        const value = marshaller.encodeStarship(starship);
        window.open('/view?s=' + value, "_blank");
    }

    return (
        <LcarsFrame activePage={PageIdentity.RandomStarship}>
            <div id="app">
                <div className="page container ms-0">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/index.html" onClick={(e) => preventDefaultAnchorEvent(e, () => navigate("/"))}>{t('Page.title.home')}</a></li>
                        <li className="breadcrumb-item active" aria-current="page">{t('Page.title.randomStarship')}</li>
                    </ol>
                    </nav>
                    <main>
                        <Header>{t('Page.title.randomStarship')}</Header>
                        <ReactMarkdown>{t('RandomStarshipPage.instructions')}</ReactMarkdown>
                        <div className="row">
                            <div className="col-md-6 mt-4">
                                <Header level={2}>{t('Construct.other.starshipType')}</Header>

                                <div className="my-4">
                                    <DropDownSelect
                                        items={ RandomStarshipCharacterTypes.instance.types.map(t => new DropDownElement(t.type, t.localizedName )) }
                                        defaultValue={ type ?? "" }
                                        onChange={(type) => setType(type as RandomStarshipCharacterType) }/>
                                </div>
                            </div>
                            <div className="col-md-6 mt-4">
                                <Header level={2}>{t('StarshipTypeSelection.campaignYear')}</Header>

                                <div className="my-4">
                                    <ServiceYearSelector campaignYear={campaignYear} onChange={year => setCampaignYear(year)} />
                                </div>
                            </div>

                        </div>
                        <div className="mt-5 text-end">
                            <Button className="btn btn-primary" onClick={() => createStarship()}>{t('Common.button.create')}</Button>
                        </div>

                    </main>
                </div>
            </div>
        </LcarsFrame>
    );
}

function mapStateToProps(state, ownProps) {
    return {
        era: state.context.era
    };
}
export default connect(mapStateToProps)(RandomStarshipPage);