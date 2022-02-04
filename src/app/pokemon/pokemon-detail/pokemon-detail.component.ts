import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Pokemon } from '../pokemon.model';
import { PokemonService } from '../pokemon.service';
import { faPlayCircle } from '@fortawesome/free-regular-svg-icons';
import { Location } from '@angular/common';

@Component({
  selector: 'app-pokemon-detail',
  templateUrl: './pokemon-detail.component.html',
  styleUrls: ['./pokemon-detail.component.scss']
})
export class PokemonDetailComponent implements OnInit {
  faPlayCircle = faPlayCircle;
  selectedPokemon?: Pokemon;
  audio?: HTMLAudioElement;
  @Input() id?: number;
  constructor(private route: ActivatedRoute,
    private pokemonService: PokemonService,
    private location: Location) { }

  ngOnInit() {
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes["id"].currentValue);
    this.getPokemon(changes["id"].currentValue);
    this.loadAudio();
  }

  getPokemon(id: number): void {
    this.pokemonService.getSinglePokemon(id)
      .subscribe(pokemon => this.selectedPokemon = pokemon);
  }

  loadAudio(){
    this.audio = new Audio();
    this.audio.src = "/assets/audio/" + this.id + ".mp3";
    this.audio.load();
  }

  onClick(){
    console.log("play sound");
    this.audio?.play();
  }

  goBack(){
    this.location.back();
  }
}
