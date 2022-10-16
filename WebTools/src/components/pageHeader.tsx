import * as React from 'react';
import { character } from '../common/character';
import { PageIdentity } from '../pages/pageIdentity';

interface IPageHeaderProperties {
    page: PageIdentity;
}

export class PageHeader extends React.Component<IPageHeaderProperties, {}> {
    render() {
        const title = this.getTitle();

        return (
            <div className="page-header">{title}</div>
        );
    }

    getTitle() {
        if (this.props.page === PageIdentity.Selection) {
            return "Home";
        } else if (this.props.page === PageIdentity.TalentsOverview) {
            return "Talents Overview";
        } else if (this.props.page === PageIdentity.Era) {
            return "Era";
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
        } else if (this.props.page === PageIdentity.Starship) {
            return "Starship";
        } else if (this.props.page === PageIdentity.ToolSelecton) {
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
            return character.workflow.currentStep().name;
        } else if (this.props.page === PageIdentity.SystemGeneration) {
            return "System Generation";
        } else if (this.props.page === PageIdentity.SectorDetails) {
            return "Sector Details";
        } else if (this.props.page === PageIdentity.StarSystemDetails) {
            return "Star System Details";
        } else if (this.props.page === PageIdentity.ViewSheet) {
            return "View Sheet";
        } else if (this.props.page === PageIdentity.CreditsPage) {
            return "Credits";
        } else {
            return "";
        }
    }
}