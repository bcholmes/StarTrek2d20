export enum EventIdentity {
    ShowPage,
    HistoryBack,
    UpdateCharacter
}

export class EventChannel {
    private listeners: { [id: number]: Array<(arg?: {}) => void> };

    constructor() {
        this.listeners = {};
    }

    signal(id: EventIdentity, arg?: {}) {
        const listeners = this.listeners[id];
        if (listeners && listeners.length > 0) {
            listeners.forEach(listen => {
                listen(arg);
            });
        }
    }

    listen(id: EventIdentity, handler: (arg?: {}) => void) {
        const listeners = this.listeners[id];
        if (listeners) {
            listeners.push(handler);
        }
        else {
            this.listeners[id] = [handler];
        }
    }
}

export const Events = new EventChannel();