import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-entry',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './entry.component.html',
  styleUrl: './entry.component.css',
})
export class EntryComponent {
  username: string = '';

  constructor(private router: Router) {}

  joinChat() {
    if (this.username.trim()) {
      const user: User = {
        username: this.username,
        id: uuidv4(),
      };
      localStorage.setItem('socket_user', JSON.stringify(user));
      this.router.navigate(['/chat']);
    }
  }
}
