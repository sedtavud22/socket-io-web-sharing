import { Routes } from '@angular/router';
import { EntryComponent } from './components/entry/entry.component';
import { ChatComponent } from './components/chat/chat.component';

export const routes: Routes = [
  { path: '', component: EntryComponent },
  { path: 'chat', component: ChatComponent },
];
