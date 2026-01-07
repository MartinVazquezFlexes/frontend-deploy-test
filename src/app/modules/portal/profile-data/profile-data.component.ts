import { Component, inject, OnInit } from '@angular/core';
import { MyFilesComponent } from './my-files/my-files.component';
import { MyContactNetworksComponent } from "./my-contact-networks/my-contact-networks.component";
import { MyDataComponent } from "./my-data/my-data.component";
import { MySkillsComponent } from "./my-skills/my-skills.component";
import { MyDataModel } from '../models/MyDataModel';
import { ProfileDataService } from './service/profile-data.service';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../shared/components/button/button.component';
@Component({
  selector: 'app-profile-data',
  imports: [MyFilesComponent, MyContactNetworksComponent, MyDataComponent, MySkillsComponent, CommonModule, ButtonComponent],
  templateUrl: './profile-data.component.html',
  styleUrl: './profile-data.component.scss'
})
export class ProfileDataComponent implements OnInit {
  selectedSkills: number[] = [];

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
        this.selectedSkills = p.skills?.map((s: any) => s.id) ?? [];
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

  profilePayload: any = {};
isSaving = false;

onMyDataChange(data: any) {
  this.profilePayload = {
    ...this.profilePayload,
    ...data
  };
}

  onSkillsChange(skills: number[]) {
    this.selectedSkills = skills;
    console.log('Skills actualizadas:', this.selectedSkills);
  }

onSaveAll(): void {
  const payload = {
    ...this.profilePayload,
    skillIds: this.selectedSkills.length > 0
      ? this.selectedSkills
      : undefined
  };

  // limpiar undefined
  const cleanedPayload = Object.fromEntries(
    Object.entries(payload).filter(([_, value]) => value !== undefined)
  );

  if (!Object.keys(cleanedPayload).length) return;

  this.isSaving = true;

  this.profileDataService
    .updatePersonProfile(cleanedPayload)
    .subscribe({
      next: res => {
        this.isSaving = false;
        console.log('Perfil guardado', res);
      },
      error: err => {
        this.isSaving = false;
        console.error('Error guardando perfil', err);
      }
    });
}


}
