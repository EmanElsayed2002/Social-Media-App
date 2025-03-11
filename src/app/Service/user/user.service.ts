import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}
  apiURl: string = 'http://localhost:3000/users';
  id: number = -1;
  login() {}
  register(user: any) {
    console.log(user);
    user.token = this.generateToken();
    return this.http.post(this.apiURl, user);
  }

  logout() {}
  generateToken() {
    return Math.random().toString(36).substring(2);
  }

  getUsers() {
    return this.http.get<any>(this.apiURl);
  }
  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user')!);
  }
  checkEmailExists(email: string) {
    return this.http.get<any[]>(`${this.apiURl}?email=${email}`);
  }

  updateProfile(data: any) {
    const userId = this.getCurrentUser().id;

    return this.http.put(`${this.apiURl}/${userId}`, data);
  }

  deleteAccount() {
    const userId = this.getCurrentUser().id;
    return this.http.delete(`${this.apiURl}/${userId}`).pipe(
      tap(() => {
        localStorage.removeItem('user');
      })
    );
  }
}
