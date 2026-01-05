import { Component } from '@angular/core';
import { MyFilesComponent } from './my-files/my-files.component';
import { MyContactNetworksComponent } from "./my-contact-networks/my-contact-networks.component";
import { MyDataComponent } from "./my-data/my-data.component";
import { MySkillsComponent } from "./my-skills/my-skills.component";

@Component({
  selector: 'app-profile-data',
  imports: [MyFilesComponent, MyContactNetworksComponent, MyDataComponent, MySkillsComponent],
  templateUrl: './profile-data.component.html',
  styleUrl: './profile-data.component.scss'
})
export class ProfileDataComponent {
  selectedSkills: string[] = [];

  onSkillsChange(skills: string[]) {
    this.selectedSkills = skills;
    console.log('Skills actualizadas:', this.selectedSkills);
  }
}
