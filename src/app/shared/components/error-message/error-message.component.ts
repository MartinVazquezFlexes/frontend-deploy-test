import { Component, computed, inject, input } from '@angular/core';
import { MessageService } from '../../../core/services/message.service';

@Component({
  selector: 'app-error-message',
  imports: [],
  templateUrl: './error-message.component.html',
  styleUrl: './error-message.component.scss',
})
export class ErrorMessageComponent {
  private messageService = inject(MessageService);
  errorMessage = computed(() => this.messageService._message());
}
