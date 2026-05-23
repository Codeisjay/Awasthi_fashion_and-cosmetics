import React from 'react';
import { useNotification } from '../hooks/useNotification';

const Toast = ({ notification, onRemove }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(notification.id);
    }, 5000);
    return () => clearTimeout(timer);
  }, [notification.id, onRemove]);

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500'
  }[notification.type] || 'bg-gray-500';

  return (
    <div className={`${bgColor} text-white px-4 py-3 rounded-lg shadow-lg`}>
      {notification.message}
    </div>
  );
};

const ToastContainer = () => {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50">
      {notifications.map(notification => (
        <Toast
          key={notification.id}
          notification={notification}
          onRemove={removeNotification}
        />
      ))}
    </div>
  );
};

export default ToastContainer;
