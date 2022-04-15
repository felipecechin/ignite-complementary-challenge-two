import { useEffect, useState } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';
import { FoodDataForm, FoodObject } from '../../types';


export default function Dashboard() {
  const [foods, setFoods] = useState<FoodObject[]>([])
  const [editingFood, setEditingFood] = useState<FoodObject>({} as FoodObject)
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false)

  useEffect(() => {
    const loadFoods = async () => {
      const response = await api.get('/foods');

      setFoods(response.data)
    }

    loadFoods()
  }, [])

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  }

  const handleAddFood = async (food: FoodDataForm) => {
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });
      setFoods([...foods, response.data])
    } catch (err) {
      console.log(err);
    }
  }

  const toggleEditModal = () => {
    setEditModalOpen(!editModalOpen);
  }

  const handleEditFood = (food: FoodObject) => {
    setEditingFood(food)
    setEditModalOpen(true)
  }

  const handleUpdateFood = async (food: FoodDataForm) => {
    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  }

  const handleDeleteFood = async (id: number) => {

    await api.delete(`/foods/${id}`);

    const foodsCopy = [...foods]
    const foodsFiltered = foodsCopy.filter(food => food.id !== id);

    setFoods(foodsFiltered)
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
}