import ReactMarkdown from "react-markdown";
import { Starship } from "../../common/starship";
import { Header } from "../../components/header";
import { ShipBuildWorkflow } from "../model/shipBuildWorkflow";
import ShipBuildingBreadcrumbs from "../view/shipBuildingBreadcrumbs";
import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { nextStarshipWorkflowStep, setStarshipServiceRecord } from "../../state/starshipActions";
import store from "../../state/store";
import { Navigation } from "../../common/navigator";
import { ServiceRecordList, ServiceRecordModel } from "../model/serviceRecord";
import { TalentsHelper } from "../../helpers/talents";
import { CheckBox } from "../../components/checkBox";
import { connect } from "react-redux";


interface IServiceRecordPageProperties {
    starship: Starship;
    workflow: ShipBuildWorkflow;
}

const ServiceRecordPage: React.FC<IServiceRecordPageProperties> = ({starship, workflow}) => {
    const { t } = useTranslation();

    const nextPage = () => {
        let step = workflow.peekNextStep();
        store.dispatch(nextStarshipWorkflowStep());
        Navigation.navigateToPage(step.page);
    }

    const onServiceRecordSelection = (serviceRecord: ServiceRecordModel) => {
        if (serviceRecord.type === starship.serviceRecordStep?.type.type) {
            store.dispatch(setStarshipServiceRecord(null, null));
        } else {
            const talent = TalentsHelper.getTalent(serviceRecord.specialRule);
            store.dispatch(setStarshipServiceRecord(serviceRecord, talent));
        }
    }

    const serviceRecords = ServiceRecordList.instance.records.map((r, i) => {
        const talent = TalentsHelper.getTalent(r.specialRule);

        return (
            <tbody key={i}>
                <tr>
                    <td className=""><div className="selection-header">{r.name}</div></td>
                    <td className="">{r.description}</td>
                    <td className="">{talent.localizedName}</td>
                    <td><CheckBox
                            isChecked={starship.serviceRecordStep?.type?.type === r.type}
                            text=""
                            value={r.type}
                            onChanged={() => { onServiceRecordSelection(r); } }/></td>
                </tr>
            </tbody>);
    });

    console.log(starship);

    return (<div className="page container ms-0">
        <ShipBuildingBreadcrumbs />
        <Header>{t('Page.title.starshipServiceRecord')}</Header>
        <ReactMarkdown>{t('StarshipServiceRecordPage.instruction')}</ReactMarkdown>

        <table className="selection-list w-100">
            <thead>
                <tr>
                    <td></td>
                    <td className="d=none d-md-table-cell" >{t('Common.text.description')}</td>
                    <td className="d=none d-md-table-cell" style={{paddingLeft: "0.75rem"}}>{t('Construct.other.specialRules')}</td>
                    <td></td>
                </tr>
            </thead>
            {serviceRecords}
        </table>

        <div className="text-end mt-4">
            <Button onClick={() => nextPage()}>{t('Common.button.next')}</Button>
        </div>
    </div>);
}


function mapStateToProps(state, ownProps) {
    return {
        starship: state.starship.starship,
        workflow: state.starship.workflow
    };
}

export default connect(mapStateToProps)(ServiceRecordPage);
