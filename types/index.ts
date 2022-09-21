export interface User {
  id: string;
}

export interface Country {
  id: string;
  name: string;
}

export interface Make {
  id: string;
  name: string;
  country_id: Country;
}

export interface Car {
  id: string;
  name: string;
  makers: Make;
}

export interface Wishlist {
  id: string;
}
