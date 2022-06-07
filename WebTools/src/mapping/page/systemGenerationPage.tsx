import * as React from 'react';
import {IPageProperties} from '../../pages/iPageProperties';
import { Button } from '../../components/button';
import { SystemGenerationTable } from '../table/systemGenerator';
import { Navigation } from '../../common/navigator';
import { PageIdentity } from '../../pages/pageIdentity';
import { SpaceRegion, SpaceRegionModel, SpecialSectors, SpecialSectorTypeModel } from '../table/star';

interface ISystemGenerationState {
    region: SpaceRegion;
    sectorType: SpecialSectors;
}

export class SystemGenerationPage extends React.Component<IPageProperties, ISystemGenerationState> {

    constructor(props) {
        super(props);
        this.state = {
            region: SpaceRegionModel.allRegions()[0].id,
            sectorType: SpecialSectors.GeneralExpanse
        }
    }

    render() {
        return (
            <div className="page container ml-0">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="index.html">Home</a></li>
                        <li className="breadcrumb-item active" aria-current="page">System Generation</li>
                    </ol>
                </nav>

                <div className="page-text mt-3">
                    Select tool.
                </div>
                <div className="page-text mt-3">
                <select onChange={(e) => this.selectRegion(e.target.value)} value={this.state.region}>
                    {this.renderOptions()}
                </select>
                </div>
                {this.renderSectorTypeSection()}
                <div className="button-container">
                    <Button text="Generate Sector" buttonType={true} className="button" onClick={() => { this.generateSystem(); }} />
                </div>
            </div>
        );
    }

    renderSectorTypeSection() {
        if (this.state.region === SpaceRegion.ShackletonExpanse) {
            let options = SpecialSectorTypeModel.allSpecialSectorTypes().map((s, i) => { return (<option value={s.id} key={'type-' + s.id}>{s.name}</option>);});
            return (<div className="page-text mt-3">
                    <select onChange={(e) => this.selectSectorType(e.target.value)} value={this.state.sectorType}>
                        {options}
                    </select>
                </div>)
        } else {
            return null;
        }
    }

    selectSectorType(sectorType: string) {
        this.setState((state) => ({...state, sectorType: parseInt(sectorType) as SpecialSectors }))
    }

    selectRegion(region: string) {
        this.setState((state) => ({...state, region: parseInt(region) as SpaceRegion }))
    }

    renderOptions() {
        return SpaceRegionModel.allRegions().map(r => { return (<option value={r.id} key={'region-' + r.id}>{r.name}</option>) });
    }

    private generateSystem() {
        SystemGenerationTable.generateSector(SpaceRegionModel.for(this.state.region), this.state.region === SpaceRegion.ShackletonExpanse ? this.state.sectorType : undefined);
        Navigation.navigateToPage(PageIdentity.SectorDetails);
    }
}
