import { ContactUpdateDTO, ResponseContactDTO, ResponseContactTypeDTO } from "../../modules/portal/models/MyContactsModels";

export class ContactMapperUtil {
  static toUpdateDTO(
    contacts: ResponseContactDTO[],
    types: ResponseContactTypeDTO[]
  ): ContactUpdateDTO[] {
    const byName = new Map(
      (types ?? []).map(t => [t.name.trim().toLowerCase(), t.id])
    );

    return (contacts ?? []).map(c => {
      const key = (c.contactType ?? '').trim().toLowerCase();
      const contactTypeId = byName.get(key);

      if (!contactTypeId) {
        // Inconsistencia entre Contact.contactType (string) y catálogo ContactType
        throw new Error(`ContactType no encontrado para "${c.contactType}" (contact id=${c.id})`);
      }

      return {
        id: c.id,
        contactTypeId,
        value: c.value ?? '',
        label: (c.label ?? c.contactType ?? '').trim(),
      };
    });
  }
}