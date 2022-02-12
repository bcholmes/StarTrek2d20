import { CharacterType } from "../common/characterType";

class WorkflowStep {
    name: string;
    description: string[];
    talentPrompt: boolean;

    constructor(name: string, description: string[] = [], talentPrompt: boolean = false) {
        this.name = name;
        this.description = description;
        this.talentPrompt = talentPrompt;
    }
}

export class Workflow {
    steps: WorkflowStep[];
    currentStepIndex: number = 0;

    constructor(steps: WorkflowStep[]) {
        this.steps = steps;
    }

    public currentStep() {
        return this.steps[this.currentStepIndex];
    }

    public peekNextStep() {
        return this.steps[this.currentStepIndex+1];
    }

    public next() {
        this.currentStepIndex++;
    }

    public copy() {
        let result = new Workflow(this.steps);
        result.currentStepIndex = this.currentStepIndex;
        return result;
    }
}

class Workflows {
    starfleetWorkflow: Workflow = new Workflow([
        new WorkflowStep("Species", [], true),
        new WorkflowStep("Environment", ["Regardless of their species, Starfleet officers come from many places, across many worlds. While many Humans (for example) are born on Earth, there are many more who were born on a colonized world elsewhere in the Galaxy, or on a starbase or a starship."]),
        new WorkflowStep("Upbringing", ["The nature of a person’s family and their surroundings as they grew up can have a massive impact upon them, and, whether they accept this influence or rebelled against it, it will shape the rest of their lives.", "Either select or roll your Upbringing."]),
        new WorkflowStep("Starfleet Academy", ["The years spent at Starfleet Academy are some of the most memorable and definitive of an officer’s life, shaping the direction of their career going forwards. For those who pass the grueling entrance examinations, the Academy takes four years, covering a mixture of intense training, academic studies, and practical experiences. Much of this takes place within the main Starfleet Academy campus in San Francisco on Earth, but other campuses and annexes exist across the Federation, and a cadet may spend time at any of these before they graduate.", "Alternatively, you may opt for an Enlisted character. This is however purely background and does not affect you in more ways than the fact that you never went to Starfleet Academy and cannot select Command as your Major. Either select or roll your Academy Track."]),
        new WorkflowStep("Career", ["At this stage, you have a choice to make about the character. This decision is a clear one: are you a young officer, fresh out of the Academy, with your whole career ahead of you, have you served in Starfleet for several years, or are you a veteran with decades of experience?", "Either select or roll your Career."]),
        new WorkflowStep("Career Events", ["Your career is a tapestry of events and experiences, but amongst this, a few will have been pivotal moments in your life. Define which moments of your life are important in retrospect, and what seemed definitive to an ensign in their early 20s may be inconsequential to that same officer decades later.", "Either select or roll a Career Event."]),
        new WorkflowStep("Finishing Touches", [], false)
    ]);

    ambasssadorWorkflow: Workflow = new Workflow([
        new WorkflowStep("Species", [], true),
        new WorkflowStep("Environment", ["Regardless of their species, diplomats come from many places, across many worlds. While many Humans (for example) are born on Earth, there are many more who were born on a colonized world elsewhere in the Galaxy, or on a starbase or a starship."]),
        new WorkflowStep("Upbringing", ["The nature of a person’s family and their surroundings as they grew up can have a massive impact upon them, and, whether they accept this influence or rebelled against it, it will shape the rest of their lives.", "Either select or roll your Upbringing."]),
        new WorkflowStep("Training", ["The years spent in training are some of the most memorable and definitive of an diplomat’s life, shaping the direction of their career going forwards. Diplomatic training takes years, covering a mixture of intense training, academic studies, and practical experiences."]),
        new WorkflowStep("Career", ["At this stage, you have a choice to make about the character. This decision is a clear one: are you a young officer, fresh out of the Academy, with your whole career ahead of you, have you served in Starfleet for several years, or are you a veteran with decades of experience?", "Either select or roll your Career."]),
        new WorkflowStep("Career Events", ["Your career is a tapestry of events and experiences, but amongst this, a few will have been pivotal moments in your life. Define which moments of your life are important in retrospect, and what seemed definitive to an ensign in their early 20s may be inconsequential to that same officer decades later.", "Either select or roll a Career Event."]),
        new WorkflowStep("Finishing Touches", [], false)
    ]);

    civilianWorkflow: Workflow = new Workflow([
        new WorkflowStep("Species", [], true),
        new WorkflowStep("Environment", ["Regardless of their species, people come from many places, across many worlds. While many Humans (for example) are born on Earth, there are many more who were born on a colonized world elsewhere in the Galaxy, or on a starbase or a starship."]),
        new WorkflowStep("Upbringing", ["The nature of a person’s family and their surroundings as they grew up can have a massive impact upon them, and, whether they accept this influence or rebelled against it, it will shape the rest of their lives.", "Either select or roll your Upbringing."]),
        new WorkflowStep("Training", ["The years spent in training are some of the most memorable and definitive of an diplomat’s life, shaping the direction of their career going forwards. For those who pass the grueling entrance examinations, the Academy takes four years, covering a mixture of intense training, academic studies, and practical experiences. Much of this takes place within the main Starfleet Academy campus in San Francisco on Earth, but other campuses and annexes exist across the Federation, and a cadet may spend time at any of these before they graduate.", "Alternatively, you may opt for an Enlisted character. This is however purely background and does not affect you in more ways than the fact that you never went to Starfleet Academy and cannot select Command as your Major. Either select or roll your Academy Track."]),
        new WorkflowStep("Career", ["At this stage, you have a choice to make about the character. This decision is a clear one: are you a young officer, fresh out of the Academy, with your whole career ahead of you, have you served in Starfleet for several years, or are you a veteran with decades of experience?", "Either select or roll your Career."]),
        new WorkflowStep("Career Events", ["Your career is a tapestry of events and experiences, but amongst this, a few will have been pivotal moments in your life. Define which moments of your life are important in retrospect, and what seemed definitive to an ensign in their early 20s may be inconsequential to that same officer decades later.", "Either select or roll a Career Event."]),
        new WorkflowStep("Finishing Touches", [], false)
    ]);

    klingonWarriorWorkflow: Workflow = new Workflow([
        new WorkflowStep("Species", [], false),
        new WorkflowStep("Environment", ["The Klingon Empire is vast and expands with each new conquest. Thus, Klingons come from many different worlds, from the likes of Qo’noS and Khitomer in the heart of the Empire, to border colonies that may have only been claimed in the last generation. Further, as a culture which has been spacefaring for centuries, countless Klingons are raised in space, aboard starbases and transport ships across the Empire."]),
        new WorkflowStep("Caste", ["The Klingon Empire has long had a system of castes, divided amongst the professions and vocations which allow society to function. Families within these castes tend to train in certain vocations, generation after generation. Throughout Klingon history, different castes have risen and fallen in prominence, though the Warrior caste has always held a place of significance. Within the last few centuries, however, this system has begun to break down, with caste divisions no longer as strictly defined as they once were, and while more traditional families still expect their children to follow in their footsteps, many Klingons break from caste and pursue whatever careers they desire.", "Either select or roll your Caste."]),
        new WorkflowStep("Training", ["You have chosen to commit your life to the Klingon Empire as a warrior, joining the Klingon Defense Force to protect the Empire and its interests. But this is not a trivial thing to do. Joining the crew of a starship takes training and dedication, and to be an officer rather than merely a bekk requires grueling entrance exams and the approval of the Oversight Council. There are training facilities on every major world in the Empire, but the most prestigious academies are found on Qo’noS and Ty’Gokor, and a young cadet may spend much of their training off-world engaging in fleet exercises and other practical study."]),
        new WorkflowStep("Career", ["At this stage, you have a choice to make about the character. This decision is a clear one: is the character a young officer, eager for glory and with their whole career ahead of them, have they served in the KDF for several years, or are they a veteran with decades of experience?", "Either select or roll your Career."]),
        new WorkflowStep("Career Events", ["The character’s career is a tapestry of events and experiences, but amongst this, a few will have been pivotal moments in the character’s life. A character defines which moments of their life are important in retrospect, and what seemed definitive to a young bekk after their first few battles may be inconsequential to that same warrior 40 or more years later.", "Either select or roll a Career Event."]),
        new WorkflowStep("Finishing Touches", [], true)
    ]);

    alliedMilitaryWorkflow: Workflow = new Workflow([
        new WorkflowStep("Species", [], true),
        new WorkflowStep("Environment", ["Regardless of their species, military officers and ratings come from many places, across many types of worlds."]),
        new WorkflowStep("Upbringing", ["The nature of a person’s family and their surroundings as they grew up can have a massive impact upon them, and, whether they accept this influence or rebelled against it, it will shape the rest of their lives.", "Either select or roll your Upbringing."]),
        new WorkflowStep("Training", ["You have chosen to commit your life to your government's military. You have undergone necessary training to prepare for your military role, whether that be formal officer education, or much more informal guerilla training."]),
        new WorkflowStep("Career", ["At this stage, you have a choice to make about the character: is the character a young officer, fresh out of training, have they served in the military for several years, or are they a veteran with decades of experience?", "Either select or roll your Career."]),
        new WorkflowStep("Career Events", ["The character’s career is a tapestry of events and experiences, but amongst this, a few will have been pivotal moments in the character’s life. A character defines which moments of their life are important in retrospect, and what seemed definitive to a young officer may be inconsequential to that same officer decades years later.", "Either select or roll a Career Event."]),
        new WorkflowStep("Finishing Touches", [], false)
    ]);

    getWorkflow(type: CharacterType) {
        if (type === CharacterType.KlingonWarrior) {
            return this.klingonWarriorWorkflow;
        } else if (type === CharacterType.AlliedMilitary) {
            return this.alliedMilitaryWorkflow;
        } else if (type === CharacterType.Starfleet) {
            return this.starfleetWorkflow;
        } else if (type === CharacterType.AmbassadorDiplomat) {
            return this.ambasssadorWorkflow;
        } else {
            return this.civilianWorkflow;
        }
    }
}

export const WorkflowsHelper = new Workflows();
