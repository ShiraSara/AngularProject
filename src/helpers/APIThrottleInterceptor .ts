import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Observable, Subscriber, of } from 'rxjs';
import { tap, catchError, concatMap, finalize } from 'rxjs/operators';

// Create a REGEX of API calls which we want to throttle
const URL_REGEX = /\/GetLocations|\/GetTodayLocations/;
// What is the Throttle Limit
const THROTTLE_LIMIT = 5;

@Injectable()
export class APIThrottleInterceptor implements HttpInterceptor {
    constructor() {}
    private activeCount = 0;
    private reqURLs = [];
    private reqObs: { [key: string]: Subscriber<any> } = {};

    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (URL_REGEX.test(req.url)) {
            // Handle throttling here
            const idx = this.reqURLs.indexOf(req.url);
            if (idx > -1) {
                this.reqURLs.splice(idx, 1);
                const observer = this.reqObs[req.url];
                observer.error();
                delete this.reqObs[req.url];
                if(this.activeCount > 0) {
                    this.activeCount--;
                }
            }

            if (this.activeCount < THROTTLE_LIMIT) {
               return this.proccessNext(req, next)
            } else {
                this.reqURLs.push(req.url);
                this.reqObs[req.url] = null;
                const obs = Observable.create(ob => {
                    this.reqObs[req.url] = ob;
                });
                return obs.pipe(
                    concatMap(_ => {
                        return this.proccessNext(req, next)
                    })
                );
            }
        } else {
            return next.handle(req);
        }
    }

    private proccessNext(req, next){
        this.activeCount++;
        let lastResponse: HttpEvent<any>;
        let error: HttpErrorResponse;
        return next.handle(req).pipe(
            tap((evt: HttpEvent<any>) => {
                lastResponse = evt;
                if (evt instanceof HttpResponse) {
                    this.processResponse();
                }
                return evt;
            }),
            catchError(err => {
                error = err;
                this.processResponse();
                return of(err);
            }),
            finalize(() => {
                if (lastResponse.type === HttpEventType.Sent && !error) {
                    // last response type was 0, and we haven't received an error
                    this.processResponse();
                    console.log('aborted request');
                }
            })
        )
    }

    private processResponse(){
        if (this.activeCount > 0) {
            this.activeCount--;
        }
        if (this.reqURLs.length > 0) {
            const url = this.reqURLs[0];
            const observer = this.reqObs[url];
            observer.next('done!');
            observer.complete();
            this.reqURLs = this.reqURLs.slice(1);
            delete this.reqObs[url];
        }
    }
}