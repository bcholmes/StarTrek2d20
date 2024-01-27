import ReactMarkdown from "react-markdown";
import { Header } from "../../components/header";
import { Table } from "../model/table";

interface ITableViewProperties {
    name: string;
    table: Table;
}

export const TableView: React.FC<ITableViewProperties> = ({name, table}) => {

    return (<>
            <Header level={3}>{name}</Header>
            <table className="table table-dark table-striped table-hover">
                <tbody>
                    {table.rows.map((r, i) => (<tr key={'row-' + i}>
                        <td>{r.range}</td>
                        <td><ReactMarkdown>{'**' + r.result.name + ':** ' + r.result.description}</ReactMarkdown></td>
                    </tr>))}
                </tbody>
            </table>
        </>)

}