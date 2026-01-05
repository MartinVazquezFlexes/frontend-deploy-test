import { Component } from '@angular/core';
import { LoginLeftSideComponent } from "../login-left-side/login-left-side.component";
import { LoginRightSideComponent } from "../login-right-side/login-right-side.component";

@Component({
  selector: 'app-login-container',
  imports: [LoginLeftSideComponent, LoginRightSideComponent],
  templateUrl: './login-container.component.html',
  styleUrl: './login-container.component.scss'
})
export class LoginContainerComponent {

}
