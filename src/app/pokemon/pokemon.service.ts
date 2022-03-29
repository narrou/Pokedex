import { Injectable } from '@angular/core';
import { Pokemon } from './pokemon.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { forkJoin, Observable, ObservableInput, throwError } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';
import { LoginToken } from '../login.model';


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
    const params = new HttpParams()
    .set('offset', offset)
    .set('limit', limit);
    return this.http.get<any>(this.apiRoute + "/pokemons" , {params});
  }

  getSinglePokemon(id: number): Observable<any> {
    return this.http.get<any>(this.apiRoute + "/pokemons/" + id);
  }

  getSearchPokemon(input: string, offset: number, limit: number): Observable<any> {
    const params = new HttpParams()
    .set('search', input)
    .set('offset', offset)
    .set('limit', limit);
    return this.http.get<any>(this.apiRoute + "/pokemons", {params});
  }

  postLogin(_email: string, _password: string): Observable<LoginToken>{
    return this.http.post<LoginToken>(this.apiRoute + "/auth/login", {email: _email, password: _password});
  }

  refreshToken(refresh_token: string): Observable<LoginToken>{
    return this.http.post<LoginToken>(this.apiRoute + "/auth/refresh", {refresh_token: refresh_token});
  }

  getPokemonByList(listId: number[]): Observable<any[]> {
    let observableBatch: any[] = [];
    listId.forEach((key) => {
      observableBatch.push(this.getSinglePokemon(key));
    });

    return forkJoin(observableBatch);
  }

  getTeam(): Observable<any>{
    return this.http.get<any>(this.apiRoute + "/trainers/me/team", {
      headers: {
          "Authorization": 'Bearer ' + localStorage.getItem("access_token")
      }});
  }

  

  putTeam(listId: number[]) {
    return this.http.put<any>(this.apiRoute + "/trainers/me/team", listId,{
      
      headers: {
          "Authorization": 'Bearer ' + localStorage.getItem("access_token")
      }});
  }

  isConnected(){
    if (localStorage.getItem('access_token') !== null) {
      if (!this.tokenExpired(localStorage.getItem('access_token'))) {
        return true;
      }
      return false;
    }
    else {
      return false;
    }
  }


  private tokenExpired(token: string | null) {
    if (token){
      const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
      return (Math.floor((new Date).getTime() / 1000)) >= expiry;
    }
    else {
      return false;
    }
  }

}
