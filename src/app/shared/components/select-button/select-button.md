# SelectButtonComponent

Componente Angular reutilizable para mostrar un combo box que permite seleccionar **múltiples opciones** de una lista recibida por `@Input`.

---

## 📦 Ejemplo de uso

```html
<!-- Uso básico -->
<app-select-button [filterOptions]="options" (selectionChange)="onSelectionChange($event)"></app-select-button>

<!-- Con tamaños personalizados -->
<app-select-button 
  [filterOptions]="options" 
  [buttonWidth]="'200px'"
  [dropdownWidth]="'300px'"
  [dropdownMaxHeight]="'250px'"
  (selectionChange)="onSelectionChange($event)">
</app-select-button>
```

---

## 🛠️ Importación

```ts
import { SelectButtonComponent } from './select-button.component';
```

Este componente es `standalone` y puede utilizarse directamente en el template de otro componente si se importa correctamente.

---

## 💡 Comportamiento y accesibilidad

- **Selección múltiple**: Este componente permite seleccionar múltiples opciones simultáneamente.
- **Checkboxes visuales**: Cada opción muestra un checkbox visual que indica su estado de selección.
- **Cierre automático** del menú desplegable al hacer clic fuera del dropdown (mediante `@HostListener`).
- **Opciones deshabilitadas**:
  - Se indica visualmente con estilos específicos.
  - Uso de `cursor: not-allowed`.
  - Se aplica la clase `.disabled`.
- **Selección clara**:
  - Las opciones seleccionadas se muestran con la clase `.selected`.
  - El texto en el botón refleja dinámicamente la selección actual:
    - Sin selección: Texto por defecto
    - Una selección: Muestra el texto de la opción
    - Múltiples selecciones: Muestra "X seleccionados"
- **Estilo visual activo** cuando hay selecciones con clase `button-active`.
- **Tamaños personalizables**: El botón y dropdown pueden ajustarse en ancho y alto.

---

## 🔁 Parámetros de entrada y salida

```ts
@Input() filterOptions?: OptionItem[];
@Input() buttonWidth: string = '94px';
@Input() dropdownWidth: string = '195px';
@Input() dropdownMaxHeight: string = '188px';
@Output() selectionChange = new EventEmitter<any[]>();
```

### Propiedades de entrada:

- **`filterOptions`**: Arreglo de opciones que se deben adherir a la interfaz `OptionItem`
- **`buttonWidth`**: Ancho del botón principal (por defecto: '94px')
- **`dropdownWidth`**: Ancho del menú desplegable (por defecto: '195px')
- **`dropdownMaxHeight`**: Altura máxima del menú desplegable (por defecto: '188px')
- **`disabled`**: Estado deshabilitado del componente (por defecto: false)
- **`placeholder`**: Texto placeholder cuando no hay selección (por defecto: 'SELECT_BUTTON.DEFAULT_PLACEHOLDER')
- **`multiple`**: Permite selección múltiple o única (por defecto: true - múltiple)

### Propiedades de salida:

- **`selectionChange`**: Emite un array con los valores (`value`) de las opciones seleccionadas

### Traducciones disponibles:

El componente incluye traducciones para los siguientes idiomas:

#### Español (es.json):
```json
"SELECT_BUTTON": {
  "DEFAULT_PLACEHOLDER": "Seleccionar opciones",
  "MULTIPLE_SELECTED": "{{count}} seleccionados",
  "SINGLE_SELECTED": "{{count}} seleccionado"
}
```

#### Inglés (en.json):
```json
"SELECT_BUTTON": {
  "DEFAULT_PLACEHOLDER": "Select options",
  "MULTIPLE_SELECTED": "{{count}} selected",
  "SINGLE_SELECTED": "{{count}} selected"
}
```

#### Portugués (pt.json):
```json
"SELECT_BUTTON": {
  "DEFAULT_PLACEHOLDER": "Selecionar opções",
  "MULTIPLE_SELECTED": "{{count}} selecionados",
  "SINGLE_SELECTED": "{{count}} selecionado"
}
```

`filterOptions` es un arreglo de opciones que se deben adherir a la siguiente interfaz:

```ts
interface OptionItem {
  label: string;
  value: any;
  selected?: boolean;
  disabled?: boolean;
}
```

---

## 🎨 Variables SCSS utilizadas

```scss
$color-default: #2e2473;
$color-dark: #1f2937;
$color-dark-gray: #6b7280;
$color-gray-200: #e5e7eb;
$color-gray-300: #d1d5db;
$color-green: #a3e635;
$color-background: #ffffff;
$font-body: /* fuente definida en variables */;
```

---

## 🧱 Estructura HTML

```html
<div class="select-button-container" [class.open]="isDropdownOpen" [style.width]="buttonWidth">
  <button class="select-button" [ngClass]="{'button-active': isAnyOptionSelected}" (click)="toggleDropdown($event)" [style.width]="buttonWidth">
    {{ selectedOption || 'Chips filtro' }}
  </button>
  <div class="select-dropdown" [class.open]="isDropdownOpen" [style.width]="dropdownWidth" [style.max-height]="dropdownMaxHeight">
    <div style="margin-top: 4px;">
      <div *ngFor="let option of filterOptions" class="select-dropdown__option" [class.disabled]="option.disabled"
        [class.selected]="option.selected" (click)="!option.disabled && toggleOption(option)">
        <span class="checkbox-container" [class.disabled]="option.disabled" [class.selected]="option.selected">
          <span class="checkbox-visual"></span>
          <input type="checkbox" [checked]="option.selected" [disabled]="option.disabled">
        </span>
        <span class="select-dropdown__option-text">{{ option.label }}</span>
      </div>
    </div>
  </div>
</div>
```

---

## 🎨 Estilos destacados (SCSS)

```scss
.select-button-container {
  position: relative;
  margin-left: 20px;
  
  &.open .select-button {
    background-color: $color-green;
    border: none;
    font-weight: 600;
    color: $color-dark;
  }
}

.select-button {
  height: 37px;
  border-radius: 6px;
  border: 1px solid $color-dark-gray;
  cursor: pointer;
  font-family: $font-body;
  font-weight: 500;
  font-size: 13px;
  line-height: 130%;
  text-align: center;
  background: $color-background;
  
  &.button-active {
    background-color: $color-green;
    border: none;
    color: $color-dark;
    font-weight: 600 !important;
  }
}

.select-dropdown {
  display: none;
  position: absolute;
  left: 0;
  border-radius: 2px;
  box-shadow: 0px 4px 20px 0px rgba(31, 41, 55, 0.2);
  background: $color-background;
  overflow-y: auto;
  overflow-x: hidden;
  
  &.open {
    display: block;
  }
  
  &__option {
    display: flex;
    margin-left: 4px;
    margin-right: 4px;
    align-items: center;
    height: 36px;
    border-radius: 2px;
    padding: 8px 12px;
    font-family: $font-body;
    font-weight: 500;
    font-size: 13px;
    line-height: 130%;
    letter-spacing: 0%;
    cursor: pointer;
    gap: 10px;
    
    &.disabled {
      cursor: not-allowed;
      background: $color-gray-300;
    }
  }
}

.checkbox-container {
  .checkbox-visual {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    border-radius: 4px;
    position: relative;
    box-sizing: border-box;
    border: 2px solid $color-gray-200;
  }
  
  &.selected .checkbox-visual {
    background-color: $color-default;
    border-color: $color-default;
    
    &:after {
      content: '';
      position: absolute;
      display: block;
      width: 5px;
      height: 10px;
      border: solid $color-background;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
      margin-bottom: 2px;
    }
  }
  
  &.disabled .checkbox-visual {
    opacity: 0.3;
    background-color: $color-gray-200;
    border-color: $color-gray-200;
  }
  
  &.disabled.selected .checkbox-visual:after {
    border-color: $color-dark-gray;
  }
}
```

---

## 🧠 Lógica del componente (TypeScript)

```ts
export class SelectButtonComponent implements OnInit {
  @Input() filterOptions?: OptionItem[];
  @Input() buttonWidth: string = '94px';
  @Input() dropdownWidth: string = '195px';
  @Input() dropdownMaxHeight: string = '188px';
  @Output() selectionChange = new EventEmitter<any[]>();

  selectedOption?: string;
  isDropdownOpen: boolean = false;

  get isAnyOptionSelected(): boolean | undefined {
    return this.filterOptions?.some(opt => opt.selected);
  }

  private platformId = inject(PLATFORM_ID);

  ngOnInit(): void {
    this.updateSelectedText();
  }

  toggleDropdown(event: Event): void {
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  toggleOption(option: OptionItem): void {
    if (option.disabled) return;

    option.selected = !option.selected;
    this.updateSelectedText();

    setTimeout(() => {
      this.selectionChange.emit(this.getSelectedValues());
    }, 0);
  }

  updateSelectedText(): void | string {
    const selectedOptions = this.filterOptions?.filter(opt => opt.selected);

    if (selectedOptions?.length === 0) {
      this.selectedOption = '';
    } else if (selectedOptions?.length === 1) {
      this.selectedOption = selectedOptions[0].label;
    } else {
      this.selectedOption = `${selectedOptions?.length} seleccionados`;
    }
  }

  getSelectedValues(): any[] | undefined {
    return this.filterOptions?.filter(opt => opt.selected).map(opt => opt.value);
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent): void {
    if (isPlatformBrowser(this.platformId)) {
      const target = event.target as HTMLElement;
      if (!target.closest('.select-button-container')) {
        this.isDropdownOpen = false;
      }
    }
  }
}
```

---

## 🎯 Ejemplos de uso con diferentes tamaños

### Botón pequeño con dropdown compacto
```html
<app-select-button 
  [filterOptions]="options" 
  [buttonWidth]="'80px'"
  [dropdownWidth]="'150px'"
  [dropdownMaxHeight]="'120px'"
  (selectionChange)="onSelectionChange($event)">
</app-select-button>
```

### Botón grande con dropdown amplio
```html
<app-select-button 
  [filterOptions]="options" 
  [buttonWidth]="'300px'"
  [dropdownWidth]="'400px'"
  [dropdownMaxHeight]="'300px'"
  (selectionChange)="onSelectionChange($event)">
</app-select-button>
```

### Solo cambiar el ancho del botón
```html
<app-select-button 
  [filterOptions]="options" 
  [buttonWidth]="'200px'"
  (selectionChange)="onChange($event)">
</app-select-button>
```

### Ejemplo: Campo de Rol Funcional en formulario
```html
<app-select-button 
  [filterOptions]="functionalRoleOptions" 
  [buttonWidth]="'100%'"
  [dropdownWidth]="'100%'"
  [dropdownMaxHeight]="'200px'"
  [placeholder]="'MY_DATA.FUNCTIONAL_ROLE'"
  [multiple]="false"
  (selectionChange)="onFunctionalRoleChange($event)"
  [disabled]="!isEditing">
</app-select-button>
```

### Ejemplo: Selección única vs múltiple
```html
<!-- Selección única (solo una opción) -->
<app-select-button 
  [filterOptions]="singleOptions" 
  [multiple]="false"
  (selectionChange)="onSingleSelection($event)">
</app-select-button>

<!-- Selección múltiple (varias opciones) -->
<app-select-button 
  [filterOptions]="multipleOptions" 
  [multiple]="true"
  (selectionChange)="onMultipleSelection($event)">
</app-select-button>
```

**Nota:** Para este ejemplo, necesitarás definir las opciones de rol funcional:
```typescript
functionalRoleOptions: OptionItem[] = [
  { label: 'Desarrollador Fullstack', value: 'fullstack', selected: false },
  { label: 'Desarrollador Frontend', value: 'frontend', selected: false },
  { label: 'Desarrollador Backend', value: 'backend', selected: false },
  { label: 'QA Tester', value: 'qa', selected: false },
  { label: 'DevOps', value: 'devops', selected: false },
  { label: 'Analista Funcional', value: 'analyst', selected: false }
];
```