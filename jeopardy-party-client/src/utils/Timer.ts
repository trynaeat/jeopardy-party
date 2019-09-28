import { Observable, Subject, Subscription, empty, interval, merge } from 'rxjs';
import { switchMap, scan, takeUntil, takeWhile, startWith, mapTo } from 'rxjs/operators';

/**
 *  We use this timer to handle all buzzer/game timers client-side for smoother performance.
 * The server is still the source of truth running its own timers,
 * and will sync timers at important intervals (ie when a buzzer times out)
 */
export class Timer {
    private _tickRate: number; // In ms
    private _timeLimit: number; // in ms
    private interval$: Observable<number>;
    private pause$ = new Subject<boolean>();
    private resume$ = new Subject<boolean>();
    private stop$ = new Subject();
    private subscription$: Subscription | null;
    private internalTimer$: Observable<number> | null;
    public timer$ = new Subject<number>();
    public timeRemaining: number; // In ms

    get timeLimit() {
        return this._timeLimit;
    }

    constructor(timeLimit: number, tickRate: number) {
        this._tickRate = tickRate;
        this._timeLimit = this.timeRemaining = timeLimit;
        this.subscription$ = null;
        this.internalTimer$ = null;
        this.interval$ = interval(this._tickRate).pipe(
            mapTo(this._tickRate * -1),
        );
        this.internalTimer$ = merge(
            this.pause$.pipe(mapTo(false)),
            this.resume$.pipe(mapTo(true)),
        ).pipe(
            switchMap((val: boolean) => (val ? this.interval$ : empty())),
            scan((acc: number, curr: number) => (curr ? curr + acc : acc), this._timeLimit),
            takeWhile((v) => v >= 0),
            takeUntil(this.stop$),
        );
    }

    public startTimer() {
        if (!this.subscription$) {
            this.subscription$ = this.internalTimer$ && this.internalTimer$.subscribe(
                (timeRemaining) => {
                    this.timeRemaining = timeRemaining;
                    this.timer$.next(timeRemaining);
                },
            );
        }
        this.resume$.next();
    }

    public pauseTimer() {
        this.pause$.next();
    }

    public stopTimer() {
        this.stop$.next();
    }
}