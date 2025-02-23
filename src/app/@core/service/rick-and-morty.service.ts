import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Character, RickAndMortyApiResponse } from '../models/rick-and-morty.model';

@Injectable({
  providedIn: 'root'
})
export class RickAndMortyService {

  constructor(private http: HttpClient) { }

  getCharacters(searchParams: string): Observable<RickAndMortyApiResponse> {
    return this.http.get<RickAndMortyApiResponse>(`https://rickandmortyapi.com/api/character?${searchParams}`);
  }
}
