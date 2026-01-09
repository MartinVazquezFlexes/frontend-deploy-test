import { Component, OnInit, input, output, ElementRef, HostListener } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { InputGenericComponent } from '../../../../shared/components/input-generic/input-generic.component';
import { ContactUpdateDTO, ResponseContactTypeDTO } from '../../models/MyContactsModels';

@Component({
  selector: 'app-my-contact-networks',
  imports: [InputGenericComponent, TranslateModule, ReactiveFormsModule],
  templateUrl: './my-contact-networks.component.html',
  styleUrl: './my-contact-networks.component.scss',
})
export class MyContactNetworksComponent implements OnInit {
  contactTypes = input<ResponseContactTypeDTO[]>([]);
  initialContacts = input<ContactUpdateDTO[]>([]);

  contactsChange = output<ContactUpdateDTO[]>();
  deletedContactId = output<number>();


  private defaultNetworks = [];

  private availableNetworks = [
    'Twitter',
    'Instagram',
    'Facebook',
    'YouTube',
    'TikTok',
    'Portfolio',
  ];

  isDropdownOpen = false;

  contactNetworksForm: FormGroup = new FormGroup({
    networks: new FormArray([]),
  });

  constructor(private elRef: ElementRef<HTMLElement>) { }

  get networksArray(): FormArray {
    return this.contactNetworksForm.get('networks') as FormArray;
  }

  get remainingNetworks(): string[] {
    const existing = this.networksArray.controls.map(
      (control) => control.get('name')?.value
    );
    const all = [...this.defaultNetworks, ...this.availableNetworks];
    return all.filter((n) => !existing.includes(n));
  }


  get canOpenDropdown(): boolean {
    return this.remainingNetworksNew.length > 0;
  }

  get remainingNetworksNew(): ResponseContactTypeDTO[] {
    const usedTypeIds = new Set(
      this.networksArray.controls
        .map(ctrl => ctrl.get('contactTypeId')?.value)
        .filter(v => v != null)
    );

    return (this.contactTypes() ?? []).filter(
      type => !usedTypeIds.has(type.id)
    );
  }

  ngOnInit(): void {
    this.initializeFromInputs();
    this.setupValueChangesNew();
    this.emitContacts();
  }

  private initializeDefaultNetworks(): void {
    this.defaultNetworks.forEach((networkName) => {
      this.addInternalNetwork(networkName);
    });
  }

  /*private setupValueChanges(): void {
    this.networksArray.valueChanges.subscribe(() => {
      this.emitNetworksData();
    });
  }*/

  toggleDropdown(): void {
    if (!this.canOpenDropdown) return;
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown(): void {
    this.isDropdownOpen = false;
  }

  /*selectNetworkToAdd(networkName: string): void {
    if (!this.remainingNetworks.includes(networkName)) return;

    this.addInternalNetwork(networkName);
    this.closeDropdown();
  }*/

  removeNetwork(index: number): void {
    if (index < 0 || index >= this.networksArray.length) return;

    const group = this.networksArray.at(index) as FormGroup;
    const id = group.get('id')?.value as number | null;

    // UI: lo saco igual
    this.networksArray.removeAt(index);

    // Backend: si ya existía, pido borrarlo
    if (id != null) {
      console.log('Borrando contacto', id);
      this.deletedContactId.emit(id);
    }

    if (!this.canOpenDropdown) this.closeDropdown();
  }


  private addInternalNetwork(networkName: string): void {
    const networkForm: FormGroup = new FormGroup({
      name: new FormControl(networkName),
      url: new FormControl(''),
    });

    this.networksArray.push(networkForm);
  }

  private addInternalNetworkNew(contact: ContactUpdateDTO): void {
    const networkForm: FormGroup = new FormGroup({
      id: new FormControl<number | null>((contact.id ?? null) as any),
      contactTypeId: new FormControl<number>(contact.contactTypeId, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      value: new FormControl<string>(contact.value ?? '', { nonNullable: true }),
      label: new FormControl<string>((contact.label ?? '').trim(), {
        nonNullable: true,
        validators: [Validators.required],
      }),
    });

    this.networksArray.push(networkForm);
  }

  /*private emitNetworksData(): void {
    const networksData: NetworkData[] = this.networksArray.value.filter(
      (network: NetworkData) => String(network.url ?? '').trim() !== ''
    );

    this.networks.emit(networksData);
  }*/

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.isDropdownOpen) return;

    const target = event.target as Node;
    if (!this.elRef.nativeElement.contains(target)) {
      this.closeDropdown();
    }
  }

  onAddButtonClick(event: MouseEvent): void {
    event.stopPropagation();
    this.toggleDropdown();
  }

  onDropdownClick(event: MouseEvent): void {
    event.stopPropagation();
  }

  private initializeFromInputs(): void {
    // 1) cargar contactos existentes
    const existing = this.initialContacts() ?? [];
    existing.forEach(c => this.addInternalNetworkNew(c));

    // 2) asegurar defaults SOLO si existen en el catálogo
    const byName = new Map((this.contactTypes() ?? []).map(t => [t.name.trim().toLowerCase(), t.id]));
    const existingTypeIds = new Set(
      this.networksArray.controls
        .map(ctrl => ctrl.get('contactTypeId')?.value)
        .filter(v => v != null)
    );

    console.log('Networks loaded:', this.networksArray.value);
  }

  private setupValueChangesNew(): void {
    this.networksArray.valueChanges.subscribe(() => {
      this.emitContacts();
    });
  }

  private emitContacts(): void {
    const raw = this.networksArray.getRawValue() as any[];

    const dto: ContactUpdateDTO[] = (raw ?? [])
      .map(r => ({
        id: r.id ?? undefined,
        contactTypeId: Number(r.contactTypeId),
        value: String(r.value ?? ''),
        label: String(r.label ?? ''),
      }))
      .filter(c => c.value.trim() !== '')
      .map(c => ({
        ...c,
        label: c.label.trim() || this.getNetworkNameByTypeId(c.contactTypeId) || 'Network',
      }));

    this.contactsChange.emit(dto);
  }

  selectNetworkToAddNew(type: ResponseContactTypeDTO): void {
    this.addInternalNetworkNew({
      contactTypeId: type.id,
      value: '',
      label: type.name,
    });

    this.closeDropdown();
  }


  private getTypeIdByName(name: string): number | null {
    const type = (this.contactTypes() ?? []).find(
      t => t.name.trim().toLowerCase() === name.trim().toLowerCase()
    );
    return type?.id ?? null;
  }

  getNetworkNameByTypeId(typeId: number): string {
    return (this.contactTypes() ?? []).find(t => t.id === typeId)?.name ?? '';
  }


  getNetworkIcon(networkName: string): string {
    const iconMap: { [key: string]: string } = {
      Linkedin: 'assets/img/linkedin-logo.svg',
      Behance: 'assets/img/behance.svg',
      Github: 'assets/img/github.svg',
      Twitter: 'assets/img/twitter.svg',
      Instagram: 'assets/img/instagram.svg',
      Facebook: 'assets/img/facebook.svg',
      Youtube: 'assets/img/youtube.svg',
      Tiktok: 'assets/img/tiktok.svg',
      Portfolio: 'assets/img/portfolio.svg',
    };

    return iconMap[networkName] || 'assets/img/default-network.svg';
  }
}
