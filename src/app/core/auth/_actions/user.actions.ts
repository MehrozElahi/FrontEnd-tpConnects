// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { User } from '../_models/user.model';
// Models

export enum UserActionTypes {

    UserOnServerCreated = '[Edit User Component] User On Server Created',
    UserCreated = '[Edit User Dialog] User Created',
    UserUpdated = '[Edit User Dialog] User Updated',
    UserDeleted = '[Users List Page] User Deleted',

}

export class UserOnServerCreated implements Action {
    readonly type = UserActionTypes.UserOnServerCreated;
    constructor(public payload: { user: User }) { }
}

export class UserCreated implements Action {
    readonly type = UserActionTypes.UserCreated;
    constructor(public payload: { user: User }) { }
}


export class UserUpdated implements Action {
    readonly type = UserActionTypes.UserUpdated;
    constructor(public payload: {
        partialUser: Update<User>,
        user: User
    }) { }
}

export class UserDeleted implements Action {
    readonly type = UserActionTypes.UserDeleted;
    constructor(public payload: { id: number }) {}
}


export type UserActions = UserCreated
| UserUpdated
| UserDeleted
| UserOnServerCreated;
