import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import eventReducer from './slices/eventSlice';
import societyReducer from './slices/societySlice';
import eventsLegacyReducer from './slices/eventsSlice';
import societiesLegacyReducer from './slices/societiesSlice';
// NEW & REPLACED SLICES
import notificationsReducer from './slices/notificationsSlice';
import academicNetworkReducer from './slices/academicNetworkSlice';
import messagesReducer from './slices/messagesSlice';
import notesReducer from './slices/notesSlice';
import societyDetailReducer from './slices/societyDetailSlice';
import memberReducer from './slices/memberSlice';
import mentorsReducer from './slices/mentorsSlice';

// Existing unchanged slices
import mentoringReducer from './slices/mentoringSlice';
import sessionsReducer from './slices/sessionsSlice';
import dashboardReducer from './slices/dashboardSlice';
import studyGroupReducer from './slices/studyGroupSlice';
import tasksReducer from './slices/tasksSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  events: eventReducer,
  societies: societyReducer,
  eventsLegacy: eventsLegacyReducer,
  societiesLegacy: societiesLegacyReducer,
  mentoring: mentoringReducer,
  sessions: sessionsReducer,
  dashboard: dashboardReducer,
  studyGroups: studyGroupReducer,
  tasks: tasksReducer,
  
  // Phase 4 Slices
  societyDetail: societyDetailReducer,
  notifications: notificationsReducer,
  academicNetwork: academicNetworkReducer,
  messages: messagesReducer,
  notes: notesReducer,
  members: memberReducer,
  mentors: mentorsReducer,
});

export default rootReducer;
