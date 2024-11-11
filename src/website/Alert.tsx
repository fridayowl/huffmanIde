import React from 'react';
import { AlertCircle, CheckCircle2, Info, XCircle, X } from 'lucide-react';

const variantStyles = {
    success: {
        wrapper: 'border-green-500/30 bg-green-500/10',
        icon: 'text-green-500',
        title: 'text-green-500',
        description: 'text-green-400'
    },
    error: {
        wrapper: 'border-red-500/30 bg-red-500/10',
        icon: 'text-red-500',
        title: 'text-red-500',
        description: 'text-red-400'
    },
    warning: {
        wrapper: 'border-yellow-500/30 bg-yellow-500/10',
        icon: 'text-yellow-500',
        title: 'text-yellow-500',
        description: 'text-yellow-400'
    },
    info: {
        wrapper: 'border-blue-500/30 bg-blue-500/10',
        icon: 'text-blue-500',
        title: 'text-blue-500',
        description: 'text-blue-400'
    }
};

const icons = {
    success: CheckCircle2,
    error: XCircle,
    warning: AlertCircle,
    info: Info
};

interface AlertProps {
    variant?: keyof typeof variantStyles;
    title?: string;
    description?: string;
    onClose?: () => void;
    children?: React.ReactNode;
    className?: string;
    showIcon?: boolean;
    autoClose?: number;
}

const Alert = ({
    variant = 'info',
    title,
    description,
    onClose,
    children,
    className = '',
    showIcon = true,
    autoClose
}: AlertProps) => {
    const styles = variantStyles[variant];
    const Icon = icons[variant];

    React.useEffect(() => {
        if (autoClose && onClose) {
            const timer = setTimeout(onClose, autoClose);
            return () => clearTimeout(timer);
        }
    }, [autoClose, onClose]);

    return (
        <div
            role="alert"
            className={`relative overflow-hidden rounded-lg border p-4 
        animate-in slide-in-from-top-2 fade-in duration-200 
        ${styles.wrapper} ${className}`}
        >
            <div className="flex gap-3">
                {showIcon && (
                    <div className={`flex-shrink-0 ${styles.icon}`}>
                        <Icon className="h-5 w-5" />
                    </div>
                )}
                <div className="flex-1 space-y-1">
                    {title && (
                        <h5 className={`font-medium ${styles.title}`}>
                            {title}
                        </h5>
                    )}
                    {description && (
                        <p className={`text-sm ${styles.description}`}>
                            {description}
                        </p>
                    )}
                    {children}
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className={`flex-shrink-0 ${styles.icon} opacity-70 hover:opacity-100 transition-opacity`}
                    >
                        <X className="h-5 w-5" />
                    </button>
                )}
            </div>

            {/* Animated Progress Bar for Auto-close */}
            {autoClose && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-current opacity-20">
                    <div
                        className="h-full bg-current opacity-50 transition-all duration-1000"
                        style={{
                            width: '100%',
                            animation: `shrink ${autoClose}ms linear forwards`
                        }}
                    />
                </div>
            )}
        </div>
    );
};

// Add Alert subcomponents for more structured usage
const AlertTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({
    children,
    className = ''
}) => (
    <h5 className={`font-medium ${className}`}>{children}</h5>
);

const AlertDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({
    children,
    className = ''
}) => (
    <p className={`text-sm ${className}`}>{children}</p>
);

export { Alert, AlertTitle, AlertDescription };

// Usage Examples Component
const AlertExamples = () => {
    const [alerts, setAlerts] = React.useState<string[]>(['1', '2', '3']);

    const removeAlert = (id: string) => {
        setAlerts(alerts.filter(alertId => alertId !== id));
    };

    return (
        <div className="space-y-4 p-4">
            {/* Success Alert */}
            <Alert
                variant="success"
                title="Success!"
                description="Your changes have been saved successfully."
                onClose={() => { }}
            />

            {/* Error Alert */}
            <Alert
                variant="error"
                title="Error"
                description="There was a problem processing your request."
                onClose={() => { }}
            />

            {/* Warning Alert */}
            <Alert
                variant="warning"
                title="Warning"
                description="Your session will expire in 5 minutes."
                onClose={() => { }}
            />

            {/* Info Alert */}
            <Alert
                variant="info"
                title="Info"
                description="A new version is available for download."
                onClose={() => { }}
            />

            {/* Auto-closing Alert */}
            <Alert
                variant="success"
                title="Auto-close"
                description="This alert will close automatically in 5 seconds."
                autoClose={5000}
                onClose={() => { }}
            />

            {/* Stack of Alerts */}
            <div className="fixed bottom-4 right-4 space-y-2">
                {alerts.map(id => (
                    <Alert
                        key={id}
                        variant="info"
                        description={`Notification ${id}`}
                        onClose={() => removeAlert(id)}
                        className="w-72"
                        autoClose={5000}
                    />
                ))}
            </div>
        </div>
    );
};

export default AlertExamples;