import React from "react";
import { Starship } from "../common/character";
import { Department } from "../helpers/departments";
import { System } from "../helpers/systems";
import { Header } from "./header";
import { OutlineImage } from "./outlineImage";

interface IStarshipViewProperties {
    starship: Starship;
}

export class StarshipView extends React.Component<IStarshipViewProperties, {}> {

    render() {
        return (<div className="container ml-0">
            <Header>{this.props.starship.name + ' • ' + this.props.starship.registry}</Header>
            <div className="row mt-4" style={{alignItems: "baseline"}}>
                <div className="col-md-2 view-field-label pb-2">Space Frame:</div>
                <div className="col-md-4 text-white"><div className="view-border-bottom pb-2">{this.props.starship.spaceframeModel ? this.props.starship.spaceframeModel.name : undefined}</div></div>

                <div className="col-md-2 view-field-label pb-2">Service Date:</div>
                <div className="col-md-4 text-white"><div className="view-border-bottom pb-2">{this.props.starship.serviceYear}</div></div>
            </div>

            <div className="row" style={{alignItems: "baseline"}}>
                <div className="col-md-2 view-field-label pb-2">Mission Profile:</div>
                <div className="col-md-4 text-white"><div className="view-border-bottom pb-2">{this.props.starship.missionProfileModel ? this.props.starship.missionProfileModel.name : undefined}</div></div>

                <div className="col-md-2 view-field-label pb-2">Refits:</div>
                <div className="col-md-4 text-white"><div className="view-border-bottom pb-2">{this.props.starship.refitsAsString()}</div></div>
            </div>

            <div className="row" style={{alignItems: "baseline"}}>
                <div className="col-md-2 view-field-label pb-2">Traits:</div>
                <div className="col-md-10 text-white"><div className="view-border-bottom pb-2">{this.props.starship.getAllTraits()}</div></div>
            </div>

            <div className="row mt-4">
                <div className="col-xl-6">
                    <Header level={2}>Systems</Header>

                    <div className="row row-cols-1 row-cols-xl-3 mt-3">
                        <div className="col mb-1">
                            <div className="stat-name purple">Comms</div>
                            <div className="stat-value purple">{this.props.starship.systems[System.Comms]}</div>
                        </div>
                        <div className="col mb-1">
                            <div className="stat-name purple">Engines</div>
                            <div className="stat-value purple">{this.props.starship.systems[System.Engines]}</div>
                        </div>
                        <div className="col mb-1">
                            <div className="stat-name purple">Structure</div>
                            <div className="stat-value purple">{this.props.starship.systems[System.Structure]}</div>
                        </div>
                    </div>
                    <div className="row row-cols-1 row-cols-xl-3">
                        <div className="col mb-1">
                            <div className="stat-name purple">Computers</div>
                            <div className="stat-value purple">{this.props.starship.systems[System.Computer]}</div>
                        </div>
                        <div className="col mb-1">
                            <div className="stat-name purple">Sensors</div>
                            <div className="stat-value purple">{this.props.starship.systems[System.Sensors]}</div>
                        </div>
                        <div className="col mb-1">
                            <div className="stat-name purple">Weapons</div>
                            <div className="stat-value purple">{this.props.starship.systems[System.Weapons]}</div>
                        </div>
                    </div>

                    <Header level={2} className="mt-4">Departments</Header>
                    <div className="row row-cols-1 row-cols-xl-3 mt-3">
                        <div className="col mb-1">
                            <div className="stat-name purple">Command</div>
                            <div className="stat-value purple">{this.props.starship.departments[Department.Command]}</div>
                        </div>
                        <div className="col mb-1">
                            <div className="stat-name purple">Security</div>
                            <div className="stat-value purple">{this.props.starship.departments[Department.Security]}</div>
                        </div>
                        <div className="col mb-1">
                            <div className="stat-name purple">Science</div>
                            <div className="stat-value purple">{this.props.starship.departments[Department.Science]}</div>
                        </div>
                    </div>
                    <div className="row row-cols-1 row-cols-xl-3 mb-1">
                        <div className="col mb-1">
                            <div className="stat-name purple">Conn</div>
                            <div className="stat-value purple">{this.props.starship.departments[Department.Conn]}</div>
                        </div>
                        <div className="col mb-1">
                            <div className="stat-name purple">Engineering</div>
                            <div className="stat-value purple">{this.props.starship.departments[Department.Engineering]}</div>
                        </div>
                        <div className="col mb-1">
                            <div className="stat-name purple">Medicine</div>
                            <div className="stat-value purple">{this.props.starship.departments[Department.Medicine]}</div>
                        </div>
                    </div>

                    <div className="mt-3">
                        <OutlineImage serviceYear={this.props.starship.serviceYear} spaceframe={this.props.starship.spaceframeModel} />

                        <div className="row row-cols-1 row-cols-xl-3 mb-1">
                            <div className="col mb-1">
                                <div className="stat-name red">Resistance</div>
                                <div className="stat-value red">{this.props.starship.spaceframeModel.scale}</div>
                            </div>
                            <div className="col mb-1">
                                <div className="stat-name red">Scale</div>
                                <div className="stat-value red">{this.props.starship.spaceframeModel.scale}</div>
                            </div>
                        </div>
                    </div>
                    <Header level={2} className="mt-4">Talents</Header>
                    {this.renderTalentNames()}

                </div>
                <div className="col-xl-6">
                    <div className="row">
                        <div className="col-xl-6">
                            <Header level={2}>Shields</Header>
                        </div>
                        <div className="col-xl-6">
                            <Header level={2}>Power / Crew</Header>
                        </div>
                    </div>
                    <Header level={2} className="mt-4">Weapons</Header>
                    {this.renderWeapons()}
                </div>
            </div>
       </div>);
    }

    renderTalentNames() {
        let talents = this.props.starship.getTalentNameList().map((t, i) => (<div className="text-white" key={'talent-' + i}>{t}</div>));
        return talents;
    }

    renderWeapons() {
        let weapons = this.props.starship.determineWeapons().map((w, i) => (<div className="row mt-3">
            <div className="col-xl-9 mb-2"><div className="pill-left">Name/Type:</div><div className="pill-right">{w.name}</div></div>
            <div className="col-xl-3 mb-2"><div className="d-flex align-items-start"><div className="pill-left pill-left-sm"><span className="delta">d</span></div><div className="pill-right pill-right-sm"><span>{w.dice}</span></div></div></div>
            <div className="col-xl-12 mb-2"><div className="pill-left">Qualities:</div><div className="pill-right">{w.qualities ? w.qualities : '\u00A0'}</div></div>
        </div>));
        return (<div>{weapons}</div>);
    }

}