export type Td1MrzFields = {
  readonly documentCode: string;
  readonly issuingState: string;
  readonly documentNumber: string;
  /** YYMMDD as printed, with fillers for unknown birth-date components. */
  readonly birthDate: string;
  /** YYMMDD as printed. */
  readonly expiryDate: string;
  readonly nationality: string;
  readonly sex: 'F' | 'M' | null;
  readonly primaryName: string;
  readonly secondaryNames: string | null;
};

export type Td1MrzIssue =
  | 'format'
  | 'document-code'
  | 'issuing-state'
  | 'document-number'
  | 'birth-date'
  | 'expiry-date'
  | 'nationality'
  | 'sex'
  | 'name'
  | 'document-number-check-digit'
  | 'birth-date-check-digit'
  | 'expiry-date-check-digit'
  | 'composite-check-digit';

export type Td1MrzResult =
  | {readonly kind: 'valid'; readonly fields: Td1MrzFields}
  | {readonly kind: 'invalid'; readonly issues: readonly Td1MrzIssue[]};

const checkDigitWeights = [7, 3, 1];
const characterValues = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function matchesCheckDigit(value: string, digit: string): boolean {
  let total = 0;
  for (let index = 0; index < value.length; index++) {
    const character = value[index];
    const weight = checkDigitWeights[index % checkDigitWeights.length];
    total += (character === '<' ? 0 : characterValues.indexOf(character)) * weight;
  }
  return String(total % 10) === digit;
}

function readDocumentNumber(upper: string): {value: string; checkDigit: string} | null {
  const prefix = upper.slice(5, 14);
  if (!/^[A-Z0-9][A-Z0-9<]*$/.test(prefix)) {
    return null;
  }

  if (upper[14] !== '<') {
    return {value: prefix, checkDigit: upper[14]};
  }

  // Position 15 marks an extended number. Its continuation and check digit
  // precede the first filler in the optional field.
  const delimiter = upper.indexOf('<', 15);
  if (delimiter < 17) {
    return null;
  }

  return {
    value: prefix + upper.slice(15, delimiter - 1),
    checkDigit: upper[delimiter - 1],
  };
}

function isPossibleDate(value: string): boolean {
  if (!/^(?:[0-9]{2}|<<){3}$/.test(value)) {
    return false;
  }

  const year = value.slice(0, 2);
  const month = value.slice(2, 4);
  const day = value.slice(4, 6);
  if (month !== '<<' && (Number(month) < 1 || Number(month) > 12)) {
    return false;
  }
  if (day === '<<') {
    return true;
  }

  // A two-digit year of 00 could correspond to a leap century such as 2000.
  const february = year === '<<' || Number(year) % 4 === 0 ? 29 : 28;
  const daysPerMonth = [31, february, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const lastDay = month === '<<' ? 31 : daysPerMonth[Number(month) - 1];
  return Number(day) >= 1 && Number(day) <= lastDay;
}

function invalid(issue: Td1MrzIssue): Td1MrzResult {
  return {kind: 'invalid', issues: [issue]};
}

/** Parses a single ICAO TD1 MRZ and verifies its structure and check digits. */
export function parseTd1Mrz(input: string): Td1MrzResult {
  if (typeof input !== 'string') {
    return invalid('format');
  }
  const lines = input.replace(/\r?\n$/, '').split(/\r?\n/);
  if (lines.length !== 3 || lines.some(line => line.length !== 30 || /[^A-Z0-9<]/.test(line))) {
    return invalid('format');
  }

  const [upper, middle, lower] = lines;
  const documentCode = upper.slice(0, 2);
  const issuingState = upper.slice(2, 5);
  const birthDate = middle.slice(0, 6);
  const expiryDate = middle.slice(8, 14);
  const nationality = middle.slice(15, 18);
  const sex = middle[7] === '<' ? null : middle[7];
  const name = lower.replace(/<+$/, '');

  if (!/^[ACI][A-UW-Z<]$/.test(documentCode) || documentCode === 'AI') {
    return invalid('document-code');
  }
  if (!/^[A-Z]+<*$/.test(issuingState)) {
    return invalid('issuing-state');
  }
  const documentNumber = readDocumentNumber(upper);
  if (!documentNumber) {
    return invalid('document-number');
  }
  if (!isPossibleDate(birthDate)) {
    return invalid('birth-date');
  }
  if (expiryDate.includes('<') || !isPossibleDate(expiryDate)) {
    return invalid('expiry-date');
  }
  if (!/^[A-Z]+<*$/.test(nationality)) {
    return invalid('nationality');
  }
  if (sex !== 'F' && sex !== 'M' && sex !== null) {
    return invalid('sex');
  }
  if (!/^[A-Z]+(?:<[A-Z]+)*(?:<<[A-Z]+(?:<[A-Z]+)*)?$/.test(name)) {
    return invalid('name');
  }

  const issues: Td1MrzIssue[] = [];
  if (!matchesCheckDigit(documentNumber.value, documentNumber.checkDigit)) {
    issues.push('document-number-check-digit');
  }
  if (!matchesCheckDigit(birthDate, middle[6])) {
    issues.push('birth-date-check-digit');
  }
  if (!matchesCheckDigit(expiryDate, middle[14])) {
    issues.push('expiry-date-check-digit');
  }

  const composite = upper.slice(5) + middle.slice(0, 7) + middle.slice(8, 15) + middle.slice(18, 29);
  if (!matchesCheckDigit(composite, middle[29])) {
    issues.push('composite-check-digit');
  }
  if (issues.length > 0) {
    return {kind: 'invalid', issues};
  }

  const [primaryName, secondaryNames] = name.split('<<');
  return {
    kind: 'valid',
    fields: {
      documentCode,
      issuingState: issuingState.replace(/<+$/, ''),
      documentNumber: documentNumber.value.replace(/<+$/, ''),
      birthDate,
      expiryDate,
      nationality: nationality.replace(/<+$/, ''),
      sex,
      primaryName: primaryName.replace(/</g, ' '),
      secondaryNames: secondaryNames ? secondaryNames.replace(/</g, ' ') : null,
    },
  };
}
