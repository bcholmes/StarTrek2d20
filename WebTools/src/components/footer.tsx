import * as React from 'react';
import {Events, EventIdentity} from '../common/eventChannel';

interface IFooterProperties {
}

interface IFooterState {
    buttonClass: string;
}

export class Footer extends React.Component<IFooterProperties, IFooterState> {
    private _isSheetVisible: boolean;

    constructor(props: IFooterProperties) {
        super(props);

        this._isSheetVisible = false;

        this.state = {
            buttonClass: "arrow-right"
        };
    }

    render() {
        return (
            <div className="page-footer">
                <div className="view-character" onClick={() => this.showCharacter() }><div className={this.state.buttonClass}></div></div>
            </div>
        );
    }

    private showCharacter() {
        this._isSheetVisible = !this._isSheetVisible;

        var sheetBg = document.getElementById("sheet-bg");

        var sheet = document.getElementsByClassName("sheet-container")[0];
        var content = [
            document.getElementsByClassName("content")[0],
            document.getElementsByClassName("content-container-fullscreen")[0]
        ];

        if (this._isSheetVisible) {
            sheetBg.style.display = "";

            sheet.classList.add("sheet-container-visible");
            sheet.classList.remove("sheet-container-hidden");

            content.forEach(el => {
                el.classList.add("content-nudged");
            });

            this.setState({ buttonClass: "arrow-right arrow-left" });

            Events.signal(EventIdentity.UpdateCharacter);
        }
        else {
            sheetBg.style.display = "none";

            sheet.classList.add("sheet-container-hidden");
            sheet.classList.remove("sheet-container-visible");

            content.forEach(el => {
                el.classList.remove("content-nudged");
            });

            this.setState({ buttonClass: "arrow-right" });
        }
    }
}