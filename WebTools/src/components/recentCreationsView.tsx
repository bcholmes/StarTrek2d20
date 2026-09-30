import { connect } from 'react-redux';
import type { ILocalStorageConstructRecord } from '../common/iLocalStorageConstructRecord';
import { Header } from './header';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import Markdown from 'react-markdown';

interface IRecentCreationsProperties {
  records: ILocalStorageConstructRecord[];
}

const RecentCreationsViewBase: React.FC<IRecentCreationsProperties> = ({
  records,
}) => {
  const { t } = useTranslation();

  if (records?.length) {
    return (
      <div className="my-4">
        <Header level={2}>{t('RecentCreationsView.title')}</Header>
        <Markdown>{t('RecentCreationsView.instruction')}</Markdown>
        <ul>
          {records.map((r) => (
            <li className="m-0" key={'record-' + r.hash}>
              <Link
                to={'/view?s=' + r.marshalled}
                target="_blank"
                rel="noopener noreferrer"
              >
                {r.name?.length
                  ? r.name
                  : t('Construct.other.unnamedCharacter')}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  } else {
    return undefined;
  }
};

function mapStateToProps(state, ownProps) {
  return {
    records: state.savedConstructReducer.records,
  };
}

export const RecentCreationsView = connect(mapStateToProps)(
  RecentCreationsViewBase,
);
