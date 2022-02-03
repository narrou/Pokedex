import { Component, OnInit } from '@angular/core';
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
  constructor(private route: ActivatedRoute,
    private pokemonService: PokemonService,
    private location: Location) { }

  ngOnInit(): void {
    this.getPokemon();
    this.loadAudio();
  }

  getPokemon(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.pokemonService.getSinglePokemon(id)
      .subscribe(pokemon => this.selectedPokemon = pokemon);
  }
  loadAudio(){
    this.audio = new Audio();
    this.audio.src = "/assets/audio/" + this.route.snapshot.paramMap.get('id') + ".mp3";
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
