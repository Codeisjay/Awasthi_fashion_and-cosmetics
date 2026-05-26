import React, { createContext, useContext, useState, useCallback } from 'react';

/**
 * Form Submission Context
 * Manages form submission state to prevent duplicate submissions
 */
const FormSubmissionContext = createContext();

export const FormSubmissionProvider = ({ children }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittingForms, setSubmittingForms] = useState(new Set());

  /**
   * Lock a form from submitting
   */
  const lockForm = useCallback((formId) => {
    setSubmittingForms((prev) => new Set([...prev, formId]));
    setIsSubmitting(true);
  }, []);

  /**
   * Unlock a form
   */
  const unlockForm = useCallback((formId) => {
    setSubmittingForms((prev) => {
      const newSet = new Set(prev);
      newSet.delete(formId);
      return newSet;
    });
  }, []);

  /**
   * Check if a form is locked
   */
  const isFormLocked = useCallback((formId) => {
    return submittingForms.has(formId);
  }, [submittingForms]);

  /**
   * Check if ANY form is locked
   */
  const isAnyFormSubmitting = useCallback(() => {
    return submittingForms.size > 0;
  }, [submittingForms]);

  /**
   * Wrapper for async submission
   * Automatically handles locking/unlocking
   */
  const executeSubmission = useCallback(async (formId, asyncFn) => {
    // Prevent duplicate submissions
    if (isFormLocked(formId)) {
      console.warn(`[FORM LOCK] Form ${formId} is already submitting`);
      return null;
    }

    lockForm(formId);

    try {
      const result = await asyncFn();
      return result;
    } catch (error) {
      console.error(`[FORM ERROR] Submission failed for form ${formId}`, error);
      throw error;
    } finally {
      unlockForm(formId);
    }
  }, [lockForm, unlockForm, isFormLocked]);

  return (
    <FormSubmissionContext.Provider
      value={{
        lockForm,
        unlockForm,
        isFormLocked,
        isAnyFormSubmitting,
        executeSubmission,
        isSubmitting
      }}
    >
      {children}
    </FormSubmissionContext.Provider>
  );
};

/**
 * Hook to use form submission context
 */
export const useFormSubmission = () => {
  const context = useContext(FormSubmissionContext);

  if (!context) {
    throw new Error('useFormSubmission must be used within FormSubmissionProvider');
  }

  return context;
};

export default FormSubmissionContext;
