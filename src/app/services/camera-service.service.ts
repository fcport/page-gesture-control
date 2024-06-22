import { Injectable } from '@angular/core';
import { audit } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CameraServiceService {
  constructor() {}

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
}
