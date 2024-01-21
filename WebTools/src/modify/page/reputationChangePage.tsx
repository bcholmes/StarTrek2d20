import React, { useState } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router";
import { useTranslation } from 'react-i18next';
import { Header } from "../../components/header";
import { Character } from "../../common/character";
import { navigateTo } from "../../common/navigator";
import { PageIdentity } from "../../pages/pageIdentity";
import { StatControl } from "../../starship/view/statControl";
import { Button } from "../../components/button";
import store from "../../state/store";
import { modifyCharacterReputation } from "../../state/characterActions";

interface ReputationChangePageProperties {
    character?: Character;
}

const ReputationChangePage: React.FC<ReputationChangePageProperties> = ({character}) => {

    const [delta, setDelta] = useState(0);
    const { t } = useTranslation();
    const navigate = useNavigate()

    const nextPage = () => {
        store.dispatch(modifyCharacterReputation(delta));
        navigateTo(null, PageIdentity.ModificationCompletePage);
    }

    const goToHome = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        e.stopPropagation();

        navigate("/");
    }

    const value = (character?.reputation ?? 0) + delta;
    return (<div className="page container ms-0">
        <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
                <li className="breadcrumb-item"><a href="index.html" onClick={(e) => goToHome(e)}>{t('Page.title.home')}</a></li>
                <li className="breadcrumb-item"><a href="index.html" onClick={(e) => navigateTo(e, PageIdentity.ModificationTypeSelection)}>{t('Page.title.modificationTypeSelection')}</a></li>
                <li className="breadcrumb-item active" aria-current="page">{t('Page.title.reputationChange')}</li>
            </ol>
        </nav>

        <Header>{t('Page.title.reputationChange')}</Header>
        <p>{t('ReputationChangePage.instruction')}</p>

        <StatControl statName={t('Construct.other.reputation')} value={value}
                    showIncrease={value < 20}
                    showDecrease={value > 0}
                    onIncrease={() => setDelta((delta) => (delta + 1))}
                    onDecrease={() => setDelta((delta) => (delta - 1))} />

        <div className="mt-4 text-end">
            <Button buttonType={true} onClick={() => nextPage()} className="btn btn-primary btn-sm">{t('Common.button.next')}</Button>
        </div>

    </div>);

}

function mapStateToProps(state, ownProps) {
    return {
        character: state.character.currentCharacter
    };
}

export default connect(mapStateToProps)(ReputationChangePage);
