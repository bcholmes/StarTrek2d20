import { Era } from "../../helpers/eras"
import { RandomStarshipCharacterType } from "./randomStarshipCharacterTypes"


const starshipEnterpriseEraNames = [
    "Republic",
    "Yorktown",
    "Intrepid",
    "Kongo",
    "Cochrane",
    "Challenger",
    "Endeavour",
    "Farragut",
    "Hood",
    "Hornet",
    "Essex",
    "Lexington",
    "Valiant",
    "Potemkin",
    "Constellation",
    "Exeter",
    "Madrid",
    "Bozeman",
    "Liverpool",
    "Beijing",
    "Eagle",
    "Merrimac",
    "Trimble",
    "Tasaki",
    "Tecumseh",
    "Sitting Bull",
    "Gies",
    "Voskuijl",
    "Leeuwenhoek",
    "Curie",
    "Descartes",
    "Pasteur",
    "Arondeus",
    "Thunberg",
    "Wathuti",
    "Mandela",
    "Coto",
    "Sagan",
    "Earhart",
    "Al-Farabi",
    "Ibn Sina",
    "Al-Haytham",
    "Ibn Zuhr",
    "Salk",
    "Winton",
    "Lumumba"
]

const klingonEnterpriseEraNames = [
    "HIv",
    "Chech",
    "Horey'So",
    "Wa' qelI'qam Lengpu'",
    "Chaj",
    "yIDoH",
    "bortaS",
    "HoSghaj",
    "'Iw",
    "vaQ",
    "SuvwI'",
    "QeyHa'",
    "parmaq",
    "bIHegh",
    "QeylIS",
    "bIrchoH",
    "qo'",
    "Hoch",
    "jatlh",
    "juH qach",
    "qaqIp",
    "'ej yIqemchu'meH jIjaH",
    "may'luch",
    "ghe''or",
    "Sub",
    "ghom'a' qellu'chugh",
    "HeSraj vavlI'",
    "toy'wI''a'",
    "poSrupbe'jaj",
    "qorDu'ghot HoSghaj",
    "'ej bortaS",
    "maw'",
    "rol taj",
    "ghev",
    "may'luch",
    "SIq",
    "ngutlh",
    "qew",
    "ratlh"
]

const klingonTngEraNames = [
    "Korrd",
    "Azetbur"
]


const starshipTosEraName = [
    "Mayweather",
    "Archer",
    "Tereshkova",
    "Gagarin",
    "Komarov",
    "Leonov",
    "Xinlin",
    "Yaping",
    "Lewei",
    "Zhigang",
    "Yang",
    "Ride",
    "Vaughan",
    "Jemison",
    "Bluford",
    "King Jr.",
    "Rustin",
    "Hopper",
    "T'Pol",
    "Sato",
    "Hernandez",
    "Chavez",
    "Chawla",
    "Gallant",
    "McAuliffe",
    "Resnik",
    "Scobee",
    "Onizuka",
    "Gebru",
    "Mohri",
    "Glenn",
    "Armstrong",
    "Lincoln",
    "Bethune",
    "Merkel",
    "Zelenskyy",
    "Ocasio-Cortez",
    "Tlaib",
    "Shran",
    "Soval",
    "Forrest",
    "Robinson",
    "Yunis",
    "Zhang",
    "Raji",
    "Farmer",
    "Hampton",
    "Northup",
    "Winton",
    "Jaggar",
    "Edhi",
    "Unaipon",
    "Tolokonnikova",
    "Alyokhina",
    "Samutsevich",
    "Suzuki",
    "Milk",
    "Xia",
    "Bolivar",
    "Fontana",
    "Gral",
    "Thoris",
    "Phlox",
    "Ajax",
    "Artemis",
    "Powhatan",
    "Banneker",
    "Lamarr",
    "Pearson",
    "Prescod-Weinstein",
    "Zhongjing",
    "DePass",
    "Shukla",
    "Nair",
    "Haipeng",
    "Yipang",
    "Zhigang"
]

const starshipTngEraNames = [
    "Louverture",
    "Nogura",
    "Uhura",
    "Shras",
    "Chin-Riley",
    "Georgiou",
    "Pike",
    "Sulu",
    "Drexler",
    "Dismuke",
    "Korby",
    "Johnson",
    "Pollyea",
    "Campbell",
    "de Leve",
    "Pearl",
    "Spader"
]

const chooseOptions = (era: Era, type: RandomStarshipCharacterType) => {
    if (type === RandomStarshipCharacterType.Klingon) {
        let result = [...klingonEnterpriseEraNames];
        switch (era) {
            case Era.NextGeneration:
                Array.prototype.push.apply(result, klingonTngEraNames);
                break;
            default:
        }
        return result;
    } else {
        let result = [...starshipEnterpriseEraNames];
        switch (era) {
            case Era.OriginalSeries:
                Array.prototype.push.apply(result, starshipTosEraName);
                break;
            case Era.NextGeneration:
                Array.prototype.push.apply(result, starshipTosEraName);
                Array.prototype.push.apply(result, starshipTngEraNames);
                break;
            default:
        }
        return result;
    }
}

export const StarshipRandomNameTable = (era: Era, type: RandomStarshipCharacterType) => {

    let options = chooseOptions(era, type);
    let index = Math.floor(Math.random() * options.length);

    return options[index];
}