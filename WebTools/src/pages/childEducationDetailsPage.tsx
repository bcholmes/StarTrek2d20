import * as React from 'react';
import { Header } from '../components/header';
import { IPageProperties } from './iPageProperties';

export class ChildEducationDetailsPage extends React.Component<IPageProperties, {}> {

    render() {
        return (<div className="page"><Header text="Hi" /></div>);
    }
}