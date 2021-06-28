import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { User } from '../models/user';
import { environment } from 'src/environments/environment';
const API_URL = environment.api_url
@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private http: HttpClient,) { }


	imageUplaod(payload:any): Observable<any> {

		return this.http.post(API_URL + '/images/upload',payload).pipe(
			tap(_ => this.log(`Upload Image=${payload}`)),
			catchError(this.handleError<any>('Image Upload'))
		);
	}

	private handleError<T>(operation = 'operation', result?: T) {
		return (error: any): Observable<T> => {
			// TODO: send the error to remote logging infrastructure
			console.error(error); // log to console instead

			// TODO: better job of transforming error for user consumption
			this.log(`${operation} failed: ${error.message}`);

			// Let the app keep running by returning an empty result.
			return of(result as T);
		};
	}
	private log(message: string) {

	}


}
