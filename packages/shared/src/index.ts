import { parsePhoneNumberFromString } from "libphonenumber-js";

export function normalizePhone( input: string, defaultCountry: "IN" | "US" | "GB" = "IN"): string {
    const phone = parsePhoneNumberFromString(input, defaultCountry);
    if (!phone || !phone.isValid()) {
        throw new Error("Invalid phone number");
    }
    return phone.format("E.164"); // ✅ normalized
}

export function isValidPhone(input: string, defaultCountry: "IN" | "US" | "GB" = "IN"): boolean {
    const phone = parsePhoneNumberFromString(input, defaultCountry);
    return phone ? phone.isValid() : false;
}