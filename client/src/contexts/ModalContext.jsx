import React, { createContext, useContext, useState, useCallback } from 'react';

export const MODAL_TYPES = {
  REGISTER_EVENT: 'REGISTER_EVENT',
  CANCEL_EVENT_REGISTRATION: 'CANCEL_EVENT_REGISTRATION',
  JOIN_SOCIETY: 'JOIN_SOCIETY',
  LEAVE_SOCIETY: 'LEAVE_SOCIETY',
  BOOK_MENTOR: 'BOOK_MENTOR',
  CANCEL_SESSION: 'CANCEL_SESSION',
  SESSION_FEEDBACK: 'SESSION_FEEDBACK',
  SET_AVAILABILITY: 'SET_AVAILABILITY',
  EDIT_PROFILE: 'EDIT_PROFILE',
  CREATE_SOCIETY: 'CREATE_SOCIETY',
};

const ModalContext = createContext(null);

export function ModalProvider({ children }) {
  const [modal, setModal] = useState({ type: null, props: {} });

  const openModal = useCallback((type, props = {}) => {
    setModal({ type, props });
  }, []);

  const closeModal = useCallback(() => {
    setModal({ type: null, props: {} });
  }, []);

  return (
    <ModalContext.Provider value={{ modal, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}
