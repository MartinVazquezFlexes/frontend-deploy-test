import { Component, OnInit, output, ElementRef, HostListener } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { InputGenericComponent } from '../../../../shared/components/input-generic/input-generic.component';
import { NetworkData } from '../../models/NetworkData';

@Component({
  selector: 'app-my-contact-networks',
  imports: [InputGenericComponent, TranslateModule, ReactiveFormsModule],
  templateUrl: './my-contact-networks.component.html',
  styleUrl: './my-contact-networks.component.scss',
})
export class MyContactNetworksComponent implements OnInit {
  networks = output<NetworkData[]>();

  private defaultNetworks = ['LinkedIn', 'Behance', 'Github'];

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

  constructor(private elRef: ElementRef<HTMLElement>) {}

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
    return this.remainingNetworks.length > 0;
  }

  ngOnInit(): void {
    this.initializeDefaultNetworks();
    this.setupValueChanges();
    this.emitNetworksData();
  }

  private initializeDefaultNetworks(): void {
    this.defaultNetworks.forEach((networkName) => {
      this.addInternalNetwork(networkName);
    });
  }

  private setupValueChanges(): void {
    this.networksArray.valueChanges.subscribe(() => {
      this.emitNetworksData();
    });
  }

  toggleDropdown(): void {
    if (!this.canOpenDropdown) return;
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown(): void {
    this.isDropdownOpen = false;
  }

  selectNetworkToAdd(networkName: string): void {
    if (!this.remainingNetworks.includes(networkName)) return;

    this.addInternalNetwork(networkName);
    this.closeDropdown();
  }

  removeNetwork(index: number): void {
    if (index >= 0 && index < this.networksArray.length) {
      this.networksArray.removeAt(index);

      if (!this.canOpenDropdown) this.closeDropdown();
    }
  }

  private addInternalNetwork(networkName: string): void {
    const networkForm: FormGroup = new FormGroup({
      name: new FormControl(networkName),
      url: new FormControl(''),
    });

    this.networksArray.push(networkForm);
  }

  private emitNetworksData(): void {
    const networksData: NetworkData[] = this.networksArray.value.filter(
      (network: NetworkData) => String(network.url ?? '').trim() !== ''
    );

    this.networks.emit(networksData);
  }

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

  getNetworkIcon(networkName: string): string {
    const iconMap: { [key: string]: string } = {
      LinkedIn: 'assets/img/linkedin-logo.svg',
      Behance: 'assets/img/behance.svg',
      Github: 'assets/img/github.svg',
      Twitter: 'assets/img/twitter.svg',
      Instagram: 'assets/img/instagram.svg',
      Facebook: 'assets/img/facebook.svg',
      YouTube: 'assets/img/youtube.svg',
      TikTok: 'assets/img/tiktok.svg',
      Portfolio: 'assets/img/portfolio.svg',
    };

    return iconMap[networkName] || 'assets/img/default-network.svg';
  }
}
