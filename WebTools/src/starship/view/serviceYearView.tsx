import { useTranslation } from "react-i18next";
import ServiceYear from "../../helpers/serviceYear";

export interface IServiceYearProperties {
    campaignYear: number;
    onChange: (number) => void

}

export const ServiceYearSelector: React.FC<IServiceYearProperties> = ({campaignYear, onChange}) => {
    const { t } = useTranslation();

    return (<>
            <div className="d-sm-flex align-items-stretch">
                <label htmlFor="campaignYear" className="textinput-label">{t('StarshipTypeSelection.year')}</label>
                <input
                    id="campaignYear"
                    type="number"
                    defaultValue={campaignYear.toString()}
                    onChange={(e) => {
                        let value = e.target.value;
                        onChange(parseInt(value));
                    }}
                    />
            </div>
            <div className="small text-white mt-2" style={{maxWidth: "365px"}}>
                {ServiceYear.instance().getTextHint(campaignYear)}
            </div>
        </>);
}