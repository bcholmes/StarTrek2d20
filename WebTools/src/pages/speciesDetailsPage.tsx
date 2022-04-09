import * as React from 'react';
import { character } from '../common/character';
import { Navigation } from '../common/navigator';
import {IPageProperties} from './iPageProperties';
import {PageIdentity} from './pageIdentity';
import { SpeciesHelper } from '../helpers/species';
import { AttributesHelper } from '../helpers/attributes';
import { Skill } from '../helpers/skills';
import { TalentsHelper, TalentViewModel, ToViewModel } from '../helpers/talents';
import { AttributeView } from '../components/attribute';
import { AttributeImprovementCollection, AttributeImprovementCollectionMode } from '../components/attributeImprovement';
import { Button } from '../components/button';
import { CheckBox } from '../components/checkBox';
import { Dialog } from '../components/dialog';
import { TalentSelection } from '../components/talentSelection';
import { Source } from '../helpers/sources';
import { CharacterCreationBreadcrumbs } from '../components/characterCreationBreadcrumbs';
import { Species } from '../helpers/speciesEnum';
import { context } from '../common/context';

export class SpeciesDetailsPage extends React.Component<IPageProperties, {}> {
    private _selectedTalent: TalentViewModel;
    private _attributesDone: boolean;

    render() {
        var species = SpeciesHelper.getSpeciesByType(character.species);
        var paragraphs = species.description.split('\n');
        var description = paragraphs.map((p, i) => {
            return (<div className="desc-text" key={'text-' + i}>{p}</div>);
        });

        var mixed = character.mixedSpecies != null
            ? SpeciesHelper.getSpeciesByType(character.mixedSpecies)
            : null;

        let attributes = species.attributes.length > 3
            ? <AttributeImprovementCollection mode={AttributeImprovementCollectionMode.Species} points={3} onDone={(done) => { this.attributesDone(done); }} />
            : species.attributes.map((a, i) => {
                return <AttributeView key={i} name={AttributesHelper.getAttributeName(a)} points={1} value={character.attributes[a].value} />;
            });

        const selectDesc = species.attributes.length > 3 ? "(Select three)" : "";

        if (species.id === Species.Ktarian) {
            attributes =
            (
                <div>
                    <AttributeView name={AttributesHelper.getAttributeName(species.attributes[0])} points={1} value={character.attributes[species.attributes[0]].value} />
                    <AttributeView name={AttributesHelper.getAttributeName(species.attributes[1])} points={1} value={character.attributes[species.attributes[1]].value} />
                </div>
            );
        }

        const attributeSelection = species.id === Species.Ktarian
            ? (
                <div>
                    <div className="header-small">(Select one)</div>
                    <AttributeImprovementCollection mode={AttributeImprovementCollectionMode.Ktarian} points={1} onDone={(done) => { this.attributesDone(done); }} />
                </div>
              )
            : undefined;

        let talents = [];
        if (species.id === Species.Changeling) {
            talents.push(ToViewModel(TalentsHelper.getTalent("Morphogenic Matrix")));
        }
        else {
            talents.push(...TalentsHelper.getTalentsForSkills(character.skills.map(s => { return s.skill; })), ...TalentsHelper.getTalentsForSkills([Skill.None]));
        }

        const esotericTalentOption = (context.hasSource(Source.PlayersGuide)) ? (<div>
                <CheckBox
                    isChecked={context.allowEsotericTalents}
                    text="Allow esoterric talents (GM's decision)"
                    value={!context.allowEsotericTalents}
                    onChanged={() => { context.allowEsotericTalents = !context.allowEsotericTalents; this.forceUpdate(); }} />
            </div>) : undefined;

        const talentSelection = talents.length > 0 && character.workflow.currentStep().talentPrompt
            ? (<div className="panel">
                <div className="header-small">TALENTS</div>
                <div>
                    <CheckBox
                        isChecked={context.allowCrossSpeciesTalents}
                        text="Allow cross-species talents (GM's decision)"
                        value={!context.allowCrossSpeciesTalents}
                        onChanged={() => { context.allowCrossSpeciesTalents = !context.allowCrossSpeciesTalents; this.forceUpdate(); }} />
                </div>
                {esotericTalentOption}
                <TalentSelection talents={talents} onSelection={talents => this.onTalentSelected(talents.length > 0 ? talents[0] : undefined)} />
            </div>)
            : (<div className="panel">
                <div className="header-small">SPECIES OPTIONS</div>
                <div>
                    <CheckBox
                        isChecked={context.allowCrossSpeciesTalents}
                        text="Allow cross-species talents (GM's decision)"
                        value={!context.allowCrossSpeciesTalents}
                        onChanged={() => { context.allowCrossSpeciesTalents = !context.allowCrossSpeciesTalents; this.forceUpdate(); }} />
                </div>
                {esotericTalentOption}
              </div>);

        const mixedTrait = mixed != null
            ? (
                <div>
                    <div><b>{mixed.trait}</b></div>
                    <div>{mixed.traitDescription}</div>
                </div>
            )
            : undefined;

        const name = mixed != null
            ? `${species.name}/${mixed.name}`
            : species.name;

        return (
            <div className="page">
                <CharacterCreationBreadcrumbs />
                <div className="header-text"><div>{name}</div></div>
                <div className="panel">
                    {description}
                </div>
                <div className="panel">
                    <div className="header-small">ATTRIBUTES {selectDesc}</div>
                    {attributes}
                    {attributeSelection}
                </div>
                <div className="panel">
                    <div className="header-small">TRAIT</div>
                    <div><b>{species.trait}</b></div>
                    <div>{species.traitDescription}</div>
                    {mixedTrait}
                </div>
                {talentSelection}
                <Button text="ENVIRONMENT" className="button-next" onClick={() => this.onNext()} />
            </div>
        );
    }

    private attributesDone(done: boolean) {
        this._attributesDone = done;
    }

    private onTalentSelected(talent: TalentViewModel) {
        this._selectedTalent = talent;
    }

    private onNext() {
        var species = SpeciesHelper.getSpeciesByType(character.species);
        if (species.attributes.length > 3) {
            if (!this._attributesDone) {
                Dialog.show("You have not distributed all Attribute points.");
                return;
            }
        }

        if (character.workflow.currentStep().talentPrompt) {
            if (!this._selectedTalent) {
                Dialog.show("You have not selected a talent.");
                return;
            }

            character.addTalent(this._selectedTalent);

            if (this._selectedTalent.name === "The Ushaan") {
                character.addEquipment("Ushaan-tor ice pick");
            }
        }

        character.workflow.next();
        Navigation.navigateToPage(PageIdentity.Environment);
    }
}
