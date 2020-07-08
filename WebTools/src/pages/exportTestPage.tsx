import * as React from 'react';
import {character} from '../common/character';
import {SetHeaderText} from '../common/extensions';
import {IPageProperties} from './pageFactory';
import {CharacterSerializer} from '../common/characterSerializer';

export class ExportTestPage extends React.Component<IPageProperties, {}> {
    constructor(props: IPageProperties) {
        super(props);

        SetHeaderText("EXPORT TEST");

        character.name = "T'Rek";
        character.era = 1;
        character.age = 37;
        character.species = 4;
        character.attributes[0].value++;
        character.attributes[1].value++;
        character.attributes[2].value++;
        character.addTrait("Human");
        character.addTalent("kngodn");
        character.environment = 0;
        character.environmentValue = "1. The environment value";
        character.attributes[1].value++;
        character.skills[3].expertise++;
        character.upbringing = 5;
        character.acceptedUpbringing = false;
        character.attributes[2].value++;
        character.attributes[5].value += 2;
        character.skills[3].expertise++;
        character.addFocus("Espionage");
        character.track = 1;
        character.trackValue = "2. The track value";
        character.attributes[3].value++;
        character.attributes[4].value += 2;
        character.skills[3].expertise += 2;
        character.skills[0].expertise++;
        character.skills[1].expertise++;
        character.addFocus("Hand-to-Hand Combat");
        character.addFocus("Interrogation");
        character.addFocus("Survival");
        character.addTalent("Mean Right Hook");
        character.career = 1;
        character.careerValue = "3. The career value";
        character.addTalent("Beta");
        character.attributes[5].value++;
        character.skills[2].expertise++;
        character.addFocus("Improvisation");
        character.attributes[5].value++;
        character.skills[4].expertise++;
        character.addFocus("Xenobiology");
        character.finishValue = "4. The finish value";
        character.role = "Ship's Counselor";
        character.rank = "Lieutenant";
        character.addEquipment("Uniform");
        character.addEquipment("Communicator");
        character.addEquipment("Tricorder");
    }

    render() {
        const characterData = CharacterSerializer.serialize(character);

        const data = characterData.map((d, i) => {
            return (<input type="hidden" name={d.name} value={d.value}/>)
        });

        //const url = "http://localhost:52355/api/sheet";
        const url = "http://pdf.modiphiusapps.hostinguk.org/api/sheet";

        return (
            <div className="page">
                <div className="panel button-container">
                    <form action={url} method="post" encType="application/x-www-form-urlencoded" target="_blank">
                        {data}
                        <input type="submit" value="Export PDF"/>
                    </form>
                    <br/>
                </div>
            </div>
        );
    }
}