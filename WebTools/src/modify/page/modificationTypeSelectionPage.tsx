import React, { useState } from "react";
import { connect } from "react-redux";
import { useTranslation } from 'react-i18next';
import { Character } from "../../common/character";
import { Header } from "../../components/header";
import { Button } from "../../components/button";
import { DropDownInput, DropDownElement, DropDownSelect  } from "../../components/dropDownInput";
import Modifications, { ModificationType } from "../model/modificationType";
import Milestones, { MilestoneType } from "../model/milestoneType";
import { navigateTo } from "../../common/navigator";
import { PageIdentity } from "../../pages/pageIdentity";
import { ModifyBreadcrumb } from "../modifyBreadcrumb";

interface ModificationTypeSelectionPageProperties {
    character?: Character;
    isModified: boolean;
}

const ModificationTypeSelectionPage: React.FC<ModificationTypeSelectionPageProperties> = ({character, isModified}) => {

    const [modificationType, setModificationType ] = useState(ModificationType.Reputation);
    const [milestoneType, setMilestoneType ] = useState(MilestoneType.NormalMilestone);
    const { t } = useTranslation();

    const getModificationTypes = () => {
        return Modifications.instance.getItems().map(t => new DropDownElement(t.type, t.localizedName));
    }

    const getMilestoneTypes = () => {
        return Milestones.instance.getItems().map(t => new DropDownElement(t.type, t.localizedName));
    }

    const nextPage = () => {
        if (modificationType === ModificationType.Reputation) {
            navigateTo(null, PageIdentity.ReputationChange);
        } else if (modificationType === ModificationType.Promotion) {
            navigateTo(null, PageIdentity.Promotion);
        } else if (modificationType === ModificationType.Milestone && milestoneType === MilestoneType.NormalMilestone) {
            navigateTo(null, PageIdentity.NormalMilestone);
        }
    }

    return (<div className="page container ms-0">
                <ModifyBreadcrumb />

                <Header>{t('Page.title.modificationTypeSelection')}</Header>
                <p>{t('ModificationTypeSelectionPage.instruction')}</p>

                <div>
                    <DropDownInput items={getModificationTypes()}
                        onChange={(index) => setModificationType(Modifications.instance.getItems()[index].type)} defaultValue={modificationType}/>
                </div>

                {modificationType === ModificationType.Milestone
                ?  (<div className="my-4">
                        <p>{t('ModificationTypeSelectionPage.whatMilestoneType')}</p>
                        <div>
                            <DropDownSelect items={getMilestoneTypes()} onChange={(type) => setMilestoneType(type as MilestoneType)} defaultValue={milestoneType}/>
                        </div>
                    </div>)
                : null}
                <div className="my-4 text-end">
                    <Button className="btn btn-primary btn-sm" onClick={() => nextPage()}>Next</Button>
                </div>
            </div>);

}

function mapStateToProps(state, ownProps) {
    return {
        character: state.character.currentCharacter,
        isModified: state.character.isModified
    };
}

export default connect(mapStateToProps)(ModificationTypeSelectionPage);