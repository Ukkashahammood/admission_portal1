export type StepId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export interface StepMetadata {
  id: StepId;
  code: string;
  title: string;
  subtitle: string;
  badge: string;
  color: string;
  accentColor: string;
  bgLight: string;
  process: string;
  zeroInteractionBenefit: string;
  flow: string;
  phase: 'Admission Phase (01-06)' | 'Allotment & Student Management (07-09)';
}

export interface PersonalDetails {
  fullName: string;
  email: string;
  mobile: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other' | '';
  category: 'General' | 'OBC' | 'SC' | 'ST' | 'EWS' | '';
  bloodGroup: string;
  fatherName: string;
  motherName: string;
  guardianPhone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  nationality: string;
  avatarUrl: string;
}

export interface AcademicDetails {
  tenthSchool: string;
  tenthBoard: string;
  tenthYear: string;
  tenthPercentage: string;
  twelfthSchool: string;
  twelfthBoard: string;
  twelfthYear: string;
  twelfthPercentage: string;
  pcmPercentage: string;
  hasGraduation: boolean;
  gradCollege?: string;
  gradPercentage?: string;
}

export interface ProgramSelection {
  degree: string;
  specialization: string;
  shift: 'Morning (08:30 AM - 03:30 PM)' | 'Evening (11:00 AM - 06:00 PM)';
  hostelRequired: boolean;
  hostelTypePreference: 'AC Double Occupancy' | 'Non-AC Triple Occupancy' | 'Single Studio Suite';
}

export interface SectionalScore {
  section: string;
  score: number;
  maxScore: number;
  accuracy: number;
}

export interface SectionSwapRequest {
  id: string;
  status: 'none' | 'pending' | 'approved' | 'rejected';
  currentSection: string;
  requestedSection: string;
  reasonCategory: string;
  detailedReason: string;
  swapType: 'Direct Transfer' | 'Mutual Peer Swap';
  peerRollNumber?: string;
  requestDate: string;
  reviewedDate?: string;
  adminRemarks?: string;
  reviewedBy?: string;
}

export interface HostelSwapRequest {
  id: string;
  status: 'none' | 'pending' | 'approved' | 'rejected';
  currentBlock: string;
  currentRoom: string;
  requestedBlock: string;
  requestedRoomType: string;
  swapType: 'Mutual Swap' | 'Medical / Special Relocation' | 'Category Upgrade';
  peerRollNumber?: string;
  reason: string;
  requestDate: string;
  reviewedDate?: string;
  wardenRemarks?: string;
  approvedRoom?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  step: StepId;
  action: string;
  actor: string;
  status: 'Success' | 'Pending' | 'Flagged';
  hash: string;
}

export interface ApplicantProfile {
  id: string;
  applicationId: string;
  rollNumber?: string;
  currentStep: StepId;
  completedSteps: StepId[];
  createdAt: string;
  lastUpdated: string;
  
  // Step 1
  isOtpVerified: boolean;
  registeredPhone: string;
  registeredEmail: string;
  otpCode: string;
  
  // Step 2
  personalDetails: PersonalDetails;
  academicDetails: AcademicDetails;
  programSelection: ProgramSelection;
  isDraftSaved: boolean;
  isFormSubmitted: boolean;
  formSubmittedAt?: string;
  applicationFeePaid: boolean;
  applicationFeeAmount: number;
  applicationFeeTxnId?: string;
  
  // Step 3
  receiptGenerated: boolean;
  receiptId: string;
  receiptTimestamp?: string;
  
  // Step 4
  admitCardGenerated: boolean;
  admitCardNumber: string;
  examCenter: string;
  examDate: string;
  examSlot: string;
  admitCardQrToken: string;
  
  // Step 5
  testTaken: boolean;
  testScore: number;
  testMaxScore: number;
  percentile: number;
  allIndiaRank: number;
  isTestQualified: boolean;
  meritRankCategory: string;
  sectionalScores: SectionalScore[];
  testCompletionDate?: string;
  
  // Step 6
  admissionFeePaid: boolean;
  admissionFeeBase: number;
  scholarshipDiscount: number;
  hostelFeeAmount: number;
  admissionFeeTotal: number;
  admissionFeeTxnId?: string;
  admissionFeePaidAt?: string;
  installmentPlan: 'Full Payment (5% Rebate)' | 'Two Installments' | 'Semester Plan';
  
  // Step 7
  permanentAllotted: boolean;
  allotmentDate?: string;
  permanentRollNo?: string;
  allocatedSection: string;
  allocatedHostelBlock: string;
  allocatedRoomNo: string;
  facultyMentor: string;
  orientationDate: string;
  allotmentQrToken: string;
  
  // Step 8
  sectionSwap: SectionSwapRequest;
  
  // Step 9
  hostelSwap: HostelSwapRequest;
  
  // Audit trail
  auditLogs: AuditLogEntry[];
}

export interface TestQuestion {
  id: number;
  section: 'Quantitative' | 'Logical Reasoning' | 'Engineering Physics & Tech' | 'Verbal Ability';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}
