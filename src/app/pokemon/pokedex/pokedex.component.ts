import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { LoginToken } from 'src/app/login.model';
import { PokemonService } from '../pokemon.service';

@Component({
  selector: 'app-pokedex',
  templateUrl: './pokedex.component.html',
  styleUrls: ['./pokedex.component.scss']
})
export class PokedexComponent implements OnInit {

  selectedPokemonId?: number;
  constructor(public dialog: MatDialog) { }
  ngOnInit(): void {
    
  }

  onSelect(id: number){
    if (id > 0 && id < 152) {
      this.selectedPokemonId = id;
    }
    
  }

  userConnect(){
    const dialogRef = this.dialog.open(DialogContentExampleDialog);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}

@Component({
  selector: 'dialog-user-connect',
  templateUrl: './dialog-user-connect.html',
  styleUrls: ['./dialog-user-connect.scss']
})
export class DialogContentExampleDialog {
  public email = new FormControl('', [Validators.required, Validators.email]);
  hide = true;
  public password: string = '';
  token?: LoginToken;

  constructor(private pokemonService: PokemonService){

  }

    ngOnInit(){

    }

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  validateForm(){
  //  if ( this.email.status === 'VALID') {
    //  this.pokemonService.postLogin(this.email.value, this.password).subscribe(data => this.token = data);
    //}
    this.pokemonService.postLogin("francois.poire@ig2i.centralelille.fr", "toto12345").subscribe(data => {
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
    });
    
  }
}
