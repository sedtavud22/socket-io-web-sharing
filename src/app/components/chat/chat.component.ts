import { Component, inject, PLATFORM_ID, signal } from '@angular/core';
import { SocketService } from '../../services/socket.service';
import { FormsModule } from '@angular/forms';
import { Message, MessageType } from '../../models/message.model';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
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

  private typingSubject = new Subject<string>();

  get MessageType() {
    return MessageType;
  }

  constructor(private socketService: SocketService) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const userJSON = localStorage.getItem('socket_user');
      if (userJSON) {
        this.user.set(JSON.parse(userJSON));
      }
    }

    this.typingSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        if (this.currentRoom()) {
          if (this.isUserTyping()) {
            this.socketService.stopTyping(this.currentRoom(), this.user());
            this.isUserTyping.set(false);
          }
        }
      });

    this.socketService.initSocket();

    this.socketService.onMessage().subscribe((message: Message) => {
      if (message.room === this.currentRoom()) {
        this.messages.update((msgs) => [...msgs, message]);
      }
    });

    this.socketService
      .onTyping()
      .subscribe(({ room, user }: { room: string; user: User }) => {
        if (room === this.currentRoom()) {
          const typingUser = this.typingUsers().find((u) => u.id === user.id);

          if (!typingUser) {
            this.typingUsers.update((users) => [...users, user]);
          }
        }
      });

    this.socketService
      .onStopTyping()
      .subscribe(({ room, user }: { room: string; user: User }) => {
        if (room === this.currentRoom()) {
          this.typingUsers.update((users) =>
            users.filter((u) => u.id !== user.id)
          );
        }
      });

    this.socketService
      .onJoin()
      .subscribe(({ room, user }: { room: string; user: User }) => {
        if (room === this.currentRoom()) {
          const joinMessage: Message = {
            id: uuidv4(),
            user,
            room,
            type: MessageType.Join,
          };
          this.messages.update((msgs) => [...msgs, joinMessage]);
        }
      });

    this.socketService
      .onLeave()
      .subscribe(({ rooms, user }: { rooms: string[]; user: User }) => {
        const thisRoom = rooms.find((r) => r === this.currentRoom());
        if (thisRoom) {
          const leaveMessage: Message = {
            id: uuidv4(),
            user,
            room: thisRoom,
            type: MessageType.Leave,
          };
          this.messages.update((msgs) => [...msgs, leaveMessage]);
        }
      });
  }

  ngOnDestroy() {
    if (this.currentRoom()) {
      this.leaveRoom();
    }
    this.typingSubject?.unsubscribe();
  }

  joinRoom(room: string) {
    if (this.currentRoom()) {
      this.leaveRoom();
    }
    this.currentRoom.set(room);
    this.messages.set([]);
    this.typingUsers.set([]);
    this.socketService.joinRoom(room, this.user());
  }

  leaveRoom() {
    if (this.currentRoom()) {
      this.socketService.leaveRoom(this.currentRoom(), this.user());
      this.currentRoom.set('');
    }
  }

  sendMessage() {
    if (this.newMessage().trim() && this.currentRoom()) {
      const message: Message = {
        id: uuidv4(),
        text: this.newMessage(),
        user: this.user(),
        room: this.currentRoom(),
        type: MessageType.Text,
      };

      this.socketService.sendMessage(message);
      this.newMessage.set('');
      this.socketService.stopTyping(this.currentRoom(), this.user());
    }
  }

  onTyping(event: Event) {
    if (!this.isUserTyping()) {
      this.socketService.startTyping(this.currentRoom(), this.user());
      this.isUserTyping.set(true);
    }
    this.typingSubject.next(this.newMessage());
  }
}
