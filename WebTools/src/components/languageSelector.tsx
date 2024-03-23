import React, {useState} from 'react';
import {getCurrentLanguageCode, overrideLanguage, supportedLanguages} from "../i18n/config";

const LanguageSelector: React.FC = () => {
    const [selectedLanguage, setSelectedLanguage] = useState<string>(getCurrentLanguageCode());

    const { hostname } = window.location;

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        overrideLanguage(e.target.value);
        setSelectedLanguage(e.target.value);
    };

    const style: React.CSSProperties = {
        width: 'auto',
        backgroundColor: '#9E8ABD',
        color: 'black',
        padding: 0
    };

    return hostname !== "localhost"
        ? undefined
        : (
            <select value={selectedLanguage} onChange={handleLanguageChange} style={style}>
                {Object.keys(supportedLanguages).map((key) => (
                    <option key={key} value={key}>{supportedLanguages[key]}</option>
                ))}
            </select>
        );
}

export default LanguageSelector;