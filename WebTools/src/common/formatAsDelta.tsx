
const formatAsDelta = (value: number) => {
    if (value && value > 0) {
        return "+" + value;
    } else if (value && value < 0) {
        return "" + value;
    } else if (value === 0) {
        return (<span>&ndash;</span>)
    } else {
        return (<span>&nbsp;</span>)
    }
}

export default formatAsDelta;