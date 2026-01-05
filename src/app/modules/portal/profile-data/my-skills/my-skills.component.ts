import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';


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
  @Input() selectedSkills: string[] = [];
  @Input() maxSkills: number = 20;
  @Output() skillsChange = new EventEmitter<string[]>();

  
  placeholder = 'MY_SKILLS.PLACEHOLDER';

  @ViewChild('skillInput') skillInput!: ElementRef<HTMLInputElement>;
  @ViewChild('dropdown') dropdown!: ElementRef<HTMLDivElement>;

  inputValue: string = '';
  isOpen: boolean = false;
  filteredSkills: string[] = [];

  ngOnInit() {
    this.updateFilteredSkills();
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
    if (this.inputValue.trim()) {
      this.filteredSkills = PREDEFINED_SKILLS.filter(skill =>
        skill.toLowerCase().includes(this.inputValue.toLowerCase()) &&
        !this.selectedSkills.includes(skill)
      );
      this.isOpen = this.filteredSkills.length > 0 || this.showAddButton();
    } else {
      this.filteredSkills = [];
      this.isOpen = false;
    }
  }

  onInputChange() {
    this.updateFilteredSkills();
  }

  onKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case 'Enter':
        event.preventDefault();
        if (this.inputValue.trim()) {
          this.addSkill(this.inputValue);
        }
        break;
      case 'Backspace':
        if (!this.inputValue && this.selectedSkills.length > 0) {
          this.removeSkill(this.selectedSkills[this.selectedSkills.length - 1]);
        }
        break;
      case 'Escape':
        this.isOpen = false;
        this.skillInput.nativeElement.blur();
        break;
    }
  }

  addSkill(skill: string) {
    const trimmedSkill = skill.trim();
    if (trimmedSkill && 
        !this.selectedSkills.includes(trimmedSkill) && 
        this.selectedSkills.length < this.maxSkills) {
      const newSkills = [...this.selectedSkills, trimmedSkill];
      this.selectedSkills = newSkills;
      this.skillsChange.emit(newSkills);
      this.inputValue = '';
      this.isOpen = false;
      this.updateFilteredSkills();
      setTimeout(() => this.skillInput.nativeElement.focus(), 0);
    }
  }

  removeSkill(skillToRemove: string) {
    const newSkills = this.selectedSkills.filter(skill => skill !== skillToRemove);
    this.selectedSkills = newSkills;
    this.skillsChange.emit(newSkills);
    this.updateFilteredSkills();
  }

  showAddButton(): boolean {
    return !!(this.inputValue.trim() && 
      !this.selectedSkills.includes(this.inputValue.trim()) &&
      !PREDEFINED_SKILLS.some(skill => skill.toLowerCase() === this.inputValue.toLowerCase()) &&
      this.selectedSkills.length < this.maxSkills);
  }

  get isInputDisabled(): boolean {
    return this.selectedSkills.length >= this.maxSkills;
  }


}