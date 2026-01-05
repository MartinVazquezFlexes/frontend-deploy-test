import { FormControl } from "@angular/forms";

export interface ProfileForm {
  avatar: FormControl<string | null>;
  firstName: FormControl<string | null>;
  lastName: FormControl<string | null>;
  email: FormControl<string | null>;
  phone: FormControl<string | null>;
  functionalRole: FormControl<string | null>;
  englishLevel: FormControl<string | null>;
  country: FormControl<string | null>;
}
