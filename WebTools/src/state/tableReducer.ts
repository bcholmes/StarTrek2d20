import { Table, TableCollection, TableRow, ValueResult } from "../table/model/table";
import TableMarshaller from "../table/model/tableMarshaller";
import { IMPORT_TABLE_COLLECTION, SET_TABLE_COLLECTION_SELECTION } from "./tableActions";

const tableCollection = new TableCollection(
        new Table("Probability Matrix: Things That Could Go Wrong While Visiting an Alien Bar",
            new TableRow(new ValueResult("Misunderstood Currency", "You unwittingly offend the bartender by using the wrong currency or payment method."), 1),
            new TableRow(new ValueResult("Intergalactic Brawl", "A heated altercation breaks out between patrons, threatening to involve you."), 2),
            new TableRow(new ValueResult("Language Barrier", "Communication difficulties arise, leading to misunderstandings with the locals."), 3),
            new TableRow(new ValueResult("Alien Food Allergy", "You have an adverse reaction to the exotic alien cuisine served at the bar."), 4),
            new TableRow(new ValueResult("Identity Mix-Up", "You’re mistaken for a notorious criminal, leading to unwanted attention."), 5),
            new TableRow(new ValueResult("Drinking Challenge", "A local alien challenges you to a drinking contest that could end badly."), 6),
            new TableRow(new ValueResult("Currency Theft", "Your credits or belongings are stolen by a pickpocket or sneak thief."), 7),
            new TableRow(new ValueResult("Alien Beverage", "You order a mysterious alien drink that has unexpected and extreme effects."), 8),
            new TableRow(new ValueResult("Alien Customs Violation", "You unknowingly violate a local custom or tradition, angering the locals."), 9),
            new TableRow(new ValueResult("Frequent Power Outages", "The bar experiences frequent power outages, plunging you into darkness."), 10),
            new TableRow(new ValueResult("Bar Bouncer Conflict", "You have a run-in with the bar’s formidable bouncer or security."), 11),
            new TableRow(new ValueResult("Local Gang Presence", "A local alien gang takes an interest in you, demanding your compliance."), 12),
            new TableRow(new ValueResult("Telepathic Misunderstanding", "You accidentally broadcast your thoughts to nearby telepathic aliens."), 13),
            new TableRow(new ValueResult("Invasion Alarm", "The bar’s alarms blare as an enemy fleet approaches, causing panic."), 14),
            new TableRow(new ValueResult("Mind-Altering Atmosphere", "The bar’s atmosphere affects your judgment and perception."), 15),
            new TableRow(new ValueResult("Botched Karaoke", " You’re coerced into participating in an embarrassing karaoke competition."), 16),
            new TableRow(new ValueResult("Alien Romance Complications", "You unintentionally become entangled in a complicated alien romance."), 17),
            new TableRow(new ValueResult("Black Market Dealings", "You witness illegal black market transactions taking place in the bar."), 18),
            new TableRow(new ValueResult("Alien Pet Attack", "A patron’s exotic alien pet escapes and causes chaos."), 19),
            new TableRow(new ValueResult("Temporal Anomaly", "A sudden temporal anomaly disrupts the space-time continuum, causing bizarre effects in the bar."), 20)),
        "Roll a D20 to determine which complication your character encounters while visiting an alien bar in the sci-fi setting!",
        "Probability Matrices");


const persistTables = (tables: TableCollection[]) => {

    let data = {
        sources: (tables?.length ? tables.map(s => TableMarshaller.instance.marshall(s) ) : [])
    }
    window.localStorage.setItem("settings.tableData", JSON.stringify(data));
}

let initialData: { selection: TableCollection, collections: TableCollection[] } = null;

const getInitialData = () => {
    let base = { selection: null, collections: [ tableCollection ] };
    if (initialData == null) {
        initialData = { ...base };
    }

    return initialData;
}

const tableReducer = (state = getInitialData(), action) => {
    switch (action.type) {
        case IMPORT_TABLE_COLLECTION: {
            let collections = [...state.collections];
            let collection = action.payload.collection;
            collections.push(collection);
            persistTables(collections);
            return {
                ...state,
                collections: collections
            };
        }
        case SET_TABLE_COLLECTION_SELECTION: {
            let temp = {...state };
            temp.selection = action.payload.selection;
            return temp;
        }
        default:
            return state;
    }
}

export default tableReducer;