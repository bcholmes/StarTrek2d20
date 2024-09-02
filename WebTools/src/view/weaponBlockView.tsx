import { useTranslation } from "react-i18next";
import { Construct } from "../common/construct";
import { Header } from "../components/header";
import WeaponView from "../components/weaponView";

interface IWeaponBlockViewProperties {
    construct: Construct;
}

const WeaponBlockView: React.FC<IWeaponBlockViewProperties> = ({construct}) => {

    const { t } = useTranslation();

    if (construct.determineWeapons().length) {
        let weapons = construct.determineWeapons().map((w, i) => {
            let dice = construct.getDiceForWeapon(w);
            return (<WeaponView key={'weapon-' + i} weapon={w} dice={dice} version={construct.version} />);
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