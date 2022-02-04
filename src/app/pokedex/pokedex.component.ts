import { Component, OnInit } from '@angular/core';
import { Pokemon } from '../pokemon/pokemon.model';

@Component({
  selector: 'app-pokedex',
  templateUrl: './pokedex.component.html',
  styleUrls: ['./pokedex.component.scss']
})
export class PokedexComponent implements OnInit {

  selectedPokemonId?: number;
  constructor() { }

  ngOnInit(): void {
  }

  onSelect(id: number){
    if (id > 0 && id < 152) {
      this.selectedPokemonId = id;
    }
    
  }

}
