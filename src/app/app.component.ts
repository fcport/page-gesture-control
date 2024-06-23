import {
  Component,
  ElementRef,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CameraServiceService } from './services/camera-service.service';
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';
import { HandsService } from './services/hands.service';
import { handKeypoint } from './constants/constants';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ButtonModule, CardModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'gesture-control';
  cameraService = inject(CameraServiceService);

  videoRaw = viewChild.required<ElementRef<HTMLVideoElement>>('video');

  video = computed(() => this.videoRaw().nativeElement);

  rafId = 0;

  repeat = Array(150).fill(
    '"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."'
  );

  detector!: handPoseDetection.HandDetector;
  hands: handPoseDetection.Hand[] = [];
  handsNumber = 0;

  isMiddleFinger = false;
  isThumbsUp = false;

  readyToScroll = false;
  indexCursor = false;

  proportionFactorX = 0;
  proportionFactorY = 0;

  previousPosition = { indexTipY: 0, middleTipY: 0 };

  handsService = inject(HandsService);

  topFromIndex = signal(0);
  rightFromIndex = signal(0);

  cursorElement = viewChild.required<ElementRef>('cursor');

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
      } catch (e) {
        this.detector.dispose();
        console.error(e);
      }
    }

    if (this.hands.length === 0) {
      return;
    }
    this.isMiddleFinger = this.handsService.isMiddleFinger(this.hands);
    this.isThumbsUp = this.handsService.isThumbsUp(this.hands);
    this.readyToScroll = this.handsService.wantsToScrollDown(this.hands);
    this.indexCursor = this.handsService.indexCursorActive(this.hands);

    const currentHandIndexTipY =
      this.hands[0].keypoints[handKeypoint.indexTip].y;
    const currentHandMiddleTipY =
      this.hands[0].keypoints[handKeypoint.middleTip].y;

    //--- SCROLL ------
    //
    //----------------

    if (
      this.readyToScroll &&
      this.previousPosition.indexTipY !== 0 &&
      this.previousPosition.middleTipY !== 0
    ) {
      if (
        //se vedo che vado giu piu' di 10 scrollo in basso
        this.previousPosition.indexTipY < currentHandIndexTipY &&
        this.previousPosition.middleTipY < currentHandMiddleTipY &&
        Math.abs(this.previousPosition.middleTipY - currentHandMiddleTipY) >
          70 &&
        Math.abs(this.previousPosition.middleTipY - currentHandMiddleTipY) > 70
      ) {
        const yDiff = Math.abs(
          this.previousPosition.middleTipY - currentHandMiddleTipY
        );
        // console.log(yDiff);

        if (yDiff > 150) {
          window.scrollBy(0, 400);
        } else {
          window.scrollBy(0, 100);
        }

        this.previousPosition = { indexTipY: 0, middleTipY: 0 };
      }

      this.previousPosition.indexTipY =
        this.hands[0].keypoints[handKeypoint.indexTip].y;
      this.previousPosition.middleTipY =
        this.hands[0].keypoints[handKeypoint.middleTip].y;
    }
    if (
      this.readyToScroll &&
      this.previousPosition.indexTipY === 0 &&
      this.previousPosition.middleTipY === 0
    ) {
      this.previousPosition.indexTipY =
        this.hands[0].keypoints[handKeypoint.indexTip].y;
      this.previousPosition.middleTipY =
        this.hands[0].keypoints[handKeypoint.middleTip].y;
    }

    //--- INDEX CURSOR ---
    //
    //--------------------

    if (this.indexCursor) {
      const indexTip = this.hands[0].keypoints[handKeypoint.indexTip];
      if (
        Math.abs(this.topFromIndex() - indexTip.y * this.proportionFactorY) > 5
      )
        this.topFromIndex.set(indexTip.y * this.proportionFactorY);

      if (
        Math.abs(this.rightFromIndex() - indexTip.x * this.proportionFactorX) >
        5
      )
        this.rightFromIndex.set(indexTip.x * this.proportionFactorX);

      this.cursorElement().nativeElement.style.top = this.topFromIndex();
      this.cursorElement().nativeElement.style.right = this.rightFromIndex();
    }
  }

  async renderPrediction() {
    await this.renderResult();
    // console.log(this.hands);
    this.handsNumber = this.hands.length;
    this.rafId = requestAnimationFrame(this.renderPrediction.bind(this));
  }

  captureCurrentHands() {
    console.log(this.hands);
  }

  start() {
    this.renderPrediction();
  }
}
