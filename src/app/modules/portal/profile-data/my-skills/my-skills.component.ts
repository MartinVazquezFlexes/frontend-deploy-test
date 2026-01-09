import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ProfileDataService } from '../service/profile-data.service';
import { OptionItem } from '../../../../core/interfaces/option.interface';


const PREDEFINED_SKILLS = [
  'JavaScript', 'TypeScript', 'React', 'Vue.js', 'Angular', 'Node.js',
  'Python', 'Java', 'C#', 'PHP', 'HTML', 'CSS', 'SASS', 'Tailwind CSS',
  'Bootstrap', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Docker',
  'Kubernetes', 'AWS', 'Azure', 'GCP', 'Git', 'Linux', 'Figma',
  'Adobe Photoshop', 'UI/UX Design', 'Project Management', 'Scrum',
  'Agile', 'Machine Learning', 'Data Analysis', 'API Development'
];

@Component({
  selector: 'app-my-skills',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './my-skills.component.html',
  styleUrl: './my-skills.component.scss'
})
export class MySkillsComponent {
  @Input() selectedSkillIds: number[] = [];
  @Output() skillsChange = new EventEmitter<number[]>();
  @Input() maxSkills: number = 20;
  @Output() componentReady = new EventEmitter<void>();

  profileDataService = inject(ProfileDataService);
  
  placeholder = 'MY_SKILLS.PLACEHOLDER';

  @ViewChild('skillInput') skillInput!: ElementRef<HTMLInputElement>;
  @ViewChild('dropdown') dropdown!: ElementRef<HTMLDivElement>;

  inputValue: string = '';
  isOpen: boolean = false;
  allSkills: OptionItem[] = [];
  filteredSkills: OptionItem[] = [];

  ngOnInit() {
    this.loadSkills();
  }

  loadSkills(){
    this.profileDataService.getSkills().subscribe({
      next: (response) =>{
        this.allSkills = response;
        this.updateFilteredSkills();
        this.componentReady.emit();
        
      },
      error: (err) =>{
        console.error(err);
      }
    })
  }

  ngOnChanges() {
    this.updateFilteredSkills();
  }

  @HostListener('document:mousedown', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.dropdown && !this.dropdown.nativeElement.contains(event.target as Node)) {
      this.isOpen = false;
    }
  }

  updateFilteredSkills() {
  const search = this.inputValue.toLowerCase().trim();

  if (!search) {
    this.filteredSkills = [];
    this.isOpen = false;
    return;
  }

  this.filteredSkills = this.allSkills.filter(skill =>
    skill.label.toLowerCase().includes(search) &&
    !this.selectedSkillIds.includes(Number(skill.value))
  );

  this.isOpen = this.filteredSkills.length > 0;
}

  onInputChange() {
    this.updateFilteredSkills();
  }

  onKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case 'Enter':
  event.preventDefault();

  if (this.filteredSkills.length > 0) {
    this.addSkill(this.filteredSkills[0]);
  }
  break;
      case 'Backspace':
        if (!this.inputValue && this.selectedSkillIds.length > 0) {
          this.removeSkill(this.selectedSkillIds[this.selectedSkillIds.length - 1]);
        }
        break;
      case 'Escape':
        this.isOpen = false;
        this.skillInput.nativeElement.blur();
        break;
    }
  }

addSkill(skill: OptionItem) {
  const skillId = Number(skill.value);

  if (
    !this.selectedSkillIds.includes(skillId) &&
    this.selectedSkillIds.length < this.maxSkills
  ) {
    const newSkills = [...this.selectedSkillIds, skillId];
    this.selectedSkillIds = newSkills;
    this.skillsChange.emit(newSkills);

    this.inputValue = '';
    this.isOpen = false;
    this.updateFilteredSkills();
  }
}

  removeSkill(skillId: number) {
  const newSkills = this.selectedSkillIds.filter(id => id !== skillId);
  this.selectedSkillIds = newSkills;
  this.skillsChange.emit(newSkills);
}

  /*showAddButton(): boolean {
    return !!(this.inputValue.trim() && 
      !this.selectedSkills.includes(this.inputValue.trim()) &&
      !PREDEFINED_SKILLS.some(skill => skill.toLowerCase() === this.inputValue.toLowerCase()) &&
      this.selectedSkills.length < this.maxSkills);
  }*/
 showAddButton(): boolean {
  return false;
}

  get isInputDisabled(): boolean {
    return this.selectedSkillIds.length >= this.maxSkills;
  }

  getSkillLabel(id: number): string {
  return this.allSkills.find(s => Number(s.value) === id)?.label ?? '';
}


}