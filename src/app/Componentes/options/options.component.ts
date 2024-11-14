import { Component } from '@angular/core';
import { Router} from '@angular/router';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.css'] 
})
export class OptionsComponent {

  constructor(private router: Router) { }

  logout(): void {
    this.router.navigate(['/']);
  }
  navegarCaja(){
this.router.navigate(['/caja']);
  }
}