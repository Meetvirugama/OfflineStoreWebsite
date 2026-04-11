import { create } from "zustand";
import apiClient from "@core/api/client";
import { toast } from "react-hot-toast";

const useTranslationAdminStore = create((set, get) => ({
    translations: [],
    loading: false,

    fetchTranslations: async () => {
        set({ loading: true });
        try {
            const res = await apiClient.get("/translate/glossary");
            if (res.data?.success) {
                set({ translations: res.data.data });
            }
        } catch (error) {
            console.error("Error fetching glossary:", error);
            toast.error("Failed to fetch dictionary.");
        } finally {
            set({ loading: false });
        }
    },

    addTranslation: async (original, gujarati) => {
        if (!original || !gujarati) return toast.error("Required fields missing");
        try {
            const res = await apiClient.post("/translate/glossary", {
                original_text: original,
                translated_text: gujarati,
                target_lang: 'gu' // default
            });
            if (res.data?.success) {
                toast.success("Word added to dictionary");
                set((state) => ({ translations: [res.data.data, ...state.translations] }));
                return true;
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Error adding word.");
            return false;
        }
    },

    updateTranslation: async (id, newGujaratiText) => {
        try {
            const res = await apiClient.put(`/translate/glossary/${id}`, {
                translated_text: newGujaratiText
            });
            if (res.data?.success) {
                toast.success("Dictionary updated");
                set((state) => ({
                    translations: state.translations.map(t => 
                        t.id === id ? { ...t, translated_text: newGujaratiText } : t
                    )
                }));
                return true;
            }
        } catch (error) {
            toast.error("Failed to update dictionary");
            return false;
        }
    },

    deleteTranslation: async (id) => {
        try {
            await apiClient.delete(`/translate/glossary/${id}`);
            toast.success("Reset cached translation successfully");
            set((state) => ({
                translations: state.translations.filter(t => t.id !== id)
            }));
            return true;
        } catch (error) {
            toast.error("Delete failed.");
            return false;
        }
    }
}));

export default useTranslationAdminStore;
