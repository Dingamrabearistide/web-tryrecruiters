import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { map, Observable } from "rxjs";

export interface Country {
  name: string;
  iso2: string;
  flag: string; // emoji flag
}

function iso2ToFlag(iso2: string): string {
  // Convert ISO2 code to emoji flag using regional indicator symbols
  return iso2
    .toUpperCase()
    .split("")
    .map((char) => String.fromCodePoint(0x1f1e6 - 65 + char.charCodeAt(0)))
    .join("");
}

/** countriesnow.space's /countries/iso endpoint — the one every country
 * dropdown in the app is built from — is missing several real countries
 * entirely (confirmed against their own /countries endpoint, which does
 * have them). Patched in here so they show up everywhere a country list is
 * used, instead of silently vanishing from every selector in the app.
 * Names/spellings match what the same API's other endpoints (cities,
 * states) expect, so selecting one of these still works for those lookups. */
const MISSING_COUNTRIES: { name: string; iso2: string }[] = [
  { name: "Bolivia", iso2: "BO" },
  { name: "Ivory Coast", iso2: "CI" },
  { name: "Kosovo", iso2: "XK" },
  { name: "Libya", iso2: "LY" },
  { name: "Macedonia", iso2: "MK" },
  { name: "Moldova", iso2: "MD" },
  { name: "North Korea", iso2: "KP" },
  { name: "South Korea", iso2: "KR" },
  { name: "Tanzania", iso2: "TZ" },
];

@Injectable({ providedIn: "root" })
export class GeoService {
  private base = "https://countriesnow.space/api/v0.1";

  constructor(private http: HttpClient) {}

  private withMissingCountries(data: any[]): any[] {
    const existingNames = new Set(
      data.map((c) => (c?.name || "").toLowerCase()),
    );
    const additions = MISSING_COUNTRIES.filter(
      (c) => !existingNames.has(c.name.toLowerCase()),
    ).map((c) => ({ name: c.name, Iso2: c.iso2 }));
    return [...data, ...additions];
  }

  getCountries(): Observable<string[]> {
    return this.http
      .get<any>(`${this.base}/countries/iso`)
      .pipe(
        map((res) =>
          this.withMissingCountries(res?.data ?? [])
            .map((c: any) => c.name)
            .filter(Boolean),
        ),
      );
  }

  getCountriesWithFlags(): Observable<Country[]> {
    return this.http
      .get<any>(`${this.base}/countries/iso`)
      .pipe(
        map((res) =>
          this.withMissingCountries(res?.data ?? [])
            .filter((c: any) => c.name && c.Iso2)
            .map((c: any) => ({
              name: c.name,
              iso2: c.Iso2,
              flag: iso2ToFlag(c.Iso2),
            }))
            .sort((a: Country, b: Country) => a.name.localeCompare(b.name)),
        ),
      );
  }

  /** countriesnow.space migrated these three lookups from POST+JSON-body
   * to GET+query-string at a "/q" suffixed path — the old POST calls now
   * 301-redirect to the GET form instead of returning data, which silently
   * broke every city/region dropdown in the app (empty list, nothing to
   * search). Confirmed live against the real API before switching. */
  getStatesByCountry(countryName: string): Observable<string[]> {
    const params = new HttpParams().set("country", countryName);
    return this.http
      .get<any>(`${this.base}/countries/states/q`, { params })
      .pipe(
        map((res) =>
          (res?.data?.states ?? []).map((s: any) => s.name).filter(Boolean),
        ),
      );
  }

  getCitiesByCountry(countryName: string): Observable<string[]> {
    const params = new HttpParams().set("country", countryName);
    return this.http
      .get<any>(`${this.base}/countries/cities/q`, { params })
      .pipe(map((res) => (res?.data ?? []).filter(Boolean)));
  }

  getCitiesByState(countryName: string, stateName: string): Observable<string[]> {
    const params = new HttpParams()
      .set("country", countryName)
      .set("state", stateName);
    return this.http
      .get<any>(`${this.base}/countries/state/cities/q`, { params })
      .pipe(map((res) => (res?.data ?? []).filter(Boolean)));
  }
}
