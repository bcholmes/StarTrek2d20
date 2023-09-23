import { useTranslation } from "react-i18next";
import { Navigation } from "../../common/navigator";
import { PageIdentity } from "../../pages/pageIdentity";
import { Header } from "../../components/header";
import { SpeciesHelper, SpeciesModel } from "../../helpers/species";
import { connect } from "react-redux";
import { Species } from "../../helpers/speciesEnum";
import { makeKey } from "../../common/translationKey";
import { Attribute } from "../../helpers/attributes";
import { Window } from "../../common/window";
import { Button } from "../../components/button";
import { useState } from "react";
import { SpeciesRandomTable } from "../table/speciesRandomTable";
import store from "../../state/store";
import { setCharacterSpecies } from "../../state/characterActions";
import SoloCharacterBreadcrumbs from "../component/soloCharacterBreadcrumbs";
import { Character } from "../../common/character";
import { Era } from "../../helpers/eras";

interface ISoloSpeciesPageProperties {
    era: Era;
    character: Character;
}

const SoloSpeciesPage: React.FC<ISoloSpeciesPageProperties> = ({era, character}) => {

    const selectSpecies = (species: SpeciesModel) => {
        if (species.attributes?.length === 3) {
            store.dispatch(setCharacterSpecies(species.id, species.attributes));
        } else {
            store.dispatch(setCharacterSpecies(species.id));
        }
        Navigation.navigateToPage(PageIdentity.SoloSpeciesDetails);
    }

    const { t } = useTranslation();
    const [randomSpecies, setRandomSpecies] = useState(character?.speciesStep?.species);

    let speciesList = SpeciesHelper.getCaptainsLogSpecies();
    if (randomSpecies != null) {
        speciesList = [SpeciesHelper.getSpeciesByType(randomSpecies)];
    }
    let speciesRows = speciesList.map((s,i) => {
        const attributes = s.id === Species.Ktarian
            ? (
                <div key={'species-' + s.id}>
                    <div>{t('Construct.attribute.control')}</div>
                    <div>{t('Construct.attribute.reason')}</div>
                    <div>Fitness or Presence</div>
                </div>
            )
            : s.attributes.map((a, i) => {
                return <div key={i}>{t(makeKey('Construct.attribute.', Attribute[a])) }</div>;
            });

        return (
            <tr key={i} onClick={() => { if (Window.isCompact()) selectSpecies(s); }}>
                <td className="selection-header">{s.localizedName}</td>
                <td>{attributes}</td>
                <td className="text-right"><Button buttonType={true} className="button-small"onClick={() => { selectSpecies(s) }} >{t('Common.button.select')}</Button></td>
            </tr>
        );
    });

    return (
        <div className="page container ml-0">
            <SoloCharacterBreadcrumbs pageIdentity={PageIdentity.SoloSpecies} />
            <Header>{t('Page.title.species')}</Header>
            <p className="mt-3">
                {t('SoloSpeciesPage.instruction')}
            </p>

            <div className="my-4">
                <Button buttonType={true} className="btn btn-primary btn-sm mr-3" onClick={() => setRandomSpecies( SpeciesRandomTable(era)) }>
                    <img src="/static/img/d20.svg" style={{height: "24px", aspectRatio: "1"}} className="mr-1" alt={t('Common.button.random')}/> {t('Common.button.random')}
                </Button>
                {randomSpecies != null ? (<Button buttonType={true} className="btn btn-primary btn-sm mr-3" onClick={() => setRandomSpecies(null)} >{t('Common.button.showAll')}</Button>) : undefined}
            </div>

            <table className="selection-list">
                    <thead>
                        <tr>
                            <td></td>
                            <td><b>{t('Construct.other.attributes')}</b></td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        {speciesRows}
                    </tbody>
                </table>
        </div>);
}

function mapStateToProps(state, ownProps) {
    return {
        era: state.context.era,
        character: state.character.currentCharacter
    };
}



export default connect(mapStateToProps)(SoloSpeciesPage);