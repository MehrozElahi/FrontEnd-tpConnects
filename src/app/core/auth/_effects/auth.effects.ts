// Angular
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
// RxJS
import { tap, withLatestFrom, filter, mergeMap } from 'rxjs/operators';
import { of, Observable, defer } from 'rxjs';
// NGRX
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store, select } from '@ngrx/store';
// Auth actions
import { AuthActionTypes, Login, Logout, Register, UserRequested, UserLoaded } from '../_actions/auth.actions';
import { AuthService } from '../_services/index';

import { environment } from '../../../../environments/environment';
import { isUserLoaded } from '../_selectors/auth.selectors';
import { AppState } from '../reducers';

@Injectable()
export class AuthEffects {
  @Effect({ dispatch: false })
  login$ = this.actions$.pipe(
    ofType<Login>(AuthActionTypes.Login),
    tap(action => {
      localStorage.setItem(environment.authTokenKey, action.payload.authToken);
      localStorage.setItem(environment.refreshTokenKey , action.payload.refreshToken)
      this.store.dispatch(new UserRequested());
    }),
  );

  @Effect({ dispatch: false })
  logout$ = this.actions$.pipe(
    ofType<Logout>(AuthActionTypes.Logout),
    tap(() => {
      localStorage.removeItem(environment.authTokenKey);
      this.router.navigateByUrl('/auth/login');
    })
  );

  @Effect({ dispatch: false })
  register$ = this.actions$.pipe(
    ofType<Register>(AuthActionTypes.Register),
    tap(action => {
      localStorage.setItem(environment.authTokenKey, action.payload.authToken);
      localStorage.setItem(environment.refreshTokenKey, action.payload.refreshToken);
    })
  );

  @Effect({ dispatch: false })
  loadUser$ = this.actions$
    .pipe(
      ofType<UserRequested>(AuthActionTypes.UserRequested),
      withLatestFrom(this.store.pipe(select(isUserLoaded))),
      filter(([action, _isUserLoaded]) => !_isUserLoaded),
      mergeMap(([action, _isUserLoaded]) => this.auth.getUserByToken()),
      tap(_user => {
        if (_user) {
          this.store.dispatch(new UserLoaded({ user: _user }));
        } else {
          this.store.dispatch(new Logout());
        }
      })
    );



  constructor(private actions$: Actions,
    private router: Router,
    private auth: AuthService,
    private store: Store<AppState>) { }
}
