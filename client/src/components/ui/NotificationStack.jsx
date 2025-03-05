import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeNotification, selectNotifications } from '../../store/slices/uiSlice';

const NotificationStack = () => {
  const dispatch = useDispatch();
  const notifications = useSelector(selectNotifications);

  useEffect(() => {
    // Remove notifications after their duration
    notifications.forEach(notification => {
      if (notification.duration) {
        const timer = setTimeout(() => {
          dispatch(removeNotification(notification.id));
        }, notification.duration);

        return () => clearTimeout(timer);
      }
    });
  }, [notifications, dispatch]);

  const getNotificationStyles = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white';
      case 'error':
        return 'bg-red-500 text-white';
      case 'warning':
        return 'bg-yellow-500 text-white';
      case 'info':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-700 text-white';
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return 'fas fa-check-circle';
      case 'error':
        return 'fas fa-exclamation-circle';
      case 'warning':
        return 'fas fa-exclamation-triangle';
      case 'info':
        return 'fas fa-info-circle';
      default:
        return 'fas fa-bell';
    }
  };

  return (
    <div className="fixed bottom-0 right-0 p-4 z-50 space-y-4">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`max-w-sm w-full shadow-lg rounded-lg pointer-events-auto overflow-hidden ${getNotificationStyles(
            notification.type
          )}`}
          role="alert"
        >
          <div className="p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <i className={`${getNotificationIcon(notification.type)} text-xl`}></i>
              </div>
              <div className="ml-3 w-0 flex-1">
                <p className="text-sm font-medium">{notification.message}</p>
              </div>
              <div className="ml-4 flex-shrink-0 flex">
                <button
                  className="inline-flex text-white hover:text-gray-200 focus:outline-none focus:text-gray-200"
                  onClick={() => dispatch(removeNotification(notification.id))}
                >
                  <span className="sr-only">Close</span>
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
          </div>
          {notification.duration && (
            <div
              className="h-1 bg-white bg-opacity-25 transition-all duration-300"
              style={{
                width: '100%',
                animation: `shrink ${notification.duration}ms linear forwards`,
              }}
            />
          )}
        </div>
      ))}

      <style jsx>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
};

export default NotificationStack;
