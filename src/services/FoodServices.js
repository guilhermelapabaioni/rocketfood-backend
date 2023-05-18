const AppError = require('../utils/AppError')
const DiskStorage = require('../providers/DiskStorage')
const IngredientServices = require('./IngredientServices')
const IngredientRepository = require('../repositories/IngredientRepository')

class FoodServices {
  constructor(foodRepository) {
    this.foodRepository = foodRepository;
    const ingredientRepository = new IngredientRepository
    this.ingredientServices = new IngredientServices(ingredientRepository)
  }

  async createFood({ user_id, image, name, category, price, description, ingredients }) {
    if (!name || !price || !description || !image) {
      throw new AppError('You need to provide a avatar, name, price and description to create a new food.')
    }

    const diskStorage = new DiskStorage()
    const imageUpload = await diskStorage.saveFile(image)

    const food_id = await this.foodRepository.createFood({ user_id, image: imageUpload, name, category, price, description })

    this.ingredientServices.createIngredient({ food_id: food_id.lastID, ingredients })

    return food_id
  }

  async updateFood({ id, image, name, category, price, description, oldIngredients, ingredients }) {
    const food = await this.foodRepository.findById(id)

    if (!food) {
      throw new AppError('Something is wrong, try again later.')
    }

    if (image) {
      const diskStorage = new DiskStorage()
      if (food.image) {
        await diskStorage.deleteFile(food.image)
      }
      const imageUpload = await diskStorage.saveFile(image)

      await this.foodRepository.updateFood({ id, image: imageUpload, name, category, price, description })
    } else {
      await this.foodRepository.updateFood({ name, category, price, description })
    }

    if (ingredients) {
      const ingredientRepository = new IngredientRepository()
      const ingredientServices = new IngredientServices(ingredientRepository)

      await ingredientServices.updateIngredient({ food_id: id, oldIngredients, ingredients })
    }
  }

  async deleteFood({ id }) {
    const food = await this.foodRepository.findById(id)

    if (!food) {
      throw new AppError('Something is wrong, try again later.')
    }

    await this.foodRepository.deleteFood({ id: food.id })

    return food
  }
}

module.exports = FoodServices