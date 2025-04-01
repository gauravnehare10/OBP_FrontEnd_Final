// store.js
import { create } from 'zustand';

const useFormStore = create((set, get) => ({
  formData: {},

  fetchFormData: async (formName) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/mortgage/get-form-data/${formName}`);
      if (!response.ok) {
        throw new Error('Failed to fetch form data');
      }

      const result = await response.json();
      if (result) {
        set((state) => ({
          formData: {
            ...state.formData,
            [formName]: result,
          },
        }));
      }
    } catch (error) {
      console.error('Error fetching form data:', error);
    }
  },

  updateFormData: async (formName, data) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/mortgage/save-form-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ formName, data }),
      });

      if (!response.ok) {
        throw new Error('Failed to update form data');
      }

      const result = await response.json();
      console.log('Data saved to MongoDB:', result);
      
      set((state) => ({
        formData: {
          ...state.formData,
          [formName]: data,
        },
      }));
    } catch (error) {
      console.error('Error updating form data:', error);
    }
  },

  clearFormData: () => {
    set({ formData: {} });
  },
}));

export default useFormStore;