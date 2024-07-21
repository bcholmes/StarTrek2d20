import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { preventDefaultAnchorEvent } from "../../common/navigator";
import { PageIdentity } from "../../pages/pageIdentity";
import { DropDownElement, DropDownSelect } from "../../components/dropDownInput";
import { useState } from "react";
import { AssetType, AssetTypes } from "../assetType";
import { assetTypeRandomTable } from "../assetTypeRandomTable";
import { assetRandomTable } from "../assetCatalog";
import LcarsFrame from "../../components/lcarsFrame";
import { Button } from "react-bootstrap";
import { Header } from "../../components/header";

const TacticalAssetsPage = () => {

    const { t } = useTranslation();
    const navigate = useNavigate();
    const [type, setType] = useState<(string|AssetType)>("");
    const [ assets, setAssets ] = useState([]);

    const getAssetTypes = () => {
        let result = [ new DropDownElement("", "Any")];
        AssetTypes.instance.getTypes().forEach(t => result.push(new DropDownElement(t.type, t.name)));
        return result;
    }

    const numberOfCharacters = () => {
        return assets.filter(a => a.type === AssetType.Character).length;
    }

    const generateAsset = () => {
        let asset = null;
        while (asset == null) {
            let assetType = null;
            if (type == "") {
                assetType = assetTypeRandomTable(numberOfCharacters());
            } else {
                assetType = type as AssetType;
            }

            let newAssets = [...assets];
            asset = assetRandomTable(AssetType.Character);
            if (asset) {
                newAssets.push(asset);
                setAssets(newAssets);
            }
        }
    }


    return (
        <LcarsFrame activePage={PageIdentity.TacticalAssets}>
            <div id="app">
                <div className="page container ms-0">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/index.html" onClick={(e) => preventDefaultAnchorEvent(e, () => navigate("/"))}>{t('Page.title.home')}</a></li>
                        <li className="breadcrumb-item active" aria-current="page">{t('Page.title.tacticalAssets')}</li>
                    </ol>
                    </nav>
                    <main>
                        <Header>{t('Page.title.tacticalAssets')}</Header>
                        <p className="mt-3">
                            {t('TacticalAssetsPage.instruction')}
                        </p>

                        <div className="row">
                            <div className="col-md-6 mt-4">
                                <Header level={2}>{t('Construct.other.starshipType')}</Header>

                                <div className="my-4">
                                    <DropDownSelect
                                        items={getAssetTypes()}
                                        defaultValue={ type ?? "" }
                                        onChange={(type) => setType(type) }/>
                                </div>
                            </div>
                        </div>

                        <div className="my-3 text-end">
                            <Button size="sm" onClick={() => generateAsset()}>Add</Button>
                        </div>

                        <Header level={2} className="mt-4">{t('TacticalAssetsPage.assets')}</Header>

                        {assets?.length ? (<table className="table table-dark mt-4">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {assets.map(a => (<tr>
                                    <td><p>{a.name}</p></td>
                                </tr>))}
                            </tbody>

                        </table>) : undefined}


                    </main>
                </div>
            </div>
        </LcarsFrame>
    );
}

export default TacticalAssetsPage;