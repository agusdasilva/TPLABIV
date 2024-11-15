import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule} from '@angular/router';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  standalone: true,
  imports: [CommonModule,
    RouterModule
  ],
  styleUrls: ['./options.component.css'] 
})
export class OptionsComponent {

  constructor(private router: Router) { }

  logout(): void {
    this.router.navigate(['/']);
  }
}