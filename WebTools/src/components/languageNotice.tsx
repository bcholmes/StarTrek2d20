import * as React from 'react';
import { Header } from './header';
import { useTranslation } from 'react-i18next';

const LanguageNotice =(props) => {

    const { t } = useTranslation();

    return (<div>
        <Header level={2} className="mt-5">{t('LanguageNotice.title')}</Header>
        <p>{t('LanguageNotice.text')}</p>
    </div>);
}

export default LanguageNotice;