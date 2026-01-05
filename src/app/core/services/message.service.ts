import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MessageService {

  _message = signal<string>('');

  setMessage(newMessage: string) {
    this._message.set(newMessage);
  }
}
