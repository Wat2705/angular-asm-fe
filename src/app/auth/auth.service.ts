import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  url = 'http://localhost:3000/user'
  constructor(private http: HttpClient) { }

  register(data: any) {
    return this.http.post(this.url + '/register', data)
  }

  logIn(data: any) {
    return this.http.post(this.url + '/login', data)
  }
}
