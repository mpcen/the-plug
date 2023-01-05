export type NoActionMap = {
    "": () => string;
};

export type BetActionMap = {
    list: () => Promise<string[] | string>;
    add: (name: string, data: string) => Promise<string>;
    remove: (name: string, betId: string) => Promise<string>;
};

export type RandomizeActionMap = {
    "": (name: string, data: string) => string;
};

export type ActionMap = NoActionMap | BetActionMap | RandomizeActionMap;

export type CommandMap = {
    "!help": NoActionMap;
    "!bets": BetActionMap;
    "!status": NoActionMap;
    "!randomize": RandomizeActionMap;
};
