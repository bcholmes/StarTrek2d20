import i18next from "i18next";
import { makeKey } from "../../common/translationKey";

export enum ServiceRecord {
    AgingRelic,
    DependableWorkhorse,
    Legendary,
    HopeShip,
    Prototype,
    SurvivorOfX
}

export const allServiceRecords = (): ServiceRecord[] => {
    return Object.keys(ServiceRecord).filter((item) => {
        return !isNaN(Number(item));
    }).map(item => Number(item));
}

export class ServiceRecordModel {
    type: ServiceRecord;
    specialRule: string;

    constructor(type: ServiceRecord, specialRule: string) {
        this.type = type;
        this.specialRule = specialRule;
    }

    get name() {
        let key = makeKey("ServiceRecord.", ServiceRecord[this.type]);
        return i18next.t(key);
    }

    get description() {
        let key = makeKey("ServiceRecord.", ServiceRecord[this.type], ".description");
        return i18next.t(key);
    }

}

export class ServiceRecordList {
    private static _instance: ServiceRecordList;

    readonly records: ServiceRecordModel[] = [
        new ServiceRecordModel(ServiceRecord.AgingRelic, "Larger Crew"),
        new ServiceRecordModel(ServiceRecord.DependableWorkhorse, "Reliable"),
        new ServiceRecordModel(ServiceRecord.Legendary, "Prestigious Posting"),
        new ServiceRecordModel(ServiceRecord.HopeShip, "Mission of Mercy"),
        new ServiceRecordModel(ServiceRecord.Prototype, "Experimental Vessel"),
        new ServiceRecordModel(ServiceRecord.SurvivorOfX, "Ready for Battle"),
    ]

    static get instance() {
        if (ServiceRecordList._instance == null) {
            ServiceRecordList._instance = new ServiceRecordList();
        }
        return ServiceRecordList._instance;
    }

    getByType(type: ServiceRecord) {
        let result = this.records.filter(s => s.type === type);
        return result.length > 0 ? result[0] : undefined;
    }

}