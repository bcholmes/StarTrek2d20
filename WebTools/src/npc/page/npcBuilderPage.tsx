import { connect } from 'react-redux';
import { LcarsFrame } from '../../components/lcarsFrame';
import type { Era } from '../../helpers/erasEnum';
import { PageIdentity } from '../../pages/pageIdentity';
import { useTranslation } from 'react-i18next';
import { Header } from '../../components/header';
import { InstructionText } from '../../components/instructionText';
import { Link, useNavigate } from 'react-router';
import {
  DropDownElement,
  DropDownSelect,
} from '../../components/dropDownInput';
import { NpcType, NpcTypes } from '../model/npcType';
import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { Character, OtherDetails } from '../../common/character';
import { isSecondEdition } from '../../state/contextFunctions';
import { store } from '../../state/store';
import { setCharacter } from '../../state/characterActions';
import { CharacterType, CharacterTypeModel } from '../../common/characterType';
import type { Source } from '../../helpers/sources';
import { InputFieldAndLabel } from '../../common/inputFieldAndLabel';

interface INpcConfigurationPageProperties {
  era: Era;
  sources: Source[];
}

const NpcBuilderPageBase: React.FC<INpcConfigurationPageProperties> = ({
  era,
  sources,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedCharacterType, setSelectedCharacterType] =
    useState<CharacterType>(CharacterType.Starfleet);
  const [selectedNpcType, setSelectedNpcType] = useState<NpcType>(
    NpcType.Notable,
  );
  const [selectedOtherText, setSelectedOtherText] = useState<string>('');

  const createCharacterAndNext = () => {
    const character = Character.createNpcCharacter(
      era,
      isSecondEdition() ? 2 : 1,
      selectedNpcType,
      selectedCharacterType,
    );
    if (
      selectedCharacterType === CharacterType.Other &&
      selectedOtherText?.length
    ) {
      character.typeDetails = new OtherDetails(selectedOtherText);
    }
    store.dispatch(setCharacter(character));
    navigate('/npc/species');
  };

  return (
    <LcarsFrame activePage={PageIdentity.NpcBuilder}>
      <div id="app">
        <div className="page container ms-0">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to={'/index.html'}>{t('Page.title.home')}</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {t('Page.title.npcBuilder')}
              </li>
            </ol>
          </nav>
          <main>
            <Header>{t('Page.title.npcBuilder')}</Header>

            <div className="my-4">
              <InstructionText text={t('NpcBuilderPage.text')} />
            </div>

            <div className="row">
              <div className="col-md-6 mt-4">
                <Header level={2}>{t('NpcConfigurationPage.npcType')}</Header>

                <div className="my-4">
                  <DropDownSelect
                    items={NpcTypes.getNpcTypes().map(
                      (t) => new DropDownElement(t.type, t.localizedName),
                    )}
                    defaultValue={selectedNpcType}
                    onChange={(type) => setSelectedNpcType(type as NpcType)}
                  />

                  <div className="mt-3">
                    <InstructionText
                      text={
                        NpcTypes.getNpcTypes()[selectedNpcType]
                          .localizedDescription
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-6 mt-4">
                <Header level={2}>{t('Construct.other.characterType')}</Header>

                <div className="my-4">
                  <DropDownSelect
                    items={CharacterTypeModel.getNpcTypes(sources).map(
                      (t) => new DropDownElement(t.type, t.localizedName),
                    )}
                    defaultValue={selectedCharacterType}
                    onChange={(type) =>
                      setSelectedCharacterType(type as CharacterType)
                    }
                  />

                  {selectedCharacterType === CharacterType.Other ? (
                    <div className="mt-3">
                      <InputFieldAndLabel
                        labelName={t('Common.text.other')}
                        id="other"
                        value={selectedOtherText}
                        onChange={(v) => setSelectedOtherText(v)}
                      />
                    </div>
                  ) : undefined}
                </div>
              </div>
            </div>

            <div className="mt-4 text-end">
              <Button
                className="mt-4"
                onClick={() => {
                  createCharacterAndNext();
                }}
              >
                {t('Common.button.next')}
              </Button>
            </div>
          </main>
        </div>
      </div>
    </LcarsFrame>
  );
};

function mapStateToProps(state, ownProps) {
  return {
    era: state.context.era,
    sources: state.context.sources,
  };
}

export const NpcBuilderPage = connect(mapStateToProps)(NpcBuilderPageBase);
