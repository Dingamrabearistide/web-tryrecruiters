// export const sanitanize = (object: Object) =>  {
//     return Object.keys(object).filter(key => !!object[key]).map((key) => )

import { environment } from "@env/environment";

// }

export const wait = async (delay = 1000) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(null), delay);
  });
};

export function goToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/** <input type="number"> still accepts letters like e/E (scientific
 * notation) as valid keystrokes even when the field is meant to hold a
 * plain integer/amount. Rather than block just that one known offender,
 * allow only what a number can legitimately contain — digits, a single
 * leading "-", and a single "." — plus navigation/editing keys and
 * copy/paste/select-all shortcuts, so no letter of any kind ever gets
 * through, on every number field app-wide, not just the ones that
 * happened to get reported. */
export function blockInvalidNumberKeys(event: KeyboardEvent): void {
  const allowedControlKeys = [
    "Backspace", "Delete", "Tab", "Escape", "Enter",
    "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End",
  ];
  if (allowedControlKeys.includes(event.key)) return;
  if ((event.ctrlKey || event.metaKey) && ["a", "c", "v", "x", "z"].includes(event.key.toLowerCase())) {
    return;
  }
  if (event.key.length !== 1) return; // other non-printing keys
  const input = event.target as HTMLInputElement;
  if (event.key === "-" && input.selectionStart === 0 && !input.value.includes("-")) return;
  if (event.key === "." && !input.value.includes(".")) return;
  if (!/^[0-9]$/.test(event.key)) {
    event.preventDefault();
  }
}

/** Some job offers come back from the backend with a salary already
 * formatted as a string with its own currency text baked in (e.g.
 * "450000 FCFA") instead of a plain number. Displaying that alongside the
 * offer's real `salaryCurrency` (e.g. "XOF" or "EUR") produced nonsense
 * like "450000 FCFA XOF" or "2500 FCFA EUR" — strips anything but the
 * digits/separators so only the real currency code is ever shown next to
 * it. */
export function formatSalaryAmount(salary?: number | string): string {
  if (salary === undefined || salary === null) return "";
  return String(salary)
    .replace(/[^\d.,\s]/g, "")
    .trim();
}

export function convertToProfileFormat(data: any) {
  return {
    personalInfo: {
      name: data.name || "Utilisateur",
      title: data.profession || "Professionnel",
      email: data.email || "",
      phone: data.phone || "",
      address: data.placeOfBirth || "",
      website: data.website || "",
      profile: data.photoFileId
        ? `/images/${data.photoFileId}`
        : "/images/profil.png",
      sexe: data.gender || data.sexe || "non spécifié",
    },
    experiences: data.experiences || [],
    education: data.education || [],
    skills:
      data.skills?.map((skill: { name: any; level: any }, index: number) => ({
        id: index + 1,
        name: skill.name || skill,
        level: skill.level || "Débutant",
      })) || [],
    languages:
      data.languages?.map((lang: { name: any; level: any }, index: number) => ({
        id: index + 1,
        name: lang.name || lang,
        level: lang.level || "Débutant",
      })) || [],
    certifications: data.certifications || [], // Array vide si pas de certifications
    metadata: {
      id: data.id,
      accountId: data.accountId,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      bio: data.bio,
      nationality: data.nationality,
      notes: data.notes,
      resumeUrl: data.resumeUrl,
      tools: data.tools,
      archived: data.archived,
      deleted: data.deleted,
    },
  };
}

export function humanSize(bytes: number) {
  if (bytes < 1024) return `${bytes} o`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} Ko`;
  const mb = kb / 1024;
  return `${mb.toFixed(1)} Mo`;
}

export function formatDateForInput(date: string | Date): string {
  if (!date) return "";
  const d = new Date(date);
  return d.toISOString().split("T")[0]; // retourne '2025-08-13'
}

export function getFullPhotoUrl(photo?: string): string {
  if (!photo) return "";
  const trimmed = photo.trim();
  const isAbsolute = /^https?:\/\//i.test(trimmed);
  if (isAbsolute) return trimmed;

  let clean = trimmed
    .replace(/^undefined\/?/, "")
    .replace(/\/undefined\/?/g, "/");

  const rawBase = environment.apiUrl;
  const base =
    rawBase && rawBase !== "undefined" ? rawBase.replace(/\/$/, "") : "";

  const path = clean.startsWith("/") ? clean : `/${clean}`;
  return base ? `${base}${path}` : path;
}
