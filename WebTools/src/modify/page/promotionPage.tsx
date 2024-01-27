import React, { useState } from "react";
import { connect } from "react-redux";
import { Header } from "../../components/header";
import { Character, CharacterRank } from "../../common/character";
import { navigateTo } from "../../common/navigator";
import { PageIdentity } from "../../pages/pageIdentity";
import { Button } from "../../components/button";
import store from "../../state/store";
import { modifyCharacterRank } from "../../state/characterActions";
import { RanksHelper } from "../../helpers/ranks";
import { DropDownElement, DropDownSelect } from "../../components/dropDownInput";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

interface IPromotionPageProperties {
    character?: Character;
}

const PromotionPage: React.FC<IPromotionPageProperties> = ({character}) => {

    const [ rank, setRank ] = useState(character?.rank?.id);
    const [ rankName, setRankName ] = useState(character?.rank?.name);
    const navigate = useNavigate();

    const getRanks = () => {
        return RanksHelper.instance().getRanks(character, false).map(r => new DropDownElement(r.id, r.name));
    }

    const nextPage = () => {
        store.dispatch(modifyCharacterRank(new CharacterRank(rankName, rank)));
        navigateTo(null, PageIdentity.ModificationCompletePage);
    }

    const goToHome = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        e.stopPropagation();

        navigate("/");
    }

    const { t } = useTranslation();
    return (<div className="page container ms-0">
        <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
                <li className="breadcrumb-item"><a href="/index.html" onClick={(e) => goToHome(e)}>{t('Page.title.home')}</a></li>
                <li className="breadcrumb-item"><a href="/index.html" onClick={(e) => navigateTo(e, PageIdentity.ModificationTypeSelection)}>{t('Page.title.modificationTypeSelection')}</a></li>
                <li className="breadcrumb-item active" aria-current="page">{t('Page.title.promotion')}</li>
            </ol>
        </nav>

        <Header>{t('Page.title.promotion')}</Header>
        <p>{t('PromotionPage.instruction')}</p>

        <DropDownSelect items={getRanks()} onChange={(id) => {
                let allRanks = RanksHelper.instance().getRanks(character, false);
                let rank = allRanks.filter(r => r.id === id)[0];
                setRank(rank.id);
                setRankName(rank.name);
            }} defaultValue={rank || ""}/>

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

export default connect(mapStateToProps)(PromotionPage);
