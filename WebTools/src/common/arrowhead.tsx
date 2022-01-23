
const replaceDiceWithArrowhead = (description: string) => {
    if (description.indexOf("[D]") < 0) {
        return (<span>{description}</span>)
    } else {
        let parts = [];
        while (description.indexOf("[D]") >= 0) {
            let index = description.indexOf("[D]");
            if (index > 0) {
                let part = description.substring(0, index);
                parts.push(part);
            }
            parts.push("[D]");
            description = description.substring(index+3);
        }
        if (description.length > 0) {
            parts.push(description);
        }
        let content = parts.map((p,i) => p === "[D]" ? (<span className="delta" key={'part'+i}>{p}</span>) : (<span key={'part'+i}>{p}</span>));
        return (<span>
            {content}
        </span>)
    }
}

export default replaceDiceWithArrowhead;