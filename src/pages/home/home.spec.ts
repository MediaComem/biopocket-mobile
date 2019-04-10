import { TestBed } from '@angular/core/testing';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player';
import { MomentModule } from 'angular2-moment';
import { expect } from 'chai';
import { IonicModule, NavController } from 'ionic-angular';
import { mockNavController } from 'ionic-angular/util/mock-providers';

import { HomePage } from '@pages/home/home';
import { translateModuleForRoot } from '@utils/i18n';

describe('HomePage', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        HomePage
      ],
      imports: [
        IonicModule.forRoot(HomePage),
        MomentModule,
        translateModuleForRoot
      ],
      providers: [
        { provide: NavController, useValue: mockNavController() },
        { provide: YoutubeVideoPlayer, useValue: {} }
      ]
    });

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).to.be.an.instanceOf(HomePage);
  });
});
