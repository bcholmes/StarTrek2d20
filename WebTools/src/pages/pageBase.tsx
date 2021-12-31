import * as React from 'react';
import {PageFactory} from  './pageFactory';
import {PageIdentity} from './pageIdentity';

interface IPageBaseProperties {
    page: PageIdentity;
}

export class Page extends React.Component<IPageBaseProperties, {}> {
    private pageFactory: PageFactory;

    constructor(props: IPageBaseProperties) {
        super(props);

        this.pageFactory = new PageFactory();
    }

    render() {
        const {page} = this.props;
        const pageContent = this.pageFactory.createPage(page);

        return (
            <div>
                <div>
                    {pageContent}
                </div>
            </div>
        );
    }
}