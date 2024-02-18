
import copy from 'copy-to-clipboard';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';

interface IShareTableModalProperties {
    link: string;
}

export const ShareTableModal: React.FC<IShareTableModalProperties> = ({link}) => {

    const { t } = useTranslation();

    const copyToClipboard = () => {
        copy(link);
        toast(t('Common.text.copiedToClipboard'), { className: 'bg-success' })
    }

    return (<div>
                <ReactMarkdown>{t('ShareTableModal.instruction')}</ReactMarkdown>

                <div className="input-group mb-3">
                    <input type="text" className="form-control form-control-sm bg-dark border-secondary text-white" placeholder="" aria-label="URL for sharing" aria-describedby="share-button"
                        value={link} readOnly={true} />
                    <button className="btn btn-outline-secondary btn-sm" type="button" id="share-button" onClick={copyToClipboard}
                        style={{minWidth: "auto", paddingTop: "6px", paddingBottom: "6px"}}
                        aria-label={t('Common.button.copyToClipboard')}><i className="bi bi-clipboard"></i></button>
                </div>
            </div>);
}