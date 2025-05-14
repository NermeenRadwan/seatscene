// Observer Pattern Implementation for Booking Notifications

class BookingSubject {
  constructor() {
    this.observers = [];
  }

  addObserver(observer) {
    this.observers.push(observer);
  }

  removeObserver(observer) {
    this.observers = this.observers.filter(obs => obs !== observer);
  }

  notify(bookingData) {
    this.observers.forEach(observer => observer.update(bookingData));
  }
}

class EmailNotificationObserver {
  update(bookingData) {
    console.log(`Email notification sent for booking ID: ${bookingData._id}`);
    // In a real implementation, this would send an actual email
    this.sendEmail(bookingData);
  }

  sendEmail(bookingData) {
    // Email sending logic would go here
    console.log(`Sending email to ${bookingData.user.email} for movie: ${bookingData.movie.title}`);
  }
}

class SMSNotificationObserver {
  update(bookingData) {
    console.log(`SMS notification sent for booking ID: ${bookingData._id}`);
    // In a real implementation, this would send an actual SMS
    this.sendSMS(bookingData);
  }

  sendSMS(bookingData) {
    // SMS sending logic would go here
    console.log(`Sending SMS to user's phone for booking confirmation`);
  }
}

class AdminNotificationObserver {
  update(bookingData) {
    console.log(`Admin notification sent for booking ID: ${bookingData._id}`);
    // Notify admin about new booking
    this.notifyAdmin(bookingData);
  }

  notifyAdmin(bookingData) {
    // Admin notification logic would go here
    console.log(`New booking alert sent to admin dashboard: ${bookingData.movie.title} at ${bookingData.showtime}`);
  }
}

// Create and export a singleton instance of the booking subject
const bookingNotifier = new BookingSubject();

// Register default observers
const emailObserver = new EmailNotificationObserver();
const smsObserver = new SMSNotificationObserver();
const adminObserver = new AdminNotificationObserver();

bookingNotifier.addObserver(emailObserver);
bookingNotifier.addObserver(smsObserver);
bookingNotifier.addObserver(adminObserver);

module.exports = {
  bookingNotifier,
  EmailNotificationObserver,
  SMSNotificationObserver,
  AdminNotificationObserver
};
