import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Pokemon } from '../pokemon.model';
import { PokemonService } from '../pokemon.service';
import { ChangeDetectorRef, AfterContentChecked} from '@angular/core';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.scss']
})
export class PokemonListComponent implements OnInit {
  offset: number = 10;
  limit: number = 20;
  listPokemon?: Pokemon[];
  selectedPokemonId?: number;

  @Output() select = new EventEmitter<number>();

  private _searchedPokemon: string = '';
    
    @Input() set searchedPokemon(value: string) {
    
       this._searchedPokemon = value;
       console.log(value);
       if (this.searchedPokemon == '') {
         this.getPokemon();
         return
       }
       else {
        this.getSearchPokemon(this._searchedPokemon);
       }
       
    
    }
    
    ngAfterContentChecked() {

      this.cdref.detectChanges();
  
    }

    get searchedPokemon(): string {
    
        return this._searchedPokemon;
    
    }
  
  constructor(private pokemonService: PokemonService,
    private cdref: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getPokemon();
  }

  getSearchPokemon(input: string) {
    this.pokemonService.getSearchPokemon(input).subscribe(p => {
      this.listPokemon = p.data;
    });
  }

  getPokemon() {
    this.pokemonService.getPokemonRange(this.offset, this.limit).subscribe(p => {
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

  selectPokemon(id: number){
    this.selectedPokemonId = id;
    this.select.emit(id);
  }

}
