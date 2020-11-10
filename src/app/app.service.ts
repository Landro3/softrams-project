import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  api = 'http://localhost:8000/api';
  username: string;

  constructor(private http: HttpClient) {}

  // Returns all members
  getMembers() {
    return this.http
      .get(`${this.api}/members`)
      .pipe(catchError(this.handleError));
  }

  // Sets username at login
  setUsername(name: string): void {
    this.username = name;
  }

  // Adds member
  addMember(memberForm: FormGroup) {
    return this.http
      .post(`${this.api}/addMember`, memberForm)
      .pipe(catchError(this.handleError));
  }

  // Deletes member 
  deleteMember(id: number) {
    return this.http
      .delete(`${this.api}/deleteMember/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Update existing member
  updateMember(member) {
    return this.http
    .put(`${this.api}/putMember/`, member)
    .pipe(catchError(this.handleError));
  }

  // Returns all teams
  getTeams() {
    return this.http
      .get(`${this.api}/teams`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    return [];
  }
}
