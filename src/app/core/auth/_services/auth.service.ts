import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, ChangeDetectorRef } from '@angular/core';
import * as jwt_decode from 'jwt-decode';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { QueryParamsModel, QueryResultsModel } from '../../_base/crud';
import { Permission } from '../_models/permission.model';
import { Role } from '../_models/role.model';
import { TokenRequest } from '../_models/token-request.model';
import { TokenResponse } from '../_models/token-response.model';
import { User } from '../_models/user.model';
import { AutoLoginRequest } from '../_models/auto-login-request.model';
import { MenuConfigService } from 'app/core/_base/layout/services/menu-config.service';
const API_USERS_URL = 'api/users';
const API_PERMISSION_URL = 'api/permissions';
const API_ROLES_URL = 'api/roles';
const Base_API_URL_IDEN = environment.apiUrlIdentity;

const httpOptions1 = {
  headers: new HttpHeaders(
    {
      'Content-Type': 'application/json',
      'Authorization': 'BEARER ' + localStorage.getItem('accessToken')
    }
  )
};
@Injectable()
export class AuthService {
  IP = '';
  moduleId: any;
  menu: any;
  constructor(private http: HttpClient,  private menuConfigService: MenuConfigService,) {
    // if (this.IP === '') {
    //   this.getIpAddress().subscribe((data: any) => {
    //     this.IP = data.ip;
    //   });
    // }

  }

  httpHeaders = {
    headers: new HttpHeaders(
      {
        'X-Forwarded-For': this.IP
      }
    )
  };
  // Authentication/Authorization
  login(tokenRequest: TokenRequest, ip): Observable<TokenResponse> {

      this.httpHeaders = {
        headers: new HttpHeaders({
          'X-Forwarded-For': ip
        })
      }
      let response = this.http.post<TokenResponse>(
        environment.apiUrlIdentity + 'token/Authenticate',
        tokenRequest, this.httpHeaders
      );
      return response;

    // return this.http.post<User>(API_TOKEN + "/Authenticate", tokenRequest);
  }

  autoLogIn(tokenRequest: AutoLoginRequest): Observable<TokenResponse> {

    let response = this.http.post<TokenResponse>(
      environment.apiUrlIdentity + 'token/AutoLogin',
      tokenRequest
    );

    return response;
  }
  chnagePassword(data): Observable<any> {
    return this.http
      .post(
        Base_API_URL_IDEN + 'users/ChangePassword',
        data, { headers: httpOptions1.headers }
      )
      .pipe(
        map((item: any) => {
          return item;
        })
      );
  }
  getIpAddress(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'mode': 'cors'
      })
    };
    return this.http
      .get('https://cors-anywhere.herokuapp.com/https://ipv4.jsonip.com/', httpOptions)
      // .get('https://cors-anywhere.herokuapp.com/https://jsonip.com/', httpOptions)
  }
  getUserByToken(): Observable<User> {
    const userTokenx = localStorage.getItem(environment.authTokenKey);
    let user = jwt_decode<any>(userTokenx);

    user.id = user.uid;
    user.pic = './assets/media/users/default.jpg';
    user.fullname = user.name;

    return of(user);
  }

  // setModuleId

  setModuleId(id) {
    this.moduleId = id;

  }


  // getModuleId


  getModuleId() {
    return this.moduleId;
  }


  getMenu() {

    this.menu = {
      header: {
        self: {},
        'items': []
      },
      aside: {
        self: {},
        items: [
          {
            title: 'Home',
            root: true,
            icon: 'flaticon2-architecture-and-city',
            page: 'dashboard',
            translate: 'MENU.DASHBOARD',
            moduleAccess: 'sub.moduleAccess',
            bullet: 'dot',
          },
        ]
      },
    };

    const userToken = localStorage.getItem(environment.authTokenKey);
    let user: any;
    try {
      user = jwt_decode<any>(userToken);
    } catch (error) {
      return this.menu;
    }
    const params = new HttpParams()
      .set('userId', user.uid)
      .set('roleIds', (user.roles as any[]).map(x => x.Id).join(','));
    this.http.get<any>(environment.apiUrlCommon + 'userRoleAccess/GetUserMenus', { params: params }).subscribe(result => {
      let datas = result.data as any[];
      this.menuConfigService.setMenuDataArray(datas);
      datas.forEach(x => {
        let first = {
          title: x.name,
          root: true,
          icon: x.icon,
          bullet: '',
          page: x.menuUrl,
          moduleAccess: x.moduleAccess,
          translate: '',
          submenu: []
        };
        x.subModules.forEach(sub => {
          if (sub.subModules.length > 0) {
            let second = {
              title: sub.name,
              root: true,
              icon: sub.icon,
              bullet: 'dot',
              moduleAccess: sub.moduleAccess,
              page: sub.menuUrl,
              translate: '',
              submenu: []
            };
            sub.subModules.forEach(sub2 => {
              second.submenu.push(
                {
                  title: sub2.name,
                  bullet: 'dot',
                  // icon: sub2.icon,
                  moduleAccess: sub2.moduleAccess,
                  page: sub2.menuUrl,
                  translate: ''
                });
            });
            first.submenu.push(second);
          } else {
            let second = {
              title: sub.name,
              bullet: 'dot',
              icon: sub.icon,
              moduleAccess: sub.moduleAccess,
              page: sub.menuUrl,
              translate: ''
            };
            first.submenu.push(second);
          }
        });
        this.menu.aside.items.push(first);
      });
    }
    );
    return this.menu;
  }

  getMenuLoaded() {
    return this.menu;
  }

  getMenu1(user) {

    const params = new HttpParams()
      .set('userId', user.uid)
      .set('roleIds', (user.roles as any[]).map(x => x.Id).join(','));
    return this.http.get<any>(environment.apiUrlCommon + 'userRoleAccess/GetUserMenus', { params: params });
  }

  // getMenu(): Observable<any> {
  //   let menu = {
  //     header: {
  //       self: {},
  //       'items': [
  //         {
  //           'title': 'Pages',
  //           'root': true,
  //           'icon-': 'flaticon-add',
  //           'toggle': 'click',
  //           'custom-class': 'kt-menu__item--active',
  //           'alignment': 'left',
  //           submenu: []
  //         },
  //         {
  //           'title': 'Features',
  //           'root': true,
  //           'icon-': 'flaticon-line-graph',
  //           'toggle': 'click',
  //           'alignment': 'left',
  //           submenu: []
  //         },
  //         {
  //           'title': 'Apps',
  //           'root': true,
  //           'icon-': 'flaticon-paper-plane',
  //           'toggle': 'click',
  //           'alignment': 'left',
  //           submenu: []
  //         }
  //       ]
  //     },
  //     aside: {
  //       self: {},
  //       items: [
  //         {
  //           title: 'Dashboard',
  //           root: true,
  //           icon: 'flaticon2-architecture-and-city',
  //           page: 'dashboard',
  //           translate: 'MENU.DASHBOARD',
  //           bullet: 'dot',
  //         },
  //       ]
  //     },
  //   };

  //   const userToken = localStorage.getItem(environment.authTokenKey);
  //   let user: any;
  //   try {
  //     user = jwt_decode<any>(userToken);
  //   } catch (error) {
  //     return of(menu);
  //   }

  //   this.http.post<any>(environment.apiUrlCommon + 'userRoleAccess/GetUserRoleAccess?userId=' + user.uid, {})
  //     .subscribe(result => {
  //       let datas = result.data as any[];

  //       datas.forEach(x => {
  //         let first = {
  //           title: x.name,
  //           root: true,
  //           icon: 'flaticon-list-3',
  //           bullet: 'dot',
  //           page: x.menuUrl,
  //           translate: '',
  //           submenu: []
  //         };
  //         x.subModules.forEach(sub => {
  //           if (sub.subModules.length > 0) {
  //             let second = {
  //               title: sub.name,
  //               root: true,
  //               icon: 'flaticon-list-3',
  //               bullet: 'dot',
  //               page: sub.menuUrl,
  //               translate: '',
  //               submenu: []
  //             };
  //             sub.subModules.forEach(sub2 => {
  //               second.submenu.push(
  //                 {
  //                   title: sub2.name,
  //                   icon: 'flaticon-list-3',
  //                   bullet: '',
  //                   page: sub2.menuUrl,
  //                   translate: ''
  //                 });
  //             });

  //             first.submenu.push(second);
  //           } else {
  //             let second = {
  //               title: sub.name,
  //               icon: 'flaticon-list-3x',
  //               bullet: 'dot',
  //               page: sub.menuUrl,
  //               translate: ''
  //             };

  //             first.submenu.push(second);
  //           }
  //         });
  //         menu.aside.items.push(first);
  //       });
  //       return of(menu);
  //     });


  //   return of(menu);
  // }

  register(user: User): Observable<any> {
    const httpHeaders = new HttpHeaders();
    httpHeaders.set('Content-Type', 'application/json');
    return this.http
      .post<User>(API_USERS_URL, user, { headers: httpHeaders })
      .pipe(
        map((res: User) => {
          return res;
        }),
        catchError(err => {
          return null;
        })
      );
  }

  /*
   * Submit forgot password request
   *
   * @param {string} email
   * @returns {Observable<any>}
   */
  public requestPassword(email: string): Observable<any> {
    return this.http
      .get(API_USERS_URL + '/forgot?=' + email)
      .pipe(catchError(this.handleError('forgot-password', [])));
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(API_USERS_URL);
  }

  getUserById(userId: number): Observable<User> {
    return this.http.get<User>(API_USERS_URL + `/${userId}`);
  }

  // DELETE => delete the user from the server
  deleteUser(userId: number) {
    const url = `${API_USERS_URL}/${userId}`;
    return this.http.delete(url);
  }

  // UPDATE => PUT: update the user on the server
  updateUser(_user: User): Observable<any> {
    const httpHeaders = new HttpHeaders();
    httpHeaders.set('Content-Type', 'application/json');
    return this.http.put(API_USERS_URL, _user, { headers: httpHeaders });
  }

  // CREATE =>  POST: add a new user to the server
  createUser(user: User): Observable<User> {
    const httpHeaders = new HttpHeaders();
    httpHeaders.set('Content-Type', 'application/json');
    return this.http.post<User>(API_USERS_URL, user, { headers: httpHeaders });
  }

  // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
  // items => filtered/sorted result
  findUsers(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
    const httpHeaders = new HttpHeaders();
    httpHeaders.set('Content-Type', 'application/json');
    return this.http.post<QueryResultsModel>(
      API_USERS_URL + '/findUsers',
      queryParams,
      { headers: httpHeaders }
    );
  }

  // Permission
  getAllPermissions(): Observable<Permission[]> {
    return this.http.get<Permission[]>(API_PERMISSION_URL);
  }

  getRolePermissions(roleId: number): Observable<Permission[]> {
    return this.http.get<Permission[]>(
      API_PERMISSION_URL + '/getRolePermission?=' + roleId
    );
  }

  // Roles
  getAllRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(API_ROLES_URL);
  }

  getRoleById(roleId: number): Observable<Role> {
    return this.http.get<Role>(API_ROLES_URL + `/${roleId}`);
  }

  // CREATE =>  POST: add a new role to the server
  createRole(role: Role): Observable<Role> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = new HttpHeaders();
    httpHeaders.set('Content-Type', 'application/json');
    return this.http.post<Role>(API_ROLES_URL, role, { headers: httpHeaders });
  }

  // UPDATE => PUT: update the role on the server
  updateRole(role: Role): Observable<any> {
    const httpHeaders = new HttpHeaders();
    httpHeaders.set('Content-Type', 'application/json');
    return this.http.put(API_ROLES_URL, role, { headers: httpHeaders });
  }

  // DELETE => delete the role from the server
  deleteRole(roleId: number): Observable<Role> {
    const url = `${API_ROLES_URL}/${roleId}`;
    return this.http.delete<Role>(url);
  }

  // Check Role Before deletion
  isRoleAssignedToUsers(roleId: number): Observable<boolean> {
    return this.http.get<boolean>(
      API_ROLES_URL + '/checkIsRollAssignedToUser?roleId=' + roleId
    );
  }

  findRoles(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
    // This code imitates server calls
    const httpHeaders = new HttpHeaders();
    httpHeaders.set('Content-Type', 'application/json');
    return this.http.post<QueryResultsModel>(
      API_ROLES_URL + '/findRoles',
      queryParams,
      { headers: httpHeaders }
    );
  }

  /*
   * Handle Http operation that failed.
   * Let the app continue.
   *
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: any) {
    return (error: any): Observable<any> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result);
    };
  }
}
