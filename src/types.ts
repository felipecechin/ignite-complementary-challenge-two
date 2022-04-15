export interface FoodObject {
  id: number;
  name: string;
  description: string;
  price: number;
  available: boolean;
  image: string;
}

export interface FoodDataForm {
  name: string;
  description: string;
  price: number;
  image: string;
}