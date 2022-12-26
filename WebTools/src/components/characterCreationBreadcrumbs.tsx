import React from "react";
import { withTranslation, WithTranslation } from 'react-i18next';

class CharacterCreationBreadcrumbs extends React.Component<WithTranslation,{}> {

    render() {
        const { t } = this.props;

        return (<nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="index.html">{t('Page.title.home')}</a></li>
                        <li className="breadcrumb-item active" aria-current="page">{t('Page.breadcrumb.characterCreation')}</li>
                    </ol>
                </nav>);
    }
}

export default withTranslation()(CharacterCreationBreadcrumbs)