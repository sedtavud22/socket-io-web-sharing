import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { User } from '../models/user.model';
import { Message } from '../models/message.model';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket!: Socket;

  constructor() {}

  initSocket() {
    this.socket = io('http://localhost:3000');
  }

  joinRoom(room: string, user: User) {
    this.socket.emit('join', { room, user });
  }

  leaveRoom(room: string, user: User) {
    this.socket.emit('leave', { room, user });
  }

  sendMessage(message: Message) {
    this.socket.emit('message', { message });
  }

  onMessage() {
    return new Observable<Message>((observer) => {
      this.socket.on('message', (data) => {
        observer.next(data);
      });
    });
  }

  startTyping(room: string, user: User) {
    this.socket.emit('typing', { room, user });
  }

  stopTyping(room: string, user: User) {
    this.socket.emit('stop-typing', { room, user });
  }

  onTyping() {
    return new Observable<{ room: string; user: User }>((observer) => {
      this.socket.on('typing', (data) => {
        observer.next(data);
      });
    });
  }

  onStopTyping() {
    return new Observable<{ room: string; user: User }>((observer) => {
      this.socket.on('stop-typing', (data) => {
        observer.next(data);
      });
    });
  }

  onJoin() {
    return new Observable<{ room: string; user: User }>((observer) => {
      this.socket.on('join', (data) => {
        observer.next(data);
      });
    });
  }

  onLeave() {
    return new Observable<{ rooms: string[]; user: User }>((observer) => {
      this.socket.on('leave', (data) => {
        observer.next(data);
      });
    });
  }
}
