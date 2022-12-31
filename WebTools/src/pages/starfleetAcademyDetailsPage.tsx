import * as React from 'react';
import {character} from '../common/character';
import {CharacterType} from '../common/characterType';
import {Navigation} from '../common/navigator';
import {IPageProperties} from './iPageProperties';
import {TracksHelper} from '../helpers/tracks';
import {Skill} from '../helpers/skills';
import {AttributeImprovementCollection, AttributeImprovementCollectionMode} from '../components/attributeImprovementCollection';
import {Button} from '../components/button';
import {Dialog} from '../components/dialog';
import {ValueInput, Value} from '../components/valueInput';
import {MajorsList} from '../components/majorsList';
import SkillView from '../components/skill';
import { TalentsHelper, TalentViewModel } from '../helpers/talents';
import { Header } from '../components/header';
import CharacterCreationBreadcrumbs from '../components/characterCreationBreadcrumbs';
import { SingleTalentSelectionList } from '../components/singleTalentSelectionList';
import { Track } from '../helpers/trackEnum';

export class StarfleetAcademyDetailsPage extends React.Component<IPageProperties, {}> {
    private _talent: TalentViewModel;
    private _focus1: HTMLInputElement;
    private _focus2: HTMLInputElement;
    private _focus3: HTMLInputElement;
    private _trait: HTMLInputElement;
    private _attributesDone: boolean;
    private _skillsDone: boolean;

    render() {
        const track = TracksHelper.instance().getTrack(character.track);

        if (character.track === Track.EnlistedSecurityTraining) {
            return this.renderEnlistedSecurityTrainingDetails();
        }
        else if (character.track === Track.ShipOperations) {
            return this.renderShipOperationsDetails();
        }
        else if (character.track === Track.UniversityAlumni) {
            return this.renderUniversityAlumniDetails();
        }
        else if (character.track === Track.ResearchInternship) {
            return this.renderResearchInternshipDetails();
        }

        let training = "Select three focuses for your character, at least one reflecting the time at Starfleet Academy.";
        if (character.type === CharacterType.KlingonWarrior) {
            if (character.enlisted) {
                training = "Select three focuses for your character, at least one reflecting their time training.";
            } else {
                training = "Select three focuses for your character, at least one reflecting the time at KDF Academy.";
            }
        }

        return (
            <div className="page">
                <Header>{track.name}</Header>
                <div className="panel">
                    <div className="desc-text">{track.description}</div>
                </div>
                <div className="panel">
                    <div className="header-small">ATTRIBUTES (Select up to three)</div>
                    <AttributeImprovementCollection mode={AttributeImprovementCollectionMode.Academy} points={3} onDone={(done) => { this._attributesDone = done; } } rule={track.attributesRule}/>
                </div>
                <MajorsList skills={track.majorDisciplines} onDone={(done) => {this._skillsDone = done; this.forceUpdate() }} rule={track.skillsRule}/>
                <div className="panel">
                    <div className="header-small">FOCUS</div>
                    <div>{training}</div>
                    <div>
                        <div className="textinput-label">FOCUS</div>
                        <input type="text" ref={(input) => { this._focus1 = input; } } />
                    </div>
                    <div>
                        <div className="textinput-label">FOCUS</div>
                        <input type="text" ref={(input) => { this._focus2 = input; } } />
                    </div>
                    <div>
                        <div className="textinput-label">FOCUS</div>
                        <input type="text" ref={(input) => { this._focus3 = input; } } />
                    </div>
                    <div><b>Suggestions: </b> {track.focusSuggestions.join(", ")}</div>
                </div>
                <div className="panel">
                    <div className="header-small">TALENT</div>
                    <SingleTalentSelectionList talents={this.filterTalentList()}
                        construct={character} onSelection={(talent) => { this.onTalentSelected(talent) } }/>
                </div>
                <div className="panel">
                    <div className="header-small">VALUE</div>
                    <ValueInput value={Value.Track}/>
                </div>
                <Button text="CAREER" className="button-next" onClick={() => this.onNext() }/>
            </div>
        );
    }

    private renderEnlistedSecurityTrainingDetails() {
        const track = TracksHelper.instance().getTrack(character.track);

        return (
            <div className="page">
                <div className="header-text"><div>{track.name}</div></div>
                <div className="panel">
                    <div className="desc-text">{track.description}</div>
                </div>
                <div className="panel">
                    <div className="header-small">ATTRIBUTES (Select up to three) </div>
                    <AttributeImprovementCollection mode={AttributeImprovementCollectionMode.Academy} points={3} onDone={(done) => { this._attributesDone = done; } }/>
                </div>
                <div className="panel">
                    <div className="header-small">DISCIPLINES</div>
                    <SkillView points={2} skill={Skill.Security} />
                    <SkillView points={1} skill={Skill.Conn} />
                    <SkillView points={1} skill={Skill.Engineering} />
                </div>
                <div className="panel">
                    <div className="header-small">FOCUS</div>
                    <div>Select two focuses for your character. You have already gained the <b>Chain of Command</b> focus.</div>
                    <div>
                        <div className="textinput-label">FOCUS</div>
                        <input type="text" ref={(input) => { this._focus1 = input; } } />
                    </div>
                    <div>
                        <div className="textinput-label">FOCUS</div>
                        <input type="text" ref={(input) => { this._focus2 = input; } } />
                    </div>
                    <div><b>Suggestions: </b> {track.focusSuggestions.join(", ") }</div>
                </div>
                <div className="panel">
                    <div className="header-small">TALENT</div>
                    <SingleTalentSelectionList talents={this.filterTalentList()}
                        construct={character} onSelection={(talent) => { this.onTalentSelected(talent) } }/>
                </div>
                <div className="panel">
                    <div className="header-small">VALUE</div>
                    <ValueInput value={Value.Track}/>
                </div>
                <Button text="CAREER" className="button-next" onClick={() => this.onNext() }/>
            </div>
        );
    }

    private renderShipOperationsDetails() {
        const track = TracksHelper.instance().getTrack(character.track);

        return (
            <div className="page">
                <div className="header-text"><div>{track.name}</div></div>
                <div className="panel">
                    <div className="desc-text">{track.description}</div>
                </div>
                <div className="panel">
                    <div className="header-small">ATTRIBUTES (Select up to three) </div>
                    <AttributeImprovementCollection mode={AttributeImprovementCollectionMode.Academy} points={3} onDone={(done) => { this._attributesDone = done; } }/>
                </div>
                <div className="panel">
                    <div className="header-small">DISCIPLINES</div>
                    <SkillView points={2} skill={Skill.Conn} />
                    <SkillView points={1} skill={Skill.Engineering} />
                    <SkillView points={1} skill={Skill.Science} />
                </div>
                <div className="panel">
                    <div className="header-small">FOCUS</div>
                    <div>Select three focuses for your character.</div>
                    <div>
                        <div className="textinput-label">FOCUS</div>
                        <input type="text" ref={(input) => { this._focus1 = input; } } />
                    </div>
                    <div>
                        <div className="textinput-label">FOCUS</div>
                        <input type="text" ref={(input) => { this._focus2 = input; } } />
                    </div>
                    <div>
                        <div className="textinput-label">FOCUS</div>
                        <input type="text" ref={(input) => { this._focus3 = input; } } />
                    </div>
                    <div><b>Suggestions: </b> {track.focusSuggestions.join(", ") }</div>
                </div>
                <div className="panel">
                    <div className="header-small">TALENT</div>
                    <SingleTalentSelectionList talents={this.filterTalentList()}
                        onSelection={(talent) => { this.onTalentSelected(talent) } }
                        construct={character} />
                </div>
                <div className="panel">
                    <div className="header-small">VALUE</div>
                    <ValueInput value={Value.Track}/>
                </div>
                <Button text="CAREER" className="button-next" onClick={() => this.onNext() }/>
            </div>
        );
    }

    private renderUniversityAlumniDetails() {
        const track = TracksHelper.instance().getTrack(character.track);

        return (
            <div className="page">
                <CharacterCreationBreadcrumbs />
                <div className="header-text"><div>{track.name}</div></div>
                <div className="panel">
                    <div className="desc-text">{track.description}</div>
                </div>
                <div className="panel">
                    <div className="header-small">ATTRIBUTES (Select up to three) </div>
                    <AttributeImprovementCollection mode={AttributeImprovementCollectionMode.Academy} points={3} onDone={(done) => { this._attributesDone = done; } }/>
                </div>
                <div className="panel">
                    <div className="header-small">DISCIPLINES</div>
                    <SkillView points={2} skill={Skill.Science} />
                    <SkillView points={1} skill={Skill.Engineering} />
                    <SkillView points={1} skill={Skill.Command} />
                </div>
                <div className="panel">
                    <div className="header-small">FOCUS</div>
                    <div>Select three focuses for your character.</div>
                    <div>
                        <div className="textinput-label">FOCUS</div>
                        <input type="text" ref={(input) => { this._focus1 = input; } } />
                    </div>
                    <div>
                        <div className="textinput-label">FOCUS</div>
                        <input type="text" ref={(input) => { this._focus2 = input; } } />
                    </div>
                    <div>
                        <div className="textinput-label">FOCUS</div>
                        <input type="text" ref={(input) => { this._focus3 = input; } } />
                    </div>
                    <div><b>Suggestions: </b> {track.focusSuggestions.join(", ") }</div>
                </div>
                <div className="panel">
                    <div className="header-small">TRAIT</div>
                    <div>Define a trait that reflects the time, people and relationships that were important to the character during their time on campus.</div>
                    <div>Example: <i>Alumni of Stanford - Class of '59</i></div>
                    <div>
                        <div className="textinput-label">TRAIT</div>
                        <input type="text" ref={(input) => { this._trait = input; } } />
                    </div>
                </div>
                <div className="panel">
                    <div className="header-small">TALENT</div>
                    <SingleTalentSelectionList talents={this.filterTalentList()}
                        construct={character} onSelection={(talent) => { this.onTalentSelected(talent) } }/>
                </div>
                <div className="panel">
                    <div className="header-small">VALUE</div>
                    <ValueInput value={Value.Track}/>
                </div>
                <Button text="CAREER" className="button-next" onClick={() => this.onNext() }/>
            </div>
        );
    }

    private renderResearchInternshipDetails() {
        const track = TracksHelper.instance().getTrack(character.track);

        return (
            <div className="page">
                <div className="header-text"><div>{track.name}</div></div>
                <div className="panel">
                    <div className="desc-text">{track.description}</div>
                </div>
                <div className="panel">
                    <div className="header-small">ATTRIBUTES (Select up to three) </div>
                    <AttributeImprovementCollection mode={AttributeImprovementCollectionMode.Academy} points={3} onDone={(done) => { this._attributesDone = done; } }/>
                </div>
                <div className="panel">
                    <div className="header-small">DISCIPLINES</div>
                    <SkillView points={2} skill={Skill.Science} />
                    <SkillView points={1} skill={Skill.Engineering} />
                    <SkillView points={1} skill={Skill.Medicine} />
                </div>
                <div className="panel">
                    <div className="header-small">FOCUS</div>
                    <div>Select three focuses for your character.</div>
                    <div>
                        <div className="textinput-label">FOCUS</div>
                        <input type="text" ref={(input) => { this._focus1 = input; } } />
                    </div>
                    <div>
                        <div className="textinput-label">FOCUS</div>
                        <input type="text" ref={(input) => { this._focus2 = input; } } />
                    </div>
                    <div>
                        <div className="textinput-label">FOCUS</div>
                        <input type="text" ref={(input) => { this._focus3 = input; } } />
                    </div>
                    <div><b>Suggestions: </b> {track.focusSuggestions.join(", ") }</div>
                </div>
                <div className="panel">
                    <div className="header-small">TRAIT</div>
                    <div>Define a trait that reflects the research and scientific work done during the character's internship.</div>
                    <div>Example: <i>Nanoprobe Breakthrough</i></div>
                    <div>
                        <div className="textinput-label">TRAIT</div>
                        <input type="text" ref={(input) => { this._trait = input; } } />
                    </div>
                </div>
                <div className="panel">
                    <div className="header-small">TALENT</div>
                    <SingleTalentSelectionList talents={this.filterTalentList()}
                        construct={character} onSelection={(talent) => { this.onTalentSelected(talent) } }/>
                </div>
                <div className="panel">
                    <div className="header-small">VALUE</div>
                    <ValueInput value={Value.Track}/>
                </div>
                <Button text="CAREER" className="button-next" onClick={() => this.onNext() }/>
            </div>
        );
    }

    filterTalentList() {
        return TalentsHelper.getAllAvailableTalentsForCharacter(character).filter(
            t => !character.hasTalent(t.name) || (this._talent != null && t.name === this._talent.name) || t.rank > 1);
    }

    private onTalentSelected(talent?: TalentViewModel) {
        this._talent = talent;
        this.forceUpdate();
    }

    private onNext() {
        const ignoresDisciplineRequirements =
            character.track === Track.EnlistedSecurityTraining ||
            character.track === Track.ShipOperations ||
            character.track === Track.ResearchInternship ||
            character.track === Track.UniversityAlumni;

        if (!this._attributesDone) {
            Dialog.show("You have not distributed all Attribute points.");
            return;
        }

        if (!this._skillsDone && !ignoresDisciplineRequirements) {
            Dialog.show("You must select one major and two other disciplines before proceeding.");
            return;
        }
        if (!this._talent) {
            Dialog.show("You must select a talent before proceeding.");
            return;
        }

        var focus1 = this._focus1.value;
        var focus2 = this._focus2.value;
        var focus3 = this._focus3 ? this._focus3.value : null;

        if (!ignoresDisciplineRequirements) {
            if (!focus1 || focus1.length === 0 ||
                !focus2 || focus2.length === 0 ||
                !focus3 || focus3.length === 0) {
                Dialog.show("You need to type in three Focuses. Choose from the suggestions if you cannot come up with your own.");
                return;
            }
        }
        else {
            if (!focus1 || focus1.length === 0 ||
                !focus2 || focus2.length === 0) {
                Dialog.show("You need to type in two Focuses. Choose from the suggestions if you cannot come up with your own.");
                return;
            }
        }

        character.addFocus(focus1);
        character.addFocus(focus2);

        if (focus3 && focus3.length > 0) {
            character.addFocus(focus3);
        }

        var trait = this._trait ? this._trait.value : null;
        if (trait && trait.length > 0) {
            character.addTrait(trait);
        }

        character.addTalent(this._talent);

        character.workflow.next();
        Navigation.navigateToPage(character.workflow.currentStep().page);
    }
}
