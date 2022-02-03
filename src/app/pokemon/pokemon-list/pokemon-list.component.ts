import { Component, OnInit } from '@angular/core';
import { Pokemon } from '../pokemon.model';
import { PokemonService } from '../pokemon.service';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.scss']
})
export class PokemonListComponent implements OnInit {
  offset: number = 10;
  limit: number = 10;
  listPokemon?: Pokemon[];
  constructor(private pokemonService: PokemonService) { }

  ngOnInit(): void {
    this.getPokemon();
  }

  getPokemon() {
    this.pokemonService.getPokemon().subscribe(p => {
      this.listPokemon = p.data;
    });
  }
  
  onScroll(){
    console.log("we scroll");
    this.pokemonService.getPokemonRange(this.offset, this.limit).subscribe(p => {
      this.listPokemon?.push.apply(this.listPokemon, p.data);
    });
    this.offset += 10;
  }

}
