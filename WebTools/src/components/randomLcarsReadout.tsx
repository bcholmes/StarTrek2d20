import * as React from 'react';
import { createRandomValue } from '../common/randomValueGenerator';
import { PageIdentity } from '../pages/pageIdentity';

interface IRandomLcarsReadoutProperties {
    page: PageIdentity;
}

export class RandomLcarsReadout extends React.Component<IRandomLcarsReadoutProperties, {}> {

    render() {
        let value = createRandomValue(5) + "-" + createRandomValue(6);
        return (
            <div className="lcar-text" aria-hidden="true">{value}</div>
        );
    }

}