export type ISO8601 = string;
export type ID = string;

// ========================================================
// START: REDUX types

interface Action {
  type: string,
  payload: object
}

interface FancyPayload {
  id: ID,
  value: any,
  isChecked: boolean,
  extra: string|number,
  suffix: string|number
}
interface FancyAction extends Action {
  type: string,
  payload: FancyPayload,
  href: string | null,
  now: number,
  userID: ID,
}

//  END:  REDUX types
// ========================================================
// START: stored data types


interface Kiln {
  id: ID,
  brand: string,
  model: string,
  name: string,
  installDate: ISO8601|null,
  fuel: fuelSource,
  type: kilnType,
  maxTemp: number,
  maxProgramCount: number,
  width: number,
  depth: number,
  height: number,
  glaze: boolean,
  bisque: boolean,
  luster: boolean,
  onglaze: boolean,
  saggar: boolean,
  raku: boolean,
  pit: boolean,
  black: boolean,
  rawGlaze: boolean,
  saltGlaze: boolean,
  useCount: number,
  isRetired: false,
  isWorking: boolean,
  isInUse: boolean,
  isHot: boolean
}

interface  EquipmentLogEntry {
  id: ID,
  equipmentID: string,
  date: number,
  type: equipmentLogType,
  user: string,
  shortDesc: string,
  longDesc: string,
  parentID: string | null,
  verifiedDate: number | null,
  verifiedBy: string | null
}

interface FiringProgram {
  id: ID,
  kilnID: string,
  controllerProgramID: number,
  type: firingType,
  name: string,
  version: number,
  description: string,
  maxTemp: number,
  duration: number,
  averageRate: number,
  steps: [FiringStep],
  created: ISO8601,
  createdBy: ID,
  superseded: boolean,
  parentID: string,
  used: boolean,
  useCount: number,
  deleted: boolean,
  locked: boolean
}

interface FiringProgramTmp implements FiringProgram {
  confirmed: boolean,
  errors: object,
  lastField: string,
  mode: string
}

type FiringStep = {
  endTemp: number, // positive degrees
  rate: number,    // degrees per hour
  hold: number     // minutes to hold at end temperature
}


interface FiringLog {
  id: ID,
  kilnID: string,
  programID: string,
  diaryID: string|null,
  firingType: firingType,
  start: number,
  end: number|null,
  started: boolean,
  complete: boolean,
  maxTemp: number,
  currentTemp: number,
  responsibleID: string,
  notes: string,
  tempLog: [TemperatureLogEntry]
  responsibleLog: [ResponsibleLogEntry]
}

interface TemperatureLogEntry {
  userID: string,
  time: number,
  tempExpected: number,
  tempActual: number,
  state: temperatureState,
  notes: string,
}

interface ResponsibleLogEntry {
  time: Date,
  userID: string,
  isStart: boolean
}

interface Kilns {
  all: [Kiln],
  tmp: Kiln
}

interface AllFiringPrograms {
  all: [FiringProgram]
  tmp: FiringProgram
}

type FiringLogs = [FiringLog]
type equipmentLog = [EquipmentLogEntry]
type users = [User]
type calendar = [DiaryEntry]

interface DiaryEntry {
    id: ID,
    date: Date,
    kilnID: string,
    ownerID: string,
    approverID: string,
    programID: string,
    firingType: firingType,
    notes: string,
    confirmed: boolean,
    started: boolean,
}

interface User {
    id: ID,
    firstName: string
    lastName: string,
    preferredName: string,
    phone: string,
    email: string,
    canFire: boolean,
    canLog: boolean,
    canPack: boolean,
    canUnpack: boolean,
    canPrice: boolean,
}

interface Studio {
  kilns: [kiln],
  firingPrograms: AllFiringPrograms,
  firingLogs: FiringLogs,
  equipmentLogs: EquipmentLog,
  users: Users,
  diary: Calendar
}


//  END:  stored data types
// ========================================================
// START: view only types


interface FiringReport {
    kilnName: string,
    program: firingProgram,
    firingType: firingType,
    state: firingState,
    responsible: string,
    startTime: Date,
    endTime: Date,
    firingState: firingState,
    tempState: temperatureState,
    log: [reportRow]
    currentRate: number
}

interface ReportRow {
    time: Date,
    temp: number,
    expectedTemp: number,
    rate: number,
    expectedRate: number
}

interface veiw {
  route: [string],
  title: string,
  url: string,
  navOpen: false,
  settingsOpen: false
}

interface App {
    currentUser: user,
    reports: [firingReport],
    view: view,
    stateSlice: kilns | allFiringPrograms | firingLogs | maintenance | issues | users | diary
}

function view (state: object, eHandler: function, routes: array) : html


//  END:  view only types
// ========================================================
// START: enums


enum firingType {
    bisque,
    glaze,
    single,
    luster,
    onglaze
}

enum firingState {
    pending,
    started,
    completed,
    aborted
}

enum temperatureState {
    nominal,
    over,
    under
}

enum view {
    diary,
    firings,
    kilns,
    programs,
    report,
    users
}

enum fuelSource {
  electric,
  gas,
  wood,
  oil,
}

enum kilnType {
  'general',
  'raku',
  'platter',
  'black firing',
  'annagamma'
}

enum equipmentLogType {
  usage,
  maintenance,
  problem
}

enum programStatus {
  unused,
  selected,
  used
}


//  END:  enums
// ========================================================

