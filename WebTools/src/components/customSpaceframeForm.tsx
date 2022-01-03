import * as React from 'react';
import { character } from '../common/character';
import { CharacterType } from '../common/characterType';
import { Department } from '../helpers/departments';

import { SpaceframeViewModel } from '../helpers/spaceframes';
import { System } from '../helpers/systems';
import { TalentsHelper } from '../helpers/talents';
import StarshipWeaponRegistry, { Weapon } from '../helpers/weapons';
import { Button } from './button';
import { CheckBox } from './checkBox';

interface IStatControlProperties {
    statName: string;
    value: number;
    showIncrease: boolean;
    showDecrease: boolean;
    onIncrease: () => void;
    onDecrease: () => void;
}

export class StatControl extends React.Component<IStatControlProperties, {}> {
    render() {
        const {statName, value, showDecrease, showIncrease} = this.props;

        const dec = showDecrease
            ? (<img style={{ float: "left" }} height="20" src="static/img/dec.png" onClick={ () => { this.props.onDecrease() } } alt="-"/>)
            : undefined;

        const inc = showIncrease
            ? (<img style={{ float: "right" }} height="20" src="static/img/inc.png" onClick={ () => { this.props.onIncrease() } } alt="+"/>)
            : undefined;

        return (
            <div className="stat">
                <div className="stat-entry-name">
                    {statName}
                </div>
                <div className="stat-entry-value">
                    {dec}
                    {value}
                    {inc}
                </div>
            </div>
        );
    }
}


interface ICustomSpacefraemProperties {
    initialSelection: SpaceframeViewModel;
    onComplete: (s: SpaceframeViewModel) => void;
}

interface ICustomSpacefraemState {
    name: string;
    departments: number[];
    systems: number[];
    scale: number;
    serviceYear: number;
    weapons: string[];
    talents: string[];
}
class CustomSpaceframeForm extends React.Component<ICustomSpacefraemProperties, ICustomSpacefraemState> {

    weapons: Weapon[];

    constructor(props: ICustomSpacefraemProperties) {
        super(props);
        this.state = {
            name: this.props.initialSelection.name,
            departments: [...this.props.initialSelection.departments],
            systems: [...this.props.initialSelection.systems],
            scale: this.props.initialSelection.scale,
            serviceYear: this.props.initialSelection.serviceYear,
            weapons: [],
            talents: []
        }

        this.weapons = StarshipWeaponRegistry.availableWeapons(character.type, character.era);
    }

    render() {
        let weaponList = this.weapons.map((w, i) => { return (<div className="col" key={'weapon-' + i}><CheckBox
            isChecked={this.isWeaponAdded(w)}
            value={i}
            text={w.description}
            onChanged={(e) =>  { this.toggleWeapon(w)} } /></div>);} );

        return (
            <div>
                <div className="panel">
                    <div className="page-text">What's the name of this class of ship?</div>
                    <label className="textinput-label" htmlFor="spaceframe-name">CLASS</label>
                    <input id="spaceframe-name"
                        type="text"
                        onChange={(ev) => {
                            let value = (ev.target as HTMLInputElement).value;
                            let state = this.state;
                            this.setState({
                                ...state,
                                name: value
                            });
                        } }
                        value={this.state.name} />  
                    <div><small><b>e.g.: </b> <i>Archer Class, Soyuz Class, etc.</i></small></div>
                </div>
                <div className="panel">
                    <div className="page-text">When was this class introduced?</div>
                    <label className="textinput-label" htmlFor="spaceframe-name">YEAR</label>
                    <input id="spaceframe-name"
                        type="number"
                        onChange={(ev) => {
                            let value = (ev.target as HTMLInputElement).value;
                            this.setState((state) => ({
                                ...state,
                                serviceYear: parseInt(value)
                            }));
                        } }
                        value={this.state.serviceYear.toString()} />
                    <div><small>Don't make this after the service year of the campaign. Wonky things will probably happen.</small></div>
                </div>

                <div className="panel">
                    <div className="page-text">Provide some base stats for this frame.</div>

                    <div className="stats-row">
                        <StatControl statName="Comms" value={this.state.systems[System.Comms]} 
                            showIncrease={this.state.systems[System.Comms] < 12} showDecrease={this.state.systems[System.Comms] > 7} 
                            onIncrease={() => { this.setSystem(System.Comms, 1) }} 
                            onDecrease={() => {this.setSystem(System.Comms, -1)}} />

                        <StatControl statName="Engines" value={this.state.systems[System.Engines]} 
                            showIncrease={this.state.systems[System.Engines] < 12} showDecrease={this.state.systems[System.Engines] > 7} 
                            onIncrease={() => { this.setSystem(System.Engines, 1) }} 
                            onDecrease={() => {this.setSystem(System.Engines, -1)}} />

                        <StatControl statName="Structure" value={this.state.systems[System.Structure]} 
                            showIncrease={this.state.systems[System.Structure] < 12} showDecrease={this.state.systems[System.Structure] > 7} 
                            onIncrease={() => { this.setSystem(System.Structure, 1) }} 
                            onDecrease={() => {this.setSystem(System.Structure, -1)}} />
                    </div>

                    <div className="stats-row">
                        <StatControl statName="Computers" value={this.state.systems[System.Computer]} 
                            showIncrease={this.state.systems[System.Computer] < 12} showDecrease={this.state.systems[System.Computer] > 7} 
                            onIncrease={() => { this.setSystem(System.Computer, 1) }} 
                            onDecrease={() => {this.setSystem(System.Computer, -1)}} />

                        <StatControl statName="Sensors" value={this.state.systems[System.Sensors]} 
                            showIncrease={this.state.systems[System.Sensors] < 12} showDecrease={this.state.systems[System.Sensors] > 7} 
                            onIncrease={() => { this.setSystem(System.Sensors, 1) }} 
                            onDecrease={() => {this.setSystem(System.Sensors, -1)}} />

                        <StatControl statName="Weapons" value={this.state.systems[System.Weapons]} 
                            showIncrease={this.state.systems[System.Weapons] < 12} showDecrease={this.state.systems[System.Weapons] > 7} 
                            onIncrease={() => { this.setSystem(System.Weapons, 1) }} 
                            onDecrease={() => {this.setSystem(System.Weapons, -1)}} />
                    </div>

                    <div className="stats-row pt-2">
                        <StatControl statName="Command" value={this.state.departments[Department.Command]} 
                            showIncrease={this.state.departments[Department.Command] < 5} showDecrease={this.state.departments[Department.Command] > 0} 
                            onIncrease={() => { this.setDepartment(Department.Command, 1) }} 
                            onDecrease={() => {this.setDepartment(Department.Command, -1)}} />

                        <StatControl statName="Security" value={this.state.departments[Department.Security]} 
                            showIncrease={this.state.departments[Department.Security] < 5} showDecrease={this.state.departments[Department.Security] > 0} 
                            onIncrease={() => { this.setDepartment(Department.Security, 1) }} 
                            onDecrease={() => {this.setDepartment(Department.Security, -1)}} />

                        <StatControl statName="Science" value={this.state.departments[Department.Science]} 
                            showIncrease={this.state.departments[Department.Science] < 5} showDecrease={this.state.departments[Department.Science] > 0} 
                            onIncrease={() => { this.setDepartment(Department.Science, 1) }} 
                            onDecrease={() => {this.setDepartment(Department.Science, -1)}} />
                    </div>
                    <div className="stats-row">
                        <StatControl statName="Conn" value={this.state.departments[Department.Conn]} 
                            showIncrease={this.state.departments[Department.Conn] < 5} showDecrease={this.state.departments[Department.Conn] > 0} 
                            onIncrease={() => { this.setDepartment(Department.Conn, 1) }} 
                            onDecrease={() => {this.setDepartment(Department.Conn, -1)}} />

                        <StatControl statName="Engineering" value={this.state.departments[Department.Engineering]} 
                            showIncrease={this.state.departments[Department.Engineering] < 5} showDecrease={this.state.departments[Department.Engineering] > 0} 
                            onIncrease={() => { this.setDepartment(Department.Engineering, 1) }} 
                            onDecrease={() => {this.setDepartment(Department.Engineering, -1)}} />

                        <StatControl statName="Medicine" value={this.state.departments[Department.Medicine]} 
                            showIncrease={this.state.departments[Department.Medicine] < 5} showDecrease={this.state.departments[Department.Medicine] > 0} 
                            onIncrease={() => { this.setDepartment(Department.Medicine, 1) }} 
                            onDecrease={() => {this.setDepartment(Department.Medicine, -1)}} />
                   </div>

                    <div className="stats-row pt-2">
                        <StatControl statName="Scale" value={this.state.scale} 
                            showIncrease={true} showDecrease={this.state.scale > 3} 
                            onIncrease={() => { this.setScale(1) }} onDecrease={() => {this.setScale(-1)}} />
                    </div>
                </div>

                <div className="panel">
                    <div className="page-text">What weapons are built in to this spaceframe?</div>
                    <div className="row row-cols-md-3">
                        {weaponList}
                    </div>
                </div>

                <div className="button-container-centered">
                    <Button className="button-small" onClick={() => this.props.onComplete(this.createSpaceframe()) } text="OK" />
                </div>
            </div>);
    }

    isWeaponAdded(weapon: Weapon) {
        return this.state.weapons.indexOf(weapon.description) >= 0;
    }

    toggleWeapon(weapon: Weapon) {
        if (this.isWeaponAdded(weapon)) {
            this.setState((state) => {
                let weapons = state.weapons;
                if (weapons.indexOf(weapon.description) >=0) {
                    weapons.splice(weapons.indexOf(weapon.description), 1);
                }
                let talents = state.talents;
                if (talents.indexOf(weapon.description) >=0) {
                    talents.splice(weapons.indexOf(weapon.description), 1);
                }
                return {
                    ...state,
                    weapons: weapons,
                    talents: talents
                };
            });
        } else {
            this.setState((state) => {
                let weapons = state.weapons;
                weapons.push(weapon.description);
                let talents = state.talents;
                if (weapon.requiresTalent && talents.indexOf(weapon.description) < 0) {
                    talents.push(weapon.description);
                }
                return {
                    ...state,
                    weapons: weapons,
                    talents: talents
                };
            });
        }
    }

    setScale(delta: number) {
        this.setState((state) => ({
            ...state,
            scale: state.scale + delta
        }));
    }

    setDepartment(department: Department, delta: number) {
        this.setState((state) => {
            let departments = state.departments;
            departments[department] = departments[department] + delta;
            return {
                ...state,
                departments: departments
            };
        });
    }

    setSystem(system: System, delta: number) {
        this.setState((state) => {
            let systems = state.systems;
            systems[system] = systems[system] + delta;
            return {
                ...state,
                systems: systems
            };
        });
    }

    createSpaceframe() {
        let result = SpaceframeViewModel.createCustomSpaceframe(this.props.initialSelection.type, this.state.serviceYear, this.props.initialSelection.eras);
        result.name = this.state.name;
        result.scale = this.state.scale;
        result.systems = this.state.systems;
        result.departments = this.state.departments;
        result.attacks = this.state.weapons;
        if (character.type === CharacterType.KlingonWarrior) {
            result.additionalTraits = [ "Klingon Starship" ];
        } else if (character.type === CharacterType.Starfleet) {
            result.additionalTraits = [ "Federation Starship" ];
        }
        let talentList = [];
        this.state.talents.forEach((t) => {
            const talent = TalentsHelper.getTalent(t);
            if (talent) {
                talentList.push(talent);
            }
        });
        result.talents = talentList;
        return result;
    }
}

export default CustomSpaceframeForm;