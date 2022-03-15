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
        } else if (this.props.page === PageIdentity.Starship) {
            return "Starship";
        } else if (this.props.page === PageIdentity.ToolSelecton) {
            return "Registry";
        } else if (this.props.page === PageIdentity.CharacterType) {
            return "Character Type";
        } else if (this.props.page === PageIdentity.Species
                || this.props.page === PageIdentity.SpeciesDetails
                || this.props.page === PageIdentity.BorgImplants
                || this.props.page === PageIdentity.Environment
                || this.props.page === PageIdentity.EnvironmentDetails
                || this.props.page === PageIdentity.Upbringing
                || this.props.page === PageIdentity.UpbringingDetails
                || this.props.page === PageIdentity.StarfleetAcademy
                || this.props.page === PageIdentity.StarfleetAcademyDetails
                || this.props.page === PageIdentity.ChildCareer
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
        } else {
            return "";
        }
    }
}