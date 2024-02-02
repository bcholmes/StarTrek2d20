import { useTranslation } from "react-i18next"
import { Header } from "../../components/header"
import LcarsFrame from "../../components/lcarsFrame"
import { PageIdentity } from "../../pages/pageIdentity"
import { connect } from "react-redux"
import { TableCollection } from "../model/table"
import ReactMarkdown from "react-markdown"
import { Button } from "../../components/button"
import { setTableCollectionSelection } from "../../state/tableActions"
import store from "../../state/store"
import { useNavigate } from "react-router"
import { toCamelCase } from "../../common/camelCaseUtil"
import { TableCollectionDescription } from "./tableDescription"

interface ITableListPageProperties {
    collections: TableCollection[];
}

const TableListPage: React.FC<ITableListPageProperties> = ({collections}) => {

    const { t } = useTranslation();
    const navigate = useNavigate();
    const categories = [];
    collections.forEach(c => {
        if (categories.indexOf(c.category) < 0) {
            categories.push(c.category);
        }
    });
    categories.sort();

    const selectCollection = (collection: TableCollection) => {
        store.dispatch(setTableCollectionSelection(collection));
        navigate("/table/view");
    }

    const renderCategories = () => {
        return categories.map((c, i) => {
            return (
                <div className="col-lg-6 mt-4" key={'category-' + i}>
                    <Header level={2}>{c}</Header>
                    <table className="table table-dark table-striped">
                        <tbody>

                        {collections
                            .filter(tc => tc.category === c)
                            .map((tc, j) => (<tr key={'row-' + toCamelCase(c) + '-' + j}>
                                    <td>
                                        <TableCollectionDescription tableCollection={tc} />
                                    </td>
                                    <td>
                                        <div className="text-right">
                                            <Button buttonType={true} className="btn btn-primary btn-xs" onClick={() => selectCollection(tc)}>Select</Button>
                                        </div>
                                    </td>
                                </tr>))}
                        </tbody>
                    </table>
                </div>
            )
        });
    }

    return (<LcarsFrame activePage={PageIdentity.TableList}>
        <div id="app">

            <div className="page container ms-0">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/index.html">{t('Page.title.home')}</a></li>
                        <li className="breadcrumb-item active" aria-current="page">{t('Page.title.tableList')}</li>
                    </ol>
                </nav>

                <main>
                    <Header>{t('Page.title.tableList')}</Header>

                    <div className="row">
                        {renderCategories()}
                    </div>
                </main>
            </div>
        </div>
    </LcarsFrame>)
}

const mapStateToProps = (state) => {
    return {
        collections: state.table.collections
    }
}

export default connect(mapStateToProps)(TableListPage);