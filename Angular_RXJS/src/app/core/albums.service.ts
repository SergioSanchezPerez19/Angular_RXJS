import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, delay, timeout } from 'rxjs';
import { Albums } from '../common/interfaces/albums';

@Injectable({
  providedIn: 'root',
})
export class AlbumsService {
  private http = inject(HttpClient);

  private baseUrl: string = 'https://jsonplaceholder.typicode.com/albums';

  getAlbums(): Observable<Albums[]> {
    return this.http.get<Albums[]>(this.baseUrl);
  }
}
