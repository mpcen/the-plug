export type HelpActionMap = {
    '': () => Promise<string>;
};

export type BetActionMap = {
    list: () => Promise<string>;
    add: (name: string, data: string) => Promise<string>;
    remove: (name: string, betId: string) => Promise<string>;
};

export type ActionMap = HelpActionMap | BetActionMap;

export type CommandMap = {
    '!help': HelpActionMap;
    '!bets': BetActionMap;
};
