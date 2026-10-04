import StartScreen from './StartScreen.jsx';
import SignalReceived from './SignalReceived.jsx';
import AreYouOk from './AreYouOk.jsx';
import StatusVerified from './StatusVerified.jsx';
import SafeOutcome from './SafeOutcome.jsx';
import WaitVerify from './WaitVerify.jsx';
import EmergencyAlert from './EmergencyAlert.jsx';
import GPSFromPhone from './GPSFromPhone.jsx';
import EmergencyContact from './EmergencyContact.jsx';
import CallSMS from './CallSMS.jsx';
import ResponseSimulation from './ResponseSimulation.jsx';
import EndScreen from './EndScreen.jsx';

/** Screen registry — states.js refers to screens by these names. */
export const SCREENS = {
  StartScreen,
  SignalReceived,
  AreYouOk,
  StatusVerified,
  SafeOutcome,
  WaitVerify,
  EmergencyAlert,
  GPSFromPhone,
  EmergencyContact,
  CallSMS,
  ResponseSimulation,
  EndScreen,
};
