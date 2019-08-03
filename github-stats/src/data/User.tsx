export default class User {
    private _name: string;
    private _avatar: string;
    private _approves: number;
    private _comments: number;
    private _total: number;
    private _bestInTheMonth: boolean;

    constructor(name: string, avatar: string) {
        this._name = name;
        this._avatar = avatar;
        this._approves = 0;
        this._comments = 0;
        this._total = 0;
        this._bestInTheMonth = false;
    }

    public set approves(approves: number) {
        this._approves = approves;
    }

    public set comments(comments: number) {
        this._comments = comments;
    }

    public set total(total: number) {
        this._total = total;
    }

    public set bestInTheMonth(bestInTheMonth: boolean) {
        this._bestInTheMonth = bestInTheMonth;
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

    public get total(): number {
        return this._total;
    }

    public get bestInTheMonth(): boolean {
        return this._bestInTheMonth;
    }
}