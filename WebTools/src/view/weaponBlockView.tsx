import { useTranslation } from "react-i18next";
import { Character } from "../common/character";
import { Construct } from "../common/construct";
import { Header } from "../components/header";
import WeaponView from "../components/weaponView";
import { Skill } from "../helpers/skills";

interface IWeaponBlockViewProperties {
    construct: Construct;
}

const WeaponBlockView: React.FC<IWeaponBlockViewProperties> = ({construct}) => {

    const { t } = useTranslation();

    if (construct.determineWeapons().length) {
        let weapons = construct.determineWeapons().map((w, i) => {
            let dice = w.dice;
            if (construct instanceof Character) {
                let character = construct as Character;
                dice += character.skills[Skill.Security].expertise;
            }
            return (<WeaponView key={'weapon-' + i} weapon={w} dice={dice} />);
        });
        return (<>
                <Header level={2} className="mt-4">{t('Construct.other.weapons')}</Header>
                <div>{weapons}</div>
            </>);
    } else {
        return null;
    }
}

export default WeaponBlockView;