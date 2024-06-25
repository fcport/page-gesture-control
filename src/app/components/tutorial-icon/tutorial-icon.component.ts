import { Component, input } from '@angular/core';
import { ACTIONS } from '../../services/hands.service';

@Component({
  selector: 'app-tutorial-icon',
  standalone: true,
  imports: [],
  templateUrl: './tutorial-icon.component.html',
  styleUrl: './tutorial-icon.component.scss',
})
export class TutorialIconComponent {
  command = input.required<ACTIONS>();
}
