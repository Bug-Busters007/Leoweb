import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-poll-display',
  standalone: true,

  templateUrl: './poll-display.component.html',
  styleUrl: './poll-display.component.css'
})
export class PollDisplayComponent {
  @Input() headline: string | undefined;
  @Input() description: string | undefined;
}
