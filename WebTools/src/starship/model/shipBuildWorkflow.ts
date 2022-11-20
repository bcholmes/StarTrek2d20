import { ShipBuildType } from "../../common/starship";
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

    constructor(steps: ShipBuildWorkflowStep[], currentStepIndex: number = 0) {
        this.steps = steps;
        this.currentStepIndex = currentStepIndex;
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

    public static createStarshipBuildWorkflow() {
        return new ShipBuildWorkflow([ new ShipBuildWorkflowStep("Starship Type", PageIdentity.StarshipTypeSelection),
            new ShipBuildWorkflowStep("Spaceframe", PageIdentity.SpaceframeSelection),
            new ShipBuildWorkflowStep("Mission Profile", PageIdentity.MissionProfileSelection),
            new ShipBuildWorkflowStep("Talent Selection", PageIdentity.StarshipTalentSelection),
            new ShipBuildWorkflowStep("Refits", PageIdentity.StarshipRefits),
            new ShipBuildWorkflowStep("Final Details", PageIdentity.FinalStarshipDetails)], 1);
    }

    public static createSmallCraftBuildWorkflow(buildType: ShipBuildType) {
        if (buildType === ShipBuildType.Pod) {
            return new ShipBuildWorkflow([ new ShipBuildWorkflowStep("Starship Type", PageIdentity.StarshipTypeSelection),
                new ShipBuildWorkflowStep("Small Craft Stats", PageIdentity.SmallCraftStats),
                new ShipBuildWorkflowStep("Weapon Selection", PageIdentity.StarshipWeaponsSelection),
                new ShipBuildWorkflowStep("Final Details", PageIdentity.FinalStarshipDetails)], 1);
        } else {
            return new ShipBuildWorkflow([ new ShipBuildWorkflowStep("Starship Type", PageIdentity.StarshipTypeSelection),
                new ShipBuildWorkflowStep("Small Craft Stats", PageIdentity.SmallCraftStats),
                new ShipBuildWorkflowStep("Talent Selection", PageIdentity.StarshipTalentSelection),
                new ShipBuildWorkflowStep("Weapon Selection", PageIdentity.StarshipWeaponsSelection),
                new ShipBuildWorkflowStep("Final Details", PageIdentity.FinalStarshipDetails)], 1);
        }
    }
}