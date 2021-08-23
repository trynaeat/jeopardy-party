import { Observable, Subject, Subscription, empty, interval, merge } from 'rxjs';
import { switchMap, scan, takeUntil, takeWhile, startWith, mapTo } from 'rxjs/operators';

export class Timer {
    private _tickRate: number; // In ms
    private _timeLimit: number; // in ms
    private interval$: Observable<number>;
    private pause$ = new Subject<boolean>();
    private resume$ = new Subject<boolean>();
    private _reset$ = new Subject();
    private subscription$: Subscription;
    private internalTimer$: Observable<number>;
    private _timer$ = new Subject<number>();
    public timeRemaining: number; // In ms

    public get timer$() {
        return this._timer$.asObservable();
    }

    get timeLimit() {
        return this._timeLimit;
    }

    constructor(timeLimit: number, tickRate: number) {
        this._tickRate = tickRate;
        this._timeLimit = this.timeRemaining = timeLimit;
        this.interval$ = interval(this._tickRate).pipe(
            mapTo(this._tickRate * -1),
        );
        this.restartTimer();
    }

    public startTimer() {
        if (!this.subscription$) {
            this.subscription$ = this.internalTimer$.subscribe(
                timeRemaining => {
                    this.timeRemaining = timeRemaining;
                    this._timer$.next(timeRemaining);
                },
            );
        }
        this.resume$.next();
    }

    public pauseTimer() {
        this.pause$.next();
    }

    public resetTimer() {
        this._reset$.next();
        this.subscription$ = null;
        this.restartTimer();
    }

    private restartTimer() {
        this.internalTimer$ = merge(
            this.pause$.pipe(mapTo(false)),
            this.resume$.pipe(mapTo(true)),
        ).pipe(
            switchMap((val: boolean) => (val ? this.interval$ : empty())),
            scan((acc: number, curr: number) => (curr ? curr + acc : acc), this._timeLimit),
            takeWhile(v => v >= 0),
            takeUntil(this._reset$),
        );
    }
}

export class SanitizedTimer {
    public timeLimit: number;
    public timeRemaining: number;

    constructor(timer: Timer) {
        this.timeRemaining = timer.timeRemaining;
        this.timeLimit = timer.timeLimit;
    }
}