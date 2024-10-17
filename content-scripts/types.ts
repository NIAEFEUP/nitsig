export type AuthSession = {
    number: string;
    name: string;
    hasNotifications: boolean;
};

// TODO: Add more types as needed
export type Lecture = {
    ucs: Array<object>;
    start: string;
};
