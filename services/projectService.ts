
import { Project } from '../types';

/**
 * Loads a user's project from the backend.
 * @param uid The user's unique ID.
 */
export const loadProject = async (uid: string): Promise<Project> => {
    const response = await fetch(`/api/project/${uid}`);
    if (!response.ok) {
        // This might happen for new users, which is fine. The backend will return a default project.
        if(response.status === 404) {
             console.log("No project found for user, will use default.");
        } else {
            console.error("Failed to load project from backend.");
        }
    }
    return response.json();
};

/**
 * Saves a user's project to the backend.
 * @param uid The user's unique ID.
 * @param project The project data to save.
 */
export const saveProject = async (uid: string, project: Project): Promise<{ success: boolean }> => {
    const response = await fetch(`/api/project/${uid}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project),
    });

    if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || "Failed to save project.");
    }

    return response.json();
};
