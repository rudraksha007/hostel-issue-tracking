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

export function getQueriedURL(base:string, query: Record<string, string>): string {
    const url = new URL(`http://localhost:3001${base}`);
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
        params.append(key, value);
    });
    url.search = params.toString();
    return url.toString();
}