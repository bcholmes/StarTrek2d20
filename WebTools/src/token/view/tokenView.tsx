import { useCallback, useEffect, useState } from 'react';
import type { TokenConfig } from '../../common/character';
import { LoadingSpinnerView } from '../../common/loadingSpinnerView';
import { SpeciesRestrictions } from '../model/speciesRestrictions';
import { HeadCatalog } from '../model/headCatalog';
import { UniformPackCollection } from '../model/uniformPackCollection';
import { ExtrasCatalog } from '../model/extrasCatalog';
import { TokenSvgBuilder } from '../tokenSvgBuilder';
import { useTranslation } from 'react-i18next';

interface ITokenViewProperties {
  tokenConfig: TokenConfig;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export const TokenView: React.FC<ITokenViewProperties> = ({
  tokenConfig,
  onClick,
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const editable = onClick != null;
  const { t } = useTranslation();

  const loadExtras = useCallback(() => {
    if (!ExtrasCatalog.instance.isLibraryLoaded) {
      ExtrasCatalog.instance.loadLibraryExtension(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const loadUniformEra = useCallback(() => {
    if (
      !UniformPackCollection.instance.isLoaded(tokenConfig.token.uniformEra)
    ) {
      UniformPackCollection.instance.loadUniformPack(
        tokenConfig.token.uniformEra,
        loadExtras,
      );
    } else {
      loadExtras();
    }
  }, [tokenConfig.token.uniformEra, loadExtras]);

  const loadDependencies = useCallback(async () => {
    if (SpeciesRestrictions.isRubberHeaded(tokenConfig.token.species)) {
      HeadCatalog.instance.loadRubberHeadExtension(loadUniformEra);
    } else {
      loadUniformEra();
    }
  }, [tokenConfig.token.species, loadUniformEra]);

  useEffect(() => {
    loadDependencies();
  }, [loadDependencies]);

  if (loading) {
    return <LoadingSpinnerView />;
  } else {
    const svg = TokenSvgBuilder.createSvg(
      tokenConfig.token,
      tokenConfig.rounded,
      tokenConfig.bordered && tokenConfig.rounded,
    );
    return (
      <div
        role={editable ? 'button' : undefined}
        onClick={() => {
          if (editable) {
            onClick();
          }
        }}
      >
        <div
          className="mw-100"
          style={{ width: '300px', aspectRatio: '1' }}
          dangerouslySetInnerHTML={{ __html: svg }}
          title={t('Construct.other.characterImage')}
        ></div>
      </div>
    );
  }
};
