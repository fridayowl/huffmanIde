import { isPermissionGranted, requestPermission, sendNotification } from '@tauri-apps/api/notification';
import { invoke } from '@tauri-apps/api/tauri';

class NotificationService {
    private static instance: NotificationService;
    private notificationInterval: number | null = null;
    private counter: number = 1;
    private isInitialized: boolean = false;

    private constructor() {}

    public static getInstance(): NotificationService {
        if (!NotificationService.instance) {
            NotificationService.instance = new NotificationService();
        }
        return NotificationService.instance;
    }

    public async start() {
        if (this.isInitialized) {
            return;
        }

        try {
            // Check and request permissions
            let permissionGranted = await isPermissionGranted();
            if (!permissionGranted) {
                const permission = await requestPermission();
                permissionGranted = permission === 'granted';
            }

            if (!permissionGranted) {
                console.error('Notification permission denied');
                return;
            }

            // Start sending periodic notifications using both methods
            this.startNotifications();
            
            // Log success
            console.log('Notification service started successfully');
            this.isInitialized = true;

        } catch (error) {
            console.error('Failed to start notification service:', error);
        }
    }

    private startNotifications() {
        if (this.notificationInterval) {
            window.clearInterval(this.notificationInterval);
        }

        // Try both notification methods every 10 seconds
        this.notificationInterval = window.setInterval(async () => {
            try {
                // Try Tauri's invoke method
                await invoke('show_notification', {
                    title: 'Test Notification',
                    message: `Notification #${this.counter} via Rust`
                });

                // Also try the JS API as backup
                await sendNotification({
                    title: 'Test Notification',
                    body: `Notification #${this.counter} via JS API`
                });

                console.log(`Notification #${this.counter} sent at ${new Date().toLocaleTimeString()}`);
                this.counter++;
            } catch (error) {
                console.error('Failed to send notification:', error);
            }
        }, 10000);
    }

    public stop() {
        if (this.notificationInterval) {
            window.clearInterval(this.notificationInterval);
            this.notificationInterval = null;
        }
        this.isInitialized = false;
        this.counter = 1;
        console.log('Notification service stopped');
    }
}

export const notificationService = NotificationService.getInstance();