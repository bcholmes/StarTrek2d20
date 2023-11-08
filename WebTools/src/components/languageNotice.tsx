import React from 'react';
import { Header } from './header';
import { useTranslation } from 'react-i18next';
import { clearLanguageOverride, isLanguageOverridePresent, overrideLanguage } from '../i18n/config';

const LanguageNotice =(props) => {

    const { t } = useTranslation();

    return (<div>
        <Header level={2} className="mt-5">{t('LanguageNotice.title')}</Header>
        <p>{t('LanguageNotice.text')}</p>

        {isLanguageOverridePresent()
            ? (
                <p>
                    <a href="index.html" onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                        e.preventDefault();
                        e.stopPropagation();
                        clearLanguageOverride();
                    }}>Use Default Language</a>
                </p>)
            : (<p>
                    <a href="index.html" onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                        e.preventDefault();
                        e.stopPropagation();
                        overrideLanguage('en');
                    }}>{t('LanguageNotice.useEnglish')}</a>
                </p>)
        }
    </div>);
}

export default LanguageNotice;