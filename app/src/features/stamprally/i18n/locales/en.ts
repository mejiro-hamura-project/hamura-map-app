import type { PartialMessages } from '../index';

// English translation. Any key omitted here automatically falls back to `ja`.
const en: PartialMessages = {
  common: {
    start: 'Start',
    ok: 'OK',
    cancel: 'Cancel',
    back: 'Back',
    resetConfirm:
      'Erase all progress (stamps, registration, exchange history) and start over from the beginning?',
    resetButton: '(Test) Reset progress and start over',
  },
  header: {
    line1: 'Festival',
    line2: 'Stamp Rally',
  },
  notice: {
    iconAlt: 'Festival Stamp Rally icon',
    title: 'Please Note',
    safetyHeading: 'Safety request',
    safetyBody:
      'The shrine grounds get crowded with visitors. Please watch your surroundings and avoid running or bumping into others. Walking while looking at your phone is very dangerous, so please stop before using the app.',
    privacyHeading: 'About personal information',
    privacyBody:
      'The information you register is used only for running this event, confirming prize exchanges, and statistics. It is not used for any other purpose and is never shared with third parties.',
    otherHeading: 'Other',
    otherBody:
      'Prizes are limited in number and the exchange may end once they run out. Thank you for your understanding.',
    dataRetentionHeading: 'Data retention & contact',
    dataRetentionBody:
      'Your registered information will be deleted after the event, within the period set by the organizers. Please contact the organizers for details on what is stored, how it is deleted, and who to contact.',
  },
  howto: {
    title: 'How to Play',
    imagePlaceholder: 'Image placeholder',
    steps: [
      {
        title: 'Find the QR codes around the grounds!',
        body: 'Stamp rally QR codes are hidden all around the shrine grounds. Go find them!',
      },
      {
        title: 'Scan them with your camera!',
        body: 'Just point the app camera at a QR code. Once it reads, it checks the code automatically.',
      },
      {
        title: 'Collect the characters!',
        body: 'Each scan gets you one character. Collect all 7 to complete the secret phrase.',
      },
      {
        title: 'Complete the phrase and exchange it!',
        body: 'Once you have all 7, head to the main hall. Show your screen to a staff member to get your prize!',
      },
    ],
  },
  register: {
    title: 'Participant Registration',
    nicknameLabel: 'Nickname (optional)',
    nicknamePlaceholder: 'e.g. Festivalgoer',
    genderLabel: 'Gender',
    ageLabel: 'Age',
    agePlaceholder: 'e.g. 25',
    required: 'Required',
    selectPlaceholder: 'Please select',
    genderError: 'Please select your gender',
    ageError: 'Please enter a whole number between 1 and 110',
    isStudentLabel: 'Are you a student?',
    isStudentYes: 'Yes, I am a student',
    isStudentNo: 'No, I am not a student',
    isStudentError: 'Please select whether you are a student',
    studentCategoryLabel: 'School level',
    studentCategoryError: 'Please select your school level',
    ageStudentMismatchConfirm:
      'The age and school level you entered don’t seem to match. Continue anyway?',
    submit: 'Join',
    gender: {
      male: 'Male',
      female: 'Female',
      other: 'Other',
    },
    // Legacy age-group field (replaced by the numeric age input; unused, kept for cross-locale key compatibility).
    age: {
      student: 'Student',
      '10s': 'Teens',
      '20s': '20s',
      '30s': '30s',
      '40s': '40s',
      '50s': '50s',
      '60plus': '60 and over',
    },
    studentCategory: {
      elementary: 'Elementary school',
      juniorHigh: 'Junior high school',
      highSchool: 'High school',
      university: 'University',
    },
  },
  rally: {
    countLabel: 'Stamps collected',
    completeBanner1: 'You collected all 7 stamps!',
    completeBanner2: 'Work out the right order and take on the phrase challenge.',
    phraseSolvedBanner: 'You completed the phrase! Exchange it at the main hall.',
    exchangedBanner: 'Your prize exchange is complete.',
    challengeCta: 'Take on the phrase challenge',
    exchangeCta: 'Go to prize exchange',
    cameraCta: '📷 Open the camera',
  },
  camera: {
    instruction: 'Fit the QR code inside the frame',
    permissionDenied:
      'Camera access is not allowed. Please allow camera permission in your browser settings.',
    duplicate: 'You already have this QR code',
    invalid: 'This QR code is not part of the rally',
    demoScanButton: 'Load a demo QR',
    debugLabel: 'Debug (hidden in production): grant a stamp without the camera',
  },
  reveal: {
    title: 'Character get!',
    stampGet: 'STAMP GET!',
    close: 'Close',
  },
  challenge: {
    title: 'Phrase Challenge',
    instruction: 'Rearrange the 7 characters to complete the correct phrase!',
    wrong: 'Not quite. Try rearranging them again!',
    available: 'Your characters (tap to place)',
    checkCta: 'Check this order',
    exchangeCta: 'Go to prize exchange',
    correctTitle: 'Correct! Complete!',
    correctBody: 'Congratulations! You completed the phrase.',
    answersHintLabel: 'Answer hints (it’s one of these)',
  },
  exchange: {
    phraseLabel: 'Completed phrase',
    title1: 'Stamp Rally',
    title2: 'Completion Prize — Exchange Desk',
    numberLabel: 'Exchange number',
    staffNotice1: 'Prize exchange must be operated by a staff member.',
    staffNotice2: 'Please hand your phone to a staff member.',
    staffNotice3: 'Only staff can finalize the prize exchange.',
    longPressHint: '(Staff: press and hold this box to open the exchange confirmation)',
    exchangeButton: 'Exchange',
    done: 'Exchanged',
    confirmQuestion: 'Are you sure you want to exchange it?',
    confirmButton: 'Confirm exchange',
    staffHeading: 'For staff',
    staffPasscodePlaceholder: 'Staff passcode',
    staffPasscodeError: 'Incorrect passcode',
  },
};

export default en;
