import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, MessageCircle, Reply, AtSign, Check, X } from 'lucide-react';

interface Notification {
  id: number;
  type: 'answer' | 'comment' | 'mention';
  title: string;
  message: string;
  username: string;
  timeAgo: string;
  isRead: boolean;
  questionTitle?: string;
}

interface NotificationDropdownProps {
  darkMode: boolean;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ darkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'answer',
      title: 'New Answer',
      message: 'answered your question about SQL joins',
      username: 'Sarah Johnson',
      timeAgo: '5 minutes ago',
      isRead: false,
      questionTitle: 'How to join 2 columns in a data set to make a separate column in SQL'
    },
    {
      id: 2,
      type: 'comment',
      title: 'New Comment',
      message: 'commented on your answer',
      username: 'Mike Chen',
      timeAgo: '1 hour ago',
      isRead: false,
      questionTitle: 'Best practices for React component optimization'
    },
    {
      id: 3,
      type: 'mention',
      title: 'You were mentioned',
      message: 'mentioned you in a comment',
      username: 'Emma Davis',
      timeAgo: '2 hours ago',
      isRead: false,
      questionTitle: 'CSS Grid vs Flexbox: When to use which?'
    },
    {
      id: 4,
      type: 'answer',
      title: 'New Answer',
      message: 'answered your question about Docker networking',
      username: 'Alex Rodriguez',
      timeAgo: '4 hours ago',
      isRead: true,
      questionTitle: 'Docker container networking best practices'
    },
    {
      id: 5,
      type: 'comment',
      title: 'New Comment',
      message: 'commented on your answer',
      username: 'Lisa Wang',
      timeAgo: '1 day ago',
      isRead: true,
      questionTitle: 'Understanding JavaScript closures with practical examples'
    }
  ]);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'answer':
        return <MessageCircle className="w-4 h-4" />;
      case 'comment':
        return <Reply className="w-4 h-4" />;
      case 'mention':
        return <AtSign className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'answer':
        return 'from-green-500 to-emerald-600';
      case 'comment':
        return 'from-blue-500 to-cyan-600';
      case 'mention':
        return 'from-purple-500 to-violet-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const removeNotification = (id: number) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-lg transition-colors duration-300 ${
          darkMode 
            ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`absolute right-0 mt-2 w-96 rounded-xl shadow-2xl border z-50 ${
              darkMode 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-200'
            }`}
          >
            {/* Header */}
            <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={markAllAsRead}
                    className="text-blue-500 hover:text-blue-600 text-sm font-medium"
                  >
                    Mark all as read
                  </motion.button>
                )}
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className={`p-8 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                <div className="py-2">
                  {notifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`relative p-4 border-b transition-colors duration-200 cursor-pointer ${
                        darkMode ? 'border-gray-700 hover:bg-gray-750' : 'border-gray-100 hover:bg-gray-50'
                      } ${!notification.isRead ? (darkMode ? 'bg-gray-750' : 'bg-blue-50') : ''}`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start space-x-3">
                        {/* Notification Icon */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white bg-gradient-to-br ${getNotificationColor(notification.type)}`}>
                          {getNotificationIcon(notification.type)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {notification.title}
                            </p>
                            <div className="flex items-center space-x-2">
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              )}
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeNotification(notification.id);
                                }}
                                className={`p-1 rounded-full transition-colors ${
                                  darkMode ? 'hover:bg-gray-600 text-gray-400' : 'hover:bg-gray-200 text-gray-500'
                                }`}
                              >
                                <X className="w-3 h-3" />
                              </motion.button>
                            </div>
                          </div>
                          
                          <p className={`text-sm mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            <span className="font-medium text-blue-500">{notification.username}</span>
                            {' '}{notification.message}
                          </p>
                          
                          {notification.questionTitle && (
                            <p className={`text-xs mt-1 line-clamp-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              "{notification.questionTitle}"
                            </p>
                          )}
                          
                          <p className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                            {notification.timeAgo}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className={`p-3 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full text-center text-sm font-medium py-2 rounded-lg transition-colors ${
                    darkMode 
                      ? 'text-blue-400 hover:bg-gray-700' 
                      : 'text-blue-600 hover:bg-gray-100'
                  }`}
                >
                  View all notifications
                </motion.button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};