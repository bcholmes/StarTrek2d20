
interface IStressOrShieldsViewProperties {
    value: number;
}

const StressOrShieldsView: React.FC<IStressOrShieldsViewProperties> = ({value}) => {

    if (value) {
        let iterator = [];
        for (let i = 1; i <= Math.max(20, Math.ceil(value / 5) * 5); i++) {
            iterator.push(i);
        }

        const pills = iterator.map(i => {
            if (i <= value) {
                return (<div className="empty-pill mb-2" key={'stress-' + i}></div>);
            } else {
                return (<div className="empty-pill solid mb-2" key={'stress-' + i}></div>);
            }
        });
        return (<div className="d-flex flex-wrap mt-3 mb-2">
                {pills}
            </div>);
    } else {
        return undefined;
    }
}

export default StressOrShieldsView;