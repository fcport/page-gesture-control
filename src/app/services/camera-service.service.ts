import { Injectable } from '@angular/core';
import { audit } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CameraServiceService {
  constructor() {}

  proportionFactorX = 0;
  proportionFactorY = 0;

  async initCamera(videoElment: HTMLVideoElement) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error(
        'Browser API navigator.mediaDevices.getUserMedia not available'
      );
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'user',
        frameRate: { ideal: 30 },
        width: 640,
        height: 480,
      },
      audio: false,
    });

    videoElment.srcObject = stream;
    await new Promise((resolve) => {
      videoElment.onloadedmetadata = () => {
        resolve(videoElment);
      };
    });

    videoElment.play();
  }

  setupProportionFactor(
    window: { width: number; height: number },
    camera: { width: number; height: number }
  ) {
    this.proportionFactorX = window.width / camera.width;
    this.proportionFactorY = window.height / camera.height;

    // if (window[isMax] >= camera[isMax]) {
    //   this.proportionFactor = window.width / camera.width;
    // }
  }
}
