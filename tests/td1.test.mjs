import assert from 'node:assert/strict';
import {test} from 'node:test';
import {parseTd1Mrz} from '../src/document/mrz/td1.ts';

const upper = 'I<UTOZZTEST1236<<<<<<<<<<<<<<<';
const middle = '0402291F3909300UTO<<<<<<<<<<<2';
const lower = 'SPECIMEN<ONLY<<SAMPLE<ALPHA<<<';

function parse(first = upper, second = middle, third = lower) {
  return parseTd1Mrz([first, second, third].join('\n'));
}

function changeAt(line, index, replacement) {
  return line.slice(0, index) + replacement + line.slice(index + 1);
}

test('parses a synthetic TD1 specimen with CRLF and a final newline', () => {
  assert.deepEqual(parseTd1Mrz([upper, middle, lower, ''].join('\r\n')), {
    kind: 'valid',
    fields: {
      documentCode: 'I<',
      issuingState: 'UTO',
      documentNumber: 'ZZTEST123',
      birthDate: '040229',
      expiryDate: '390930',
      nationality: 'UTO',
      sex: 'F',
      primaryName: 'SPECIMEN ONLY',
      secondaryNames: 'SAMPLE ALPHA',
    },
  });
});

test('parses a document number continued into the first optional field', () => {
  const result = parse(
    'I<UTOZZTEST123<A992<<<<<<<<<<<',
    '0402291F3909300UTO<<<<<<<<<<<8',
  );
  assert.equal(result.kind, 'valid');
  assert.equal(result.fields.documentNumber, 'ZZTEST123A99');
});

test('handles fillers in names, identifiers, and unknown birth-date components', () => {
  const padded = parse('I<D<<DEMO42<<<7<<<<<<<<<<<<<<<', '0402291<3909300D<<<<<<<<<<<<<0');
  assert.equal(padded.kind, 'valid');
  assert.equal(padded.fields.issuingState, 'D');
  assert.equal(padded.fields.documentNumber, 'DEMO42');
  assert.equal(padded.fields.sex, null);

  const unknown = parse(upper, '<<<<<<0F3909300UTO<<<<<<<<<<<4', 'SPECIMEN'.padEnd(30, '<'));
  assert.equal(unknown.kind, 'valid');
  assert.equal(unknown.fields.birthDate, '<<<<<<');
  assert.equal(unknown.fields.secondaryNames, null);

  const partial = parse(upper, '04<<297F3909300UTO<<<<<<<<<<<4');
  assert.equal(partial.kind, 'valid');
  assert.equal(partial.fields.birthDate, '04<<29');
});

test('rejects malformed input without replacing apparent OCR errors', () => {
  for (const input of [
    [upper, middle].join('\n'),
    [upper.slice(1), middle, lower].join('\n'),
    [upper, middle, lower, upper].join('\n'),
    [upper, changeAt(middle, 0, ' '), lower].join('\n'),
    [upper.toLowerCase(), middle, lower].join('\n'),
  ]) {
    assert.deepEqual(parseTd1Mrz(input), {kind: 'invalid', issues: ['format']});
  }
});

test('rejects invalid field structure even when checksums could match', () => {
  assert.deepEqual(parse(changeAt(upper, 0, 'P')), {
    kind: 'invalid', issues: ['document-code'],
  });
  assert.deepEqual(parse(upper, middle, changeAt(lower, 4, '0')), {
    kind: 'invalid', issues: ['name'],
  });
  assert.deepEqual(parse(upper, '9902299F3909300UTO<<<<<<<<<<<8'), {
    kind: 'invalid', issues: ['birth-date'],
  });
  assert.deepEqual(parse(upper, '0402291F3904316UTO<<<<<<<<<<<6'), {
    kind: 'invalid', issues: ['expiry-date'],
  });
  assert.equal(parse(upper, '0002299F3909300UTO<<<<<<<<<<<2').kind, 'valid');
});

test('reports the document number, birth date, expiry date, and composite check digits', () => {
  assert.deepEqual(parse(changeAt(upper, 14, '7')), {
    kind: 'invalid', issues: ['document-number-check-digit', 'composite-check-digit'],
  });
  assert.deepEqual(parse(upper, changeAt(middle, 6, '2')), {
    kind: 'invalid', issues: ['birth-date-check-digit', 'composite-check-digit'],
  });
  assert.deepEqual(parse(upper, changeAt(middle, 14, '1')), {
    kind: 'invalid', issues: ['expiry-date-check-digit', 'composite-check-digit'],
  });
  assert.deepEqual(parse(changeAt(upper, 15, 'F')), {
    kind: 'invalid', issues: ['composite-check-digit'],
  });
  assert.deepEqual(
    parse('I<UTOZZTEST123<A993<<<<<<<<<<<', '0402291F3909300UTO<<<<<<<<<<<8'),
    {kind: 'invalid', issues: ['document-number-check-digit', 'composite-check-digit']},
  );
});
