import * as React from 'react';
import { CheckBox } from '../components/checkBox';
import { Button } from '../components/button';
import { PageIdentity } from './pageIdentity';
import { Navigation } from '../common/navigator';
import { character } from '../common/character';
import CharacterCreationBreadcrumbs from '../components/characterCreationBreadcrumbs';
import { Header } from '../components/header';
import { extraCharacterStepsNext } from './extraCharacterSteps';
import replaceDiceWithArrowhead from '../common/arrowhead';
import store from '../state/store';
import { setCharacter } from '../state/characterActions';
import { BorgImplants, Implant } from '../helpers/borgImplant';

export class BorgImplantSelection extends React.Component<{}, {}> {

    constructor(props: {}) {
        super(props);
    }

    render() {
        const implants = BorgImplants.instance.implants.map((implant, i) => {
            return (
                <tr>
                    <td>
                        <CheckBox
                            isChecked={character.implants.indexOf(implant.type) > -1}
                            onChanged={(val) => { this.selectImplant(implant); }}
                            value={implant.name} />
                    </td>
                    <td className="selection-header-small">{implant.name}</td>
                    <td>{replaceDiceWithArrowhead(implant.description)}</td>
                </tr>
            );
        });

        return (
            <div className="page container ml-0">
                <CharacterCreationBreadcrumbs />
                <Header>Borg Implants</Header>
                <div>
                    <p>
                        Select up to 3 implants.
                        Each implant increases the difficulty of Medicine Tasks performed on you.
                    </p>
                    <div>
                        <table className="selection-list">
                            <tbody>
                                {implants}
                            </tbody>
                        </table>
                    </div>
                </div>
                <Button text="DONE" className="button-next" onClick={() => this.onNext()} />
            </div>
        )
    }

    private selectImplant(implant: Implant) {
        character.implants.push(implant.type);

        if (character.implants.length > 3) {
            character.implants.splice(0, 1);
        }

        this.forceUpdate();
    }

    private onNext() {
        let optionalPage = extraCharacterStepsNext(character, PageIdentity.BorgImplants);
        if (optionalPage != null) {
            Navigation.navigateToPage(optionalPage);
        } else {
            store.dispatch(setCharacter(character));
            Navigation.navigateToPage(PageIdentity.Finish);
        }
    }
}