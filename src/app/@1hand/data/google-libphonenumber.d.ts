/** google-libphonenumber ships no type definitions. Minimal ambient
 * declaration for the handful of APIs this app actually uses. */
declare module "google-libphonenumber" {
  export class PhoneNumber {
    getNationalNumber(): number | undefined;
  }

  export class PhoneNumberUtil {
    static getInstance(): PhoneNumberUtil;
    parse(numberToParse: string, defaultRegion?: string): PhoneNumber;
    parseAndKeepRawInput(numberToParse: string, defaultRegion?: string): PhoneNumber;
    isValidNumber(number: PhoneNumber): boolean;
    getRegionCodeForNumber(number: PhoneNumber): string | undefined;
  }
}
