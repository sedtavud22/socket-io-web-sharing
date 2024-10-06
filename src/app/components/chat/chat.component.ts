import { Component, inject, PLATFORM_ID } from '@angular/core';
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
  messages: Message[] = [];
  newMessage: string = '';
  currentRoom: string = '';
  user: User = { username: 'Anonymous', id: uuidv4() };
  typingUsers: User[] = [];
  isUserTyping = false;

  get MessageType() {
    return MessageType;
  }

  constructor(private socketService: SocketService) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const userJSON = localStorage.getItem('socket_user');
      if (userJSON) {
        this.user = JSON.parse(userJSON);
      }
    }
  }

  joinRoom(room: string) {
    this.currentRoom = room;
    this.messages = [];
  }

  leaveRoom() {
    if (this.currentRoom) {
    }
  }

  sendMessage() {}

  onTyping(event: Event) {}
}
