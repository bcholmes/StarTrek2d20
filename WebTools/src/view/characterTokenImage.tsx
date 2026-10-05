import { useNavigate } from 'react-router';
import { type Character, ImageConfig, TokenConfig } from '../common/character';
import { store } from '../state/store';
import { createNewToken } from '../state/tokenActions';
import { setCharacter } from '../state/characterActions';
import { lazy, Suspense } from 'react';
import { LoadingSpinnerView } from '../common/loadingSpinnerView';
import { TokenModel } from '../token/model/tokenModel';
import { IconButton } from '../components/iconButton';
import { FileUploadDialog } from '../components/fileUploadView';
import { cyrb53 } from '../common/cyrb53';
import { saveCharacterToLocalStorage } from '../state/savedConstructActions';
import { marshaller } from '../helpers/marshaller';

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

  const openDialog = () => {
    const token =
      character.image && character.image instanceof TokenConfig
        ? (character.image as TokenConfig)
        : undefined;
    new FileUploadDialog().show(
      () => createToken(token),
      (config) => saveImage(config),
    );
  };

  const saveImage = (config: ImageConfig) => {
    const hash = cyrb53(marshalledCharacter);
    character.image = config;
    store.dispatch(saveCharacterToLocalStorage(character, hash));
    const value = marshaller.encodeCharacter(character);
    navigate('/view?s=' + value, { replace: true });
  };

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
      {character.image && character.image instanceof TokenConfig ? (
        <Suspense fallback={<LoadingSpinnerView />}>
          <TokenView tokenConfig={character.image} onClick={openDialog} />
          {onDeleteToken != null ? (
            <IconButton icon="trash" variant="danger" onClick={onDeleteToken} />
          ) : undefined}
        </Suspense>
      ) : character.image && character.image instanceof ImageConfig ? (
        <div className="d-flex justify-content-center align-items-end">
          <img
            src={character.image.dataUrl}
            style={{
              aspectRatio: 1,
              width: '250px',
              maxWidth: '100%',
            }}
            role="button"
            onClick={openDialog}
          />
          {onDeleteToken != null ? (
            <IconButton icon="trash" variant="danger" onClick={onDeleteToken} />
          ) : undefined}
        </div>
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
          onClick={openDialog}
        >
          <i className="bi bi-person-square"></i>
        </div>
      )}
    </div>
  );
};
