import { Component, Inject, inject, PLATFORM_ID, signal } from '@angular/core';
import { SocketService } from '../../services/socket.service';
import { FormsModule } from '@angular/forms';
import { Message, MessageType } from '../../models/message.model';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { User } from '../../models/user.model';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent {
  private readonly platformId = inject(PLATFORM_ID);
  messages = signal<Message[]>([]);
  newMessage = signal<string>('');
  currentRoom = signal<string>('');
  user = signal<User>({ username: 'Anonymous', id: uuidv4() });
  typingUsers = signal<User[]>([]);
  isUserTyping = signal<boolean>(false);

  get MessageType() {
    return MessageType;
  }

  constructor() {}

  private readonly socketService = Inject(SocketService);

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const userJSON = localStorage.getItem('socket_user');
      if (userJSON) {
        this.user.set(JSON.parse(userJSON));
      }
    }
  }

  joinRoom(room: string) {
    this.currentRoom.set(room);
    this.messages.set([]);
  }

  leaveRoom() {
    if (this.currentRoom()) {
    }
  }

  sendMessage() {}

  onTyping(event: Event) {}
}
