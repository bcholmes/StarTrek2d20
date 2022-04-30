import * as ReactDOM from 'react-dom';
import CharacterCreationApp from "./app";
import { Provider } from "react-redux";
import store from './state/store';

ReactDOM.render(
    <Provider store={store}><CharacterCreationApp /></Provider>, 
    document.getElementById("mainBody")
);