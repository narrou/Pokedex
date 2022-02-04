import { Injectable } from '@angular/core';
import { Pokemon } from './pokemon.model';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  apiRoute: string = "http://app-ec21e68e-3e55-42d7-b1ae-3eef7507a353.cleverapps.io";
  constructor(private http: HttpClient) { }

  getPokemon(): Observable<any> {
    return this.http.get<any>(this.apiRoute + "/pokemons");
  }

  getPokemonRange(offset: number, limit:number): Observable<any> {
    return this.http.get<any>(this.apiRoute + "/pokemons?offset=" + offset + "&limit=" + limit);
  }

  getSinglePokemon(id: number): Observable<any> {
    return this.http.get<any>(this.apiRoute + "/pokemons/" + id);
  }

  getSearchPokemon(input: string): Observable<any> {
    return this.http.get<any>(this.apiRoute + "/pokemons?search=" + input);
  }
}
