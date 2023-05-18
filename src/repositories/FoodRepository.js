const sqlConnection = require('../database/sqlite/index')
const knex = require('../database/knex')
const AppError = require('../utils/AppError')
const sqliteConnection = require('../database/sqlite/index')

// const database = knex()

class FoodRepository {
  async indexFoods() {
    const foods = await knex('foods')

    return foods
  }

  async findById(id) {
    const food = await knex('foods').where({ id }).first()

    return food
  }

  async createFood({ user_id, image, name, category, price, description }) {
    const database = await sqliteConnection()

    try {
      const food_id = await database.run('INSERT INTO foods (user_id, image, name, category, price, description) VALUES (?, ?, ?, ?, ?, ?)', [user_id, image, name, category, price, description])

      return food_id
    } catch (error) {
      console.error(error)
      throw new AppError('Error creating food')
    }
  }

  async updateFood({ id, image, name, category, price, description }) {
    await knex('foods').where({ id }).update({
      image, name, category, price, description
    })
  }

  async deleteFood({ id }) {
    await knex('foods').where({ id }).delete()
  }
}

module.exports = FoodRepository