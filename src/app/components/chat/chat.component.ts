import { Component, inject, PLATFORM_ID } from '@angular/core';
import { SocketService } from '../../services/socket.service';
import { FormsModule } from '@angular/forms';
import { Message } from '../../models/message.model';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent {
  private readonly platformId = inject(PLATFORM_ID);
  messages: Message[] = [];
  newMessage: string = '';
  currentRoom: string = '';
  username: string = '';
  typingUsers: string[] = [];

  constructor(private socketService: SocketService) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.username = localStorage.getItem('username') || 'Anonymous';
    }
  }

  joinRoom(room: string) {
    this.currentRoom = room;
    this.messages = [];
  }

  sendMessage() {}

  onTyping() {}
}
