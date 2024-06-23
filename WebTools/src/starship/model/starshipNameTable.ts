import { Era } from "../../helpers/eras"


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
    "Ibn Zuhr"
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
]

const chooseOptions = (era: Era) => {
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

export const StarshipRandomNameTable = (era: Era) => {

    let options = chooseOptions(era);
    let index = Math.floor(Math.random() * options.length);

    return options[index];
}