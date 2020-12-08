import Model from './Model.js'

export default class Post extends Model {
  buildUrl (request) {
    const { params } = request
    return ['posts', ...params]
  }

  static async update (id, data) {
    return (new this()).request({ method: 'PUT', url: `posts/${id}`, data, isStatic: true })
  }

  static async delete (id) {
    return (new this()).request({ method: 'DELETE', url: `posts/${id}`, isStatic: true })
  }
}
