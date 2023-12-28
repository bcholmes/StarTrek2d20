import { ICharacterPageProperties } from "../common/iCharacterPageProperties";
import { localizedFocus } from "../components/focusHelper";

const FocusBlockView: React.FC<ICharacterPageProperties> = ({character}) => {

    if (character.focuses) {
        let result = character.focuses.map((f, i) => (<div className="text-white view-border-bottom py-2" key={'focus-' + i}>{localizedFocus(f)}</div>));
        return (<>{result}</>);
    } else {
        return undefined;
    }
}

export default FocusBlockView;