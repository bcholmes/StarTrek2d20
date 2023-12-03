import * as React from 'react';
import {character, CharacterRank, SpeciesStep } from '../common/character';
import {CharacterType, CharacterTypeModel } from '../common/characterType';
import {SpeciesHelper} from '../helpers/species';
import {DropDownElement, DropDownInput, DropDownSelect} from '../components/dropDownInput';
import SupportingCharacterAttributes from '../components/supportingCharacterAttributes';
import SupportingCharacterDisciplines from '../components/supportingCharacterDisciplines';
import {Rank, RanksHelper} from '../helpers/ranks';
import {Button} from '../components/button';
import {CharacterSheetDialog} from '../components/characterSheetDialog'
import {CharacterSheetRegistry} from '../helpers/sheets';
import AgeHelper, { Age } from '../helpers/age';
import { Source } from '../helpers/sources';
import { marshaller } from '../helpers/marshaller';
import { Species } from '../helpers/speciesEnum';
import store from '../state/store';
import { hasSource } from '../state/contextFunctions';
import { Header } from '../components/header';
import { InputFieldAndLabel } from '../common/inputFieldAndLabel';
import { withTranslation, WithTranslation } from 'react-i18next';

interface ISupportingCharacterState {
    age: Age;
    type: CharacterTypeModel;
    purpose: string;
    rank?: Rank;
    showRank: boolean;
    species: Species;
    customSpeciesName?: string;
}

class SupportingCharacterPage extends React.Component<WithTranslation, ISupportingCharacterState> {

    private _name: string;
    private _focus1: string;
    private _focus2: string;
    private _focus3: string;
    private _pronouns: string = "";

    constructor(props) {
        super(props);

        const profileButton = document.getElementById("profile-button");
        if (profileButton !== undefined) {
            profileButton.style.display = "none";
        }

        [10, 9, 9, 8, 8, 7].forEach((v, i) => {
            character.attributes[i].value = v;
        });

        character.speciesStep = new SpeciesStep(Species.Human);
        character.rank = new CharacterRank("Lieutenant", Rank.Lieutenant);

        this.state = {
            age: AgeHelper.getAdultAge(),
            type: CharacterTypeModel.getAllTypes()[character.type],
            purpose: "",
            rank: character.rank?.id,
            showRank: true,
            species: Species.Human
        }
    }

    getSpeciesList() {
        const { t } = this.props;
        let speciesList = SpeciesHelper.getSpecies().map(s => { return new DropDownElement(s.id, s.localizedName) });
        speciesList.push(new DropDownElement(Species.Custom, t('Species.other.name')));

        return speciesList;
    }

    render() {
        const { t } = this.props;
        let ageDiv = hasSource(Source.PlayersGuide) && character.age.isChild
            ? (<div className="mt-4">
                    <div className="page-text-aligned">
                        {t('SupportingCharacter.howOld')}
                    </div>
                    <div>
                        <DropDownInput
                            items={this.getAges() }
                            defaultValue={this.state.age.name}
                            onChange={(index) => this.selectAge(index) }/>
                    </div>
                </div>)
            : null;

        return (
            <div className="page container ml-0">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="index.html">{t('Page.title.home')}</a></li>
                        <li className="breadcrumb-item active" aria-current="page">{t('Page.breadcrumb.supportingCharacterCreation')}</li>
                    </ol>
                </nav>

                <div>
                    <Header>{t('Page.title.supportingCharacter')}</Header>

                    <div className="row">
                        <div className="col-12 col-lg-6 my-4">
                            <Header level={2}>{t('Construct.other.characterType')}</Header>
                            <p>{t('SupportingCharacter.whatType')}</p>
                            <div>
                                <DropDownSelect
                                    items={this.getTypes() }
                                    defaultValue={this.state.type.type}
                                    onChange={(index) => this.selectType(index as number) }/>
                            </div>

                            {ageDiv}
                        </div>
                        <div className="col-12 col-lg-6 my-4">
                            <Header level={2}>{t('SupportingCharacter.purposeOrDepartment')}</Header>
                            <p>
                                {t('SupportingCharacter.whatPurpose')}
                            </p>
                            <InputFieldAndLabel labelName={t('Construct.other.purpose')} value={this.state.purpose} onChange={(value) => {
                                this.setState((state) => ({
                                    ...state,
                                    purpose: value}));
                                character.jobAssignment = value;
                            }} id="purpose" />
                        </div>
                    </div>
                    <div className="mt-3">
                        <Header level={2}>{t('SupportingCharacter.speciesAndAttributes')}</Header>
                        <p>
                            {t('SupportingCharacter.speciesAndAttributesInstruction')}
                        </p>
                        <div className="mb-2">
                            <DropDownSelect
                                items={this.getSpeciesList()}
                                defaultValue={this.state.species}
                                onChange={(index) => this.selectSpecies(index as Species) }/>
                        </div>
                        {this.state.species === Species.Custom
                        ? (<div className="mb-2">
                             <InputFieldAndLabel labelName={t('Construct.other.species')} value={this.state.customSpeciesName || ''}
                                id="speciesName" onChange={(value) => {
                                    character.speciesStep.customSpeciesName = value;
                                    this.setState((state) => ({...state, customSpeciesName: value}))
                                }} />
                        </div>)
                        : null}
                        <div className="my-3">
                            <SupportingCharacterAttributes age={this.state.age}
                                species={this.state.species}
                                onUpdate={() => { this.forceUpdate(); }}/>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-lg-6 my-3">

                        <div className="mt-2 mb-5">
                            <Header level={2}>{t('Construct.other.disciplines')}</Header>
                            <p>
                                {t('SupportingCharacter.disciplineInstruction')}
                            </p>
                            <SupportingCharacterDisciplines age={this.state.age}
                                onUpdate={() => { this.forceUpdate(); } }/>
                        </div>
                    </div>
                    <div className="col-12 col-lg-6 mt-4 mb-5">
                        <Header level={2}>{t('Construct.other.focuses')}</Header>
                        <p>
                            {t('SupportingCharacter.focusInstruction')}
                        </p>
                        <div className="mb-2">
                            <InputFieldAndLabel labelName={t('Construct.other.focus1')} value={this._focus1}
                                id="focus1" onChange={(value) => {
                                    this._focus1 = value;
                                    this.onFocusChanged();
                                }} />
                        </div>
                        <div className="mb-2">
                            <InputFieldAndLabel labelName={t('Construct.other.focus2')} value={this._focus2}
                                id="focus2" onChange={(value) => {
                                    this._focus2 = value;
                                    this.onFocusChanged();
                                }} />
                        </div>
                        <div className="mb-2">
                            <InputFieldAndLabel labelName={t('Construct.other.focus3')} value={this._focus3}
                                id="focus3" onChange={(value) => {
                                    this._focus3 = value;
                                    this.onFocusChanged();
                                }} />
                        </div>
                        <Header level={2} className="mt-5">{t('SupportingCharacter.nameAndRank')}</Header>
                        <p>
                            {t('SupportingCharacter.nameAndRankInstruction')}
                        </p>
                        {this.state.showRank
                            ?
                                (<div style={{borderBottom:"1px solid rgba(128, 128, 128, 0.4)", marginBottom:"10px",paddingBottom:"18px"}}>
                                    <DropDownSelect
                                        items={this.getRanks() }
                                        defaultValue={this.state.rank}
                                        onChange={(rank) => this.selectRank(rank as Rank) }/>
                                </div>)
                            : null}
                        <div className="mb-2">
                            <InputFieldAndLabel labelName={t('Construct.other.name')} value={this._name}
                                id="name" onChange={(value) => {
                                    this._name = value;
                                    character.name = this._name;
                                    this.forceUpdate();
                                }} />
                        </div>
                        <div className="mb-2">
                            <InputFieldAndLabel labelName={t('Construct.other.pronouns')} value={this._pronouns}
                                id="pronouns" onChange={(value) => {
                                    this._pronouns = value;
                                    character.pronouns = this._pronouns;
                                    this.forceUpdate();
                                }} />
                        </div>
                    </div>
                </div>
                <div className="button-container mt-4">
                    <Button text={t('Common.button.exportPdf')} className="button-small mr-2 mb-2" onClick={() => this.showDialog() } buttonType={true} />
                    <Button text={t('Common.button.view')} className="button-small mr-2 mb-2" onClick={() => this.showViewPage() } buttonType={true} />
                </div>
            </div>
        );
    }

    showViewPage() {
        const value = marshaller.encodeSupportingCharacter(character);
        window.open('/view?s=' + value, "_blank");
    }

    getAges() {
        return AgeHelper.getAllChildAges().map(a => a.name);
    }

    selectAge(index: number) {
        this.setState((state) => ({ ...state, age: AgeHelper.getAllChildAges()[index]}));
    }

    private showDialog() {
        this.populateAdditionalFields();
        CharacterSheetDialog.show(CharacterSheetRegistry.getSupportingCharacterSheet(character, store.getState().context.era), "supporting-character");
    }

    private populateAdditionalFields() {
        character.traits = [ character.speciesName ];
    }

    private selectSpecies(selection: Species) {
        character.speciesStep = new SpeciesStep(selection);
        this.setState((state) => ({...state, species: selection}));
    }

    private getTypes() {
        return CharacterTypeModel.getAllTypes().map((t, i) => new DropDownElement(t.type, t.localizedName));
    }
    private getRanks() {
        var result = [];

        const ranks = RanksHelper.instance().getRanks(character, true)
            .filter(r => r.id !== Rank.Captain &&
                         r.id !== Rank.Commander &&
                         r.id !== Rank.LtCommander);

        ranks.forEach(r => {
            result.push(new DropDownElement(r.id, r.localizedName));
        });

        return result;
    }

    private selectRank(rank: Rank) {
        const ranks = RanksHelper.instance().getRanks(character, true).filter(r => r.id === rank);
        if (ranks.length) {
            let characterRank = new CharacterRank(ranks[0].name, ranks[0].id);
            this.setState(state => ({...state, rank: rank}));
            character.rank = characterRank;
        }
    }

    private selectType(characterType: number) {
        let type = CharacterTypeModel.getByType(characterType);
        character.type = type.type;
        let age = this.state.age;

        if (type.type !== CharacterType.Child) {
            age = AgeHelper.getAdultAge();
            character.age = age;
        } else if (character.age === AgeHelper.getAdultAge()) {
            age = AgeHelper.getAllChildAges()[0];
            character.age = age;
        }

        let showRank = true;
        let rank = character.rank;

        if (type.type === CharacterType.Child
            || type.type === CharacterType.AmbassadorDiplomat
            || type.type === CharacterType.Civilian
            || type.type === CharacterType.Tribble) {

            showRank = false;
            character.rank = null;
            rank = null;
        } else if (character.type === CharacterType.Cadet) {
            rank = RanksHelper.instance().getRank(Rank.CadetFourthClass);
            character.rank = new CharacterRank(rank.name, rank.id);
        } else {
            if (rank === null) {
                rank = RanksHelper.instance().getRank(Rank.Lieutenant);
                character.rank = new CharacterRank(rank.name, rank.id);
            }
        }

        this.setState((state) => ({
            ...state,
            age: age,
            type: type,
            showRank: showRank,
            rank: rank?.id
        }));
    }

    private onFocusChanged() {
        character._focuses = [];

        character.addFocus(this._focus1);
        character.addFocus(this._focus2);
        character.addFocus(this._focus3);

        this.forceUpdate();
    }
}

export default withTranslation()(SupportingCharacterPage);