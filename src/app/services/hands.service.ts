import { Injectable } from '@angular/core';
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';
import { handKeypoint } from '../constants/constants';

@Injectable({
  providedIn: 'root',
})
export class HandsService {
  constructor() {}

  isMiddleFinger(hands: handPoseDetection.Hand[]) {
    return hands.some((hand) => {
      const middleFingerTipTop =
        Math.min(...hand.keypoints.map((kp) => kp.y)) ===
        hand.keypoints[handKeypoint.middleTip].y;

      const distanceMiddleTipIndexDip = Math.abs(
        hand.keypoints[handKeypoint.middleTip].y -
          hand.keypoints[handKeypoint.indexDip].y
      );

      const distanceMiddleTipRingDip = Math.abs(
        hand.keypoints[handKeypoint.middleTip].y -
          hand.keypoints[handKeypoint.ringDip].y
      );

      return (
        middleFingerTipTop &&
        distanceMiddleTipIndexDip > 65 &&
        distanceMiddleTipRingDip > 65
      );
    });
  }

  isThumbsUp(hands: handPoseDetection.Hand[]) {
    return hands.some((hand) => {
      const thumbTipTop =
        Math.min(...hand.keypoints.map((kp) => kp.y)) ===
        hand.keypoints[handKeypoint.thumbTip].y;

      const avoidContrastWithMiddleFinger =
        hand.keypoints[handKeypoint.thumbTip].y <=
        hand.keypoints[handKeypoint.middleTip].y;

      const indexTipBelowThumbTip =
        hand.keypoints[handKeypoint.thumbTip].y <
        hand.keypoints[handKeypoint.indexTip].y;

      return (
        thumbTipTop && indexTipBelowThumbTip && avoidContrastWithMiddleFinger
      );
    });
  }

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

      return (
        thumbPinkyRingTipsCloseX &&
        thumbPinkyRingTipsCloseY &&
        indexAndMiddleClose
      );
    });
  }

  indexCursorActive(hands: handPoseDetection.Hand[]) {
    return hands.some((hand) => {
      return (
        Math.min(...hand.keypoints.map((kp) => kp.y)) ===
        hand.keypoints[handKeypoint.indexTip].y
      );
    });
  }
}
