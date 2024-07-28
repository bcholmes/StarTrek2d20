import { useTranslation } from "react-i18next";
import { Header } from "../../components/header";
import { Asset } from "../asset";
import { AssetTypes } from "../assetType";
import { AssetStatType } from "../assetStat";

interface IAssetViewProperties {
    asset: Asset;
}

const AssetView:React.FC<IAssetViewProperties> = ({asset}) => {
    const { t } = useTranslation();
    return (<main>
        <Header>{asset.name}</Header>

        <div className="row mt-4">

            <div className="col-12 col-xl-6">
                <div className="row">
                    <div className="col-4 view-field-label pb-2">{t('Construct.other.name')}:</div>
                    <div className="col-8 text-white"><div className="view-border-bottom pb-2">{asset.name}</div></div>
                </div>

                <div className="row">
                    <div className="col-4 view-field-label pb-2">{t('Construct.other.assetType')}:</div>
                    <div className="col-8 text-white"><div className="view-border-bottom pb-2">{AssetTypes.instance.getTypes()[asset.type].name}</div></div>
                </div>

                <div className="row row-cols-3 row-cols-md-6 justify-content-md-center">
                    <div className="col">
                        <div className="bg-primary text-center py-3 my-3 rounded-3">
                            <div className="text-white"><small>{t('Construct.assetStat.medical')}</small></div>
                            <p>{asset.stats[AssetStatType.Medical].asString}</p>
                        </div>
                    </div>

                    <div className="col">
                        <div className="bg-primary text-center py-3 my-3 rounded-3">
                            <div className="text-white"><small>{t('Construct.assetStat.military')}</small></div>
                            <p>{asset.stats[AssetStatType.Military].asString}</p>
                        </div>
                    </div>

                    <div className="col">
                        <div className="bg-primary text-center py-3 my-3 rounded-3">
                            <div className="text-white"><small>{t('Construct.assetStat.personal')}</small></div>
                            <p>{asset.stats[AssetStatType.Personal].asString}</p>
                        </div>
                    </div>

                    <div className="col">
                        <div className="bg-primary text-center py-3 my-3 rounded-3">
                            <div className="text-white"><small>{t('Construct.assetStat.science')}</small></div>
                            <p>{asset.stats[AssetStatType.Science].asString}</p>
                        </div>
                    </div>

                    <div className="col">
                        <div className="bg-primary text-center py-3 my-3 rounded-3">
                            <div className="text-white"><small>{t('Construct.assetStat.social')}</small></div>
                            <p>{asset.stats[AssetStatType.Social].asString}</p>
                        </div>
                    </div>
                </div>


            </div>

        </div>
    </main>);
}

export default AssetView;