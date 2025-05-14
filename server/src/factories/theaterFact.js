// Theater Factory Pattern Implementation

// Theater Product Interface
class Theater {
  constructor(data) {
    this.name = data.name;
    this.location = data.location;
    this.capacity = data.capacity || 0;
    this.amenities = data.amenities || [];
    this.screens = data.screens || 1;
    this.isActive = data.isActive !== undefined ? data.isActive : true;
  }

  getDetails() {
    return {
      name: this.name,
      location: this.location,
      capacity: this.capacity,
      amenities: this.amenities,
      screens: this.screens,
      isActive: this.isActive,
      type: this.constructor.name
    };
  }
}

// Concrete Theater Types
class StandardTheater extends Theater {
  constructor(data) {
    super(data);
    this.standardScreens = data.standardScreens || this.screens;
    this.hasSnackBar = data.hasSnackBar !== undefined ? data.hasSnackBar : true;
  }

  getDetails() {
    return {
      ...super.getDetails(),
      standardScreens: this.standardScreens,
      hasSnackBar: this.hasSnackBar
    };
  }
}

class MultiplexTheater extends Theater {
  constructor(data) {
    super(data);
    this.hasIMAX = data.hasIMAX !== undefined ? data.hasIMAX : false;
    this.has3D = data.has3D !== undefined ? data.has3D : true;
    this.foodCourt = data.foodCourt !== undefined ? data.foodCourt : true;
    this.parkingCapacity = data.parkingCapacity || 200;
  }

  getDetails() {
    return {
      ...super.getDetails(),
      hasIMAX: this.hasIMAX,
      has3D: this.has3D,
      foodCourt: this.foodCourt,
      parkingCapacity: this.parkingCapacity
    };
  }
}

class LuxuryTheater extends Theater {
  constructor(data) {
    super(data);
    this.hasReclinerSeats = data.hasReclinerSeats !== undefined ? data.hasReclinerSeats : true;
    this.hasDiningService = data.hasDiningService !== undefined ? data.hasDiningService : true;
    this.hasPrivateScreenings = data.hasPrivateScreenings !== undefined ? data.hasPrivateScreenings : true;
    this.hasVIPLounge = data.hasVIPLounge !== undefined ? data.hasVIPLounge : true;
  }

  getDetails() {
    return {
      ...super.getDetails(),
      hasReclinerSeats: this.hasReclinerSeats,
      hasDiningService: this.hasDiningService,
      hasPrivateScreenings: this.hasPrivateScreenings,
      hasVIPLounge: this.hasVIPLounge
    };
  }
}

class DriveInTheater extends Theater {
  constructor(data) {
    super(data);
    this.carCapacity = data.carCapacity || 100;
    this.hasAudioTransmitter = data.hasAudioTransmitter !== undefined ? data.hasAudioTransmitter : true;
    this.hasOutdoorConcession = data.hasOutdoorConcession !== undefined ? data.hasOutdoorConcession : true;
  }

  getDetails() {
    return {
      ...super.getDetails(),
      carCapacity: this.carCapacity,
      hasAudioTransmitter: this.hasAudioTransmitter,
      hasOutdoorConcession: this.hasOutdoorConcession
    };
  }
}

// Theater Factory
class TheaterFactory {
  createTheater(type, data) {
    switch (type.toLowerCase()) {
      case 'standard':
        return new StandardTheater(data);
      case 'multiplex':
        return new MultiplexTheater(data);
      case 'luxury':
        return new LuxuryTheater(data);
      case 'drive-in':
        return new DriveInTheater(data);
      default:
        return new Theater(data);
    }
  }

  // Create theater from database record
  createTheaterFromDB(theaterData) {
    // Determine the type based on amenities or other properties
    const amenities = theaterData.amenities || [];
    const amenitiesStr = amenities.join(' ').toLowerCase();
    
    if (amenitiesStr.includes('vip') || amenitiesStr.includes('luxury') || amenitiesStr.includes('private')) {
      return new LuxuryTheater(theaterData);
    } else if (amenitiesStr.includes('imax') || amenitiesStr.includes('3d') || theaterData.screens > 5) {
      return new MultiplexTheater(theaterData);
    } else if (amenitiesStr.includes('drive') || amenitiesStr.includes('outdoor')) {
      return new DriveInTheater(theaterData);
    } else {
      return new StandardTheater(theaterData);
    }
  }
}

// Export the factory as a singleton
const theaterFactory = new TheaterFactory();
module.exports = theaterFactory;
