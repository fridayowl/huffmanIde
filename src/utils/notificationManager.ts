// autoNotificationService.ts
import { isPermissionGranted, requestPermission, sendNotification } from '@tauri-apps/api/notification';

class AutoNotificationService {
    private static instance: AutoNotificationService;
    private notificationInterval: number | null = null;
    private counter: number = 1;
    private isInitialized: boolean = false;

    private constructor() {}

    public static getInstance(): AutoNotificationService {
        if (!AutoNotificationService.instance) {
            AutoNotificationService.instance = new AutoNotificationService();
        }
        return AutoNotificationService.instance;
    }

    public async start() {
        if (this.isInitialized) {
            console.log('Service already running');
            return;
        }

        try {
            // Request permission immediately
            let permissionGranted = await isPermissionGranted();
            if (!permissionGranted) {
                const permission = await requestPermission();
                permissionGranted = permission === 'granted';
            }

            if (!permissionGranted) {
                console.error('Notification permission denied');
                return;
            }

            console.log('Starting notification service...');
            
            // Send immediate first notification
            await this.sendNotification('Service Started', 'Auto notifications are now running!');
            
            // Start the interval
            this.notificationInterval = window.setInterval(async () => {
                await this.sendNotification(
                    'Auto Notification',
                    `Test notification #${this.counter}`
                );
                this.counter++;
            }, 10000); // 10 seconds

            this.isInitialized = true;
            console.log('Notification service started successfully');

        } catch (error) {
            console.error('Failed to start notification service:', error);
        }
    }

    private async sendNotification(title: string, message: string) {
        try {
            await sendNotification({
                title,
                body: message
            });
            console.log(`Sent notification: ${title} - ${message}`);
        } catch (error) {
            console.error('Failed to send notification:', error);
        }
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

export const autoNotificationService = AutoNotificationService.getInstance();