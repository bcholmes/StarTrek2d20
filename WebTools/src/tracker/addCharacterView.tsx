import React from "react";
import { withTranslation, WithTranslation } from 'react-i18next';
import { Button } from "../components/button";
import { marshaller } from "../helpers/marshaller";
import { addGMTrackedCharacter } from "../state/gmTrackerActions";
import store from "../state/store";

interface IAddCharacterState {
    enabled: boolean;
    message: string;
    characterString?: string;
}

interface IAddCharacterProperties extends WithTranslation {
    onDone: () => void;
}

class AddCharacterView extends React.Component<IAddCharacterProperties, IAddCharacterState> {

    constructor(props) {
        super(props);
        this.state = {
            enabled: false,
            message: ""
        };
    }

    render() {
        const {t} = this.props;
        return (<div>
                <p>{t('AddCharacterView.instruction')}</p>

                <div>
                    <textarea name="url" className="form-control w-100" style={{minHeight: "10rem"}}
                        onChange={(e) => this.parseCharacter(e.target.value)}>
                    </textarea>
                </div>

                <p className="mt-3">{this.state.message}</p>

                <div className="mt-5 text-right">
                    <Button className="btn btn-sm btn-primary" buttonType={true}
                        enabled={this.state.enabled}
                        onClick={() => this.addCharacter()}>{t('Common.button.add')}</Button>
                </div>
            </div>);
    }

    parseCharacter(urlString: string) {
        if (urlString) {
            const { t } = this.props;
            try {
                let url = new URL(urlString);
                let query = new URLSearchParams(url.search);
                let encodedSheet = query.get('s');

                let json = marshaller.decode(encodedSheet);
                if (json == null) {
                    this.setState((state) => ({...state, enabled: false,
                        message: t('AddCharacterView.errorMessage'),
                        characterString: undefined
                    }));
                } else if (json.stereotype !== "supportingCharacter" && json.stereotype !== "mainCharacter") {
                    this.setState((state) => ({...state, enabled: false,
                        message: t('AddCharacterView.errorCharacterType'),
                        characterString: undefined
                    }));
                } else {
                    let character = marshaller.decodeCharacter(json);
                    this.setState((state) => ({...state, enabled: true,
                        message: t('AddCharacterView.characterPrefix') + ' ' + character.name,
                        characterString: encodedSheet
                    }));
                }
            } catch (e) {
                this.setState((state) => ({...state, enabled: false, message: t('AddCharacterView.errorMessage'),
                    characterString: undefined
                }));
            }
        } else {
            this.setState((state) => ({...state, enabled: false, message: "",
                characterString: undefined
            }));
        }
    }

    addCharacter() {
        let json = marshaller.decode(this.state.characterString);
        if (json) {
            let character = marshaller.decodeCharacter(json);
            store.dispatch(addGMTrackedCharacter(character));
            this.props.onDone();
        } else {
            console.log("Things didn't work: " + this.state.characterString);
        }
    }
}

export default withTranslation()(AddCharacterView);