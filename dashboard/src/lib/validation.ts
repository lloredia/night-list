/**
 * Night List Input Validation
 * Lightweight validation without a schema library dependency.
 * Returns field-level errors for form display.
 */

export type ValidationErrors<T> = Partial<Record<keyof T, string>>;

// ── Primitives ──────────────────────────────────────────────────────────────

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function isValidPhone(phone: string): boolean {
  return /^\+?[\d\s\-().]{7,20}$/.test(phone.trim());
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// ── Booking Validation ──────────────────────────────────────────────────────

interface BookingFormData {
  partySize: number;
  tableCapacity: number;
  eventDate: string;
  minAdvanceHrs?: number;
}

export function validateBooking(data: BookingFormData): ValidationErrors<BookingFormData> {
  const errors: ValidationErrors<BookingFormData> = {};

  if (!data.partySize || data.partySize < 1) {
    errors.partySize = "Party size must be at least 1";
  } else if (data.partySize > data.tableCapacity) {
    errors.partySize = `Party size exceeds table capacity of ${data.tableCapacity}`;
  }

  if (!data.eventDate) {
    errors.eventDate = "Please select a date";
  } else {
    const eventMs = new Date(data.eventDate).getTime();
    const minAdvanceMs = (data.minAdvanceHrs ?? 2) * 60 * 60 * 1000;
    if (eventMs < Date.now() + minAdvanceMs) {
      errors.eventDate = `Bookings must be made at least ${data.minAdvanceHrs ?? 2} hours in advance`;
    }
  }

  return errors;
}

// ── Venue Settings Validation ───────────────────────────────────────────────

interface VenueFormData {
  venueName: string;
  address: string;
  phone: string;
  website: string;
  instagram: string;
  termsUrl: string;
  privacyUrl: string;
  maxPartySize: string;
  minAdvanceHrs: string;
  cancellationWindowHrs: string;
  noShowFeePct: string;
}

export function validateVenueSettings(data: Partial<VenueFormData>): ValidationErrors<VenueFormData> {
  const errors: ValidationErrors<VenueFormData> = {};

  if (!data.venueName?.trim()) {
    errors.venueName = "Venue name is required";
  } else if (data.venueName.length > 100) {
    errors.venueName = "Venue name must be under 100 characters";
  }

  if (data.phone && !isValidPhone(data.phone)) {
    errors.phone = "Invalid phone number";
  }

  if (data.website && !isValidUrl(data.website)) {
    errors.website = "Invalid website URL";
  }

  if (data.termsUrl && !isValidUrl(data.termsUrl)) {
    errors.termsUrl = "Invalid URL";
  }

  if (data.privacyUrl && !isValidUrl(data.privacyUrl)) {
    errors.privacyUrl = "Invalid URL";
  }

  const maxParty = parseInt(data.maxPartySize ?? "");
  if (isNaN(maxParty) || maxParty < 1 || maxParty > 500) {
    errors.maxPartySize = "Must be between 1 and 500";
  }

  const minAdv = parseInt(data.minAdvanceHrs ?? "");
  if (isNaN(minAdv) || minAdv < 0 || minAdv > 168) {
    errors.minAdvanceHrs = "Must be between 0 and 168 hours";
  }

  const cancel = parseInt(data.cancellationWindowHrs ?? "");
  if (isNaN(cancel) || cancel < 0 || cancel > 168) {
    errors.cancellationWindowHrs = "Must be between 0 and 168 hours";
  }

  const noShow = parseInt(data.noShowFeePct ?? "");
  if (isNaN(noShow) || noShow < 0 || noShow > 100) {
    errors.noShowFeePct = "Must be between 0 and 100%";
  }

  return errors;
}

// ── Auth Validation ─────────────────────────────────────────────────────────

interface AuthFormData {
  email: string;
  password: string;
  fullName?: string;
}

export function validateSignUp(data: AuthFormData): ValidationErrors<AuthFormData> {
  const errors: ValidationErrors<AuthFormData> = {};

  if (!data.email || !isValidEmail(data.email)) {
    errors.email = "Valid email required";
  }

  if (!data.password || data.password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  } else if (!/[A-Z]/.test(data.password)) {
    errors.password = "Password must contain at least one uppercase letter";
  } else if (!/[0-9]/.test(data.password)) {
    errors.password = "Password must contain at least one number";
  }

  if (!data.fullName?.trim()) {
    errors.fullName = "Full name is required";
  }

  return errors;
}

export function validateSignIn(data: AuthFormData): ValidationErrors<AuthFormData> {
  const errors: ValidationErrors<AuthFormData> = {};
  if (!data.email || !isValidEmail(data.email)) errors.email = "Valid email required";
  if (!data.password) errors.password = "Password required";
  return errors;
}

// ── Table Validation ────────────────────────────────────────────────────────

interface TableFormData {
  label: string;
  price: number;
  capacity: number;
  minBottles: number;
  layoutX: number;
  layoutY: number;
  layoutWidth: number;
  layoutHeight: number;
}

export function validateTable(data: Partial<TableFormData>): ValidationErrors<TableFormData> {
  const errors: ValidationErrors<TableFormData> = {};

  if (!data.label?.trim()) errors.label = "Table label required";

  if (data.price === undefined || data.price < 0) {
    errors.price = "Minimum spend must be 0 or greater";
  }

  if (!data.capacity || data.capacity < 1 || data.capacity > 100) {
    errors.capacity = "Capacity must be between 1 and 100";
  }

  if (data.minBottles !== undefined && (data.minBottles < 0 || data.minBottles > 50)) {
    errors.minBottles = "Must be between 0 and 50";
  }

  // Layout bounds (460×440 canvas)
  if (data.layoutX !== undefined && (data.layoutX < 0 || data.layoutX > 460)) {
    errors.layoutX = "X must be within canvas (0-460)";
  }
  if (data.layoutY !== undefined && (data.layoutY < 0 || data.layoutY > 440)) {
    errors.layoutY = "Y must be within canvas (0-440)";
  }

  return errors;
}

// ── Utility ─────────────────────────────────────────────────────────────────

export function hasErrors<T>(errors: ValidationErrors<T>): boolean {
  return Object.keys(errors).length > 0;
}
