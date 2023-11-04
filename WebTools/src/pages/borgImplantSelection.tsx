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
import { BorgImplants } from '../helpers/borgImplant';

export class BorgImplantSelection extends React.Component<{}, {}> {

    private selected: string[];

    constructor(props: {}) {
        super(props);
        this.selected = [...character.implants];
    }

    render() {
        const implants = BorgImplants.instance.implants.map((implant, i) => {
            return (
                <tr>
                    <td>
                        <CheckBox
                            isChecked={this.selected.indexOf(implant.name) > -1}
                            onChanged={(val) => { this.selectImplant(val); }}
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
                <Header>BORG IMPLANTS</Header>
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

    private selectImplant(implant: string) {
        this.selected.push(implant);

        if (this.selected.length > 3) {
            this.selected.splice(0, 1);
        }

        this.forceUpdate();
    }

    private onNext() {
        this.selected.forEach(i => {
            character.implants.push(i);
        });

        let optionalPage = extraCharacterStepsNext(character, PageIdentity.BorgImplants);
        if (optionalPage != null) {
            Navigation.navigateToPage(optionalPage);
        } else {
            store.dispatch(setCharacter(character));
            Navigation.navigateToPage(PageIdentity.Finish);
        }
    }
}