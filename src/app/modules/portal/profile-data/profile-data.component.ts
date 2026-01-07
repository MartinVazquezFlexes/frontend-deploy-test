import { Component, inject, OnInit } from '@angular/core';
import { MyFilesComponent } from './my-files/my-files.component';
import { MyContactNetworksComponent } from "./my-contact-networks/my-contact-networks.component";
import { MyDataComponent } from "./my-data/my-data.component";
import { MySkillsComponent } from "./my-skills/my-skills.component";
import { MyDataModel } from '../models/MyDataModel';
import { ProfileDataService } from './service/profile-data.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-profile-data',
  imports: [MyFilesComponent, MyContactNetworksComponent, MyDataComponent, MySkillsComponent, CommonModule],
  templateUrl: './profile-data.component.html',
  styleUrl: './profile-data.component.scss'
})
export class ProfileDataComponent implements OnInit {
  selectedSkills: string[] = [];

  myDataInput: MyDataModel | null = null;

  profileDataService = inject(ProfileDataService);

  ngOnInit(): void {
    this.profileDataService.getPersonData().subscribe({
      next: (p) => {
        console.log('Person data:', p);
        this.myDataInput  = {
          firstName: p.firstName ?? null,
          lastName: p.lastName ?? null,
          email: p.email ?? null,
          phoneNumber: p.phoneNumber ?? null,

          // ids para selects (si no hay, null)
          countryId: p.country?.id != null ? String(p.country.id) : null,
          functionalRoleId: p.functionalRoles?.[0]?.id != null ? String(p.functionalRoles[0].id) : null,
          languageId: p.languages?.[0]?.id != null ? String(p.languages[0].id) : null,
        };
      },
      error: (err) => console.error('Error loading profile:', err),
    });
    this.profileDataService.getEnglishLevels().subscribe({
    next: (levels) => {
      console.log('English levels (OptionItem[]):', levels);
    },
    error: (error) => {
      console.error('Error loading english levels:', error);
    }
  });
  }

  onSkillsChange(skills: string[]) {
    this.selectedSkills = skills;
    console.log('Skills actualizadas:', this.selectedSkills);
  }
}
