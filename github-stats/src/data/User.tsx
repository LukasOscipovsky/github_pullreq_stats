export default class User {
    private _name: string;
    private _avatar: string;
    private _approves: number;
    private _comments: number;
    private _total: number;
    private _monthlyApproves: number;
    private _monthlyComments: number;
    private _monthlyTotal: number;

    constructor(name: string, avatar: string) {
        this._name = name;
        this._avatar = avatar;
        this._approves = 0;
        this._comments = 0;
        this._total = 0;
        this._monthlyApproves = 0;
        this._monthlyComments = 0;
        this._monthlyTotal = 0;
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

    public set monthlyApproves(monthlyApproves: number) {
        this._monthlyApproves = monthlyApproves;
    }

    public set monthlyComments(monthlyComments: number) {
        this._monthlyComments = monthlyComments;
    }

    public set monthlyTotal(monthlyTotal: number) {
        this._monthlyTotal = monthlyTotal;
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

    public get monthlyApproves(): number {
        return this._monthlyApproves;
    }

    public get monthlyComments(): number {
        return this._monthlyComments;
    }

    public get monthlyTotal(): number {
        return this._monthlyTotal;
    }
}