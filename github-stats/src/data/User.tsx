export default class User {
    private _name: string;
    private _avatar: string;
    private _approves: number;
    private _comments: number;

    constructor(name: string, avatar: string) {
        this._name = name.toUpperCase();
        this._avatar = avatar;
        this._approves = 0;
        this._comments = 0;
    }

    public set approves(approves: number) {
        this._approves = approves;
    }

    public set comments(comments: number) {
        this._comments = comments;
    }

    public get name(): string {
        return this._name;
    }

    public get avatar(): string {
        return this._avatar;
    }

    public get approves(): number {
        return this._approves;
    }

    public get comments(): number {
        return this._comments;
    }
}