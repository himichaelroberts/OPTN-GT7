export interface User {
  id: string;
  user_metadata: {
    username: string;
  }
}

export interface Country {
  id: string;
  name: string;
}

export interface Make {
  id: string;
  name: string;
  countries: Country;
}

export interface Car {
  id: string;
  name: string;
  makers: Make;
}

export interface FavoriteCar {
  id: string;
  cars: Car;
}
