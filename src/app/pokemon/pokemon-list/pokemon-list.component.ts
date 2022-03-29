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
  offset: number = 0;
  limit: number = 20;
  listPokemon?: Pokemon[];
  selectedPokemonId?: number;

  @Output() select = new EventEmitter<number>();

  private _searchedPokemon: string = '';
    
    @Input() set searchedPokemon(value: string) {
    
       this._searchedPokemon = value;
       if (this.searchedPokemon == '') {
         this.offset = 0;
         this.getPokemon();
         return
       }
       else {
         this.offset = 0;
         this.listPokemon = [];
        this.getSearchPokemon(this._searchedPokemon, this.offset, this.limit);
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

  getSearchPokemon(input: string, offset: number, limit: number) {
    this.pokemonService.getSearchPokemon(input, offset, limit).subscribe(p => {
      this.listPokemon?.push.apply(this.listPokemon, p.data);
    });
    this.offset += 20;
  }

  getPokemon() {
    this.pokemonService.getPokemonRange(this.offset, this.limit).subscribe(p => {
      this.listPokemon = p.data;
    });
    this.offset += 20;
  }

  onScroll(){
    console.log("a");
    if (this.searchedPokemon == '') {
      this.pokemonService.getPokemonRange(this.offset, this.limit).subscribe(p => {
        this.listPokemon?.push.apply(this.listPokemon, p.data);
      });
      this.offset += 20;
    }
    else {
      this.getSearchPokemon(this.searchedPokemon, this.offset, this.limit);
    }
  }

  selectPokemon(id: number){
    this.selectedPokemonId = id;
    this.select.emit(id);
  }

}
