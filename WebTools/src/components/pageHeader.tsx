import * as React from 'react';
import { character } from '../common/character';
import { PageIdentity } from '../pages/pageIdentity';
import { withTranslation, WithTranslation } from 'react-i18next';
import { makeKey } from '../common/translationKey';

interface IPageHeaderProperties extends WithTranslation {
    page: PageIdentity;
}

class PageHeader extends React.Component<IPageHeaderProperties, {}> {
    render() {
        const title = this.getTitle();

        return (
            <div className="page-header">{title}</div>
        );
    }

    getTitle() {
        let key = makeKey('Page.title.', PageIdentity[this.props.page]);
        const { t } = this.props;

        if (key !== t(key)) {
            return t(key);
        } else if (this.props.page === PageIdentity.SoloCharacterEra) {
            return t('Page.title.era');
        } else if (this.props.page === PageIdentity.SoloSpecies) {
            return t('Page.title.species');
        } else if (this.props.page === PageIdentity.SupportingCharacter) {
            return "Supporting Character";
        } else if (this.props.page === PageIdentity.StarshipToolSelection) {
            return "Starship Tools";
        } else if (this.props.page === PageIdentity.StarshipTypeSelection) {
            return "Starship Type";
        } else if (this.props.page === PageIdentity.StarshipTalentSelection) {
            return "Starship Talents";
        } else if (this.props.page === PageIdentity.FinalStarshipDetails) {
            return "Final Details";
        } else if (this.props.page === PageIdentity.SimpleStarship) {
            return "Starship Stats";
        } else if (this.props.page === PageIdentity.SmallCraftStats) {
            return "Small Craft Stats";
        } else if (this.props.page === PageIdentity.StarshipWeaponsSelection) {
            return "Starship Weapons";
        } else if (this.props.page === PageIdentity.ToolSelection) {
            return "Registry";
        } else if (this.props.page === PageIdentity.CharacterType) {
            return "Character Type";
        } else if (this.props.page === PageIdentity.Species
                || this.props.page === PageIdentity.SpeciesDetails
                || this.props.page === PageIdentity.KobaliExtraSpeciesDetails
                || this.props.page === PageIdentity.LiberatedBorgSpeciesExtraDetails
                || this.props.page === PageIdentity.BorgSpeciesExtraDetails
                || this.props.page === PageIdentity.CyberneticallyEnhancedSpeciesExtraDetails
                || this.props.page === PageIdentity.BorgImplants
                || this.props.page === PageIdentity.Environment
                || this.props.page === PageIdentity.EnvironmentDetails
                || this.props.page === PageIdentity.ExtraFocus
                || this.props.page === PageIdentity.Upbringing
                || this.props.page === PageIdentity.UpbringingDetails
                || this.props.page === PageIdentity.StarfleetAcademy
                || this.props.page === PageIdentity.StarfleetAcademyDetails
                || this.props.page === PageIdentity.ChildCareer
                || this.props.page === PageIdentity.CadetCareer
                || this.props.page === PageIdentity.CadetSeniority
                || this.props.page === PageIdentity.ChildEducationPage
                || this.props.page === PageIdentity.ChildEducationDetailsPage
                || this.props.page === PageIdentity.CareerEvent1
                || this.props.page === PageIdentity.CareerDetails
                || this.props.page === PageIdentity.CareerEvent1Details
                || this.props.page === PageIdentity.CareerEvent2
                || this.props.page === PageIdentity.CareerEvent2Details
                || this.props.page === PageIdentity.AttributesAndDisciplines
                || this.props.page === PageIdentity.Finish) {
            return character.workflow?.currentStep()?.name || "";
        } else if (this.props.page === PageIdentity.SystemGeneration) {
            return "System Generation";
        } else if (this.props.page === PageIdentity.SectorDetails) {
            return "Sector Details";
        } else if (this.props.page === PageIdentity.SpaceframeOption) {
            return "Spaceframe Choice";
        } else if (this.props.page === PageIdentity.SpaceframeSelection) {
            return "Spaceframe Selection";
        } else if (this.props.page === PageIdentity.CustomSpaceframe) {
            return "Custom Spaceframe";
        } else if (this.props.page === PageIdentity.MissionProfileSelection) {
            return "Mission Profile";
        } else if (this.props.page === PageIdentity.MissionPodSelection) {
            return "Mission Pod";
        } else if (this.props.page === PageIdentity.StarshipRefits) {
            return "Starship Refits";
        } else if (this.props.page === PageIdentity.StarSystemDetails) {
            return "Star System Details";
        } else {
            return "";
        }
    }
}

export default withTranslation()(PageHeader);