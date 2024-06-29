import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  Signal,
  computed,
  inject,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';
import { TutorialIconComponent } from './components/tutorial-icon/tutorial-icon.component';
import { cards, handKeypoint } from './constants/constants';
import { CameraServiceService } from './services/camera-service.service';
import { HandsService } from './services/hands.service';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [
    RouterOutlet,
    ButtonModule,
    CardModule,
    CommonModule,
    TutorialIconComponent,
    DialogModule,
    MessagesModule,
    ToastModule,
  ],
  providers: [MessageService],
})
export class AppComponent {
  title = 'gesture-control';
  cameraService = inject(CameraServiceService);

  cards = cards;
  messageService = inject(MessageService);

  videoRaw = viewChild.required<ElementRef<HTMLVideoElement>>('video');
  allClickableElements = viewChildren<any>('actionButton');

  video = computed(() => this.videoRaw().nativeElement);

  rafId = 0;

  repeat = Array(150).fill('""');

  detector!: handPoseDetection.HandDetector;
  hands: handPoseDetection.Hand[] = [];
  previousHands: handPoseDetection.Hand[] = [];
  handsNumber = 0;

  proportionFactorX = 0;
  proportionFactorY = 0;

  previousPosition = { indexTipY: 0, middleTipY: 0 };

  handsService = inject(HandsService);

  topFromIndex = signal(window.innerHeight / 2);
  rightFromIndex = signal(window.innerWidth / 2);

  actionRequired = '';

  cursorElement = viewChild.required<ElementRef>('cursor');

  hasClicked = false;
  visible = false;
  activeCard = signal<number | null>(null);

  xButton: Signal<ElementRef | null> = signal(null);

  async ngOnInit() {
    this.cameraService.initCamera(this.video());
    this.detector = await this.createDetector();
    this.cameraService.setupProportionFactor(
      { width: window.innerWidth, height: window.innerHeight },
      { width: 640, height: 480 }
    );

    this.proportionFactorX = this.cameraService.proportionFactorX;
    this.proportionFactorY = this.cameraService.proportionFactorY;
    this.start();
  }

  async createDetector() {
    return await handPoseDetection.createDetector(
      handPoseDetection.SupportedModels.MediaPipeHands,
      {
        runtime: 'mediapipe',
        maxHands: 2,
        solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/hands@latest`,
      }
    );
  }

  async renderResult() {
    if (this.video() && this.video().readyState < 2) {
      await new Promise((resolve) => {
        this.video().onloadeddata = () => {
          resolve(this.video);
        };
      });
    }

    if (this.detector !== null) {
      try {
        this.hands = await this.detector.estimateHands(this.video(), {
          flipHorizontal: true,
        });

        this.handsNumber = this.hands.length;
      } catch (e) {
        this.detector.dispose();
        console.error(e);
      }
    }

    if (this.hands.length === 0) {
      this.previousHands = [];

      return;
    }

    this.actionRequired = this.handsService.handleHands(this.hands);

    const currentHandIndexTipY =
      this.hands[0].keypoints[handKeypoint.indexTip].y;
    const currentHandMiddleTipY =
      this.hands[0].keypoints[handKeypoint.middleTip].y;

    //----------------
    //  SCROLL
    //----------------

    if (
      (this.actionRequired === 'scroll-down' ||
        this.actionRequired === 'scroll-up') &&
      this.previousPosition.indexTipY !== 0 &&
      this.previousPosition.middleTipY !== 0
    ) {
      if (
        //se vedo che vado giu piu' di un tot scrollo in basso
        this.previousPosition.indexTipY < currentHandIndexTipY &&
        this.previousPosition.middleTipY < currentHandMiddleTipY &&
        Math.abs(this.previousPosition.middleTipY - currentHandMiddleTipY) >
          50 &&
        Math.abs(this.previousPosition.indexTipY - currentHandIndexTipY) > 50
      ) {
        const yDiffIndex = Math.abs(
          this.previousPosition.indexTipY - currentHandIndexTipY
        );
        const yDiffMiddle = Math.abs(
          this.previousPosition.middleTipY - currentHandMiddleTipY
        );

        window.scrollBy(0, this.actionRequired === 'scroll-down' ? 400 : -400);
      }
    }
    this.previousPosition.indexTipY =
      this.hands[0].keypoints[handKeypoint.indexTip].y;
    this.previousPosition.middleTipY =
      this.hands[0].keypoints[handKeypoint.middleTip].y;

    //-------------------
    //   INDEX CURSOR
    //--------------------

    if (
      this.actionRequired === 'index-cursor' &&
      this.previousPosition.indexTipY === 0
    ) {
      this.previousPosition.indexTipY =
        this.hands[0].keypoints[handKeypoint.indexTip].y;
    } else if (
      this.actionRequired === 'index-cursor' &&
      this.previousPosition.indexTipY !== 0 &&
      this.previousPosition.middleTipY !== 0
    ) {
      const indexTip = this.hands[0].keypoints[handKeypoint.indexTip];
      if (
        this.previousHands.length !== 0 &&
        Math.abs(this.topFromIndex() - indexTip.y * this.proportionFactorY) > 30
      ) {
        return;
      }

      if (
        Math.abs(this.topFromIndex() - indexTip.y * this.proportionFactorY) > 2
      )
        this.topFromIndex.set(indexTip.y * this.proportionFactorY);

      if (
        Math.abs(this.rightFromIndex() - indexTip.x * this.proportionFactorX) >
        2
      )
        this.rightFromIndex.set(indexTip.x * this.proportionFactorX);

      this.cursorElement().nativeElement.style.top = this.topFromIndex();
      this.cursorElement().nativeElement.style.right = this.rightFromIndex();
    }

    //-------------------
    //   CLICK GESTURE
    //--------------------

    if (this.handsService.clickGesture(this.hands)) {
      this.clickRequest();
    }

    this.previousHands = this.hands.splice(0); //splice to not have a reference but a copy
  }

  async renderPrediction() {
    await this.renderResult();

    this.rafId = requestAnimationFrame(this.renderPrediction.bind(this));
  }

  captureCurrentHands() {
    console.log(this.hands);
  }

  start() {
    this.renderPrediction();
  }

  clickRequest() {
    if (this.hasClicked) return;

    const elementToClick = this.allClickableElements().find((element) => {
      return this.isOverlapping(
        this.cursorElement().nativeElement,
        element.nativeElement
      );
    })?.nativeElement;

    this.hasClicked = true;

    if (elementToClick) {
      this.hasClicked = true;
      elementToClick.click();
    }
    setTimeout(() => {
      this.hasClicked = false;
    }, 1500);
  }

  isOverlapping(cursor: HTMLDivElement, otherElement: any) {
    if (!cursor || !otherElement) {
      return;
    }

    const fixedRect = cursor.getBoundingClientRect();
    const otherRect = otherElement.getBoundingClientRect();

    return !(
      fixedRect.right < otherRect.left ||
      fixedRect.left > otherRect.right ||
      fixedRect.bottom < otherRect.top ||
      fixedRect.top > otherRect.bottom
    );
  }

  likeButtonClick() {
    this.messageService.add({
      severity: 'success',
      summary: 'Thanks!',
      detail:
        'Thanks for liking my post! This is just an interaction I wanted to add on click, so thanks again :D',
    });
  }
  dislikeButtonClick() {
    this.messageService.add({
      severity: 'warn',
      summary: 'Ouch! :(',
      detail:
        "I'm really sad that you didn't like what you read! I hope that you'll change your mind :( ",
    });
  }

  openLink(url: string) {
    try {
      const newWindow = window.open(url, '_blank');
      console.log('Window open result:', newWindow);
      if (
        !newWindow ||
        newWindow.closed ||
        typeof newWindow.closed == 'undefined'
      ) {
        console.log('Probably blocked popup');
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail:
            "Could't open link, you probably have popups blocked! Allow them or try clicking manually to the button",
        });
      }
    } catch (error) {
      console.error('Error while opening the link:', error);
    }
  }
}
