import { useTranslation } from "react-i18next";
import { Source } from "../helpers/sources";
import { setAllowCrossSpeciesTalents, setAllowEsotericTalents } from "../state/contextActions";
import { hasAnySource } from "../state/contextFunctions";
import store from "../state/store";
import { CheckBox } from "./checkBox";
import { connect } from "react-redux";

interface ITalentSettingsProperties  {
    allowCrossSpeciesTalents: boolean;
    allowEsotericTalents: boolean;
}

const TalentSettingsView: React.FC<ITalentSettingsProperties> = ({allowCrossSpeciesTalents, allowEsotericTalents}) => {

    const { t } = useTranslation();

    const esotericTalentOption = (hasAnySource([Source.PlayersGuide, Source.Core2ndEdition])) ? (<div>
        <CheckBox
            isChecked={allowEsotericTalents}
            text={t('SpeciesDetails.allowEsoteric')}
            value={!allowEsotericTalents}
            onChanged={() => { store.dispatch(setAllowEsotericTalents(!allowEsotericTalents));  }} />
    </div>) : undefined;


    const crossSpeciesOption = (<CheckBox
            isChecked={allowCrossSpeciesTalents}
            text={t('SpeciesDetails.allowCrossSpecies')}
            value={!allowCrossSpeciesTalents}
            onChanged={() => {
                store.dispatch(setAllowCrossSpeciesTalents(!allowCrossSpeciesTalents));
            }} />)

    return (<>
        {crossSpeciesOption}
        {esotericTalentOption}
    </>);
}

function mapStateToProps(state, ownProps) {
    return {
        allowCrossSpeciesTalents: state.context.allowCrossSpeciesTalents,
        allowEsotericTalents: state.context.allowEsotericTalents
    };
}

export default connect(mapStateToProps)(TalentSettingsView);