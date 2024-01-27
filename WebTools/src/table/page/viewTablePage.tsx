import { useTranslation } from "react-i18next"
import { Header } from "../../components/header"
import LcarsFrame from "../../components/lcarsFrame"
import { PageIdentity } from "../../pages/pageIdentity"
import { Table, TableCollection, TableRow, ValueResult } from "../model/table"
import ReactMarkdown from "react-markdown"
import { TableView } from "./tableView"
import { Button } from "../../components/button"
import { useState } from "react"

const ViewTablePage: React.FC<{}> = () => {

    const { t } = useTranslation();
    const [ value, setValue ] = useState<ValueResult[]>([]);

    const tableCollection = new TableCollection(new Table("Probability Matrix: Things That Could Go Wrong While Visiting an Alien Bar",
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
        new TableRow(new ValueResult("Bar Bounder Conflict", "You have a run-in with the bar’s formidable bouncer or security."), 11),
        new TableRow(new ValueResult("Local Gang Presence", "A local alien gang takes an interest in you, demanding your compliance."), 12),
        new TableRow(new ValueResult("Telepathic Misunderstanding", "You accidentally broadcast your thoughts to nearby telepathic aliens."), 13),
        new TableRow(new ValueResult("Invasion Alarm", "The bar’s alarms blare as an enemy fleet approaches, causing panic."), 14),
        new TableRow(new ValueResult("Mind-Altering Atmosphere", "The bar’s atmosphere affects your judgment and perception."), 15),
        new TableRow(new ValueResult("Botched Karaoke", " You’re coerced into participating in an embarrassing karaoke competition."), 16),
        new TableRow(new ValueResult("Alien Romance Complications", "You unintentionally become entangled in a complicated alien romance."), 17),
        new TableRow(new ValueResult("Black Market Dealings", "You witness illegal black market transactions taking place in the bar."), 18),
        new TableRow(new ValueResult("Alien Pet Attack", "A patron’s exotic alien pet escapes and causes chaos."), 19),
        new TableRow(new ValueResult("Temporal Anomaly", "A sudden temporal anomaly disrupts the space-time continuum, causing bizarre effects in the bar."), 20)),
        "Roll a D20 to determine which complication your character encounters while visiting an alien bar in the sci-fi setting!", "Probability Matrices");

    return (<LcarsFrame activePage={PageIdentity.ViewTable}>
        <div id="app">

            <div className="page container ms-0">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/index.html">{t('Page.title.home')}</a></li>
                        <li className="breadcrumb-item"><a href="/table/list">{t('Page.title.tableList')}</a></li>
                        <li className="breadcrumb-item active" aria-current="page">{t('Page.title.viewTable')}</li>
                    </ol>
                </nav>

                <main>
                    <Header>{t('Page.title.viewTable')}</Header>
                    <Header level={2} className="mt-4">{tableCollection.name}</Header>
                    <div className="d-flex justify-content-between align-items-top" >
                        <div>
                            <ReactMarkdown>{tableCollection.description}</ReactMarkdown>
                        </div>
                        <Button buttonType={true} className="btn btn-link mt-0" onClick={() => {}} title="Share"><i className="bi bi-share"></i></Button>
                    </div>

                    <div className="row">
                        <div className="col-md-6 mt-4">
                            <TableView name="Main Table" table={tableCollection.mainTable} />
                        </div>

                        <div className="col-md-6 mt-4">
                            <div className="text-end">
                                <Button buttonType={true} onClick={() => setValue(tableCollection.roll())} className="btn btn-primary btn-sm">
                                    <img src="/static/img/d20.svg" style={{height: "24px", aspectRatio: "1"}} className="me-1" alt={t('Common.button.random')} />
                                    {' '} Roll
                                </Button>
                            </div>

                            {value?.length == 0
                                ? undefined
                                : (value.map((v,i) => (<div className="d-flex" key={'result-' + i}>
                                    <h3 className="me-3">Result:</h3>
                                    <div><p><strong>{v.name}</strong></p>
                                    <ReactMarkdown>{v.description}</ReactMarkdown></div>
                                </div>)))
                            }
                        </div>
                    </div>
                </main>
            </div>
        </div>
    </LcarsFrame>)
}

export default ViewTablePage;