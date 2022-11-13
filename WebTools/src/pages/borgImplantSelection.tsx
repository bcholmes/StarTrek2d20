import * as React from 'react';
import { CheckBox } from '../components/checkBox';
import { Button } from '../components/button';
import { PageIdentity } from './pageIdentity';
import { Navigation } from '../common/navigator';
import { character } from '../common/character';
import { CharacterCreationBreadcrumbs } from '../components/characterCreationBreadcrumbs';
import { Header } from '../components/header';

interface Implant {
    name: string;
    description: string;
}

export class BorgImplantSelection extends React.Component<{}, {}> {
    private implants: Implant[] = [
        { name: "Adaptive shielding", description: "Each time the character is Injured by an energy-based weapon, roll 1[CD]. If an Effect is rolled, the character becomes immune to that type of weapon for the remainder of the scene." },
        { name: "Cardiopulmonary strengthener", description: "The character reduces the Difficulty of any Fitness Task relating to fatigue and endurance by two." },
        { name: "Cortical array (bio-synthetic gland)", description: "The character becomes resistant to diseases and poisons, reducing the Difficulty of any Task related to overcoming their effects by 1." },
        { name: "Cortical array (cortical node)", description: "The character becomes Immune to Pain and Fear, gaining +3 Resistance to non-lethal attacks and immunity to being intimidated or threatened." },
        { name: "Cortical array (interlink node)", description: "Allows the character to interface directly with technology. When the character gains assistance from a ship, they may reroll the ship’s d20." },
        { name: "Cortical array (neural subspace transciever", description: "Provides the character with a built-in short-range subspace communications device that cannot be removed without surgery. If the character also has the Ocular Sensory Enhancer, the character can “see” data transmissions as well as the entire EM spectrum." },
        { name: "Cybernetic arm (tactical)", description: "The character gains the Assimilation Tubules weapon (Melee, 5[CD] Intense, Size 1H, Deadly, Debilitation)." },
        { name: "Cybernetic arm (medical)", description: "The character gains the Assimilation Tubules weapon (Melee, 5[CD] Intense, Size 1H, Deadly, Debilitation). The character also has built-in medical equipment, equivalent to a medkit." },
        { name: "Cybernetic arm (engineering)", description: "The character gains the Assimilation Tubes weapon (Melee, 5[CD] Intense, Size 1H, Deadly, Debilitation). The character also has built-in engineering equipment, equivalent to an engineer’s toolkit." },
        { name: "Exo-plating", description: "Grants the character Resistance 2." },
        { name: "Ocular sensory enhancer", description: "The character can scan the environment, like a tricorder, and Tasks do not suffer an increase in Difficulty due to darkness." }
    ];

    private selected: string[];

    constructor(props: {}) {
        super(props);

        this.selected = [];
    }

    render() {
        const implants = this.implants.map((implant, i) => {
            return (
                <tr>
                    <td>
                        <CheckBox
                            isChecked={this.selected.indexOf(implant.name) > -1}
                            onChanged={(val) => { this.selectImplant(val); }}
                            value={implant.name} />
                    </td>
                    <td className="selection-header-small">{implant.name}</td>
                    <td>{implant.description}</td>
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
                    <div className="panel">
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

        Navigation.navigateToPage(PageIdentity.Finish);
    }
}