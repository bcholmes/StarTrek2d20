import ReactMarkdown from "react-markdown";
import { Header } from "../../components/header";
import { Table } from "../model/table";

interface ITableViewProperties {
    name?: string;
    table: Table;
}

export const TableView: React.FC<ITableViewProperties> = ({name, table}) => {

    return (<>
            {name
                ? (<Header level={3}>{name}</Header>)
                : undefined}
            <table className="table table-dark table-striped table-hover">
                <thead>
                    <tr>
                        <th className="bg-black">Roll</th>
                        <th className="bg-black">Result</th>
                    </tr>
                </thead>
                <tbody>
                    {table.rows.map((r, i) => (<tr key={'row-' + i}>
                        <td className="text-center">{r.range}</td>
                        <td><ReactMarkdown>{'**' + r.result.name + ':** ' + r.result.description}</ReactMarkdown></td>
                    </tr>))}
                </tbody>
            </table>
        </>)

}