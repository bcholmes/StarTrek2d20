import { useTranslation } from "react-i18next"
import { Header } from "../../components/header"
import LcarsFrame from "../../components/lcarsFrame"
import { PageIdentity } from "../../pages/pageIdentity"
import { TableCollection, ValueResult } from "../model/table"
import ReactMarkdown from "react-markdown"
import { TableView } from "./tableView"
import { Button } from "../../components/button"
import { useState } from "react"
import { ModalControl } from "../../components/modal"
import { ShareTableModal } from "./shareTableModal"
import TableMarshaller from "../model/tableMarshaller"
import { connect } from "react-redux"
import { useNavigate } from "react-router"
import { preventDefaultAnchorEvent } from "../../common/navigator"

interface IViewTablePageProperties {
    tableCollection?: TableCollection;
}

const ViewTablePage: React.FC<IViewTablePageProperties> = ({tableCollection}) => {

    const { t } = useTranslation();
    const navigate = useNavigate();
    const [ value, setValue ] = useState<ValueResult[]>([]);

    const showModal = () => {
        ModalControl.show("lg", closeModal, (<ShareTableModal link={createUrl()}/>), "Share Table");
    }

    const closeModal = () => {
        ModalControl.hide();
    }

    const createUrl = () => {
        const { hostname, protocol, port } = window.location;
        return protocol + "//" + hostname + (port !== "80" && port !== "443" ? ":" + port : "") + "/table/import?table=" + TableMarshaller.instance.marshall(tableCollection);
    }

    return (<LcarsFrame activePage={PageIdentity.ViewTable}>
        <div id="app">

            <div className="page container ms-0">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/index.html">{t('Page.title.home')}</a></li>
                        <li className="breadcrumb-item"><a href="/table/list" onClick={(e) => preventDefaultAnchorEvent(e, () => navigate("/table/list"))}>{t('Page.title.tableList')}</a></li>
                        <li className="breadcrumb-item active" aria-current="page">{t('Page.title.viewTable')}</li>
                    </ol>
                </nav>

                <main>
                    <Header>{t('Page.title.viewTable')}</Header>
                    <div className="d-flex justify-content-between align-items-start" >
                        <div className="mt-4">
                            <Header level={3}>{tableCollection.name}</Header>
                            <ReactMarkdown>{tableCollection.description}</ReactMarkdown>
                        </div>
                        <Button buttonType={true} className="btn btn-link mt-4" onClick={() => showModal()} title="Share"><i className="bi bi-share"></i></Button>
                    </div>

                    <div className="row">
                        <div className="col-md-6 mt-4">
                            <TableView name={undefined} table={tableCollection.mainTable} />
                        </div>

                        <div className="col-md-6 mt-4">
                            <div className="text-end">
                                <Button buttonType={true} onClick={() => setValue(tableCollection.roll())} className="btn btn-primary btn-sm">
                                    <img src="/static/img/d20.svg" style={{height: "24px", aspectRatio: "1"}} className="me-1" alt={t('Common.button.random')} />
                                    {' '} Roll
                                </Button>
                            </div>

                            {value && value.length === 0
                                ? undefined
                                : (value.map((v,i) => (<div className="d-flex mt-4" key={'result-' + i}>
                                    <h3 className="me-3">Result:</h3>
                                    <div><p><strong>{v.name}</strong></p>
                                    <ReactMarkdown>{v.description}</ReactMarkdown></div>
                                </div>)))
                            }
                        </div>
                    </div>
                </main>
            </div>
        </div>
    </LcarsFrame>)
}

const mapStateToProps = (state) => {
    return {
        tableCollection: state.table?.selection
    }
}

export default connect(mapStateToProps)(ViewTablePage);