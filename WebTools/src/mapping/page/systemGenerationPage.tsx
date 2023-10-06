import { useState } from 'react';
import { Button } from '../../components/button';
import { SystemGenerationTable } from '../table/systemGenerator';
import { Navigation } from '../../common/navigator';
import { PageIdentity } from '../../pages/pageIdentity';
import { SpaceRegion, SpaceRegionModel, SpecialSectors, SpecialSectorTypeModel } from '../table/star';
import { DropDownElement, DropDownSelect } from '../../components/dropDownInput';
import { useNavigate } from 'react-router';

export const SystemGenerationPage = () => {

    const [region, setRegion] = useState(SpaceRegionModel.allRegions()[0].id);
    const [sectorType, setSectorType] = useState(SpecialSectors.GeneralExpanse);
    const navigate = useNavigate();

    const renderSectorTypeSection = () => {
        if (region === SpaceRegion.ShackletonExpanse) {
            let options = SpecialSectorTypeModel.allSpecialSectorTypes().map(s => new DropDownElement(s.id, s.name));
            return (<div className="page-text mt-3">
                    <DropDownSelect onChange={(e) => selectSectorType(e as SpecialSectors)} defaultValue={sectorType} items={options} />
                </div>)
        } else {
            return null;
        }
    }

    const selectSectorType = (sectorType: SpecialSectors) => {
        setSectorType(sectorType);
    }

    const selectRegion = (region: SpaceRegion) => {
        setRegion(region);
    }

    const regionOptions = () => {
        return SpaceRegionModel.allRegions().map(r => { return new DropDownElement(r.id, r.name) });
    }

    const generateSystem = () => {
        SystemGenerationTable.generateSector(SpaceRegionModel.for(region), region === SpaceRegion.ShackletonExpanse ? sectorType : undefined);
        navigate("/sectorDetails");
    }

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
            <DropDownSelect onChange={(e) => selectRegion(e as SpaceRegion)} defaultValue={region} items={regionOptions()} />
            </div>
            {renderSectorTypeSection()}
            <div className="button-container">
                <Button text="Generate Sector" buttonType={true} className="button" onClick={() => generateSystem()} />
            </div>
        </div>
    );
}
