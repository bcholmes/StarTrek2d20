import { createSlice } from '@reduxjs/toolkit';
import {
  Table,
  TableCollection,
  TableRow,
  ValueResult,
} from '../table/model/table';
import { TableMarshaller } from '../table/model/tableMarshaller';
import {
  addTableCollection,
  deleteTableCollection,
  importTableCollection,
  replaceTableCollection,
  setTableCollectionSelection,
  setTableForEditing,
} from './tableActions';

const tableCollection = new TableCollection(
  new Table(
    'Probability Matrix: Things That Could Go Wrong While Visiting an Alien Bar',
    [
      new TableRow(
        new ValueResult(
          'Misunderstood Currency',
          'You unwittingly offend the bartender by using the wrong currency or payment method.',
        ),
        1,
      ),
      new TableRow(
        new ValueResult(
          'Intergalactic Brawl',
          'A heated altercation breaks out between patrons, threatening to involve you.',
        ),
        2,
      ),
      new TableRow(
        new ValueResult(
          'Language Barrier',
          'Communication difficulties arise, leading to misunderstandings with the locals.',
        ),
        3,
      ),
      new TableRow(
        new ValueResult(
          'Alien Food Allergy',
          'You have an adverse reaction to the exotic alien cuisine served at the bar.',
        ),
        4,
      ),
      new TableRow(
        new ValueResult(
          'Identity Mix-Up',
          'You’re mistaken for a notorious criminal, leading to unwanted attention.',
        ),
        5,
      ),
      new TableRow(
        new ValueResult(
          'Drinking Challenge',
          'A local alien challenges you to a drinking contest that could end badly.',
        ),
        6,
      ),
      new TableRow(
        new ValueResult(
          'Currency Theft',
          'Your credits or belongings are stolen by a pickpocket or sneak thief.',
        ),
        7,
      ),
      new TableRow(
        new ValueResult(
          'Alien Beverage',
          'You order a mysterious alien drink that has unexpected and extreme effects.',
        ),
        8,
      ),
      new TableRow(
        new ValueResult(
          'Alien Customs Violation',
          'You unknowingly violate a local custom or tradition, angering the locals.',
        ),
        9,
      ),
      new TableRow(
        new ValueResult(
          'Frequent Power Outages',
          'The bar experiences frequent power outages, plunging you into darkness.',
        ),
        10,
      ),
      new TableRow(
        new ValueResult(
          'Bar Bouncer Conflict',
          'You have a run-in with the bar’s formidable bouncer or security.',
        ),
        11,
      ),
      new TableRow(
        new ValueResult(
          'Local Gang Presence',
          'A local alien gang takes an interest in you, demanding your compliance.',
        ),
        12,
      ),
      new TableRow(
        new ValueResult(
          'Telepathic Misunderstanding',
          'You accidentally broadcast your thoughts to nearby telepathic aliens.',
        ),
        13,
      ),
      new TableRow(
        new ValueResult(
          'Invasion Alarm',
          'The bar’s alarms blare as an enemy fleet approaches, causing panic.',
        ),
        14,
      ),
      new TableRow(
        new ValueResult(
          'Mind-Altering Atmosphere',
          'The bar’s atmosphere affects your judgment and perception.',
        ),
        15,
      ),
      new TableRow(
        new ValueResult(
          'Botched Karaoke',
          'You’re coerced into participating in an embarrassing karaoke competition.',
        ),
        16,
      ),
      new TableRow(
        new ValueResult(
          'Alien Romance Complications',
          'You unintentionally become entangled in a complicated alien romance.',
        ),
        17,
      ),
      new TableRow(
        new ValueResult(
          'Black Market Dealings',
          'You witness illegal black market transactions taking place in the bar.',
        ),
        18,
      ),
      new TableRow(
        new ValueResult(
          'Alien Pet Attack',
          'A patron’s exotic alien pet escapes and causes chaos.',
        ),
        19,
      ),
      new TableRow(
        new ValueResult(
          'Temporal Anomaly',
          'A sudden temporal anomaly disrupts the space-time continuum, causing bizarre effects in the bar.',
        ),
        20,
      ),
    ],
  ),
  'Roll a D20 to determine which complication your character encounters while visiting an alien bar in the sci-fi setting!',
  'Probability Matrices',
  '71dcc0f9-adcc-42c4-8d31-3abd6646fab5',
);
const tableCollection2 = new TableCollection(
  new Table(
    'Probability Matrix: Things That Could Go Wrong While Spacewalking',
    [
      new TableRow(
        new ValueResult(
          'Micro-Meteoroid Impact',
          'A micro-meteoroid punctures your spacesuit, causing a slow oxygen leak.',
        ),
        1,
      ),
      new TableRow(
        new ValueResult(
          'Communications Failure',
          'Your communication system malfunctions, leaving you isolated in space.',
        ),
        2,
      ),
      new TableRow(
        new ValueResult(
          'Tether Snap',
          'Your safety tether snaps, leaving you adrift in space.',
        ),
        3,
      ),
      new TableRow(
        new ValueResult(
          'Navigation Error',
          'A sudden solar flare erupts, exposing you to dangerous radiation.',
        ),
        4,
      ),
      new TableRow(
        new ValueResult(
          'Thruster Failure',
          'You become disoriented and lose your way back to the spacecraft or station.',
        ),
        5,
      ),
      new TableRow(
        new ValueResult(
          'Tool Loss',
          'One of your thrusters malfunctions, making it difficult to control your movement.',
        ),
        6,
      ),
      new TableRow(
        new ValueResult(
          'Space Debris Field',
          'You accidentally release a critical tool, sending it drifting away into space.',
        ),
        7,
      ),
      new TableRow(
        new ValueResult(
          'Helmet Visor Damage',
          'You encounter a field of space debris, posing a collision risk.',
        ),
        8,
      ),
      new TableRow(
        new ValueResult(
          'Oxygen Tank Leak',
          'Your helmet visor becomes scratched or fogged, obstructing your vision.',
        ),
        9,
      ),
      new TableRow(
        new ValueResult(
          'Sudden Darkness',
          'Your oxygen tank develops a leak, reducing your available air supply.',
        ),
        10,
      ),
      new TableRow(
        new ValueResult(
          'Spacewalk Sabotage',
          'Your spacesuit’s lights fail, leaving you in complete darkness.',
        ),
        11,
      ),
      new TableRow(
        new ValueResult(
          'Space Station Malfunction',
          'Sabotage is discovered on your spacesuit or equipment, endangering your mission.',
        ),
        12,
      ),
      new TableRow(
        new ValueResult(
          'Space Sickness',
          'The space station or spacecraft experiences a critical malfunction while you’re outside.',
        ),
        13,
      ),
      new TableRow(
        new ValueResult(
          'Astronaut Disorientation',
          'The bar’s alarms blare as an enemy fleet approaches, causing panic.',
        ),
        14,
      ),
      new TableRow(
        new ValueResult(
          'Radioactive Contamination',
          'A fellow astronaut becomes disoriented and requires assistance.',
        ),
        15,
      ),
      new TableRow(
        new ValueResult(
          'Space Junk Collision',
          'You accidentally come into contact with a radioactive substance.',
        ),
        16,
      ),
      new TableRow(
        new ValueResult(
          'Solar Panel Collapse',
          'A piece of space debris collides with you, causing damage to your suit.',
        ),
        17,
      ),
      new TableRow(
        new ValueResult(
          'Black Market Dealings',
          'You inadvertently damage or release a solar panel while spacewalking.',
        ),
        18,
      ),
      new TableRow(
        new ValueResult(
          'Space Creature Encounter',
          'You encounter a mysterious and potentially hostile space creature.',
        ),
        19,
      ),
      new TableRow(
        new ValueResult(
          'Emergency Return',
          'A critical emergency forces you to abort the spacewalk and return to the spacecraft or station immediately.',
        ),
        20,
      ),
    ],
  ),
  'Roll a D20 to determine which spacewalking complication your character encounters in the sci-fi setting!',
  'Probability Matrices',
  'ae0c7045-0894-4523-abdd-1c1e50fb9e86',
);

const persistTables = (tables: TableCollection[]) => {
  const data = {
    collections: tables?.length
      ? tables.map((s) => TableMarshaller.instance.marshall(s))
      : [],
  };
  window.localStorage.setItem('settings.tableData', JSON.stringify(data));
};

interface TableState {
  selection: TableCollection;
  collections: TableCollection[];
  editing?: TableCollection;
}

let initialData: TableState = null;

const getInitialData = (): TableState => {
  const base: TableState = {
    selection: null,
    collections: [tableCollection, tableCollection2],
  };

  if (initialData == null) {
    initialData = { ...base };
  }

  const temp =
    typeof window !== 'undefined' && window?.localStorage
      ? window.localStorage.getItem('settings.tableData')
      : null;
  if (temp) {
    const marshalled = JSON.parse(temp);
    if (marshalled.collections) {
      const collections = marshalled.collections.map((t) =>
        TableMarshaller.instance.unmarshall(t),
      );
      if (collections?.length) {
        initialData = { ...initialData, collections: [...collections] };
      }
    }
  }

  return initialData;
};

const appendCollection = (
  state: TableState,
  action: { payload: { collection: TableCollection } },
): TableState => {
  const collections = [...state.collections];
  const collection = action.payload.collection;
  collections.push(collection);
  persistTables(collections);
  return {
    ...state,
    collections: collections,
  };
};

export const tableSlice = createSlice({
  name: 'table',
  initialState: getInitialData,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(importTableCollection, appendCollection)
      .addCase(addTableCollection, appendCollection);
    builder.addCase(setTableCollectionSelection, (state, action) => {
      const temp = { ...state };
      temp.selection = action.payload.selection;
      return temp;
    });
    builder.addCase(deleteTableCollection, (state, action) => {
      const temp = { ...state };
      const tableCollection = action.payload.collection;
      temp.collections = temp.collections.filter(
        (t) => t.uuid !== tableCollection.uuid,
      );
      persistTables(temp.collections);
      return temp;
    });
    builder.addCase(setTableForEditing, (state, action) => {
      const temp = { ...state };
      temp.editing = action.payload.collection;
      return temp;
    });
    builder.addCase(replaceTableCollection, (state, action) => {
      const temp = { ...state };
      const tableCollection = action.payload.collection;
      temp.collections = temp.collections.filter(
        (t) => t.uuid !== action.payload.uuid,
      );
      temp.collections.push(tableCollection);
      return temp;
    });
  },
});

export const tableReducer = tableSlice.reducer;
