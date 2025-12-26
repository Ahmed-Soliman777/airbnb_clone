import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../Models/user';

@Injectable({ providedIn: 'root' })
export class Admin {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api'; 
//   getToken(): string | null {
//   const match = document.cookie.match(new RegExp('(^| )token=([^;]+)'));
//   return match ? match[2] : null;
// }

  getAllUsers(): Observable<User[]> {
//     const token = this.getToken();
// console.log(token)
//     const headers = new HttpHeaders({
//       Authorization: `${token}`
//     });

    return this.http.get<User[]>(
      `${this.apiUrl}/allUsers`,{  withCredentials: true,}
    
    );
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteUser/${id}`,{  withCredentials: true,});
      }
}
