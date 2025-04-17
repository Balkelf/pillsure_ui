
import { LocalNotifications } from '@capacitor/local-notifications';
import { SmartReminder } from '@/lib/types/reminders';

export const scheduleReminder = async (reminder: SmartReminder) => {
  // Request permission
  const { display } = await LocalNotifications.checkPermissions();
  
  if (display === 'denied') {
    const { display: newDisplay } = await LocalNotifications.requestPermissions();
    if (newDisplay === 'denied') {
      throw new Error('Notification permissions denied');
    }
  }

  if (reminder.smartType === 'location') {
    // For location-based reminders, we'll need to implement geofencing separately
    console.log('Location-based notification scheduled');
    return;
  }

  if (!reminder.time) {
    return;
  }

  const [hours, minutes] = reminder.time.split(':').map(Number);
  const scheduleTime = new Date();
  scheduleTime.setHours(hours, minutes, 0);

  // If the time has passed today, schedule for tomorrow
  if (scheduleTime.getTime() < Date.now()) {
    scheduleTime.setDate(scheduleTime.getDate() + 1);
  }

  await LocalNotifications.schedule({
    notifications: [
      {
        id: parseInt(reminder.id),
        title: 'Medication Reminder',
        body: `Time to take your medication ${reminder.location ? `at ${reminder.location.name}` : ''}`,
        schedule: { at: scheduleTime },
        sound: 'default',
        actionTypeId: '',
        extra: {
          reminderId: reminder.id,
          medicationId: reminder.medicationId,
        }
      }
    ]
  });
};

export const cancelReminder = async (reminderId: string) => {
  await LocalNotifications.cancel({
    notifications: [{ id: parseInt(reminderId) }]
  });
};
