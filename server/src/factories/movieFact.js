// Movie Factory Pattern Implementation

// Movie Product Interface
class Movie {
  constructor(data) {
    this.title = data.title;
    this.description = data.description;
    this.director = data.director || 'Unknown Director';
    this.actors = data.actors || [];
    this.releaseDate = data.releaseDate || new Date();
    this.genre = data.genre;
    this.duration = data.duration;
    this.language = data.language || 'Arabic';
    this.country = data.country || 'Egypt';
    this.poster = data.poster;
    this.trailer = data.trailer;
    this.isShowing = data.isShowing !== undefined ? data.isShowing : false;
    this.ratings = data.ratings || 0;
  }

  getDetails() {
    return {
      title: this.title,
      description: this.description,
      director: this.director,
      actors: this.actors,
      releaseDate: this.releaseDate,
      genre: this.genre,
      duration: this.duration,
      language: this.language,
      country: this.country,
      poster: this.poster,
      trailer: this.trailer,
      isShowing: this.isShowing,
      ratings: this.ratings
    };
  }
}

// Concrete Movie Types
class ActionMovie extends Movie {
  constructor(data) {
    super(data);
    this.genre = 'Action';
    this.specialEffects = data.specialEffects || [];
    this.stunts = data.stunts || [];
  }

  getDetails() {
    return {
      ...super.getDetails(),
      specialEffects: this.specialEffects,
      stunts: this.stunts
    };
  }
}

class ComedyMovie extends Movie {
  constructor(data) {
    super(data);
    this.genre = 'Comedy';
    this.humorStyle = data.humorStyle || 'General';
    this.isFamily = data.isFamily !== undefined ? data.isFamily : true;
  }

  getDetails() {
    return {
      ...super.getDetails(),
      humorStyle: this.humorStyle,
      isFamily: this.isFamily
    };
  }
}

class DramaMovie extends Movie {
  constructor(data) {
    super(data);
    this.genre = 'Drama';
    this.themes = data.themes || [];
    this.awards = data.awards || [];
  }

  getDetails() {
    return {
      ...super.getDetails(),
      themes: this.themes,
      awards: this.awards
    };
  }
}

class HorrorMovie extends Movie {
  constructor(data) {
    super(data);
    this.genre = 'Horror';
    this.scareLevel = data.scareLevel || 'Medium';
    this.isParanormal = data.isParanormal !== undefined ? data.isParanormal : false;
  }

  getDetails() {
    return {
      ...super.getDetails(),
      scareLevel: this.scareLevel,
      isParanormal: this.isParanormal
    };
  }
}

// Movie Factory
class MovieFactory {
  createMovie(type, data) {
    switch (type.toLowerCase()) {
      case 'action':
        return new ActionMovie(data);
      case 'comedy':
        return new ComedyMovie(data);
      case 'drama':
        return new DramaMovie(data);
      case 'horror':
        return new HorrorMovie(data);
      default:
        return new Movie(data);
    }
  }

  // Create movie from database record
  createMovieFromDB(movieData) {
    // Determine the type based on genre
    const genre = movieData.genre ? movieData.genre.toLowerCase() : '';
    
    if (genre === 'action') {
      return new ActionMovie(movieData);
    } else if (genre === 'comedy') {
      return new ComedyMovie(movieData);
    } else if (genre === 'drama') {
      return new DramaMovie(movieData);
    } else if (genre === 'horror') {
      return new HorrorMovie(movieData);
    } else {
      return new Movie(movieData);
    }
  }
}

// Export the factory as a singleton
const movieFactory = new MovieFactory();
module.exports = movieFactory;
