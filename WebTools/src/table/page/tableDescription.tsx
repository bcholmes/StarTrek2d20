import ReactMarkdown from "react-markdown";
import { TableCollection } from "../model/table"

interface ITableCollectionDescriptionProperties {
    tableCollection: TableCollection;
}

export const TableCollectionDescription:React.FC<ITableCollectionDescriptionProperties> = ({tableCollection}) => {
    return (
        <ReactMarkdown>{'**' + tableCollection.name + ':** ' + tableCollection.description}</ReactMarkdown>
    )
}