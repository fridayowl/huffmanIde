// utils/user-management.ts
import { invoke } from '@tauri-apps/api/tauri';
import { BaseDirectory, createDir, readTextFile, writeTextFile } from '@tauri-apps/api/fs';

interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
  settings: {
    theme: 'light' | 'dark';
    notifications_enabled: boolean;
  };
}

const USER_FILE = 'user-settings.json';

async function ensureConfigDir() {
  try {
    await createDir('config', { dir: BaseDirectory.App, recursive: true });
  } catch (error) {
    // Directory might already exist, which is fine
  }
}

export async function getOrCreateUser(): Promise<User> {
  try {
    await ensureConfigDir();

    // Try to read existing user data
    try {
      const contents = await readTextFile(`config/${USER_FILE}`, { 
        dir: BaseDirectory.App 
      });
      return JSON.parse(contents) as User;
    } catch (error) {
      // File doesn't exist or is invalid, create new user
      const newUser: User = {
        id: crypto.randomUUID(), // Generate unique ID
        name: 'New User',
        email: '',
        created_at: new Date().toISOString(),
        settings: {
          theme: 'dark',
          notifications_enabled: true
        }
      };

      // Save new user
      await writeTextFile(`config/${USER_FILE}`, JSON.stringify(newUser, null, 2), {
        dir: BaseDirectory.App
      });

      return newUser;
    }
  } catch (error) {
    console.error('Failed to get/create user:', error);
    throw error;
  }
}

export async function updateUser(updates: Partial<User>): Promise<User> {
  const currentUser = await getOrCreateUser();
  const updatedUser = { ...currentUser, ...updates };
  
  await writeTextFile(`config/${USER_FILE}`, JSON.stringify(updatedUser, null, 2), {
    dir: BaseDirectory.App
  });
  
  return updatedUser;
}