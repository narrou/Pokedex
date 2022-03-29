import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';
import { Pokemon } from '../pokemon/pokemon.model';
import { PokemonService } from '../pokemon/pokemon.service';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit {

  team: number[] = [];
  selectedPokemonId?: number;
  pokemonTeam: Pokemon[] = [];
  listPokemon?: Pokemon[] = [];
  offset: number = 0;
  limit: number = 10;
  isConnected: boolean = false;



  @Output() select = new EventEmitter<number>();

  constructor(private pokemonService: PokemonService, private cdref: ChangeDetectorRef, private _snackBar: MatSnackBar) { }

  private _searchedPokemon: string = '';
    
    @Input() set searchedPokemon(value: string) {
    
       this._searchedPokemon = value;
       console.log(value);
       if (this.searchedPokemon == '') {
          this.offset = 0;
          this.getPokemon();
         return
       }
       else {
          this.offset = 0;
          this.getSearchPokemon(this._searchedPokemon);
       }
    
    }

    get searchedPokemon(): string {
    
      return this._searchedPokemon;
  
  }

  
  getSearchPokemon(input: string) {
    this.pokemonService.getSearchPokemon(input, this.offset, this.limit).subscribe(p => {
      this.listPokemon = p.data;
    });
    this.offset += 10;
  }

  getPokemon() {
    this.pokemonService.getPokemonRange(this.offset, this.limit).subscribe(p => {
      this.listPokemon = p.data;
    });
    this.offset += 10;
  }


  ngOnInit(): void {
    if (localStorage.getItem('access_token') !== null) {
      this.pokemonService.getTeam().subscribe((team) => {
        this.team = team;
        this.isConnected = true;
        this.loadTeam(team);
      }, error => {
        console.log("Pas connecte");
        this.isConnected = false;
      });

    }
  }

  ngAfterContentChecked() {
    
    this.cdref.detectChanges();

  }

  loadTeam(team: number[]){
    this.pokemonService.getPokemonByList(team).subscribe((pokemon) => {
      this.pokemonTeam = pokemon;
      console.log(pokemon);
    })
  }

  selectPokemon(id: number){
    this.selectedPokemonId = id;
    this.select.emit(id);
  }

  deletePokemon(id: number) {
    var index = this.team.indexOf(id);
      if (index !== -1) {
        this.team.splice(index, 1);
      }
      if (this.team.length == 0) {
        this.pokemonTeam = []
      }
      else {
        this.loadTeam(this.team);
      }
      
    if (localStorage.getItem('access_token') !== null) {
      this.pokemonService.putTeam(this.team).subscribe();
    }

  }

  onScroll(){
    console.log("we scroll");
    if (this.searchedPokemon == '') {
      this.pokemonService.getPokemonRange(this.offset, this.limit).subscribe(p => {
        this.listPokemon?.push.apply(this.listPokemon, p.data);
      });
      this.offset += 10;
    }
    else {
      this.pokemonService.getSearchPokemon(this.searchedPokemon, this.offset, this.limit).subscribe(p => {
        this.listPokemon?.push.apply(this.listPokemon, p.data);
      });
      this.offset += 10;
    }
  }

  addPokemon(id: number) {
    if (this.team.length < 6) {
      this.team.push(id);
      this.loadTeam(this.team);
    }
    else {
     this.openSnackBar("La taille maximale de l'équipe est de 6 ")
    }
    
  if (localStorage.getItem('access_token') !== null) {
    this.pokemonService.putTeam(this.team).subscribe();

  }
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, "Fermer", {
      duration: 2000,
    });
  }

  isConnectedFunc(){
    return this.pokemonService.isConnected();
  }

}
