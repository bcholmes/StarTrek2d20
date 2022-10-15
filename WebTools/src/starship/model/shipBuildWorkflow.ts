import { PageIdentity } from "../../pages/pageIdentity";

export class ShipBuildWorkflowStep {
    name: string;
    page: PageIdentity;

    constructor(name: string, page: PageIdentity) {
        this.name = name;
        this.page = page;
    }
}

export class ShipBuildWorkflow {
    steps: ShipBuildWorkflowStep[];
    currentStepIndex: number = 0;

    constructor(steps: ShipBuildWorkflowStep[]) {
        this.steps = steps;
    }

    public currentStep() {
        return this.steps[this.currentStepIndex];
    }

    public peekNextStep() {
        return this.currentStepIndex < (this.steps.length-1) ? this.steps[this.currentStepIndex+1] : undefined;
    }

    public static createSimpleBuildWorkflow() {
        return new ShipBuildWorkflow([ new ShipBuildWorkflowStep("Starship Stats", PageIdentity.SimpleStarship),
            new ShipBuildWorkflowStep("Talent Selection", PageIdentity.StarshipTalentSelection),
            new ShipBuildWorkflowStep("Weapon Selection", PageIdentity.StarshipWeaponsSelection),
            new ShipBuildWorkflowStep("Final Details", PageIdentity.FinalStarshipDetails)]);
    }
}