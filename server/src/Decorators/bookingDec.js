// Booking Decorator Pattern Implementation

// Base Booking Component
class Booking {
  constructor(bookingData) {
    this.movieId = bookingData.movieId;
    this.userId = bookingData.userId;
    this.theaterId = bookingData.theaterId;
    this.showtime = bookingData.showtime;
    this.seats = bookingData.seats || [];
    this.totalPrice = this.calculatePrice();
    this.createdAt = new Date();
  }

  calculatePrice() {
    // Base price calculation (e.g., $10 per seat)
    return this.seats.length * 10;
  }

  getDescription() {
    return `Standard booking for ${this.seats.length} seat(s)`;
  }

  getBookingDetails() {
    return {
      movieId: this.movieId,
      userId: this.userId,
      theaterId: this.theaterId,
      showtime: this.showtime,
      seats: this.seats,
      totalPrice: this.totalPrice,
      description: this.getDescription(),
      createdAt: this.createdAt
    };
  }
}

// Base Decorator
class BookingDecorator {
  constructor(booking) {
    this.booking = booking;
  }

  calculatePrice() {
    return this.booking.calculatePrice();
  }

  getDescription() {
    return this.booking.getDescription();
  }

  getBookingDetails() {
    return this.booking.getBookingDetails();
  }
}

// Concrete Decorators
class VIPSeatingDecorator extends BookingDecorator {
  constructor(booking) {
    super(booking);
    this.vipFee = 5; // Additional $5 per seat for VIP
  }

  calculatePrice() {
    return this.booking.calculatePrice() + (this.booking.seats.length * this.vipFee);
  }

  getDescription() {
    return `${this.booking.getDescription()} with VIP seating`;
  }

  getBookingDetails() {
    const details = this.booking.getBookingDetails();
    details.totalPrice = this.calculatePrice();
    details.description = this.getDescription();
    details.vipSeating = true;
    return details;
  }
}

class FoodBeverageDecorator extends BookingDecorator {
  constructor(booking, foodOptions) {
    super(booking);
    this.foodOptions = foodOptions || [];
    this.foodPrice = this.calculateFoodPrice();
  }

  calculateFoodPrice() {
    // Calculate price based on selected food options
    return this.foodOptions.reduce((total, item) => total + item.price, 0);
  }

  calculatePrice() {
    return this.booking.calculatePrice() + this.foodPrice;
  }

  getDescription() {
    return `${this.booking.getDescription()} with food and beverages`;
  }

  getBookingDetails() {
    const details = this.booking.getBookingDetails();
    details.totalPrice = this.calculatePrice();
    details.description = this.getDescription();
    details.foodOptions = this.foodOptions;
    return details;
  }
}

class ParkingPassDecorator extends BookingDecorator {
  constructor(booking) {
    super(booking);
    this.parkingFee = 8; // $8 for parking
  }

  calculatePrice() {
    return this.booking.calculatePrice() + this.parkingFee;
  }

  getDescription() {
    return `${this.booking.getDescription()} with parking pass`;
  }

  getBookingDetails() {
    const details = this.booking.getBookingDetails();
    details.totalPrice = this.calculatePrice();
    details.description = this.getDescription();
    details.parkingIncluded = true;
    return details;
  }
}

// Export the classes
module.exports = {
  Booking,
  VIPSeatingDecorator,
  FoodBeverageDecorator,
  ParkingPassDecorator
};
