import { deepEqual } from '../components/forms/pet/utils/performance-utils'
import { extractChangedFields, transformFormDataToPet } from '../components/forms/pet/utils/data-transformers'
import type { PetFormData } from '../components/forms/pet/types/PetForm.types'

console.log('Running verification tests...')

// Test deepEqual
console.log('Testing deepEqual...')
const obj1 = { a: 1, b: { c: 2 }, d: [1, 2] }
const obj2 = { a: 1, b: { c: 2 }, d: [1, 2] }
const obj3 = { a: 1, b: { c: 3 }, d: [1, 2] }
const date1 = new Date('2023-01-01')
const date2 = new Date('2023-01-01')
const date3 = new Date('2023-01-02')

if (!deepEqual(obj1, obj2)) console.error('FAIL: deepEqual objects')
if (deepEqual(obj1, obj3)) console.error('FAIL: deepEqual objects inequality')
if (!deepEqual(date1, date2)) console.error('FAIL: deepEqual dates')
if (deepEqual(date1, date3)) console.error('FAIL: deepEqual dates inequality')
if (!deepEqual(null, null)) console.error('FAIL: deepEqual null')
if (!deepEqual(undefined, undefined)) console.error('FAIL: deepEqual undefined')

// Test extractChangedFields
console.log('Testing extractChangedFields...')
const form1: PetFormData = {
    petNumber: '123',
    ownerId: 1,
    name: 'Buddy',
    speciesId: 1,
    breedId: '',
    sexId: 1,
    primaryColorId: '',
    secondaryColorId: '',
    dateOfBirth: '',
    isBirthEstimated: false,
    microchipNumber: '',
    microchipDate: '',
    microchipLocation: '',
    tattooNumber: '',
    isSterilized: false,
    sterilizationDate: '',
    sterilizationTypeId: '',
    registrationNumber: '',
    isActive: true,
    dateOfDeath: '',
    causeOfDeath: '',
    specialNeeds: '',
    behavioralNotes: '',
    dietaryRestrictions: '',
    exerciseRequirements: '',
    acquisitionDate: '',
    acquisitionSource: '',
    previousOwnerInfo: ''
}
const form2 = { ...form1, name: 'Max' }
const changes = extractChangedFields(form2, form1)
if (changes.name !== 'Max') console.error('FAIL: extractChangedFields name change')
if (Object.keys(changes).length !== 1) console.error('FAIL: extractChangedFields length')

// Test transformFormDataToPet
console.log('Testing transformFormDataToPet...')
const pet = transformFormDataToPet(form1)
if (pet.name !== 'Buddy') console.error('FAIL: transformFormDataToPet name')
if (pet.ownerId !== 1) console.error('FAIL: transformFormDataToPet ownerId')

console.log('Verification complete.')
