import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MyFilesComponent } from './my-files/my-files.component';
import { MyContactNetworksComponent } from "./my-contact-networks/my-contact-networks.component";
import { MyDataComponent } from "./my-data/my-data.component";
import { MySkillsComponent } from "./my-skills/my-skills.component";
import { MyDataModel } from '../models/MyDataModel';
import { ProfileDataService } from './service/profile-data.service';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { forkJoin } from 'rxjs';
import { ContactService } from './service/contact.service';
import { ContactTypeService } from './service/contact-type.service';
import { ContactMapperUtil } from '../../../shared/utils/contact-mapper';
import { ContactUpdateDTO, ResponseContactTypeDTO } from '../models/MyContactsModels';

@Component({
  selector: 'app-profile-data',
  imports: [MyFilesComponent, MyContactNetworksComponent, MyDataComponent, MySkillsComponent, CommonModule, ButtonComponent],
  templateUrl: './profile-data.component.html',
  styleUrl: './profile-data.component.scss'
})
export class ProfileDataComponent implements OnInit {
  selectedSkills: number[] = [];

  myDataInput: MyDataModel | null = null;

  contactTypes: ResponseContactTypeDTO[] = [];
  contactsForUpdate: ContactUpdateDTO[] = [];   // lo que sale del hijo y va al PUT
  initialContacts: ContactUpdateDTO[] = [];     // precarga para el hijo

  profileDataService = inject(ProfileDataService);
  contactService = inject(ContactService);
  contactTypeService = inject(ContactTypeService);

  initialContactsReady = false;

  ngOnInit(): void {
    this.loadContacts();
    this.profileDataService.getPersonData().subscribe({
      next: (p) => {
        console.log('Person data:', p);
        this.personId = p.id;
        this.myDataInput = {
          firstName: p.firstName ?? null,
          lastName: p.lastName ?? null,
          email: p.email ?? null,
          phoneNumber: p.phoneNumber ?? null,
          countryId: p.country?.id != null ? String(p.country.id) : null,
          functionalRoleId: p.functionalRoles?.[0]?.id != null ? String(p.functionalRoles[0].id) : null,
          languageId: p.languages?.[0]?.id != null ? String(p.languages[0].id) : null,
        };
        this.selectedSkills = p.skills?.map((s: any) => s.id) ?? [];
      },
      error: (err) => console.error('Error loading profile:', err),
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

selectedCvFile: File | null = null;
personId: number = 0;

onCvSelected(file: File) {
  this.selectedCvFile = file;
}

private uploadCvAndFinish(): void {
  this.profileDataService.uploadCv(this.personId,this.selectedCvFile!, true).subscribe({
    next: () => this.finishSave(),
    error: err => {
      this.isSaving = false;
      console.error('Perfil guardado, pero error subiendo CV', err);
    }
  });
}

@ViewChild(MyFilesComponent)
  myFilesComponent!: MyFilesComponent;

private finishSave(): void {
  this.isSaving = false;
  console.log('Perfil y CV guardados correctamente');

  //aviso al hijo que recargue los archivos
  this.myFilesComponent.loadMyCvs();
}


  onSkillsChange(skills: number[]) {
    this.selectedSkills = skills;
    console.log('Skills actualizadas:', this.selectedSkills);
  }

  onSaveAll(): void {
    console.log('contactsForUpdate before save:', this.contactsForUpdate);

    const payload = {
      ...this.profilePayload,
      skillIds: this.selectedSkills.length > 0
        ? this.selectedSkills
        : undefined,
      contacts: this.contactsForUpdate.length > 0 ? this.contactsForUpdate : undefined
    };

    // limpiar undefined
    const cleanedPayload = Object.fromEntries(
      Object.entries(payload).filter(([_, value]) => value !== undefined)
    );

    if (!Object.keys(cleanedPayload).length && !this.selectedCvFile) return;

    this.isSaving = true;

    this.profileDataService
      .updatePersonProfile(cleanedPayload)
      .subscribe({
        next: res => {
          if (this.selectedCvFile) {
        this.uploadCvAndFinish();
      } else {
        this.finishSave();
      }
        },
        error: err => {
          this.isSaving = false;
          console.error('Error guardando perfil', err);
        }
      });
  }


  onContactsChange(dto: ContactUpdateDTO[]) {
    this.contactsForUpdate = dto;
  }

  onContactDeleted(id: number) {
    // saco del estado local inmediatamente (antes de cualquier PUT)
    this.contactsForUpdate = this.contactsForUpdate.filter(c => c.id !== id);

    this.contactService.deleteContact(id).subscribe({
      next: () => { },
      error: (err) => {
        console.error(err);
        this.loadContacts(); // rollback simple
      }
    });
    this.contactService.getAllContactsByPerson().subscribe(r => console.log('GET after DELETE:', r));

  }



  private loadContacts(): void {
    forkJoin({
      types: this.contactTypeService.getAllContactTypes(),
      contacts: this.contactService.getAllContactsByPerson(),
    }).subscribe({
      next: ({ types, contacts }) => {
        console.log('Contacts:', contacts);
        console.log('Contact types:', types);
        this.contactTypes = types;
        this.initialContacts = ContactMapperUtil.toUpdateDTO(contacts, types);
        this.contactsForUpdate = [...this.initialContacts];

        console.log('InitialContacts for Profile loaded:', this.initialContacts);
        console.log('Contact types loaded:', this.contactTypes);

        this.initialContactsReady = true;
      },
      error: (err) => console.error('Error loading contacts:', err),
    });
  }

}
