import { Injectable } from '@angular/core';
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';
import { handKeypoint } from '../constants/constants';

@Injectable({
  providedIn: 'root',
})
export class HandsService {
  constructor() {}

  wantsToScrollDown(hands: handPoseDetection.Hand[]) {
    return hands.some((hand) => {
      const thumbTip = hand.keypoints[handKeypoint.thumbTip];
      const pinkyTip = hand.keypoints[handKeypoint.pinkyTip];
      const ringTip = hand.keypoints[handKeypoint.ringTip];
      const indexTip = hand.keypoints[handKeypoint.indexTip];
      const middleTip = hand.keypoints[handKeypoint.middleTip];

      const thumbPinkyRingTipsCloseX =
        Math.abs(thumbTip.x - pinkyTip.x) <= 35 &&
        Math.abs(thumbTip.x - ringTip.x) <= 20 &&
        Math.abs(ringTip.x - pinkyTip.x) <= 25;

      const thumbPinkyRingTipsCloseY =
        Math.abs(thumbTip.y - pinkyTip.y) <= 45 &&
        Math.abs(thumbTip.y - ringTip.y) <= 20 &&
        Math.abs(ringTip.y - pinkyTip.y) <= 25;

      const indexAndMiddleClose =
        Math.abs(indexTip.y - middleTip.y) <= 20 &&
        Math.abs(indexTip.y - middleTip.y) <= 20 &&
        Math.abs(indexTip.x - middleTip.x) <= 20 &&
        Math.abs(indexTip.x - middleTip.x) <= 20;

      // const indexAndMiddleUpRingDown =
      //   indexTip.y < hand.keypoints[handKeypoint.indexDip].y &&
      //   middleTip.y < hand.keypoints[handKeypoint.middleDip].y &&
      //   ringTip.y > hand.keypoints[handKeypoint.ringDip].y;

      return (
        thumbPinkyRingTipsCloseX &&
        thumbPinkyRingTipsCloseY &&
        indexAndMiddleClose
        // indexAndMiddleUpRingDown
      );
    });
  }

  indexCursorActive(hands: handPoseDetection.Hand[]) {
    return hands.some((hand) => {
      return (
        Math.min(...hand.keypoints.map((kp) => kp.y)) ===
          hand.keypoints[handKeypoint.indexTip].y &&
        hand.keypoints[handKeypoint.middleTip].y >
          hand.keypoints[handKeypoint.middleDip].y
      );
    });
  }

  clickGesture(hands: handPoseDetection.Hand[]) {
    return hands.some((hand) => {
      return (
        hand.keypoints[handKeypoint.indexTip].y <
          hand.keypoints[handKeypoint.indexDip].y &&
        hand.keypoints[handKeypoint.middleTip].y <
          hand.keypoints[handKeypoint.middleDip].y &&
        hand.keypoints[handKeypoint.ringTip].y <
          hand.keypoints[handKeypoint.ringDip].y &&
        hand.keypoints[handKeypoint.thumbTip].y <
          hand.keypoints[handKeypoint.thumbIp].y &&
        hand.keypoints[handKeypoint.pinkyTip].y <
          hand.keypoints[handKeypoint.pinkyDip].y
      );
    });
  }

  handleHands(hands: handPoseDetection.Hand[]): ACTIONS {
    if (this.wantsToScrollDown(hands)) {
      return 'scroll-down';
    } else if (this.indexCursorActive(hands)) {
      return 'index-cursor';
    } else if (this.clickGesture(hands)) {
      return 'click-gesture';
    }

    return '';
  }
}

export type ACTIONS = 'scroll-down' | 'index-cursor' | 'click-gesture' | '';
