import React from "react";
import { Character, character } from "../common/character";
import { CharacterType } from "../common/characterType";
import { InputFieldAndLabel } from "../common/inputFieldAndLabel";
import { Navigation } from "../common/navigator";
import { Button } from "../components/button";
import { CharacterCreationBreadcrumbs } from "../components/characterCreationBreadcrumbs";
import { Dialog } from "../components/dialog";
import { Header } from "../components/header";
import { extraCharacterStepsNext } from "./extraCharacterSteps";
import { PageIdentity } from "./pageIdentity";

interface IExtraFocusPageState {
    focuses: string[]
}

export class ExtraFocusPage extends React.Component<{}, IExtraFocusPageState> {

    numberOfFocuses: number;

    constructor(props) {
        super(props);

        this.numberOfFocuses = 0;
        if (character.hasTalent("Visit Every Star")) {
            this.numberOfFocuses += 1;
        }
        if (character.hasTalent("Expanded Program")) {
            this.numberOfFocuses += 2;
        }

        let initialValues = [];
        for (let i = 0; i < this.numberOfFocuses; i++) {
            initialValues.push("");
        }
        this.state = {
            focuses: initialValues
        }
    }

    render() {
        let ids = [];
        for (let i = 0; i < this.numberOfFocuses; i++) {
            ids.push(i);
        }

        return (<div className="page container ml-0">
            <CharacterCreationBreadcrumbs />
            <Header>Extra Focuses</Header>
            <p>
                Your previous talent selections provide you with
                {this.numberOfFocuses === 1 ? ' one additional focus.' : (' ' + this.numberOfFocuses + ' additional focuses.')}
            </p>

            {ids.map(i => {
                return (<><InputFieldAndLabel id={'focus-' + i}
                    labelName="Focus"
                    onChange={(value) => this.addFocus(value, i)}
                    value={this.getFocus(i)}
                    key={'additionalFocus-' + i} />
                    <div><small className="text-white">
                        <b>Suggestions: </b> {(i === 0 && character.hasTalent("Visit Every Star"))
                            ? "Astronavigation, Stellar Cartography, or a similar field of space science."
                            : "Holonovel writing, Opera, Holo-photography, or anything else"}
                    </small></div>
                    </>)
            })}

            <Button onClick={() => this.nextPage()} text='Finish' />
        </div>);
    }

    addFocus(focus: string, index: number) {
        this.setState((state) => {
            let focuses = [...state.focuses];
            focuses[index] = focus;
            return {
                ...state,
                focuses
            };
        });
        let index2 = index + this.determineStandardNumberOfFocuses(character);
        if (index2 >= character.focuses.length) {
            for (let i = character.focuses.length, length = this.determineStandardNumberOfFocuses(character) + this.numberOfFocuses; i < length; i++) {
                character.addFocus("");
            }
        }
        character.focuses[index2] = focus;
    }

    getFocus(index: number) {
        index += this.determineStandardNumberOfFocuses(character);
        return index < character.focuses.length ? character.focuses[index] || "" : "";
    }

    nextPage() {
        let ok = true;
        for (let i = 0; i < this.numberOfFocuses; i++) {
            ok = ok && (this.getFocus(i) !== "");
        }
        if (ok) {
            let optionalPage = extraCharacterStepsNext(character, PageIdentity.ExtraFocus);
            if (optionalPage == null) {
                Navigation.navigateToPage(PageIdentity.Finish);
            } else {
                Navigation.navigateToPage(optionalPage);
            }
        } else {
            Dialog.show("You haven't specified all focuses.");
        }
    }

    determineStandardNumberOfFocuses(character: Character) {
        if (character.type === CharacterType.Child) {
            return 3;
        } else if (character.type === CharacterType.Cadet) {
            return 4 + character.careerEvents.length;
        } else {
            return 6;
        }
    }
}