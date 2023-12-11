import { Component, Input, inject } from '@angular/core';
import { SpinnerService } from '../../../core/spinner.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.css',
})
export class SpinnerComponent {
  private _spinnerService: SpinnerService = inject(SpinnerService);

  isLoading$ = this._spinnerService.isLoading$;
}
