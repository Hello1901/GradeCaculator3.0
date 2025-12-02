// Preset Management with Firebase
import { db } from './firebase-config.js';
import { getCurrentUser, isGuest, isAuthenticated } from './auth.js';
import {
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Save preset to Firebase (authenticated users) or localStorage (guest)
export async function savePreset(presetName, gradeThresholds) {
    try {
        if (!isAuthenticated()) {
            // Guest mode - save to localStorage
            const presets = getLocalPresets();
            presets[presetName] = gradeThresholds;
            localStorage.setItem('gradePresets', JSON.stringify(presets));
            return { success: true, message: 'Preset saved locally (guest mode)' };
        }

        // Authenticated user - save to Firebase
        const user = getCurrentUser();
        const presetRef = doc(db, 'users', user.uid, 'presets', presetName);

        await setDoc(presetRef, {
            name: presetName,
            gradeThresholds: gradeThresholds,
            createdAt: new Date().toISOString()
        });

        return { success: true, message: 'Preset saved to cloud' };
    } catch (error) {
        console.error('Save preset error:', error);
        return { success: false, message: 'Failed to save preset' };
    }
}

// Load presets from Firebase (authenticated) or localStorage (guest)
export async function loadPresets() {
    try {
        if (!isAuthenticated()) {
            // Guest mode - load from localStorage
            const presets = getLocalPresets();
            return { success: true, presets: Object.keys(presets).map(name => ({ name, ...presets[name] })) };
        }

        // Authenticated user - load from Firebase
        const user = getCurrentUser();
        const presetsRef = collection(db, 'users', user.uid, 'presets');
        const snapshot = await getDocs(presetsRef);

        const presets = [];
        snapshot.forEach(doc => {
            presets.push({ id: doc.id, ...doc.data() });
        });

        return { success: true, presets };
    } catch (error) {
        console.error('Load presets error:', error);
        return { success: false, message: 'Failed to load presets', presets: [] };
    }
}

// Load a specific preset
export async function loadPreset(presetName) {
    try {
        if (!isAuthenticated()) {
            // Guest mode - load from localStorage
            const presets = getLocalPresets();
            if (presets[presetName]) {
                return { success: true, gradeThresholds: presets[presetName] };
            }
            return { success: false, message: 'Preset not found' };
        }

        // Authenticated user - load from Firebase
        const user = getCurrentUser();
        const presetRef = doc(db, 'users', user.uid, 'presets', presetName);
        const presetDoc = await getDoc(presetRef);

        if (presetDoc.exists()) {
            return { success: true, gradeThresholds: presetDoc.data().gradeThresholds };
        }

        return { success: false, message: 'Preset not found' };
    } catch (error) {
        console.error('Load preset error:', error);
        return { success: false, message: 'Failed to load preset' };
    }
}

// Delete preset from Firebase (authenticated) or localStorage (guest)
export async function deletePreset(presetName) {
    try {
        if (!isAuthenticated()) {
            // Guest mode - delete from localStorage
            const presets = getLocalPresets();
            delete presets[presetName];
            localStorage.setItem('gradePresets', JSON.stringify(presets));
            return { success: true, message: 'Preset deleted from local storage' };
        }

        // Authenticated user - delete from Firebase
        const user = getCurrentUser();
        const presetRef = doc(db, 'users', user.uid, 'presets', presetName);
        await deleteDoc(presetRef);

        return { success: true, message: 'Preset deleted from cloud' };
    } catch (error) {
        console.error('Delete preset error:', error);
        return { success: false, message: 'Failed to delete preset' };
    }
}

// Get local presets from localStorage
function getLocalPresets() {
    const presetsJson = localStorage.getItem('gradePresets');
    return presetsJson ? JSON.parse(presetsJson) : {};
}

// Export preset to file (existing functionality)
export function exportPresetToFile(gradeThresholds) {
    const dataStr = JSON.stringify(gradeThresholds, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'grade-preset.json';
    link.click();
    URL.revokeObjectURL(url);
}

// Import preset from file (existing functionality)
export function importPresetFromFile(file, callback) {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const gradeThresholds = JSON.parse(e.target.result);
            callback({ success: true, gradeThresholds });
        } catch (error) {
            callback({ success: false, message: 'Invalid preset file' });
        }
    };
    reader.readAsText(file);
}
