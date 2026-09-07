import { useNavigate } from 'react-router';
import type { Character, TokenConfig } from '../common/character';
import { store } from '../state/store';
import { createNewToken } from '../state/tokenActions';
import { setCharacter } from '../state/characterActions';
import { lazy, Suspense } from 'react';
import { LoadingSpinnerView } from '../common/loadingSpinnerView';
import { TokenModel } from '../token/model/tokenModel';
import { IconButton } from '../components/iconButton';

const TokenView = lazy(() =>
  import(/* webpackChunkName: 'token' */ '../token/view/tokenView').then(
    (m) => ({ default: m.TokenView }),
  ),
);

interface CharacterTokenImageProperties {
  character: Character;
  marshalledCharacter?: string;
  onDeleteToken?: () => void;
}

export const CharacterTokenImage: React.FC<CharacterTokenImageProperties> = ({
  character,
  marshalledCharacter,
  onDeleteToken = () => {},
}) => {
  const navigate = useNavigate();

  const createToken = (token?: TokenConfig) => {
    store.dispatch(setCharacter(character));
    store.dispatch(
      createNewToken(
        token?.token ?? TokenModel.createDefault(),
        marshalledCharacter,
        character.nameAndAbbreviatedRank,
        token?.rounded,
        token?.bordered,
      ),
    );
    navigate('/token');
  };

  return (
    <div className="d-flex justify-content-center align-items-end">
      {character.token ? (
        <Suspense fallback={<LoadingSpinnerView />}>
          <TokenView
            tokenConfig={character.token}
            onClick={() => createToken(character.token)}
          />
          {onDeleteToken != null ? (
            <IconButton icon="trash" variant="danger" onClick={onDeleteToken} />
          ) : undefined}
        </Suspense>
      ) : (
        <div
          style={{
            aspectRatio: 1,
            width: '250px',
            maxWidth: '100%',
            fontSize: 'x-large',
          }}
          className="d-flex justify-content-center align-items-center text-secondary border border-secondary rounded"
          role="button"
          onClick={() => createToken()}
        >
          <i className="bi bi-person-square"></i>
        </div>
      )}
    </div>
  );
};
