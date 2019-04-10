import { Component } from '@angular/core';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'home-page',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(
    public navCtrl: NavController,
    private readonly youtube: YoutubeVideoPlayer
  ) { }

  openOnYoutube() {
    this.youtube.openVideo('l1UtCks1ljE');
  }
}
